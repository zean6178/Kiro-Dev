# Captions

SRT subtitle files aligned to the voiceover scripts in `prompts/voiceover_scripts.md`.

## Files
- `mochi.srt` — 6 cues, 90-second timeline
- `kepler.srt` — 15 cues, 120-second timeline

## Usage

### YouTube Studio
Upload alongside the video: **Subtitles -> Add -> Upload file -> With timing -> select .srt**

### DaVinci Resolve
**File -> Import -> Subtitle** then drag to a subtitle track on the timeline.

### FFmpeg burn-in (for burn-in captions on first 30s hook)
```bash
ffmpeg -i master.mp4 -vf "subtitles=captions/mochi.srt:force_style='FontName=Georgia,FontSize=28,PrimaryColour=&HF0F0E0&,OutlineColour=&H000000&,BorderStyle=1,Outline=2,Shadow=1'" -c:a copy master_captioned.mp4
```

### Style Guide

**Mochi (cartoon):** Georgia or a hand-drawn serif, cream (#F0F0E0), 2px black outline, 1px soft shadow, centered-bottom, fade 0.3s.

**Kepler (sci-fi):** JetBrains Mono or Space Mono, white on 40% black bar, typewriter reveal at 30 chars/sec, lower-third position.
