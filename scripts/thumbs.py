"""Renders the library thumbs: one still per entry of THUMBS in studio/src/LibraryThumbs.tsx, 960 px wide, into
studio/library/thumbs/. Run from anywhere:

python <skill>/scripts/thumbs.py [file ...]     (no names = all of them)
"""
import re, subprocess, sys
from pathlib import Path

STUDIO = Path(__file__).resolve().parent.parent / 'studio'
src = (STUDIO / 'src' / 'LibraryThumbs.tsx').read_text(encoding='utf-8')
files = re.findall(r"\bfile: '([^']+)'", src)
want = set(sys.argv[1:])
npx = 'npx.cmd' if sys.platform == 'win32' else 'npx'
out = STUDIO / 'library' / 'thumbs'
out.mkdir(parents=True, exist_ok=True)
for i, name in enumerate(files):
    if want and name not in want:
        continue
    print(f'{i:>2}  {name}')
    subprocess.run([npx, 'remotion', 'still', 'src/index.ts', 'Thumbs', str(out / name), f'--frame={i}', '--scale=0.5', '--log=error'],
                   cwd=STUDIO, check=True)
