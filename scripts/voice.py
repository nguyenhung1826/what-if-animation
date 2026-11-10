"""Step 2: the voice. ElevenLabs text-to-speech with character timestamps, then the pauses tightened to the genre's pace.

python <skill>/scripts/voice.py <slug> [--force]
Reads  src/episodes/<slug>/episode.json  (script, voice, gaps)
Writes public/<slug>/voice_raw.mp3, public/<slug>/voice.wav (tightened), src/episodes/<slug>/words.json (word timings
       after tightening, used by plan.py) and out/<slug>/words_raw.json. Prints the credits it used.
The API is only called when the text or the voice settings change (cached by a hash), so re-running to retune the
gaps is free.

episode.json "voice" (all optional): {"id": "y0s2ExEMuum3muUnA6Zd", "model": "eleven_multilingual_v2",
  "settings": {"stability": 0.28, "similarity_boost": 0.8, "style": 0.55, "use_speaker_boost": true}}
episode.json "previous_text" (optional): the last line of the previous chapter, so a long-form chapter carries on its
  delivery instead of restarting flat. Not voiced, not charged.
episode.json "gaps" (seconds, all optional): {"word": 0.12, "comma": 0.2, "sentence": 0.3, "question": 0.45,
  "pairs": {"anything|One": 0.6}}  -> every pause longer than its limit is cut to the limit, from its middle.
episode.json "holds" (seconds, optional): {"asleep|Not": 1.6} -> that pause is stretched to at least this long with
  silence in its middle (long-form pacing: room for a picture to land, a title to hold). Also free to retune.
"""
import base64, hashlib, json, re, subprocess, sys, time

import numpy as np

from wi import SR, api, spent_since, decode, ep_dir, load_episode, load_json, log_cost, out_dir, pub_dir, save_json, write_wav

slug = sys.argv[1]
force = '--force' in sys.argv
ep = load_episode(slug)
# The channel's voice: "Marcus - Bright, Upbeat and Clear" from the ElevenLabs library (young American male, energetic,
# hooks fast), picked 2026-11-10 to replace Tyler (rPMkKgdwgIwqv4fXgR6N): the person wanted a more cheerful, charismatic,
# punchier read. Tyler had replaced Dylan; the skill's original default was TX3LPaxmHKxFdv7VOQHJ.
# Settings carried over from Tyler (loosened 2026-11-10: stability 0.4 -> 0.28, style 0.35 -> 0.55; livelier, and the
# timestamps stay exact on eleven_multilingual_v2).
V = {'id': 'y0s2ExEMuum3muUnA6Zd', 'model': 'eleven_multilingual_v2', 'settings': {'stability': 0.28, 'similarity_boost': 0.8, 'style': 0.55, 'use_speaker_boost': True}}
V.update(ep.get('voice', {}))
if ep.get('previous_text'):
    V['previous_text'] = ep['previous_text']
text = ' '.join(b['text'].strip() for b in ep['script'])
sig = hashlib.sha1(json.dumps([text, V], sort_keys=True).encode()).hexdigest()[:12]
raw_mp3 = pub_dir(slug) / 'voice_raw.mp3'
raw_words = out_dir(slug) / 'words_raw.json'
meta = load_json(out_dir(slug) / 'voice_meta.json', {})

if force or meta.get('sig') != sig or not raw_mp3.exists() or not raw_words.exists():
    print(f'{len(text)} characters to ElevenLabs (voice {V["id"]})')
    t0 = time.time()
    res = json.loads(api(f'/v1/text-to-speech/{V["id"]}/with-timestamps?output_format=mp3_44100_128', {'text': text, 'model_id': V['model'], 'voice_settings': V['settings'], **({'previous_text': V['previous_text']} if V.get('previous_text') else {})}))
    raw_mp3.write_bytes(base64.b64decode(res['audio_base64']))
    al = res['alignment']
    words, cur = [], None
    for ch, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
        if re.match(r"[\w'’]", ch):
            if cur is None:
                cur = {'w': '', 's': s, 'e': e, 'p': ''}
            cur['w'] += ch
            cur['e'] = e
        else:
            if cur is not None:
                words.append(cur)
                cur = None
            if words and ch.strip():
                words[-1]['p'] += ch  # punctuation after the word decides how long its pause may be
    if cur:
        words.append(cur)
    for w in words:
        w['s'], w['e'] = round(w['s'], 3), round(w['e'], 3)
    save_json(raw_words, words)
    save_json(out_dir(slug) / 'voice_meta.json', {'sig': sig, 'chars': len(text)})
    used, n = spent_since(t0, expect=1)
    log_cost(slug, 'voice', used, f'{len(text)} characters' + ('' if n else '; not in the history yet, check the usage page'))
else:
    print('Voice unchanged since the last call: reusing it (no credits).')

# ---------------------------------------------------------------- tighten the pauses
words = load_json(raw_words)
G = {'word': 0.12, 'comma': 0.2, 'sentence': 0.3, 'question': 0.45, 'pairs': {}}
G.update(ep.get('gaps', {}))
H = ep.get('holds', {})
x = decode(raw_mp3)
cuts = []  # (start, end, insert): remove [start, end) of the take, then put `insert` seconds of silence there


def bare(w):
    return re.sub(r'[^\w]', '', w)


for a, b in zip(words, words[1:]):
    gap = b['s'] - a['e']
    key = bare(a['w']) + '|' + bare(b['w'])
    if key in H:
        if gap < H[key]:
            mid = (a['e'] + b['s']) / 2
            cuts.append((mid, mid, H[key] - max(gap, 0)))
        continue
    if key in G['pairs']:
        keep = G['pairs'][key]
    elif '?' in a['p'] or '!' in a['p']:
        keep = G['question']
    elif '.' in a['p'] or ':' in a['p'] or ';' in a['p'] or '…' in a['p']:
        keep = G['sentence']
    elif ',' in a['p'] or '—' in a['p'] or '-' in a['p']:
        keep = G['comma']
    else:
        keep = G['word']
    if gap > keep:
        mid = (a['e'] + b['s']) / 2
        rm = gap - keep
        cuts.append((mid - rm / 2, mid + rm / 2, 0.0))
parts, last = [], 0.0
for s, e, ins in cuts:
    parts.append(x[int(last * SR):int(s * SR)])
    if ins > 0:
        parts.append(np.zeros(int(ins * SR), dtype=x.dtype))
    last = e
parts.append(x[int(last * SR):])
fade = int(0.004 * SR)  # a 4 ms fade either side of each join, so no click
for i, part in enumerate(parts):
    part = part.copy()
    if i > 0 and len(part) > fade:
        part[:fade] *= np.linspace(0, 1, fade)
    if i < len(parts) - 1 and len(part) > fade:
        part[-fade:] *= np.linspace(1, 0, fade)
    parts[i] = part
y = np.concatenate(parts)
write_wav(pub_dir(slug) / 'voice.wav', y)
# Even the voice out and bring it to -16 LUFS: some voices (Dylan's, the channel's first, among them) come back quiet and peaky, and then
# the master can't reach -14 LUFS without the peaks hitting the limit. A gentle compressor, then loudness. Length and
# word timings are unchanged.
vw = pub_dir(slug) / 'voice.wav'
tmp = pub_dir(slug) / 'voice_norm.wav'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(vw), '-af',
                'acompressor=threshold=-26dB:ratio=5:attack=3:release=60:makeup=6,loudnorm=I=-16:TP=-1.5:LRA=5',
                '-ar', str(SR), '-ac', '1', str(tmp)], check=True)
tmp.replace(vw)


def shift(t):
    return t - sum(min(e, t) - s - ins for s, e, ins in cuts if t > s)


out = [{'w': w['w'], 's': round(shift(w['s']), 3), 'e': round(shift(w['e']), 3), 'p': w.get('p', '')} for w in words]
save_json(ep_dir(slug) / 'words.json', out)
print(f'Tightened {sum(1 for c in cuts if c[2] == 0)} pauses, removed {sum(e - s for s, e, _ in cuts):.2f} s, held {sum(1 for c in cuts if c[2] > 0)} for {sum(c[2] for c in cuts):.2f} s: {len(x) / SR:.2f} s -> {len(y) / SR:.2f} s')
print(' '.join(f"{w['w']}@{w['s']}" for w in out))
