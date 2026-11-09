# Library catalog

Everything this studio can draw or play without writing it again. **Read this file before drawing anything** in a
new episode, and reuse or extend what is here before building something new. When you add to the library, add a
line here in the same turn (see "Adding to the library" at the end). `python <skill>/scripts/catalog_check.py`
lists anything exported from `src/engine/` or sitting in `library/sfx/` that this file doesn't mention yet.

How to read a row: **Name** is what you import (`import { Kitchen } from '../../engine'`), **File** is where it
lives, **Params** are the props worth knowing (the file's own comments have the rest), **Thumb** is a still in
`library/thumbs/` (`-` until one is rendered), **Origin** is the episode that first needed it.

Full coordinates, poses and patterns for the shipped kit are in `<skill>/references/kit.md`. Open that, or the
asset's file, only for the asset you are about to use.

## Sets (places)

| Name | File | What it is | Params | Thumb | Origin |
|---|---|---|---|---|---|
| `Study` + `Desk` | `src/engine/sets/study.tsx` | Dusk study: back window with low sun, bookcase left, door and print right, pendant. `STUDY` is its room. | `night` (moon, desk lamp), `shelf` 0..1 (books fly from `STUDY_SHELF_V`), `veil` | `set-study.png` | shipped |
| `Stairwell` + `Banister` | `src/engine/sets/stairwell.tsx` | Side-on stairs, 7 steps down to the right from a landing; lit doorway, arched window, lantern. `stepTop(x)`, `hipGround(x)`; `Banister` draws in front. | walk at scale 0.9 | `set-stairwell.png` | shipped |
| `Classroom` + `SchoolDesk` + `Kid` | `src/engine/sets/classroom.tsx` | Board, windows left, two rows of desks with kids from behind. `CLS` is its room, `KIDS` the kids' looks. | `board` (chalk text), `solved`, `wrong`, `laugh`; `Kid` `turn`, `laugh` | `set-classroom.png` | shipped |
| `Rooftop` + `SunClock` | `src/engine/sets/rooftop.tsx` | Parapet, three depths of city, string lights, big low sun (optionally a clock face). | `sunX`, `sunY`, `clock`, `spin`, `crack`, `red`, `lightsOut`, `blackout`, `cityLit`, `low` | `set-rooftop.png` | shipped |
| `Kitchen` + `KitchenIsland` | `src/engine/sets/kitchen.tsx` | Counter run under a window, hob, shelves with jars, fridge, two pendants over an island. `KITCHEN` room, `islandTop(u, d)`. | `veil`, `red` | `set-kitchen.png` | copy-paste |
| `Bedroom` + `BedDuvet` | `src/engine/sets/bedroom.tsx` | Night bedroom: bed back-left, nightstand lamp and clock, window onto moon and city, calendar, wardrobe, door ajar. `BEDROOM`, `bedTop`, `bedSit`, `LAMP`, `CAL`, `WINDOW`. | `clock`, `lamp` 0..1, `crossed`, `veil`, `duvet` | `set-bedroom.png` | preview run |
| `Schematic` | `src/engine/sets/schematic.tsx` | Dark blueprint grid for the science beat. With `DrawOn`, `Arrow`, `SchLabel`, `CountUp`, `PlantIcon`; colours in `SCH`. | `PlantIcon` kinds: tower, wind, solar, dam, factory (`on`) | `set-schematic.png` | copy-paste |
| `Tabletop` | `src/engine/furnish.tsx` | A surface from high above for inserts (wood or stone), lit front edge at `edge`. | `edge` (> 1080 = straight top-down) | `set-tabletop.png` | copy-paste |

## Cast (characters)

All drawn by one rig, `Hero` (alias `Actor`) in `src/engine/rig.tsx`, with a costume from `LOOKS`. Check any new
look on the cast sheet: `npx remotion still src/index.ts Cast out/cast.png`.

| Look | Who | Notes | Thumb | Origin |
|---|---|---|---|---|
| `LOOKS.hero` | **the channel's hero** (the `Hero` default) | dark bald round head, cream eyes open at rest (curved line eyes when smug, cool or tired), slim always-on arched brows; outfit a navy mock-neck sweater with the sleeves at the elbow, charcoal trousers, black shoes. Change the outfit only when the person asks, never the face | `cast-hero.png` | channel |
| `LOOKS.heroine` | the channel's female character (supporting, cast only when a story needs her; the hero leads) | the hero's face exactly plus a short lash flick at each outer eye corner (`lashes`). Hair is free per episode (`extra`: ponytail by default, or bob, topbun...; `hair` a shade lighter than the head), like the outfit. Never change the face | `cast-heroine.png` | channel |
| `LOOKS.pipHood` | Pip, the shipped hero (B) | dark hoodie, mustard drawstrings | `cast-pipHood.png` | shipped |
| `LOOKS.pip` | Pip (A) | mustard jacket | `cast-pip.png` | shipped |
| `LOOKS.pipInk` | Pip (C) | dark head | `cast-pipInk.png` | shipped |
| `LOOKS.mo` | Mo, the friend | curls, olive jacket, headphones | `cast-mo.png` | shipped |
| `LOOKS.sis` | the little sister | bunches, teal; draw at about 0.7 scale | `cast-sis.png` | shipped |
| `LOOKS.mom` | mum | bob, rose cardigan | `cast-mom.png` | shipped |
| `LOOKS.suit` | the man in a suit | charcoal suit, red tie | `cast-suit.png` | shipped |

Expressions (`expr`): neutral, happy, smug, shock, worried, oops, cool, dizzy, tired. Motion helpers: `poseAt`,
`faceAt`, `walkPose`, `joints`, `toWorld`, `reachAngle`.

### Costume and face options (fields of a `Look`, all in `src/engine/rig.tsx`)

**The rules: everyone is dressed, only the hero's outfit is fixed, and every skin is pure black or pure white.**
Every other character starts from `tone(LOOKS.x)` or `tone(LOOKS.x, 'black' | 'white')` (`TONES` holds the two:
fully black with cream features, or fully white with dark features; without a tone, a dark skin becomes black and a
light one white) and is dressed per episode to fit its role, by spreading the look and overriding fields:
`{ ...tone(LOOKS.heroine), coat: 'denim', jacket: '#4A6FA5', jacketShade: '#3A5884', sleeve: '#4A6FA5', limb: '#2A2733', shoe: '#1C1B22' }`.

| Field | Options | Notes |
|---|---|---|
| `tone(look, tone?)` | function | makes the skin pure `black` or `white`, clothes kept; the start for everyone but the hero |
| `plain(look, tone?)` | function | the same plus no costume at all (sets `bare`); only when the person asks for an undressed character |
| `coat` | `biker`, `bomber`, `denim`, `long`, `sweater` | jacket cuts over the torso; set `sleeve` to the jacket colour so the arms match. `long` flares to mid-leg; `sweater` is a fine-knit mock neck with ribbed collar, hem and cuffs (the hero's) |
| `sleeveLength` | `full`, `elbow` | `elbow`: sleeves pushed up, the forearm bare (the hero's) |
| `extra` (head) | `hood`, `curls`, `bunches`, `bob`, `suit`, `bucket`, `topbun`, `beanie`, `cap`, `beret`, `ponytail` | the head piece; hats and hair use `hair` for their colour, bands use `accent`. Not for the hero (bald is its identity) unless the episode calls for a hat |
| `item` | `satchel`, `stopwatch`, `headlamp`, `scarf`, `backpack` | carried on the rig in every pose; colour in `itemColor` |
| `eyes` | `dot`, `big`, `bean`, `line` | every style is clearly open at rest; `line`: calm curved eyes only when smug, cool or tired (the hero) |
| `brows` | `thin`, `thick`, `slim` | `slim`: fine, always-on arched brows that act (the hero) |
| `blush`, `lashes`, `curl`, `moodTint`, `faceGlow` | booleans | rosy cheeks; a short lash flick at the outer eye corners (the heroine); a reactive curl on the crown; a colour wash per expression; glowing features for coloured faces on a dark head |
| `limbStyle` | `tube`, `stick` | `stick`: single thin-line limbs with dot hands |
| `hair` = `skin` | | a bald head (no tuft) |

## Props

| Name | File | What it is | Params | Thumb | Origin |
|---|---|---|---|---|---|
| `Cat` | `src/engine/props.tsx` | the cat; tail always moving | `mood`: sleep, alert, peek | - | shipped |
| `Mug` | `src/engine/props.tsx` | mug with steam | `rot`, `steam` | - | shipped |
| `Cookie`, `CookieTop`, `CookieStack` | `src/engine/props.tsx` | cookie side-on, from above, a tower | `s`, `rot`, `bite` | - | shipped |
| `Plate`, `PlateTop` | `src/engine/props.tsx` | plate side-on, from above | | - | shipped |
| `Paper`, `PaperStack`, `PaperBall` | `src/engine/props.tsx` | sheet from above (ticks and grade when `done`), a neat stack, a crumpled ball | `done`, `grade`, `fill`; `n`; `r`, `rot` | - | shipped |
| `AlarmClock` | `src/engine/props.tsx` | digital bedside clock | `text`, `on` | - | preview run |
| `WallCalendar` + `calendarDay` | `src/engine/props.tsx` | a month with crossed-off days | `crossed`, `drawing` | - | preview run |
| `OpenBook`, `BookFlat`, `BookTower` | `src/engine/props.tsx` | open book (page turn), closed book, tower of books | `turn`, `cover`; `n` | - | preview run |
| `LaptopBack` | `src/engine/props.tsx` | laptop lid from behind, screen light spilling | `glow`, `tilt` | - | preview run |
| `PizzaSlice`, `PizzaBox` | `src/engine/props.tsx` | slice from above (bite, drip), open empty box | `bite`, `drip`, `lid` | - | preview run |
| `Phone` | `src/engine/props.tsx` | phone, dark or ringing | `on`, `caller`, `buzz` | - | preview run |

## Room kit (for building a new set)

`src/engine/room.tsx` and `src/engine/furnish.tsx`: `makeRoom`, `Box`, `RoomShell`, `BackWindow`, `Pendant`,
`pendantLight`, `WallLight`, `FloorShadow`, `FloorPlant`, `WallFrame`, `WallClock`, `stand`. Order and coordinates:
`references/kit.md`, "The room kit".

## Light and atmosphere

`src/engine/light.tsx`: `Glow`, `Cone`, `LightVeil`, `Dust`, `WallTexture`, `RoomCorners`, `SkyView`, `SetDefs`.
`src/engine/kit.tsx`: `DuskSky`, `Sun`, `Rays`, `Haze`, `Bokeh`, `Shaft`, `Skyline`, `Foreground`, `NightSky`,
`Moon`, `Stars`, `KitDefs`. Character rim filters: `rimR`, `rimL`, `rimRed`, `rimBlue`, `rimBlueL`.

## UI and marks

`src/engine/ui.tsx`: `TitleCard`, `HudChip` (icons: rewind, pause, copy, paste, skip, dot), `Dial`, `Gauge`, `Tag`,
`Marquee`, `PasteIn`, `Toast`, `FloatLabel`, `FocusRings`, `DizzyStars`, `Sparkle`, `TapeLines`, `UI` (colours).
Faces: `FONT.title`, `FONT.ui`, `FONT.hand` (`src/engine/fonts.ts`).

## Power looks (how a power changes the picture while it runs)

| Look | Where | What it does | Thumb | Origin |
|---|---|---|---|---|
| `rewindLook` | `src/episodes/rewind/index.tsx` | desaturate, jitter, `TapeLines`, REWIND chip, stopwatch counting back | - | rewind |
| `copyLook` | `src/episodes/copy-paste/index.tsx` | cools the picture, COPY chip | - | copy-paste |
| `pasteLook` | `src/episodes/copy-paste/index.tsx` | PASTE chip (the pop is `PasteIn` in the shot) | - | copy-paste |

A look still lives in its episode until a second episode wants it; then move it to `src/engine/looks.tsx`, export
it from `engine/index.ts` and change its row here.

## Sound (`library/sfx/`)

Every clip `sfx.py` generates is saved here and reused by name before anything new is generated. The file name is
`<name>-<hash>.mp3`; reuse it by `<name>`.

| Group | Clips |
|---|---|
| Body and movement | big_step, step, land, tumble, fall_whoosh, catch, gulp, gasp, laugh, dizzy |
| Objects | clink, cookie_crunch, paper_land, crack, shatter, bulb_pop, switch_off, ding, buzzer, counter_tick, shades |
| Animals | cat_chirp, cat_yowl |
| Power and UI | rewind, rewind_start, clock_back, copy_click, paste_pop, select_draw, glitch, power_hum, power_down, pop, sparkle |
| Hits and titles | title_boom, drone_hit |
| Ambience and music | room_tone, roof_wind, class_murmur, music |

## Adding to the library

Do this in the same turn the new thing is made, not "later":

1. **Make it reusable.** A new place, prop, character look or power look goes in `src/engine/` (sets in `sets/`), not
   inside an episode's `shots.tsx`. Give it props for what an episode is likely to change (time of day, colour, a
   state like open/closed). Export it from `src/engine/index.ts`.
2. **Extend before you add.** If something close exists, add a prop to it (a `night` kitchen is
   `<Kitchen night />`, not a second kitchen). Only make a new asset when the existing one would need a different
   layout.
3. **Add its row here**: name, file, one line on what it is, the params, origin = the episode's slug.
4. **Render its thumb**: add an entry at the end of `THUMBS` in `src/LibraryThumbs.tsx` (file name `set-<name>.png`,
   `cast-<look>.png` or `prop-<name>.png`, drawn at a wide framing), run
   `python <skill>/scripts/thumbs.py <file>` (writes it 960 px wide to `library/thumbs/`) and put the file name in
   the Thumb column.
5. **Run** `python <skill>/scripts/catalog_check.py` until it reports nothing missing.
6. **Commit and push**: `git add -A && git commit -m "library: add <name> (<slug>)" && git push`.
