#!/usr/bin/env python3
"""Check that studio/CATALOG.md lists everything in the library.

Usage (from the studio folder, or pass its path):
    python <skill>/scripts/catalog_check.py [studio_dir]

Reports, and exits with code 1 when anything is missing:
  - components exported from src/engine/ (PascalCase) that CATALOG.md doesn't mention
  - power looks defined in src/episodes/*/index.tsx that CATALOG.md doesn't mention
  - sound clips in library/sfx/ whose name CATALOG.md doesn't mention
  - thumbs named in CATALOG.md that don't exist in library/thumbs/
It also prints how many catalogued rows still have no thumb (a reminder, not a failure).
"""
import re
import sys
from pathlib import Path

# Engine plumbing that isn't a drawable asset: never needs a catalog row.
IGNORE = {
    "C", "D", "N", "S3", "UI", "SCH", "FONT", "LOOKS", "KIDS",
    "Episode", "Board", "ShotFrame", "Hero", "Actor", "Box", "Room",
}

EXPORT = re.compile(r"^export const ([A-Z][A-Za-z0-9_]*)\b", re.M)
LOOK_DEF = re.compile(r"^const ([a-z][A-Za-z0-9_]*Look)\b", re.M)


def find_studio(arg):
    if arg:
        return Path(arg).resolve()
    here = Path.cwd()
    for cand in (here, here / "studio", Path(__file__).resolve().parent.parent / "studio"):
        if (cand / "src" / "engine").is_dir():
            return cand
    sys.exit("catalog_check: can't find the studio folder (one with src/engine); pass its path.")


def mentioned(name, text):
    return re.search(r"(?<![A-Za-z0-9_])" + re.escape(name) + r"(?![A-Za-z0-9_])", text) is not None


def main():
    studio = find_studio(sys.argv[1] if len(sys.argv) > 1 else None)
    cat_path = studio / "CATALOG.md"
    if not cat_path.exists():
        sys.exit(f"catalog_check: {cat_path} is missing.")
    cat = cat_path.read_text(encoding="utf-8")
    problems = []

    for f in sorted((studio / "src" / "engine").rglob("*.ts*")):
        for name in EXPORT.findall(f.read_text(encoding="utf-8")):
            is_const = name.isupper() or (len(name) > 1 and name.replace("_", "").isupper())
            if name in IGNORE or is_const:
                continue
            if not mentioned(name, cat):
                problems.append(f"component  {name:<22} {f.relative_to(studio)}")

    for f in sorted((studio / "src" / "episodes").glob("*/index.tsx")):
        for name in LOOK_DEF.findall(f.read_text(encoding="utf-8")):
            if not mentioned(name, cat):
                problems.append(f"power look {name:<22} {f.relative_to(studio)}")

    sfx_dir = studio / "library" / "sfx"
    if sfx_dir.is_dir():
        names = sorted({re.sub(r"-[0-9a-f]{6,}$", "", p.stem) for p in sfx_dir.iterdir() if p.is_file()})
        for name in names:
            if not mentioned(name, cat):
                problems.append(f"sound      {name:<22} library/sfx/")

    thumbs = studio / "library" / "thumbs"
    for thumb in sorted(set(re.findall(r"(?<![/A-Za-z0-9_\-])([A-Za-z0-9_\-]+\.(?:png|jpg))", cat))):
        if not (thumbs / thumb).exists():
            problems.append(f"thumb      {thumb:<22} named in CATALOG.md but not in library/thumbs/")

    no_thumb = len(re.findall(r"\|\s*-\s*\|\s*[^|]+\|\s*$", cat, re.M))

    if problems:
        print(f"CATALOG.md is missing {len(problems)} item(s):")
        for p in problems:
            print("  " + p)
    else:
        print("CATALOG.md covers everything in the library.")
    if no_thumb:
        print(f"({no_thumb} catalogued row(s) still have no thumb in library/thumbs/.)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
