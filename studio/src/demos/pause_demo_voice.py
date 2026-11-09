"""Voice lines for the PauseDemo test clip: one ElevenLabs take per line, so each can be placed on its own frame.

python src/demos/pause_demo_voice.py        (run from the studio folder; skips lines already generated)
Writes public/demo/vo_<n>.mp3 and public/demo/vo.json (each line's text, start frame and length).
Uses the skill's default voice and settings, and the key from the .env above the studio (never printed).
"""
import base64, json, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / 'scripts'))
from wi import api, spent_since, decode, SR  # noqa: E402

VOICE = 'Mv9ouM1X38u0rfkwQxAz'  # Dylan - Chill SoCal Male (library): young, chill, approachable
MODEL = 'eleven_multilingual_v2'
SETTINGS = {'stability': 0.4, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True}
# (text, start frame at 30 fps, the frame it must end by)
LINES = [
    ('What if you could pause time?', 8, 60),
    ('Oops.', 62, 82),
    ('Freeze.', 84, 100),
    ('The whole world just... stops.', 102, 148),
    ('So you stroll over, put it back...', 150, 222),
    ('and nobody ever knows.', 226, 290),
]

out = Path('public/demo')
meta = []
t0 = time.time()
called = 0
for i, (text, start, end) in enumerate(LINES):
    mp3 = out / f'vo_{i}.mp3'
    if not mp3.exists():
        res = json.loads(api(f'/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128',
                             {'text': text, 'model_id': MODEL, 'voice_settings': SETTINGS}))
        mp3.write_bytes(base64.b64decode(res['audio_base64']))
        called += 1
    secs = len(decode(mp3)) / SR
    frames = round(secs * 30)
    meta.append({'n': i, 'text': text, 'start': start, 'frames': frames, 'fits': start + frames <= end})
    print(f'{i}  {start:>3}+{frames:<3} {"ok " if start + frames <= end else "LONG"}  {text}')
(out / 'vo.json').write_text(json.dumps(meta, indent=1), encoding='utf-8')
if called:
    used, n = spent_since(t0, expect=called)
    print(f'credits used: {used} ({called} lines, {sum(len(t) for t, _, _ in LINES)} characters)')
