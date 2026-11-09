# switch-off-sleep-4: what to merge into the library

All of these live in `src/episodes/switch-off-sleep-4/shots.tsx` for now (the parallel-chapter rule kept `src/engine/`
and `CATALOG.md` closed). Move each to the engine, export it, add its row and thumb, then import it from there.

## Props

| Name | Move to | What it is | Params |
|---|---|---|---|
| `EnergyCan` | `src/engine/props.tsx` | an energy-drink can, side-on (x, y = bottom centre): colour body, black band with a yellow bolt, silver lid, highlight | `s`, `rot`, `color` (green `#3FB86A` default; used red `#E0463A`, blue `#3E7AD0`), `crushed` 0..1 |
| `Chalk` | `src/engine/sets/classroom.tsx` (next to `Classroom`'s `board`) | chalk handwriting that writes itself on, left to right, via a clipPath | `x`, `y`, `text`, `size`, `p` 0..1, `id` (unique clip id), `color` |

## Character looks (for the cast table / a `LOOKS` entry once a second episode wants them)

| Name | Built from | Outfit |
|---|---|---|
| `MO` (Mo, this series) | `tone(LOOKS.mo, 'black')` | olive bomber (`coat: 'bomber'`, `#5E6E46`), mustard accent, curls `#2A2430`, red sneakers. Approved by the user on the ch4 storyboard |
| `TEACHER` | `tone(LOOKS.suit, 'white')` | brown tweed blazer `#7A5A3A`, green tie `#2F6A4A`, grey hair `#8A8A90`. Approved on the ch4 storyboard |

## Engine gaps noticed (not fixed: engine closed)

- `Kid` (classroom) has no skin param: a turned kid's face is `C.skin` (cream `#F6EFE3`), close to but not exactly
  `TONES.white`. Suggest a `skin` prop defaulting to `TONES.white.skin` (and allowing `TONES.black`).
- `FloatLabel` fades out after 24 frames; to hold a label, ch4 passes `t = Math.min(t - start, 12)`. A `hold` prop would
  make that explicit.

## Sound

No new clips: all 15 reused from `library/sfx/` (ding, buzzer, laugh, step, fall_whoosh, catch, dizzy, gulp, pop,
select_draw, class_murmur, paper_land, room_tone, drone_hit, music).
