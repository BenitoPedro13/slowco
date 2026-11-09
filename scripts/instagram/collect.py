"""Download an Instagram profile's posts (every carousel slide + caption) for gallery curation.

docs/tasks/TASK-setup.md. A tool run by hand, never by the app or CI.
Ported from unimeet's scripts/instagram-research/ (collect.py + import_console.py),
trimmed to archiving: no engagement numbers, full slides, one folder per post.

Output (gitignored; working material only, not cleared to ship):
    references/instagram/<handle>/<YYYY-MM-DD>_<shortcode>/01.jpg, 02.jpg, …, post.json
    references/instagram/<handle>/index.md   (every post, for picking galleries)
JPEG EXIF/IPTC segments are removed losslessly on save (CLAUDE.md, privacy rules).
Posts already saved are skipped, so a run can be repeated after a refusal.

Setup (once; macOS's own Python, since Homebrew's 3.14 fails to bootstrap pip in a venv):
    /usr/bin/python3 -m venv .venv-ig
    .venv-ig/bin/pip install 'instaloader==4.15.3' 'browser-cookie3==0.20.1'

Route 1, script (reuses a browser where you're logged in to Instagram):
    .venv-ig/bin/python scripts/instagram/collect.py --login YOUR_IG_USER --browser chrome
    .venv-ig/bin/python scripts/instagram/collect.py --login YOUR_IG_USER <handle> --videos

Route 2, browser (no API calls, so no 429; ported from model-portfolio's
collect-posts.js): open instagram.com/<handle>/ logged in, paste
scripts/instagram/console.js into the DevTools console (⌥⌘J). It opens every post,
clicks through every carousel slide and downloads ig-<handle>_<shortcode>_<NN>.jpg
plus ig-<handle>.json into Downloads. Then:
    /usr/bin/python3 scripts/instagram/collect.py --from-json ~/Downloads/ig-<handle>.json
Route 2 needs no packages.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
DEFAULT_OUT = REPO / "references" / "instagram"
BROWSERS = ["chrome", "safari", "firefox", "arc", "brave", "edge"]
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
EXTENSIONS = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/heic": ".heic", "video/mp4": ".mp4"}
BLOCK_SIGNS = ("feedback_required", "429", "401", "checkpoint", "please wait a few minutes", "rate limit")

BLOCK_HELP = """
  Instagram refused ("feedback_required" / 401 / 429). Stopping here: each retry extends it.
  - Wait a few hours (or a day), then re-run; posts already saved are skipped.
  - Or use route 2 (scripts/instagram/console.js), see the top of this file."""

CHECKPOINT_HELP = """Instagram asked to confirm this login ("checkpoint") and refused it.
Reuse the session of a browser where you're already logged in instead:
    .venv-ig/bin/python scripts/instagram/collect.py --login {user} --browser chrome
(or safari / firefox / arc / brave / edge). Chrome asks once for Keychain access
("Chrome Safe Storage"); Safari needs Full Disk Access for the terminal app."""


def pause(low: float, high: float) -> None:
    time.sleep(random.uniform(low, high))


def attr(obj, name, default=None):
    """Instaloader properties can raise when Instagram omits a field."""
    try:
        value = getattr(obj, name)
        return default if value is None else value
    except Exception:
        return default


# --- saving -----------------------------------------------------------------


def strip_jpeg_metadata(data: bytes) -> bytes:
    """Drop APP1 (EXIF/XMP) and APP13 (IPTC) segments without re-encoding."""
    if data[:2] != b"\xff\xd8":
        return data
    out = bytearray(b"\xff\xd8")
    i = 2
    while i + 4 <= len(data):
        if data[i] != 0xFF:
            return data  # not a marker where one should be: leave the file untouched
        marker = data[i + 1]
        if marker == 0xDA:  # start of scan: the rest is image data
            out += data[i:]
            return bytes(out)
        length = int.from_bytes(data[i + 2 : i + 4], "big")
        if marker not in (0xE1, 0xED):
            out += data[i : i + 2 + length]
        i += 2 + length
    return data


def fetch(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read(), response.headers.get_content_type()


def day(post: dict) -> str:
    return (post.get("date_utc") or "undated")[:10]


def sniff(data: bytes) -> str:
    """Instagram serves WebP or JPEG from the same URLs, whatever the file is named."""
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    return "application/octet-stream"


def save_post(post: dict, out: Path, videos: bool, local: Path | None = None) -> int:
    """post = {shortcode, date_utc, slides: [{image_url, video_url} or {download}], …}.
    `download` slides are files the browser route saved into `local`. Returns files written."""
    folder = out / f"{day(post)}_{post['shortcode']}"
    folder.mkdir(parents=True, exist_ok=True)
    written = 0
    for n, slide in enumerate(post["slides"], start=1):
        wanted = [(f"{n:02d}", slide.get("image_url") or slide.get("download"))]
        if videos and slide.get("video_url"):
            wanted.append((f"{n:02d}-video", slide["video_url"]))
        files = []
        for stem, url in wanted:
            existing = sorted(folder.glob(stem + ".*"))
            if existing:
                files.append(existing[0].name)
                continue
            if not url:
                continue
            if slide.get("download") and url == slide["download"]:
                source = (local or Path(".")) / url
                if not source.exists():
                    print(f"    missing {source.name}: not in {source.parent}")
                    continue
                data = source.read_bytes()
                kind = sniff(data)
            else:
                data, kind = fetch(url)
            if kind == "image/jpeg":
                data = strip_jpeg_metadata(data)
            elif kind.startswith("image/"):
                print(f"    note: {stem} is {kind}; metadata not stripped, check before use")
            path = folder / (stem + EXTENSIONS.get(kind, ".bin"))
            path.write_bytes(data)
            files.append(path.name)
            written += 1
            pause(0.5, 1.5)
        slide["files"] = files
    record = {k: v for k, v in post.items()}
    (folder / "post.json").write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    return written


def complete(out: Path, shortcode: str) -> bool:
    """Saved before, with a file for every slide (a slide missing last time is retried)."""
    for post_file in out.glob(f"*_{shortcode}/post.json"):
        slides = json.loads(post_file.read_text(encoding="utf-8")).get("slides", [])
        return all(slide.get("files") for slide in slides)
    return False


def write_index(out: Path, handle: str) -> None:
    rows = []
    for post_file in sorted(out.glob("*/post.json"), reverse=True):
        post = json.loads(post_file.read_text(encoding="utf-8"))
        first = (post.get("caption") or "").strip().splitlines()
        first = first[0][:100].replace("|", "/") if first else ""
        people = ", ".join("@" + u for u in post.get("tagged_users") or [])
        rows.append(
            f"| {day(post)} | [{post_file.parent.name}]({post_file.parent.name}/) | {post['type']} | "
            f"{len(post['slides'])} | {people} | [{first or post['shortcode']}]({post['url']}) |"
        )
    lines = [
        f"# @{handle}: posts",
        "",
        "Working material for curation (docs/tasks/TASK-setup.md). Not cleared to ship.",
        "Tagged people need their consent before a photo of them appears on the site.",
        "",
        "| Date | Folder | Type | Slides | Tagged | Caption |",
        "|---|---|---|---|---|---|",
        *rows,
    ]
    (out / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


# --- route 1: instaloader ---------------------------------------------------


def browser_session(browser: str) -> dict:
    try:
        import browser_cookie3
    except ImportError:
        sys.exit("browser-cookie3 is not installed: .venv-ig/bin/pip install 'browser-cookie3==0.20.1'")
    try:
        jar = getattr(browser_cookie3, browser)(domain_name="instagram.com")
    except Exception as error:
        sys.exit(f"Could not read {browser}'s cookies: {error}")
    cookies = {cookie.name: cookie.value for cookie in jar}
    if "sessionid" not in cookies:
        sys.exit(f"{browser} has no Instagram session. Log in at instagram.com in {browser}, then re-run.")
    return cookies


def login(instaloader, loader, user: str, browser: str | None) -> None:
    if browser:
        loader.load_session(user, browser_session(browser))
        print(f"Using the Instagram session from {browser}")
    else:
        try:
            loader.load_session_from_file(user)
            print(f"Loaded saved session for {user}")
        except FileNotFoundError:
            print(f"No saved session for {user}; logging in (password and 2FA are asked here).")
            try:
                loader.interactive_login(user)
            except instaloader.exceptions.LoginException as error:
                if "checkpoint" in str(error).lower():
                    sys.exit(CHECKPOINT_HELP.format(user=user))
                sys.exit(f"Login failed: {error}")
    logged_in = loader.test_login()
    if logged_in != user:
        where = f"{browser} is logged in as {logged_in!r}, not {user!r}" if browser and logged_in else "The session is not logged in"
        sys.exit(f"{where}. Log in to Instagram as {user} in a browser, then re-run.")
    loader.save_session_to_file()


def instaloader_record(post) -> dict:
    kind = {"GraphImage": "image", "GraphVideo": "video", "GraphSidecar": "carousel"}.get(attr(post, "typename"), "image")
    if kind == "carousel":
        slides = [
            {"image_url": node.display_url, "video_url": node.video_url if node.is_video else None, "is_video": node.is_video}
            for node in post.get_sidecar_nodes()
        ]
    else:
        is_video = bool(attr(post, "is_video", False))
        slides = [{"image_url": post.url, "video_url": attr(post, "video_url") if is_video else None, "is_video": is_video}]
    caption = attr(post, "caption", "") or ""
    date = attr(post, "date_utc")
    return {
        "shortcode": post.shortcode,
        "url": f"https://www.instagram.com/p/{post.shortcode}/",
        "date_utc": date.replace(tzinfo=timezone.utc).isoformat(),
        "type": kind,
        "pinned": bool(attr(post, "is_pinned", False)),
        "caption": caption,
        "alt_text": attr(post, "accessibility_caption"),
        "tagged_users": list(attr(post, "tagged_users", [])),
        "mentions": list(attr(post, "caption_mentions", [])),
        "slides": slides,
        "source": "instaloader",
        "read_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def run_instaloader(args) -> None:
    try:
        import instaloader
    except ImportError:
        sys.exit("instaloader is not installed. See the setup lines at the top of this file, or use --from-json.")
    if not args.login:
        sys.exit("--login YOUR_IG_USER is required for route 1 (or use --from-json).")
    loader = instaloader.Instaloader(
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        max_connection_attempts=3,
        request_timeout=30,
    )
    if not args.handles:
        sys.exit("Pass the profile handle(s) to read (the client's handle is open input #1 in docs/08-OPEN-INPUTS.md).")
    login(instaloader, loader, args.login, args.browser)
    for handle in args.handles:
        out = args.out / handle
        out.mkdir(parents=True, exist_ok=True)
        print(f"\n@{handle}")
        saved = 0
        try:
            profile = instaloader.Profile.from_username(loader.context, handle)
            print(f"  {attr(profile, 'mediacount', '?')} posts on the profile")
            for post in profile.get_posts():
                if complete(out, post.shortcode) and not args.refresh:
                    print(f"  skip {post.shortcode} (already saved)")
                    continue
                record = instaloader_record(post)
                files = save_post(record, out, args.videos)
                saved += 1
                print(f"  {day(record)} {record['type']:<8} {len(record['slides'])} slide(s), {files} file(s) new")
                pause(3, 7)
        except KeyboardInterrupt:
            print("\nStopped; what was saved so far stays.")
        except Exception as error:
            print(f"  failed: {type(error).__name__}: {error}")
            if isinstance(error, instaloader.exceptions.AbortDownloadException) or any(s in str(error).lower() for s in BLOCK_SIGNS):
                print(BLOCK_HELP)
        write_index(out, handle)
        print(f"  {saved} post(s) saved → {out}")


# --- route 2: console.js output --------------------------------------------


def run_from_json(args) -> None:
    for path in args.from_json:
        data = json.loads(path.expanduser().read_text(encoding="utf-8"))
        handle = data["handle"]
        out = args.out / handle
        out.mkdir(parents=True, exist_ok=True)
        print(f"\n@{handle} ({len(data['posts'])} posts in {path.name}, read {data['read_at']})")
        if "method" in data:
            print(f"  slide files are read from {path.expanduser().parent}")
        for record in data["posts"]:
            if complete(out, record['shortcode']) and not args.refresh:
                print(f"  skip {record['shortcode']} (already saved)")
                continue
            record = {**record, "source": "console", "read_at": data["read_at"]}
            try:
                files = save_post(record, out, args.videos, path.expanduser().parent)
            except urllib.error.HTTPError as error:
                print(f"  {record['shortcode']} failed: HTTP {error.code}. Links expire after a few days: run console.js again.")
                continue
            print(f"  {day(record)} {record['type']:<8} {len(record['slides'])} slide(s), {files} file(s) new")
        write_index(out, handle)
        print(f"  → {out}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("handles", nargs="*", help="profiles to read (required: the client's handle)")
    parser.add_argument("--login", help="route 1: your Instagram username")
    parser.add_argument("--browser", choices=BROWSERS, help="route 1: reuse this browser's Instagram session")
    parser.add_argument("--from-json", nargs="+", type=Path, metavar="FILE", help="route 2: ig-<handle>.json from console.js")
    parser.add_argument("--videos", action="store_true", help="also save video slides/Reels as .mp4 (covers are always saved)")
    parser.add_argument("--refresh", action="store_true", help="save posts again even if already saved")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    if args.from_json:
        run_from_json(args)
    else:
        run_instaloader(args)


if __name__ == "__main__":
    main()
