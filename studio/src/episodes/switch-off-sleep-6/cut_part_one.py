"""Chapter 6 ends the story (no Part 2): cut "Part one." out of the voice take, free (no new API call).
Run after voice.py (which rewrites voice.wav and words.json): python src/episodes/switch-off-sleep-6/cut_part_one.py
Removes [Part.s - 0.04, Tell.s - 0.05) from public/<slug>/voice.wav and shifts words.json to match."""
import json, wave, pathlib
import numpy as np
slug = 'switch-off-sleep-6'
wav, wj = pathlib.Path(f'public/{slug}/voice.wav'), pathlib.Path(f'src/episodes/{slug}/words.json')
words = json.loads(wj.read_text(encoding='utf-8'))
names = [w['w'] for w in words]
if 'Part' not in names:
    raise SystemExit('already cut')
i = names.index('Part')
a, b = words[i]['s'] - 0.04, words[i + 2]['s'] - 0.05  # i+2 = "Tell"
with wave.open(str(wav)) as f:
    p = f.getparams(); x = np.frombuffer(f.readframes(p.nframes), dtype=np.int16)
sr = p.framerate
y = np.concatenate([x[: int(a * sr)], x[int(b * sr):]])
with wave.open(str(wav), 'wb') as f:
    f.setparams(p); f.writeframes(y.tobytes())
d = b - a
out = words[:i] + [{**w, 's': round(w['s'] - d, 3), 'e': round(w['e'] - d, 3)} for w in words[i + 2:]]
wj.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'cut {d:.2f} s; new length {len(y) / sr:.2f} s')
