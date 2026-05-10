# DaVinci Resolve Fusion Presets & Macros

Drop-in Fusion effects for the signature shots in both films.

## Files
- `cracked_sky.setting` — animated glass-fracture overlay for the "sky breaks" beat at 0:45 of *Mochi*.
- `anamorphic_flare.setting` — horizontal cyan flare + streak for any practical light source in *Kepler*.
- `hologram_glitch.setting` — cyan waveform UI with occasional RGB-split glitch for the hologram scenes.

## Install

### As a Macro (recommended)
1. In Fusion, right-click the Effects Library -> **Create Category**, name it `Kiro`.
2. Drop all `*.setting` files into:
   - macOS: `~/Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Macros/`
   - Windows: `%APPDATA%\Blackmagic Design\DaVinci Resolve\Support\Fusion\Macros\`
   - Linux: `~/.local/share/DaVinciResolve/Fusion/Macros/`
3. Restart Resolve.
4. They now appear under **Effects Library -> Templates -> Fusion -> Kiro**.

### As a One-Shot Paste
1. Open any `.setting` file in a text editor.
2. Select all, copy.
3. In Resolve Fusion page, right-click an empty area of the node graph -> **Paste**.

## Usage

### cracked_sky
- Drop on a Fusion clip over the sky/background you want to shatter.
- Connect the alpha output to a Merge node.
- Animate `CrackProgress` from 0 to 1 across the beat (7 seconds).
- Tweak `CrackDensity` (default 12) for finer vs chunkier fractures.

### anamorphic_flare
- Pick the brightest light source per shot (console LED, hologram center).
- Track a Tracker node to its position.
- Publish the tracker to `FlareCenter`.
- Modulate `Intensity` with the shot's brightness curve for realism.

### hologram_glitch
- Wrap around your animated waveform plate.
- `GlitchRate` (default 0.15 = 15% of frames glitch) — raise for the "Unraveling" montage.
- `RGBSplitAmount` (default 4px) — raise to 12–16 during the reveal.

## Note on Compatibility
Saved against Resolve 19.1. They will also load in 18.6 with minor warnings about deprecated node params which can be ignored.
