# Kartun Cerdas — Prompt Pack Index

Production-ready AI-video prompt library for **"KARTUN CERDAS — Belajar Jadi
Seru"**, an Indonesian kids edutainment brand built around the chibi robot
mascot **Robi**. Includes a sister pack of chibi-anime action loops for X.

---

## TL;DR — pick the file you need

| If you want to… | Open |
|---|---|
| Understand the channel strategy, brand bible, mascot sheet | [`kartun_cerdas_3d_prompts.md`](./kartun_cerdas_3d_prompts.md) |
| Generate the 5s / 10s channel intro bumper | [`opening_video_prompts.md`](./opening_video_prompts.md) |
| Drive episode production (shot-by-shot) | [`shot_list.csv`](./shot_list.csv) |
| Record Bahasa Indonesia voiceover (all 10 episodes + 5-min pilot) | [`voiceover_scripts.md`](./voiceover_scripts.md) |
| Generate Suno music beds + 60s channel anthem | [`suno_music_prompts.md`](./suno_music_prompts.md) |
| Generate Shorts 9:16 reframes, merch, channel art, side-characters | [`3d_animation_prompts.md`](./3d_animation_prompts.md) |
| Run a parallel **X (Twitter)** spin-off with chibi-anime loops | [`seedance_x_viral_loops.md`](./seedance_x_viral_loops.md) |
| Caption every X clip with A/B/C tested copy | [`x_captions_playbook.md`](./x_captions_playbook.md) |

---

## How the files fit together

```
┌──────────────────────────────────────────────────────────────────┐
│  KARTUN CERDAS (YouTube Kids, Bahasa Indonesia)                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   kartun_cerdas_3d_prompts.md  ← strategy + brand + mascot       │
│            │                                                     │
│            ├── opening_video_prompts.md  ← 5s intro bumper       │
│            │                                                     │
│            ├── shot_list.csv  ← 10 eps × 8 scenes = 80 shots     │
│            │         │                                           │
│            │         ├── voiceover_scripts.md  ← VO lines        │
│            │         └── suno_music_prompts.md ← music beds      │
│            │                                                     │
│            └── 3d_animation_prompts.md  ← Shorts, merch, extras  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  X SPIN-OFF (chibi-anime loops, English captions)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   seedance_x_viral_loops.md  ← 20 Seedance 2.0 prompts           │
│            └── x_captions_playbook.md  ← captions + schedule     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

The two brands are **independent** — same production pipeline, different
mascots, different audiences. You can ship one without the other.

---

## 7-step production quickstart (one episode, ~6 hours)

1. **Lock references.** Generate Robi turnaround in Midjourney using the
   master character prompt in `kartun_cerdas_3d_prompts.md §3`. Save seed.
2. **Render the intro bumper once.** Use `opening_video_prompts.md §2`.
   Save as `KartunCerdas_Intro_5s_v1.mp4`, pre-roll on every episode.
3. **Pick an episode** from the 10-episode calendar in
   `kartun_cerdas_3d_prompts.md §6`.
4. **Record VO.** Pull the script from `voiceover_scripts.md`, render in
   ElevenLabs with the settings in the Voice Direction block.
5. **Generate scenes.** Walk `shot_list.csv` row by row, paste the
   `prompt_snippet` column into Veo 3 / Kling 2.0. Attach the Robi reference.
6. **Generate the music bed.** Use the matching episode section in
   `suno_music_prompts.md`. Generate 3 takes, pick best.
7. **Edit, caption, thumbnail, upload.** DaVinci Resolve + Submagic +
   thumbnail template from `3d_animation_prompts.md §3`.

**Target unit economics:** USD 8–15 in AI credits + ~6h human time per episode.

---

## Brand tokens (copy everywhere)

```
Palette:  #1E5BD8 cobalt blue · #FFC83D sun yellow · #F7FAFF cloud white
          #FF8FA3 cheek pink · #0E2E6B navy outline
Type:     Display = chunky 3D rounded sans (Fredoka One / Paytone One feel)
          Body    = friendly rounded sans (Baloo 2, weight 700)
Audio:    ukulele + glockenspiel + kalimba + marimba, 90–95 BPM, C major
Mascot:   Robi (chibi white-and-blue robot, yellow antenna + headphones +
          play-button chest, winking left eye, pink cheek blush)
Sidekick: Nina (5yo girl, two pigtails, cobalt-blue dungarees)
```

---

## Changelog

- **v1.0** — Initial pack: strategy, brand bible, mascot, intro, 10-ep
  calendar, shot list, VO, music, Shorts reframes, merch, X spin-off.

---

## Suggested next additions (when you want them)

- Episode-2 through Episode-10 long-form (5–7 min) script expansions
- YouTube Shorts compilation "best-of-season" template
- Arabic / English dub VO scripts for international expansion
- Interactive QR-code end-card linking to Patreon / merch store
- A second mascot (Nina) expression sheet with voice-acting direction

Ping and say which you want next.
