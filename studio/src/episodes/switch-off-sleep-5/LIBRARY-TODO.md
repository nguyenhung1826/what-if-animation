# Library to-do from switch-off-sleep-5

Made in parallel with chapters 3, 4 and 6, so nothing here was moved into `src/engine/` or `CATALOG.md`. The merge
session should do it.

## Schematic pieces (in `kit.tsx`, to move into `src/engine/sets/schematic.tsx`)

| Name | What it is | Params | Suggested catalog row |
|---|---|---|---|
| `BrainOutline` | A brain seen from the side (front to the left) that draws on: the outline first, then 8 folds in `SCH.dim`. About 800 px wide at `s` 1, centred on (x, y). | `x`, `y`, `s`, `t` (draw-on clock: outline over 24 frames, folds from 14), `color` | Schematic row: add `BrainOutline` |
| `BrainCells` | A magnified circle of brain tissue: a 4x4 grid of rounded cells with gaps between them. `gap` 0..1 widens the gaps (awake -> asleep, ~60% wider). `flow` 0..1 adds blue fluid streaks (`FLUID` `#5AC8FF`) running through the gaps. `waste` 0..1 adds orange specks between the cells; while `flow` is on they get carried out to the right. | `x`, `y`, `r` (300), `t`, `gap`, `flow`, `waste`, `o` (fade-in), `id` (must be unique: clip path), `label` (text above) | Schematic row: add `BrainCells` (gap, flow, waste) |
| `NeedleDial` | A half-circle meter with a needle, ticks and a red zone with a marked red line. Use it for any "past the limit" reading. `Gauge` in `ui.tsx` is only a bar. | `x`, `y` (the pivot), `r` (380), `p` 0..1 (the needle), `red` (where the red zone starts, 0.66), `redLabel`, `left`, `right`, `flash` 0..1 (pulses the red zone), `t` | UI and marks: add `NeedleDial` (or put it next to `Gauge` in `ui.tsx`) |
| `FLUID` | The fluid blue `#5AC8FF`. | | Could join `SCH` as `SCH.fluid` |
| `ramp(t, a, d)` | `easeOut(clamp((t - a) / d))`. A small helper. | | Optional: `anim.ts` |

Thumbs: render `BrainCells` (gap 1, flow 1, waste 0.5) next to `BrainOutline` on a `Schematic` as
`set-schematic-brain.png`, and `NeedleDial` (p 0.78) as `prop-needledial.png`.

## Sound (already in `library/sfx/`, needs a catalog row)

- `phone_buzz` (1.6 s): "a smartphone on vibrate buzzing on a wooden nightstand at night, two short rattling buzzes,
  no ringtone". Add it to the Objects group in the Sound table.

## One-offs that stay in the episode (not worth the library yet)

- The lamp's rocker switch insert (S2) is a trimmed copy of chapter 1's S4 nightstand. If a third chapter wants it,
  make it `LampSwitch` (`on` 0..1) in `props.tsx`.
- The cereal box and bowl (S11) and the book page with drifting word blocks and a repeating highlight (S12). A
  `CerealBox` / `Bowl` prop would be easy to lift out if a kitchen breakfast shows up again.
