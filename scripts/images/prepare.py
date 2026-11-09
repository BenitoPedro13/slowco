#!/usr/bin/env python3
"""Image pipeline (docs/06-ARCHITECTURE.md §7). Needs Pillow (.venv-ig has it).

  prepare SRC... --out DIR   re-encode to JPEG q85, long edge <= 2400 px, sRGB ICC kept,
                             every other metadata (EXIF, XMP, GPS, device, comments) dropped.
                             Output name: --name or the source stem, lowercased, ascii, dashes.
  --manifest FILE --out DIR  same, for every "source<TAB>name" line of FILE (# comments ok).
  --check DIR                exit 1 if any image under DIR carries EXIF, XMP, GPS or
                             device data.

Run: .venv-ig/bin/python -I scripts/images/prepare.py --check public
Only files listed in docs/05-CONTENT.md §9 (with consent for every identifiable person, 08 #9)
may be prepared into public/.
"""

from __future__ import annotations

import argparse
import io
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

MAX_EDGE = 2400
QUALITY = 85
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"}
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))


def slug(text: str) -> str:
    ascii_ = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_.lower()).strip("-") or "imagem"


def to_srgb(img: Image.Image) -> Image.Image:
    icc = img.info.get("icc_profile")
    if icc:
        src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        img = ImageCms.profileToProfile(img.convert("RGB"), src, SRGB, outputMode="RGB")
    return img.convert("RGB")


def prepare(src: Path, out_dir: Path, name: str | None) -> Path:
    with Image.open(src) as img:
        img.load()
        img = ImageOps.exif_transpose(img)  # bake orientation in, then drop EXIF
        img = to_srgb(img)
        img.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        clean = Image.new("RGB", img.size)
        clean.paste(img)  # a fresh image carries no info/metadata from the source
    out_dir.mkdir(parents=True, exist_ok=True)
    dest = out_dir / f"{slug(name or src.stem)}.jpg"
    clean.save(
        dest,
        "JPEG",
        quality=QUALITY,
        optimize=True,
        progressive=True,
        icc_profile=SRGB.tobytes(),
    )
    return dest


def problems(path: Path) -> list[str]:
    found: list[str] = []
    try:
        with Image.open(path) as img:
            exif = img.getexif()
            if len(exif):
                found.append(f"EXIF ({len(exif)} tags)")
            if exif.get_ifd(0x8825):
                found.append("GPS")
            if any(tag in exif for tag in (0x010F, 0x0110, 0xA431, 0xA434)):
                found.append("device make/model/serial")
            if "xmp" in img.info or "XML:com.adobe.xmp" in img.info:
                found.append("XMP")
            if img.info.get("comment"):
                found.append("comment")
    except Exception as exc:  # unreadable image is a problem too
        found.append(f"unreadable: {exc}")
    return found


def check(root: Path) -> int:
    files = [p for p in sorted(root.rglob("*")) if p.suffix.lower() in IMAGE_SUFFIXES]
    bad = 0
    for p in files:
        issues = problems(p)
        if issues:
            bad += 1
            print(f"FAIL {p}: {', '.join(issues)}")
    print(f"checked {len(files)} image(s) under {root}: {bad} with metadata")
    return 1 if bad else 0


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("sources", nargs="*", type=Path)
    ap.add_argument("--out", type=Path)
    ap.add_argument("--name", help="output name (single source only)")
    ap.add_argument("--manifest", type=Path, metavar="FILE")
    ap.add_argument("--check", type=Path, metavar="DIR")
    args = ap.parse_args(argv)

    if args.check:
        return check(args.check)
    if args.manifest and args.out:
        for line in args.manifest.read_text().splitlines():
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            src, name = line.split("\t")
            print(f"{src} -> {prepare(Path(src), args.out, name)}")
        return check(args.out)
    if not args.sources or not args.out:
        ap.error("give SRC... --out DIR, or --check DIR")
    if args.name and len(args.sources) > 1:
        ap.error("--name works with one source")
    for src in args.sources:
        dest = prepare(src, args.out, args.name)
        print(f"{src} -> {dest}")
    return check(args.out)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
