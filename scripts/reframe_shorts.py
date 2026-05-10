"""
Auto-reframe a 16:9 master into a 9:16 YouTube Short using ffmpeg.

Strategy:
    1. Pick the most retention-worthy window of the master (user-provided
       timecode or sensible default).
    2. Detect the subject's horizontal center per second using ffmpeg's
       cropdetect on a blurred luma pass as a cheap saliency proxy.
    3. Build a smooth crop curve (simple moving average) and bake it into
       the final 1080x1920 output with burn-in captions and a hook frame.

Requirements:
    - ffmpeg >= 5.0 on PATH
    - stdlib only

Usage:
    python scripts/reframe_shorts.py \\
        --input out/video/mochi_master.mp4 \\
        --start 00:00:45 --duration 30 \\
        --output out/shorts/mochi_short.mp4 \\
        --captions captions/mochi.srt \\
        --title "HE KEPT THE MOON"

    python scripts/reframe_shorts.py \\
        --input out/video/kepler_master.mp4 \\
        --start 00:01:20 --duration 30 \\
        --output out/shorts/kepler_short.mp4 \\
        --captions captions/kepler.srt \\
        --title "THAT'S MY VOICE"
"""

from __future__ import annotations

import argparse
import json
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path


def ensure_ffmpeg() -> None:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        print("ffmpeg and ffprobe must be on PATH.", file=sys.stderr)
        sys.exit(2)


def has_filter(name: str) -> bool:
    try:
        out = subprocess.check_output(
            ["ffmpeg", "-hide_banner", "-filters"], stderr=subprocess.DEVNULL, text=True
        )
    except subprocess.CalledProcessError:
        return False
    return any(line.split() and line.split()[1] == name for line in out.splitlines() if " " in line)


def probe_dimensions(path: Path) -> tuple[int, int, float]:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,r_frame_rate",
            "-of",
            "json",
            str(path),
        ]
    )
    stream = json.loads(out)["streams"][0]
    num, den = stream["r_frame_rate"].split("/")
    fps = float(num) / float(den)
    return int(stream["width"]), int(stream["height"]), fps


def detect_centers(
    path: Path, start: str, duration: int, width: int
) -> list[int]:
    """
    Run cropdetect once per second on a blurred luma pass. We use the
    center of each detected crop rectangle as a cheap saliency proxy for
    the most visually active horizontal region.
    """
    cmd = [
        "ffmpeg",
        "-ss",
        start,
        "-t",
        str(duration),
        "-i",
        str(path),
        "-vf",
        "fps=1,format=gray,boxblur=20:1,cropdetect=limit=32:round=2:reset=1",
        "-f",
        "null",
        "-",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    centers: list[int] = []
    pattern = re.compile(r"crop=(\d+):(\d+):(\d+):(\d+)")
    for match in pattern.finditer(result.stderr):
        w = int(match.group(1))
        x = int(match.group(3))
        centers.append(x + w // 2)
    if not centers:
        # fall back to frame center if cropdetect never fired
        centers = [width // 2] * max(duration, 1)
    return centers


def smooth(values: list[int], window: int = 5) -> list[int]:
    if len(values) <= window:
        return values
    out: list[int] = []
    for i in range(len(values)):
        lo = max(0, i - window // 2)
        hi = min(len(values), i + window // 2 + 1)
        out.append(sum(values[lo:hi]) // (hi - lo))
    return out


def build_crop_expression(
    centers: list[int], src_w: int, src_h: int, duration: int
) -> str:
    """
    Build an ffmpeg expression for the `crop` x coordinate that lerps
    between the smoothed sample points once per second.
    Target crop is portrait: w = src_h * 9/16, h = src_h.
    """
    crop_w = int(src_h * 9 / 16)
    half = crop_w // 2
    clamp = lambda x: max(0, min(src_w - crop_w, x - half))
    sampled = [clamp(c) for c in centers]

    # Piecewise linear: between second n and n+1, interpolate t in [n, n+1)
    # Build as nested if(lt(t, ...), ..., ...)
    if len(sampled) == 1:
        expr = str(sampled[0])
    else:
        expr_parts = []
        for i in range(len(sampled) - 1):
            a, b = sampled[i], sampled[i + 1]
            segment = f"({a}+({b}-{a})*(t-{i}))"
            expr_parts.append(f"if(lt(t,{i + 1}),{segment},")
        tail = str(sampled[-1])
        expr = "".join(expr_parts) + tail + (")" * (len(sampled) - 1))
    return f"crop=w={crop_w}:h={src_h}:x='{expr}':y=0"


def build_filter_chain(
    crop: str, src_w: int, src_h: int, captions: str | None, title: str | None
) -> str:
    parts = [crop, "scale=1080:1920:flags=lanczos"]
    if captions:
        style = (
            "FontName=Arial Black,FontSize=36,PrimaryColour=&HFFFFFF&,"
            "OutlineColour=&H000000&,BorderStyle=1,Outline=3,Shadow=1,"
            "Alignment=2,MarginV=160"
        )
        esc = captions.replace(":", "\\:").replace("'", "\\'")
        parts.append(f"subtitles='{esc}':force_style='{style}'")
    if title:
        if not has_filter("drawtext"):
            print(
                "warning: ffmpeg lacks drawtext filter (no libfreetype); skipping title burn-in.",
                file=sys.stderr,
            )
        else:
            t = title.replace("'", "\\'").replace(":", "\\:")
            # Title burns in for first 3 seconds only, top-center, bold
            parts.append(
                "drawtext=text='" + t + "':"
                "fontcolor=white:fontsize=96:"
                "box=1:boxcolor=black@0.55:boxborderw=20:"
                "x=(w-text_w)/2:y=180:"
                "enable='lt(t,3)'"
            )
    return ",".join(parts)


def main() -> int:
    ensure_ffmpeg()
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, type=Path)
    ap.add_argument("--output", required=True, type=Path)
    ap.add_argument("--start", default="00:00:00")
    ap.add_argument("--duration", type=int, default=30)
    ap.add_argument("--captions", type=Path)
    ap.add_argument("--title")
    args = ap.parse_args()

    if not args.input.exists():
        print(f"input not found: {args.input}", file=sys.stderr)
        return 2

    src_w, src_h, _fps = probe_dimensions(args.input)
    centers = smooth(detect_centers(args.input, args.start, args.duration, src_w))
    crop = build_crop_expression(centers, src_w, src_h, args.duration)
    chain = build_filter_chain(
        crop,
        src_w,
        src_h,
        str(args.captions) if args.captions else None,
        args.title,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg",
        "-y",
        "-ss",
        args.start,
        "-t",
        str(args.duration),
        "-i",
        str(args.input),
        "-vf",
        chain,
        "-c:v",
        "libx264",
        "-crf",
        "18",
        "-preset",
        "slow",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        str(args.output),
    ]
    print(" ".join(shlex.quote(c) for c in cmd))
    subprocess.run(cmd, check=True)
    print(f"wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
