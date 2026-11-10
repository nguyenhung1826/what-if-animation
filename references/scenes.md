# Scenes: building each episode's sets as beautifully as possible

Every episode draws its own sets, fresh, for that story (see the rule in `SKILL.md`). The engine gives you the
tools (the rig and cast, the room kit, light, `depth.tsx`); the places themselves are new each time. Aim for a
frame a picture-book illustrator would be proud of, not clip art.

The layer recipe, the one-light rule, "colour tells the story" and the craft checklist are adapted from
[story-animator](https://github.com/deenukhan/story-animator) (MIT, Deenu Khan); the per-surface
"base, texture, edge" rule from [claude-animation-skill](https://github.com/buildwithhanif/claude-animation-skill) (MIT).

## Before drawing: a scene sheet (in the episode's `script` notes or a comment atop `sets.tsx`)

For each set, write four lines:

- **Light:** the one source (a window at dusk, a desk lamp, a TV, the low sun, a phone screen) and where it sits.
- **Palette:** 3-4 colours for this place's mood, plus one accent that draws the eye (the story's object). Change
  the palette when the story turns (calm warm kitchen, then cold blue when the power goes wrong, then warm again).
- **Depth:** what is far, middle and near.
- **Life:** what moves when nobody is acting (steam, dust in the light, a fan, rain, a flickering sign, leaves).

## Build in layers, back to front

| # | Layer | Engine pieces | Depth (parallax) |
|---|---|---|---|
| 1 | Sky or back wall: a gradient, never one flat fill | `DuskSky`, `NightSky`, `Dawn`, `WallTexture`, `RoomShell` | 0.3 |
| 2 | Far shapes: skyline, hills, the building across the street | `Skyline`, `Sun`, `Rays`, `Haze` + `FarHaze` | 0.35-0.5 |
| 3 | Middle world: furniture against the wall, storefronts, trees | room kit `Box`, `BackWindow`, episode props | 0.7-1 |
| 4 | Ground: floor, street, grass, with contact shadows | `RoomShell` floor, `FloorShadow` | 1 |
| 5 | Characters | `Hero`, `Actor`, `walkPose` | 1 |
| 6 | Foreground: a blurred plant, chair back, lamp post, door frame | `Foreground`, `blur16` | 1.2-1.4 |
| 7 | Light: glows (screen blend), shafts, the contrast veil | `Glow`, `Shaft`, `Cone`, `LightVeil`, `pendantLight` | (with its source) |
| 8 | Air and life: dust, snow, rain, embers, bokeh | `Dust`, `Drift`, `Bokeh` | per layer |
| 9 | Finish: vignette, then grain | `Vignette` (0.35-0.55), `Grain` (0.05-0.09) | screen |

Use `Parallax` (or `Layer` with `camAt`) whenever the camera moves: far layers slide less than near ones and the
flat set gets real depth for free. A still camera can still layer for the look.

## Rules of the look

- **One light source per scene.** Everything brightens and warms toward it and darkens and cools away from it.
  Characters get the rim light from its side. If you can't say where the light is, the frame isn't done.
- **Far is cooler, lighter, lower in contrast and thinner in line.** Put `FarHaze` over layers 1-2; outlines thin
  with distance (about 6 px near, 3 px middle, none far).
- **Every surface gets base, texture, edge.** Base fill with a gentle gradient; a texture (wood grain, tile
  joints, fabric weave, brick, a faint `WallTexture`); an edge (an outline, a highlight on the lit side, a shadow
  line underneath). A plain rectangle is a sketch, not a set.
- **Detail where the eye goes, calm elsewhere.** The story's object and the area around the faces get the most
  detail and the accent colour; the corners stay simple and sink under the vignette.
- **No hard pure-black areas,** no flat full-screen single colours, no shapes cutting through each other.
- **Something moves every second** (no dead air): a slow camera creep in long lines, idle life on held characters
  (`idle(t, seed)`: breathing and a blink every 3-5 s), drifting particles, a flicker.
- **A visual beat lands 2-6 frames before its word,** never after: the picture leads the voice slightly. Cut on the
  first word of a line, and keep the silence after a line short (see `traps.md`, "No dead air between beats").
- **Seeded randomness only** (`rnd(seed, i)`), so every render of a frame is identical.
- The hero is drawn by the rig, the same in every shot; scale the whole figure for close-ups, never redraw it.

## Craft checklist (run it on every board still, with the one in `look.md`)

- Would a picture-book illustrator be proud of this frame?
- Can you tell where the light comes from?
- Is there depth: near, middle, far?
- Does the hero read instantly, even small, against this background?
- Is the story's object visible and lit?
- Does every surface have base, texture and edge?
- Nothing ugly: no stretched shapes, no pure-black holes, no text off-screen, no accidental overlaps.

## Common fixes

| Problem | Fix |
|---|---|
| The set looks like vector stock | Gradients on every big fill, texture on surfaces, `Grain`, `Vignette` |
| Muddy colours | Fewer colours; one warm light; darken and cool the far layers |
| Flat, no depth | A blurred foreground object, `FarHaze` on the back, parallax on any camera move |
| The frame feels static | Idle life, particles, a slow camera creep |
| The hero gets lost | Lift the background behind the head (a glow or a lighter wall patch), darken the edges |
| Render is slow | Fewer particles; one `Grain` per frame; avoid large blur filters on big groups |
