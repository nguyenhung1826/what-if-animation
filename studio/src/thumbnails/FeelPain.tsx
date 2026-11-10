import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Glow, FONT } from '../engine';
import { S7 } from '../episodes/feel-pain-1/shots';
import { CU, Throb, RED } from '../episodes/feel-pain-1/kit';
import { Apartment } from '../episodes/feel-pain-1/sets';

// YouTube thumbnails for "What if you could feel everyone's pain?" (A/B/C for Test & Compare).
//   npx remotion still src/thumbnails/index.ts FeelPainThumbs out/thumbs/feel-pain-A.png --frame=0 --scale=0.6667
// Channel title colors: white + bright blue, red only for the hurt itself.

const BLUE = '#3DA9FF';

const Big: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; rot?: number; glow?: string }> = ({ x, y, size, fill, children, anchor = 'start', rot = 0, glow }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} textAnchor={anchor} letterSpacing={-size * 0.02}
    stroke="#0B1A3A" strokeWidth={size * 0.12} strokeLinejoin="round" style={{ paintOrder: 'stroke', filter: glow ? `drop-shadow(0 0 24px ${glow})` : undefined }}
    transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
    {children}
  </text>
);

const Hurt: React.FC<{ x: number; expr: 'shock' | 'worried' | 'dizzy'; tilt: number; dx?: number }> = ({ x, expr, tilt, dx = -900 }) => (
  <g transform={`translate(${x} 1080) scale(1.25) translate(${-x} -1080)`}>
    <CU t={0} len={1} x={x} hurt={1} face={[[0, expr]]} p={{ headTilt: tilt, yaw: -0.15 }}
      bg={<g transform={`translate(${dx} -600) scale(2.2)`}><Apartment t={0} id={`th${x}${expr}`} /></g>} />
  </g>
);

const VARIANTS: (() => React.ReactNode)[] = [
  // A: cause and effect. His toe hits the leg on the left; your face takes it on the right.
  () => (
    <>
      <Hurt x={1380} expr="shock" tilt={8} />
      <Glow x={1380} y={560} r={520} kind="red" o={0.45} />
      <defs><clipPath id="thA"><path d="M 0 0 L 860 0 L 700 1080 L 0 1080 Z" /></clipPath></defs>
      <g clipPath="url(#thA)"><g transform="translate(-1095 -286) scale(1.3)"><S7 t={70} len={90} f={0} /></g><Glow x={400} y={650} r={360} kind="red" o={0.5} /></g>
      <path d="M 860 0 L 700 1080" stroke={RED} strokeWidth={14} style={{ filter: `drop-shadow(0 0 18px ${RED})` }} />
      <Big x={60} y={210} size={170} fill="#FFFFFF">HIS TOE.</Big>
      <Big x={1880} y={1010} size={190} fill={BLUE} anchor="end" glow="rgba(61,169,255,0.6)">MY PAIN.</Big>
    </>
  ),
  // B: the real fact. 1 in 60 people.
  () => (
    <>
      <Hurt x={1360} expr="worried" tilt={-6} />
      <Throb x={1120} y={420} t={20} s={1.3} />
      <Big x={70} y={330} size={280} fill={BLUE} glow="rgba(61,169,255,0.6)">1 IN 60</Big>
      <Big x={80} y={500} size={120} fill="#FFFFFF">FEEL THIS</Big>
      <Big x={80} y={630} size={120} fill="#FFFFFF">FOR REAL</Big>
    </>
  ),
  // C: everyone at once. Red hurts all over, one face.
  () => (
    <>
      <g transform="translate(0 170)"><Hurt x={960} expr="shock" tilt={4} dx={-700} /></g>
      {[[520, 380], [1420, 330], [380, 760], [1560, 760], [700, 980], [1250, 980]].map(([x, y], i) => <Throb key={i} x={x} y={y} t={20 + i * 3} s={0.9} />)}
      <Big x={960} y={170} size={140} fill="#FFFFFF" anchor="middle">EVERYONE'S</Big>
      <Big x={960} y={340} size={190} fill={BLUE} anchor="middle" glow="rgba(61,169,255,0.6)">PAIN</Big>
    </>
  ),
];

export const FEEL_PAIN_THUMBS = VARIANTS.length;

export const FeelPainThumbs: React.FC = () => {
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
