#!/usr/bin/env bash
# One-shot pipeline: keyframes -> videos -> timelines.
# Usage:
#   export REPLICATE_API_TOKEN="..." LUMA_API_KEY="..."
#   bash scripts/run.sh          # both films
#   bash scripts/run.sh mochi    # cartoon only
#   bash scripts/run.sh kepler   # sci-fi only
set -euo pipefail

FILM="${1:-all}"

: "${REPLICATE_API_TOKEN:?Set REPLICATE_API_TOKEN to generate key-frames}"
: "${LUMA_API_KEY:?Set LUMA_API_KEY to generate video clips}"

echo "==> Key-frames"
python scripts/generate_keyframes.py --film "$FILM"

echo "==> Video clips"
python scripts/generate_video.py --film "$FILM" --concat

echo "==> FCPXML timelines"
python scripts/export_fcpxml.py

echo
echo "Done. Deliverables:"
echo "  out/keyframes/<film>/*.png"
echo "  out/video/<film>/*.mp4"
echo "  out/video/<film>_master.mp4"
echo "  out/timelines/<film>.fcpxml"
