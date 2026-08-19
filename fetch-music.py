#!/usr/bin/env python3
"""Tai nhac nen CC (CC0/CC-BY) tu Openverse API ve kho nhac theo mood.

Cach dung:
    python3 fetch-music.py <mood> [tu-khoa] [so-luong]
    python3 fetch-music.py all            # do day tat ca mood voi tu khoa mac dinh

Vi du:
    python3 fetch-music.py soi-dong "upbeat energetic electronic" 3

Nhac CC-BY phai ghi credit — script tu luu vao public/music/<mood>/CREDITS.txt,
copy dong credit vao mo ta video khi dang.
Sau khi tai xong tu chay: npm run scan-music
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
UA = "news-to-video-pipeline/1.0 (personal video project)"

# Openverse hop voi tu khoa NGAN (1-2 tu); cang dai cang it ket qua
DEFAULT_KEYWORDS = {
    "soi-dong": "energetic",
    "corporate": "corporate",
    "lofi-chill": "chill",
    "trang-nghiem": "piano",
    "quang-cao": "upbeat",
}


def slugify(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:48] or "track"


def fetch(mood: str, keywords: str, count: int) -> int:
    q = urllib.parse.quote(keywords)
    url = (
        f"https://api.openverse.org/v1/audio/?q={q}"
        f"&category=music&license=cc0,by&page_size=20"
    )
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    data = json.loads(urllib.request.urlopen(req, timeout=60).read())
    results = data.get("results", [])
    # uu tien 60-240s, bo track qua ngan/dai
    results = [r for r in results if 45_000 <= (r.get("duration") or 0) <= 300_000]
    outdir = os.path.join(ROOT, "public", "music", mood)
    os.makedirs(outdir, exist_ok=True)
    credits_path = os.path.join(outdir, "CREDITS.txt")
    existing = open(credits_path, encoding="utf-8").read() if os.path.exists(credits_path) else ""
    saved = 0
    with open(credits_path, "a", encoding="utf-8") as cred:
        for r in results:
            if saved >= count:
                break
            name = slugify(r["title"])
            dest = os.path.join(outdir, f"{name}.mp3")
            if os.path.exists(dest) or name in existing:
                continue
            try:
                dl = urllib.request.Request(r["url"], headers={"User-Agent": UA})
                audio = urllib.request.urlopen(dl, timeout=120).read()
                if len(audio) < 100_000:
                    continue
                open(dest, "wb").write(audio)
            except Exception as e:
                print(f"  bo qua {r['title']!r}: {e}")
                continue
            line = (
                f"{name}.mp3 | \"{r['title']}\" by {r.get('creator') or 'unknown'}"
                f" | {r['license'].upper()} {r.get('license_version') or ''}"
                f" | {r.get('foreign_landing_url') or r['url']}"
            )
            cred.write(line + "\n")
            print(f"  + {line}")
            saved += 1
    return saved


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    target = sys.argv[1]
    if target == "all":
        for mood, kw in DEFAULT_KEYWORDS.items():
            print(f"[{mood}] '{kw}'")
            n = fetch(mood, kw, 2)
            print(f"  => {n} track")
    else:
        kw = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_KEYWORDS.get(target, target)
        count = int(sys.argv[3]) if len(sys.argv) > 3 else 3
        n = fetch(target, kw, count)
        print(f"=> {n} track moi cho mood '{target}'")
    subprocess.run(["bash", os.path.join(ROOT, "scan-music.sh")], check=False)


if __name__ == "__main__":
    main()
