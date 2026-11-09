import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Bedroom, AlarmClock, WallCalendar, Glow, HudChip, FONT } from '../engine';
import { CloseUp, Night } from '../episodes/switch-off-sleep-1/shots';

// YouTube thumbnails for "What if you could switch off sleep?". One frame per variant (A/B/C for Test & Compare).
//   npx remotion still src/thumbnails/index.ts SwitchOffSleepThumbs out/thumbs/A.png --frame=0 --scale=0.6667
// Pattern from the What If channels: one face close and lit, one big counter or claim (2-3 words), dark ground,
// one saturated accent. Text is huge and outlined so it still reads at phone size.

const YEL = '#FFD23F';
const ICE = '#9FE4FF';

const Big: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; rot?: number }> = ({ x, y, size, fill, children, anchor = 'start', rot = 0 }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} textAnchor={anchor} letterSpacing={-size * 0.02}
    stroke="#07060C" strokeWidth={size * 0.12} strokeLinejoin="round" style={{ paintOrder: 'stroke' }} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
    {children}
  </text>
);

const DarkRoom: React.FC<{ id: string; dx?: number }> = ({ id, dx = -900 }) => (
  <g transform={`translate(${dx} -520) scale(2.2)`}><Bedroom t={500} id={id} clock="3:00" lamp={0} veil={0.7} /><Night o={0.3} /></g>
);

// a wall rocker switch, flipped to OFF, glowing ice blue
const Switch: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={0} r={260} kind="cool" o={0.9} />
    <rect x={-110} y={-170} width={220} height={340} rx={34} fill="#E9ECF2" stroke="#07060C" strokeWidth={10} />
    <rect x={-62} y={-112} width={124} height={224} rx={18} fill="#B8C0CC" stroke="#07060C" strokeWidth={8} />
    <path d="M -62 0 L 62 0 L 54 104 Q 52 112 44 112 L -44 112 Q -52 112 -54 104 Z" fill={ICE} stroke="#07060C" strokeWidth={8} />
    <text x={0} y={78} fontFamily={FONT.title} fontWeight={800} fontSize={52} textAnchor="middle" fill="#07243A">OFF</text>
    <text x={0} y={-52} fontFamily={FONT.title} fontWeight={800} fontSize={40} textAnchor="middle" fill="#6A7280">ON</text>
  </g>
);

const Face: React.FC<{ x: number; expr: 'tired' | 'smug' | 'cool'; tilt: number; bg: React.ReactNode }> = ({ x, expr, tilt, bg }) => (
  <g>
    <g transform={`translate(${x} 1080) scale(1.3) translate(${-x} -1080)`}>
      <CloseUp t={0} len={1} x={x} glint={1} face={{ expr }} p={{ headTilt: tilt, look: -0.25 }} bg={bg} />
    </g>
    <Glow x={x} y={430} r={520} kind="cool" o={0.55} />
  </g>
);

const VARIANTS: (() => React.ReactNode)[] = [
  // A: the counter. Day 6, tired eyes that still glow.
  () => (
    <>
      <Face x={1360} expr="tired" tilt={-4} bg={<DarkRoom id="ta" />} />
      <Big x={80} y={330} size={300} fill={YEL}>DAY 6</Big>
      <Big x={90} y={500} size={130} fill="#FFFFFF">NO SLEEP</Big>
      <g transform="translate(90 600) rotate(-6)"><WallCalendar x={0} y={0} w={400} crossed={6} /></g>
    </>
  ),
  // B: the switch. The premise in one object.
  () => (
    <>
      <Face x={1380} expr="smug" tilt={-3} bg={<DarkRoom id="tb" />} />
      <Switch x={560} y={760} s={1.1} />
      <Big x={70} y={250} size={180} fill="#FFFFFF">SLEEP:</Big>
      <Big x={70} y={430} size={180} fill={ICE}>OFF</Big>
    </>
  ),
  // C: the reward. 3 a.m., wide awake, +4 months a year.
  () => (
    <>
      <Face x={1370} expr="cool" tilt={3} bg={<DarkRoom id="tc" dx={-700} />} />
      <Big x={70} y={280} size={210} fill={YEL}>+4 MONTHS</Big>
      <Big x={80} y={420} size={120} fill="#FFFFFF">EVERY YEAR</Big>
      <Glow x={420} y={800} r={380} kind="red" o={0.7} />
      <AlarmClock x={420} y={960} s={3.0} text="3:00" />
    </>
  ),
];

export const THUMB_COUNT = VARIANTS.length;

export const SwitchOffSleepThumbs: React.FC = () => {
  const f = useCurrentFrame();
  const draw = VARIANTS[f];
  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0816' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        {draw ? draw() : null}
      </svg>
    </AbsoluteFill>
  );
};
