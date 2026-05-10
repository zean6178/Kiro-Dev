# Generation Scripts

One-command pipeline from prompts to deliverables.

## Install

```bash
python -m pip install --upgrade pip
# No third-party deps: scripts use only stdlib.
# ffmpeg required only for the --concat flag in generate_video.py.
```

## 1. Key-frame images (storyboards + thumbnails)

```bash
export REPLICATE_API_TOKEN="r8_..."       # preferred
# or:  export OPENAI_API_KEY="sk-..."

python scripts/generate_keyframes.py --film all
# -> out/keyframes/mochi/01_hook.png ... 06_release.png
# -> out/keyframes/kepler/01_hook.png ... 06_legion.png
```

Cost estimate (check current pricing):
- Replicate Flux 1.1 Pro: ~$0.04/image. 12 images = ~$0.48.
- OpenAI gpt-image-1 high: ~$0.19/image. 12 images = ~$2.28.

## 2. Scene-level video clips

```bash
export LUMA_API_KEY="luma-..."

python scripts/generate_video.py --film all --concat
# -> out/video/mochi/01_hook.mp4 ... 06_release.mp4
# -> out/video/mochi_master.mp4    (concat with ffmpeg)
# -> out/video/kepler/...
# -> out/video/kepler_master.mp4
```

Cost estimate (check current pricing):
- Luma Ray-2 1080p 9s: ~$1.20 per clip. 12 clips = ~$14.40.

## 3. FCPXML timelines for DaVinci Resolve / FCP

```bash
python scripts/export_fcpxml.py
# -> out/timelines/mochi.fcpxml
# -> out/timelines/kepler.fcpxml
```

Import: In Resolve, File -> Import -> Timeline -> select .fcpxml. The
shot list arrives as named gaps on V1 with markers for each music cue.
Replace gaps with the matching clip from `out/video/<film>/` and you
have a first cut in five minutes.

## End-to-end one-liner

```bash
export REPLICATE_API_TOKEN="..." LUMA_API_KEY="..."
python scripts/generate_keyframes.py --film all \
 && python scripts/generate_video.py --film all --concat \
 && python scripts/export_fcpxml.py
```

## Notes and limits

- The scripts use only the Python standard library so they work inside
  sandboxed CI with no pip install step.
- Provider APIs return URLs that expire within 24h; download immediately.
- Luma Ray-2 generates 5s or 9s clips. Scene prompts requesting 8s or 10s
  are clamped to 9s; you will trim in the NLE.
- This sandbox does not have your API keys, so you must run these scripts
  on your own machine or in a CI with the keys configured.
