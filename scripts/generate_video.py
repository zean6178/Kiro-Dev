"""
Batch video generator for the two short films.

Generates one video clip per scene using Luma Dream Machine (Ray 2), then
concatenates them with ffmpeg into a single master.

Usage:
    export LUMA_API_KEY="luma-..."

    python scripts/generate_video.py --film mochi
    python scripts/generate_video.py --film all --concat

Outputs:
    out/video/<film>/<scene>.mp4      per-scene clips
    out/video/<film>_master.mp4       concatenated master (if --concat)
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib import request

OUT_DIR = Path("out/video")

# Scene prompts tuned for video generators. Each clip is 5-10s; the final
# edit will be cut from these in DaVinci.
PROMPTS: dict[str, list[dict[str, str | int]]] = {
    "mochi": [
        {
            "id": "01_hook",
            "duration": 5,
            "prompt": (
                "Cinematic 3D Pixar style. Extreme close-up of a marshmallow "
                "bunny's huge glossy eye reflecting a glowing moon-jar. Slow "
                "dolly out reveals him sitting in a moonlit meadow holding "
                "the jar. Fireflies orbit. Soft depth of field, warm-cool "
                "contrast, wonder and curiosity, 24fps."
            ),
        },
        {
            "id": "02_discovery",
            "duration": 9,
            "prompt": (
                "3D Pixar animated, low tracking angle, marshmallow bunny "
                "tiptoes through tall glowing mushrooms toward a crashed "
                "silver meteor. The meteor cracks open, releasing a tiny "
                "glowing moon sprite. Magical particles, gentle push-in."
            ),
        },
        {
            "id": "03_bond",
            "duration": 9,
            "prompt": (
                "3D Pixar cinematic, marshmallow bunny cups tiny moon sprite "
                "in his paws, she tickles his nose, both spin in a golden "
                "dandelion field, magic hour, shallow DOF, playful camera."
            ),
        },
        {
            "id": "04_conflict",
            "duration": 8,
            "prompt": (
                "Cinematic 3D Pixar, marshmallow bunny looks up in horror as "
                "the starry sky fractures like glass above him. Dutch angle, "
                "desaturated palette, warm-to-cold lighting shift, tear "
                "welling in his oversized eye."
            ),
        },
        {
            "id": "05_climb",
            "duration": 9,
            "prompt": (
                "3D animated cinematic, marshmallow bunny climbs a giant "
                "glowing dandelion stem toward a cracked sky, scarf blowing, "
                "dynamic spiral camera, parallax stars, god rays, triumphant "
                "energy."
            ),
        },
        {
            "id": "06_release",
            "duration": 8,
            "prompt": (
                "3D Pixar cinematic. Marshmallow bunny opens a jar at the top "
                "of a dandelion. A silver ribbon of moon-light bursts out and "
                "stitches the cracked sky back into a full glowing moon. "
                "Slow pull back to wide shot of tiny silhouette against the "
                "moon."
            ),
        },
    ],
    "kepler": [
        {
            "id": "01_hook",
            "duration": 5,
            "prompt": (
                "Photoreal 3D cinematic. Extreme close-up of a female "
                "astronaut's eye reflecting a red blinking console. "
                "Anamorphic lens flare, shallow depth of field, Blade Runner "
                "2049 lighting, 24fps, 2.39:1 feel."
            ),
        },
        {
            "id": "02_station",
            "duration": 9,
            "prompt": (
                "Photoreal 3D slow dolly through a decaying space station "
                "corridor. Flickering amber emergency lights, floating dust, "
                "a lone astronaut silhouette at the far end, viewport shows "
                "a swirling blue gas giant. Volumetric god rays, Unreal "
                "Engine 5 aesthetic."
            ),
        },
        {
            "id": "03_signal",
            "duration": 9,
            "prompt": (
                "Photoreal 3D, female astronaut at a console with a cyan "
                "holographic waveform that resolves into her own face above "
                "her hands. Close-up of her shocked expression, hologram "
                "reflected in her eyes. Dramatic key light."
            ),
        },
        {
            "id": "04_unraveling",
            "duration": 9,
            "prompt": (
                "Photoreal 3D montage. Astronaut running diagnostics, pulling "
                "cables, checking her reflection in a cracked visor, "
                "rewinding a glitching transmission. Handheld feel, teal-"
                "orange palette, claustrophobic angles, rising tension."
            ),
        },
        {
            "id": "05_pod",
            "duration": 8,
            "prompt": (
                "Photoreal 3D. Astronaut opens a sealed compartment. A "
                "frosted cryo-pod inside reveals a duplicate of herself, "
                "eyes just opened. Slow push-in, condensation clears, her "
                "hand touches the glass. Volumetric fog, horror-awe lighting."
            ),
        },
        {
            "id": "06_legion",
            "duration": 10,
            "prompt": (
                "Photoreal 3D epic pull-back through a station viewport into "
                "deep space. The station is one of hundreds, scattered across "
                "a purple-cyan nebula. Camera keeps retreating until the "
                "nebula reveals the shape of a vast watching eye. Cinematic "
                "scale, ominous synth mood."
            ),
        },
    ],
}


def http_post_json(url: str, headers: dict[str, str], body: dict) -> dict:
    data = json.dumps(body).encode("utf-8")
    req = request.Request(url, data=data, headers=headers, method="POST")
    with request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get_json(url: str, headers: dict[str, str]) -> dict:
    req = request.Request(url, headers=headers, method="GET")
    with request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with request.urlopen(url, timeout=300) as resp, open(dest, "wb") as f:
        f.write(resp.read())


def generate_luma(prompt: str, duration: int, dest: Path) -> None:
    """
    Luma Dream Machine Ray 2 API.
    Docs: https://docs.lumalabs.ai/docs/api
    """
    key = os.environ["LUMA_API_KEY"]
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "accept": "application/json",
    }
    body = {
        "prompt": prompt,
        "model": "ray-2",
        "resolution": "1080p",
        "duration": f"{min(duration, 9)}s",  # Ray-2 supports 5s or 9s
        "aspect_ratio": "16:9",
    }
    create = http_post_json(
        "https://api.lumalabs.ai/dream-machine/v1/generations", headers, body
    )
    gen_id = create["id"]

    # Poll
    while True:
        time.sleep(5)
        status = http_get_json(
            f"https://api.lumalabs.ai/dream-machine/v1/generations/{gen_id}", headers
        )
        state = status.get("state")
        if state == "completed":
            video_url = status["assets"]["video"]
            download(video_url, dest)
            return
        if state == "failed":
            raise RuntimeError(f"Luma failed: {status.get('failure_reason')}")


def concat_with_ffmpeg(clips: list[Path], out: Path) -> None:
    if not clips:
        return
    list_file = out.parent / f"{out.stem}.txt"
    out.parent.mkdir(parents=True, exist_ok=True)
    list_file.write_text("".join(f"file '{c.resolve()}'\n" for c in clips))
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c",
            "copy",
            str(out),
        ],
        check=True,
    )
    list_file.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--film", choices=["mochi", "kepler", "all"], default="all")
    parser.add_argument("--concat", action="store_true", help="stitch clips with ffmpeg")
    args = parser.parse_args()

    films = ["mochi", "kepler"] if args.film == "all" else [args.film]

    if not os.environ.get("LUMA_API_KEY"):
        print("Set LUMA_API_KEY first (get one at https://lumalabs.ai/dream-machine/api).", file=sys.stderr)
        return 2

    for film in films:
        clips: list[Path] = []
        for scene in PROMPTS[film]:
            dest = OUT_DIR / film / f"{scene['id']}.mp4"
            clips.append(dest)
            if dest.exists():
                print(f"skip  {dest}")
                continue
            print(f"gen   {dest}  ({scene['duration']}s)")
            try:
                generate_luma(str(scene["prompt"]), int(scene["duration"]), dest)
            except Exception as exc:  # noqa: BLE001
                print(f"fail  {scene['id']}: {exc}", file=sys.stderr)

        if args.concat:
            master = OUT_DIR / f"{film}_master.mp4"
            existing = [c for c in clips if c.exists()]
            print(f"concat -> {master}  ({len(existing)} clips)")
            concat_with_ffmpeg(existing, master)

    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
