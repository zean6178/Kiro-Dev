"""
Batch key-frame generator.

Generates key-frame images for every scene of both short films using Replicate
(Flux 1.1 Pro) by default, with an OpenAI gpt-image-1 fallback.

Usage:
    export REPLICATE_API_TOKEN="r8_..."
    # or
    export OPENAI_API_KEY="sk-..."

    python scripts/generate_keyframes.py --film mochi
    python scripts/generate_keyframes.py --film kepler
    python scripts/generate_keyframes.py --film all --provider openai

Outputs go to ./out/keyframes/<film>/<scene>.png
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
from pathlib import Path
from urllib import error, request

OUT_DIR = Path("out/keyframes")

PROMPTS: dict[str, list[dict[str, str]]] = {
    "mochi": [
        {
            "id": "01_hook",
            "prompt": (
                "3D Pixar-style close-up, marshmallow bunny holding a glowing "
                "moon-jar, huge reflective eyes, night meadow, firefly bokeh, "
                "mint-green scarf, cinematic key light, cyan and peach palette, "
                "ultra cute, 8k, 16:9"
            ),
        },
        {
            "id": "02_discovery",
            "prompt": (
                "Cinematic 3D Pixar style, tiny marshmallow bunny tiptoes through "
                "glowing mushrooms toward a cracked silver meteor releasing a "
                "tiny moon sprite, magical particles, teal and peach, 8k, 16:9"
            ),
        },
        {
            "id": "03_bond",
            "prompt": (
                "3D Pixar style, marshmallow bunny and tiny glowing moon sprite "
                "spinning in a golden dandelion field, magic hour, god rays, "
                "joyful, ultra cute, shallow depth of field, 8k, 16:9"
            ),
        },
        {
            "id": "04_conflict",
            "prompt": (
                "Cinematic 3D Pixar, close-up marshmallow bunny with single tear "
                "in oversized reflective eye, starry sky fracturing like glass "
                "behind him, cold blue moonlight, emotional, 8k, 16:9"
            ),
        },
        {
            "id": "05_climb",
            "prompt": (
                "Wide cinematic 3D shot, tiny marshmallow bunny climbing a giant "
                "glowing dandelion stem toward a cracked starry sky, scarf "
                "fluttering, god rays, epic scale, 8k, 16:9"
            ),
        },
        {
            "id": "06_release",
            "prompt": (
                "3D Pixar cinematic, marshmallow bunny silhouette on top of giant "
                "dandelion, silver ribbon of light stitching the moon back "
                "together, golden-moon lighting, end-frame composition, 8k, 16:9"
            ),
        },
    ],
    "kepler": [
        {
            "id": "01_hook",
            "prompt": (
                "Photoreal 3D extreme close-up of a 34-year-old female astronaut "
                "eye reflecting a red blinking console, anamorphic lens flare, "
                "shallow DOF, Blade Runner 2049 lighting, Unreal Engine 5 "
                "MetaHuman, cinematic 2.39 but delivered 16:9, 8k"
            ),
        },
        {
            "id": "02_station",
            "prompt": (
                "Wide photoreal 3D shot of a decaying rotating space station "
                "interior corridor, amber emergency lights, floating dust, one "
                "lone astronaut silhouette at the far end, volumetric god rays, "
                "Unreal Engine 5, cinematic, 8k, 16:9"
            ),
        },
        {
            "id": "03_signal",
            "prompt": (
                "Photoreal 3D, female astronaut at a dark console with a cyan "
                "holographic waveform projecting her own face above her hands, "
                "shocked expression, anamorphic flare, Blade Runner 2049 "
                "aesthetic, Unreal Engine 5, 8k, 16:9"
            ),
        },
        {
            "id": "04_unraveling",
            "prompt": (
                "Photoreal 3D, astronaut in cracked visor with doubled "
                "reflection, claustrophobic handheld angle, teal and orange "
                "palette, moody sci-fi, Unreal Engine 5 MetaHuman, 8k, 16:9"
            ),
        },
        {
            "id": "05_pod",
            "prompt": (
                "Photoreal 3D, frosted cryo-pod glass with a duplicate female "
                "astronaut opening her eyes inside, condensation clearing, cyan "
                "internal glow, dark station interior, volumetric fog, Unreal "
                "Engine 5, ultra detailed, 8k, 16:9"
            ),
        },
        {
            "id": "06_legion",
            "prompt": (
                "Epic cosmic 3D vista, hundreds of identical rotating space "
                "stations scattered across a purple and cyan nebula forming the "
                "shape of a giant watching eye, photoreal, cinematic, awe-"
                "inspiring scale, 8k, 16:9"
            ),
        },
    ],
}


def http_post_json(url: str, headers: dict[str, str], body: dict) -> dict:
    data = json.dumps(body).encode("utf-8")
    req = request.Request(url, data=data, headers=headers, method="POST")
    with request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get_json(url: str, headers: dict[str, str]) -> dict:
    req = request.Request(url, headers=headers, method="GET")
    with request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with request.urlopen(url, timeout=120) as resp, open(dest, "wb") as f:
        f.write(resp.read())


def generate_replicate(prompt: str, dest: Path) -> None:
    token = os.environ["REPLICATE_API_TOKEN"]
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "wait",
    }
    body = {
        "input": {
            "prompt": prompt,
            "aspect_ratio": "16:9",
            "output_format": "png",
            "safety_tolerance": 2,
        }
    }
    # Flux 1.1 Pro on Replicate
    url = "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions"
    response = http_post_json(url, headers, body)

    # Poll until succeeded
    get_url = response.get("urls", {}).get("get")
    status = response.get("status")
    while status in ("starting", "processing"):
        time.sleep(2)
        response = http_get_json(get_url, headers)
        status = response.get("status")

    if status != "succeeded":
        raise RuntimeError(f"Replicate failed: {response}")

    output = response.get("output")
    image_url = output if isinstance(output, str) else output[0]
    download(image_url, dest)


def generate_openai(prompt: str, dest: Path) -> None:
    key = os.environ["OPENAI_API_KEY"]
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    body = {
        "model": "gpt-image-1",
        "prompt": prompt,
        "size": "1536x1024",
        "quality": "high",
        "n": 1,
    }
    url = "https://api.openai.com/v1/images/generations"
    response = http_post_json(url, headers, body)
    data = response["data"][0]
    dest.parent.mkdir(parents=True, exist_ok=True)
    if "b64_json" in data:
        dest.write_bytes(base64.b64decode(data["b64_json"]))
    else:
        download(data["url"], dest)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--film", choices=["mochi", "kepler", "all"], default="all")
    parser.add_argument("--provider", choices=["replicate", "openai"], default="replicate")
    args = parser.parse_args()

    films = ["mochi", "kepler"] if args.film == "all" else [args.film]

    if args.provider == "replicate" and not os.environ.get("REPLICATE_API_TOKEN"):
        print("Set REPLICATE_API_TOKEN or rerun with --provider openai", file=sys.stderr)
        return 2
    if args.provider == "openai" and not os.environ.get("OPENAI_API_KEY"):
        print("Set OPENAI_API_KEY or rerun with --provider replicate", file=sys.stderr)
        return 2

    generator = generate_replicate if args.provider == "replicate" else generate_openai

    for film in films:
        for scene in PROMPTS[film]:
            dest = OUT_DIR / film / f"{scene['id']}.png"
            if dest.exists():
                print(f"skip  {dest}")
                continue
            print(f"gen   {dest}  <-  {scene['id']}")
            try:
                generator(scene["prompt"], dest)
            except (error.URLError, error.HTTPError, RuntimeError) as exc:
                print(f"fail  {scene['id']}: {exc}", file=sys.stderr)

    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
