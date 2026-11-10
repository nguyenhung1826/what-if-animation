import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  Hero, basePose, plain, Pose, LOOKS, CastName, KitDefs, SetDefs,
  Study, Desk, Stairwell, Banister, Classroom, SchoolDesk, Rooftop, Kitchen, KitchenIsland, Bedroom, Schematic, PlantIcon, SchLabel, Tabletop,
  Look, Chalk, BrainOutline, BrainCells, NeedleDial, Bowl, Breakfast, MugTop, EnergyCan, Crate, HandPhone, PowerSwitch,
  MOM_GOWN, SIS_PJS, MO_BOMBER, TEACHER_TWEED, SUIT_BLACK,
} from './engine';

// One frame per catalogued asset, for the Thumb column of CATALOG.md. Frame N is THUMBS[N]; render one with
//   npx remotion still src/index.ts Thumbs library/thumbs/<file> --frame=<N> --scale=0.5
// or all of them with  python <skill>/scripts/thumbs.py
// When you add a set, look or prop to the library, add its entry at the end here (never reorder: frames are indices).

const T = 40; // a settled moment of each set's idle motion

const castThumb = (c: CastName, bare = false): React.ReactNode => {
  const s = c === 'sis' ? 1.3 : 1.6;
  const pose: Pose = { ...basePose, x: 960, y: 900 - 190 * s, scale: s, yaw: 0.3, look: 0.4, expr: 'happy' };
  return (
    <>
      <g filter="url(#blur10)">
        <Study t={0} id="thumb" />
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
      <Hero look={bare ? plain(LOOKS[c]) : LOOKS[c]} pose={pose} shadow={0.6} />
    </>
  );
};

// a line-up of looks on the blurred study (sis-sized looks drawn smaller)
const lineup = (looks: [Look, number][]): React.ReactNode => (
  <>
    <g filter="url(#blur10)">
      <Study t={0} id="thumb" />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    {looks.map(([look, s], i) => {
      const x = 260 + i * (1400 / Math.max(1, looks.length - 1));
      return <Hero key={i} look={look} pose={{ ...basePose, x, y: 940 - 190 * s, scale: s, yaw: 0.3, look: 0.4, expr: 'happy' }} shadow={0.6} />;
    })}
  </>
);
const crateHero: Pose = { ...basePose, x: 1130, y: 860 - 190 * 1.4, scale: 1.4, yaw: 0.3, look: 0.4, expr: 'happy', armR: { a: 40, b: 100 } };

export const THUMBS: { file: string; draw: () => React.ReactNode }[] = [
  { file: 'set-study.png', draw: () => <><Study t={T} id="th-st" /><Desk x0={560} x1={1360} y={700} /></> },
  { file: 'set-stairwell.png', draw: () => <><Stairwell t={T} id="th-sw" /><Banister /></> },
  { file: 'set-classroom.png', draw: () => <><Classroom t={T} id="th-cls" /><SchoolDesk x={1260} /></> },
  { file: 'set-rooftop.png', draw: () => <Rooftop t={T} clock sunX={1050} sunY={560} low={200} /> },
  { file: 'set-kitchen.png', draw: () => <><Kitchen t={T} id="th-kit" /><KitchenIsland /></> },
  { file: 'set-bedroom.png', draw: () => <Bedroom t={T} id="th-bed" /> },
  {
    file: 'set-schematic.png',
    draw: () => (
      <>
        <Schematic t={T} id="th-sch" />
        {(['tower', 'wind', 'solar', 'dam', 'factory'] as const).map((k, i) => (
          <PlantIcon key={k} x={400 + i * 280} y={560} kind={k} on={i % 2 ? 0 : 1} t={T} />
        ))}
        <SchLabel x={960} y={300} t={T} text="PLANT ICONS ON THE SCHEMATIC" />
      </>
    ),
  },
  { file: 'set-tabletop.png', draw: () => <Tabletop edge={900} /> },
  { file: 'cast-pipHood.png', draw: () => castThumb('pipHood') },
  { file: 'cast-pip.png', draw: () => castThumb('pip') },
  { file: 'cast-pipInk.png', draw: () => castThumb('pipInk') },
  { file: 'cast-mo.png', draw: () => castThumb('mo') },
  { file: 'cast-sis.png', draw: () => castThumb('sis') },
  { file: 'cast-mom.png', draw: () => castThumb('mom') },
  { file: 'cast-suit.png', draw: () => castThumb('suit') },
  { file: 'cast-hero.png', draw: () => castThumb('hero') },
  { file: 'cast-heroine.png', draw: () => castThumb('heroine') },
  { file: 'set-classroom-chalk.png', draw: () => <Classroom t={T} id="th-clc" board={<Chalk x={700} y={300} text="sleep = 0 h ?" size={56} p={0.8} id="th-chalk" />} /> },
  { file: 'set-kitchen-tint.png', draw: () => <><Kitchen t={T} id="th-kn" veil={0.7} tint="night" tintO={0.45} /><KitchenIsland /></> },
  {
    file: 'set-schematic-brain.png',
    draw: () => (
      <>
        <Schematic t={T} id="th-sb" />
        <BrainOutline x={560} y={560} s={0.8} t={60} />
        <BrainCells x={1360} y={560} r={300} t={T} gap={1} flow={1} waste={0.5} id="th-cells" label="ASLEEP" />
      </>
    ),
  },
  { file: 'prop-needledial.png', draw: () => <><Schematic t={T} id="th-nd" /><NeedleDial x={960} y={760} p={0.78} redLabel="LIMIT" left="RESTED" right="WIRED" /></> },
  { file: 'prop-breakfast.png', draw: () => <><Tabletop edge={1200} /><Breakfast x={760} y={560} /><MugTop x={1260} y={520} t={20} /></> },
  {
    file: 'prop-bowl-can.png',
    draw: () => (
      <>
        <rect width={1920} height={1080} fill="#2A2230" />
        <rect y={760} width={1920} height={320} fill="#5A4238" />
        <Bowl x={520} y={800} s={3} />
        <EnergyCan x={1040} y={800} s={2.6} />
        <EnergyCan x={1300} y={800} s={2.6} color="#E0463A" />
        <EnergyCan x={1560} y={800} s={2.6} color="#3E7AD0" crushed={1} rot={8} />
      </>
    ),
  },
  { file: 'prop-crate-phone.png', draw: () => <><rect width={1920} height={1080} fill="#2A2230" /><rect y={860} width={1920} height={220} fill="#3A3040" /><Crate x={700} top={600} bottom={860} w={380} /><Hero look={SUIT_BLACK} pose={crateHero} shadow={0.6} /><HandPhone pose={crateHero} /></> },
  { file: 'prop-powerswitch.png', draw: () => <><rect width={1920} height={1080} fill="#2E2A36" /><PowerSwitch x={660} y={540} s={2.6} down={0} /><PowerSwitch kind="cord" x={1360} y={540} s={2.6} down={1} /></> },
  { file: 'cast-switch-off-sleep.png', draw: () => lineup([[MOM_GOWN, 1.4], [SIS_PJS, 1.0], [MO_BOMBER, 1.4], [TEACHER_TWEED, 1.4], [SUIT_BLACK, 1.4]]) },
];

export const LibraryThumbs: React.FC = () => {
  const f = useCurrentFrame();
  const entry = THUMBS[f];
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        {entry ? entry.draw() : null}
      </svg>
    </AbsoluteFill>
  );
};
