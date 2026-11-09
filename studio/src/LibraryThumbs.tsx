import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  Hero, basePose, Pose, LOOKS, CastName, KitDefs, SetDefs,
  Study, Desk, Stairwell, Banister, Classroom, SchoolDesk, Rooftop, Kitchen, KitchenIsland, Bedroom, Schematic, PlantIcon, SchLabel, Tabletop,
} from './engine';

// One frame per catalogued asset, for the Thumb column of CATALOG.md. Frame N is THUMBS[N]; render one with
//   npx remotion still src/index.ts Thumbs library/thumbs/<file> --frame=<N> --scale=0.5
// or all of them with  python <skill>/scripts/thumbs.py
// When you add a set, look or prop to the library, add its entry at the end here (never reorder: frames are indices).

const T = 40; // a settled moment of each set's idle motion

const castThumb = (c: CastName): React.ReactNode => {
  const s = c === 'sis' ? 1.3 : 1.6;
  const pose: Pose = { ...basePose, x: 960, y: 900 - 190 * s, scale: s, yaw: 0.3, look: 0.4, expr: 'happy' };
  return (
    <>
      <g filter="url(#blur10)">
        <Study t={0} id="thumb" />
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
      <Hero look={LOOKS[c]} pose={pose} shadow={0.6} />
    </>
  );
};

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
