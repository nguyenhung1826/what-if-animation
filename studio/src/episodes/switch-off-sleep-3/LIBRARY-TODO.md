> **Merged into the library on 2026-11-10** (engine + CATALOG.md); what stays here is listed as one-off below or in the merge report.

# Library TODO — switch-off-sleep-3 (chapter 3, kitchen)

No new SFX (all 9 clips reused from library/sfx: room_tone, clink, cookie_crunch, gulp, cat_yowl, gasp, shades, pop, music).
No new sets. Candidates to move from `src/episodes/switch-off-sleep-3/shots.tsx` into the engine at merge time:

| Name | Where now | What | Params | Suggested home |
|---|---|---|---|---|
| `Bowl` | shots.tsx | cereal bowl, side-on, x/y = bottom centre, cereal bits on top | `x, y, s` | `src/engine/props.tsx` (Props table) |
| `Breakfast` | shots.tsx | breakfast from above: `PlateTop` + two fried eggs + a slice of toast | `x, y, r` (plate radius, default 230) | `src/engine/props.tsx` |
| `MugTop` | shots.tsx | coffee mug seen from above, handle right, steam wisps loop every 48 f | `x, y, t` | `src/engine/props.tsx` (pairs with `Mug`) |
| `MOM` (look) | shots.tsx (exported) | `tone(LOOKS.mom, 'white')` in a dusty-rose dressing gown (`coat: 'long'`, `#B7737F`/`#9A5C68`), plum pyjama trousers `#5A4A6A`, pink slippers `#E9B9C2`, dark bob `#4A2A22`. User approved on the ch3 storyboard | — | episode-level costume; reuse in later chapters by import, or note in CATALOG costume examples |
| `SIS` (look) | shots.tsx (exported) | `tone(LOOKS.sis, 'black')` in teal pyjamas (`#3E8C86` top, `#357A75` bottoms), coral slippers `#F28C6A`, bunches hair `#3A2E44`; draw at k = 0.43 with `stand()` (0.7 of an adult). User approved | — | ch6 (rooftop sis) should import this so she matches |
| `Dawn` | shots.tsx | early-morning grade: multiply rect `#3A4A80` at 0.25 (kitchen has no `dawn`/`night` prop) | — | could become `Kitchen tint="dawn"|"night"` alongside ch1's `Night` |

Trick worth a line in traps.md: a finger-to-lips "shh" can't be posed with the rig's arm in a CloseUp (the hand folds back to the
shoulder); S12 draws the hand (fist + raised index, hero hand colour, line stroke, a cream rim) in screen space instead.
