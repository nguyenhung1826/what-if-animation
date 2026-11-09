# Library to-do from switch-off-sleep-6

Things drawn in this chapter that later episodes could reuse. They live in this episode's `shots.tsx` for now
(parallel sessions may not touch `src/engine/` or `CATALOG.md`); the merge session should move them in.

## Props

| Name | Now in | What it is | Params | Move to |
|---|---|---|---|---|
| `Crate` | `shots.tsx` | a wooden crate to sit on (slats, a diagonal brace, a lit top edge, a contact shadow) | `x`, `top`, `bottom`, `w` | `src/engine/props.tsx`; thumb `prop-crate.png` |
| `PowerSwitch` | `shots.tsx` | a wall rocker-switch plate marked ON / OFF, the rocker orange when on, grey when off, a cool glow | `x`, `y`, `s`, `down` 0 (on) .. 1 (off), `glow` | `src/engine/props.tsx`; thumb `prop-powerswitch.png`. Chapter 1 S4 draws the same rocker inline on a lamp cord: could share it |
| `HandPhone` | `shots.tsx` | a small lit phone pinned to a character's hand (`toWorld(pose, joints(pose).armR.end)`) | `pose`, `side`, `lit` | `src/engine/props.tsx` next to `Phone` |

## Patterns worth a helper

- **Sitting on the rooftop.** `Rooftop`'s parapet is the far edge of the roof, so a character "on the parapet" reads
  as standing. Seat them side-on on a `Crate` on the deck: hip at `deck - 74*scale - 4*scale`, `yaw 0.8`, legs
  `{a: 86, b: -86}` / `{a: 80, b: -78}`. Deck feet line: `846 + low`; parapet top `790 + low`. Could become
  `roofSit(x, low, scale)` / `roofStand(x, low, scale)` exported from `sets/rooftop.tsx`.
- **The end card** (S12): "what would you do?" + two choice boxes (orange / ice blue) + THE END, on black. A
  reusable `ChoiceCard` in `ui.tsx` would serve any episode that ends on the audience's choice.

## Looks

- `SIS` (the sister in teal pajamas, black tone) is copied from chapter 3's `shots.tsx`; both chapters define it.
  Move it to one place (e.g. `LOOKS.sisPajamas` or an export shared by the switch-off-sleep chapters).
- `SUIT = tone(LOOKS.suit, 'black')`: charcoal suit, red tie, unchanged otherwise.

## Sound

No new clips: roof_wind, step, title_boom, power_hum, switch_off, pop, sparkle, music all reused from `library/sfx/`.

## Voice note

`cut_part_one.py` removes "Part one." from the take (the user chose to end the story here, no Part 2). Re-run it
after any `voice.py` run on this chapter. Hold keys in `episode.json` match words with punctuation stripped
("dont|So", "end|Whod").
