"""
Convert prompts/shot_list.csv into an FCPXML 1.10 timeline that DaVinci
Resolve and Final Cut Pro can import directly.

Usage:
    python scripts/export_fcpxml.py

Outputs:
    out/timelines/mochi.fcpxml
    out/timelines/kepler.fcpxml

Drop each fcpxml on top of Resolve's Media Pool. The shots arrive on V1
with gaps sized to their durations, named by scene/shot id, and tagged
with markers for music cues.
"""

from __future__ import annotations

import csv
from pathlib import Path
from xml.sax.saxutils import escape

CSV_PATH = Path("prompts/shot_list.csv")
OUT_DIR = Path("out/timelines")
FPS_NUM = 24
FPS_DEN = 1

FRAME_DURATION = f"{FPS_DEN * 100}/{FPS_NUM * 100}s"  # "100/2400s"


def frames_to_rational(frames: int) -> str:
    # FCPXML expects rational time as "<numer>/<denom>s"
    return f"{frames * FPS_DEN * 100}/{FPS_NUM * 100}s"


def build_fcpxml(project_name: str, rows: list[dict[str, str]]) -> str:
    clip_xml_parts: list[str] = []
    offset_frames = 0

    for row in rows:
        duration = int(row["duration_sec"]) * FPS_NUM
        name = escape(f"{row['scene']}_{row['shot']}_{row['shot_size']}")
        note = escape(
            f"{row['camera_move']} | {row['lens_mm']}mm f{row['aperture']} | "
            f"{row['lighting']} | SFX: {row['sfx']} | Music: {row['music_cue']}"
        )
        clip_xml_parts.append(
            f"""        <gap name="{name}" offset="{frames_to_rational(offset_frames)}" duration="{frames_to_rational(duration)}" start="0s">
          <note>{note}</note>
          <marker start="0s" duration="{FRAME_DURATION}" value="{escape(row['music_cue'])}"/>
        </gap>"""
        )
        offset_frames += duration

    total_duration = frames_to_rational(offset_frames)
    spine_inner = "\n".join(clip_xml_parts)

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="r1" name="FFVideoFormat1080p24" frameDuration="{FRAME_DURATION}" width="1920" height="1080"/>
  </resources>
  <library>
    <event name="{escape(project_name)}">
      <project name="{escape(project_name)}">
        <sequence format="r1" duration="{total_duration}" tcStart="0s" tcFormat="NDF">
          <spine>
{spine_inner}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    by_film: dict[str, list[dict[str, str]]] = {}
    with CSV_PATH.open() as f:
        for row in csv.DictReader(f):
            by_film.setdefault(row["project"], []).append(row)

    for film, rows in by_film.items():
        name = "Mochi and the Moon Jar" if film == "Mochi" else "Signal from Kepler-9"
        xml = build_fcpxml(name, rows)
        out = OUT_DIR / f"{film.lower()}.fcpxml"
        out.write_text(xml)
        print(f"wrote {out}  ({len(rows)} shots)")


if __name__ == "__main__":
    main()
