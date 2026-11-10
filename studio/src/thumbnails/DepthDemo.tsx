import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, DuskSky, Sun, Skyline, Haze, Glow, Hero, basePose, walkPose, walkPhase, Parallax, FarHaze, Vignette, Grain, Drift, idle } from '../engine';

// A test of references/scenes.md and engine/depth.tsx: a dusk street built back to front, the camera pushing right.
//   npx remotion still src/thumbnails/index.ts DepthDemo out/depth-0.png --frame=0
const GROUND = 860;

// a corner bakery: base, texture, edge on every surface; the one light is its warm window
const Bakery: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <defs>
      <linearGradient id="dmWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5B4A7A" /><stop offset="1" stopColor="#3A2E52" /></linearGradient>
      <linearGradient id="dmWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD58A" /><stop offset="1" stopColor="#FF9F4A" /></linearGradient>
      <pattern id="dmBrick" width="60" height="30" patternUnits="userSpaceOnUse">
        <path d="M 0 30 L 60 30 M 0 15 L 60 15 M 20 0 L 20 15 M 50 15 L 50 30" stroke="#2E2442" strokeWidth={2} opacity={0.5} />
      </pattern>
    </defs>
    <rect x={0} y={330} width={620} height={GROUND - 330} fill="url(#dmWall)" />
    <rect x={0} y={330} width={620} height={GROUND - 330} fill="url(#dmBrick)" />
    <rect x={-14} y={318} width={648} height={22} fill="#2A2040" />
    <rect x={0} y={340} width={620} height={4} fill="#FFC27A" opacity={0.35} />
    {/* the awning */}
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${i * 80 - 10} 420 L ${i * 80 + 70} 420 L ${i * 80 + 70} 470 Q ${i * 80 + 30} 492 ${i * 80 - 10} 470 Z`} fill={i % 2 ? '#F2E6D2' : '#C8484A'} stroke="#2A2040" strokeWidth={4} />)}
    {/* the window: the scene's light */}
    <rect x={60} y={520} width={300} height={250} rx={6} fill="url(#dmWin)" stroke="#2A2040" strokeWidth={8} />
    <path d="M 210 520 L 210 770 M 60 645 L 360 645" stroke="#2A2040" strokeWidth={6} />
    {[[110, 610], [170, 615], [260, 600], [300, 735], [120, 740]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={30} ry={18} fill="#B86A2E" stroke="#6E3A18" strokeWidth={3} />)}
    {/* the door */}
    <rect x={420} y={540} width={140} height={GROUND - 540} fill="#3A2A2A" stroke="#2A2040" strokeWidth={8} />
    <rect x={440} y={565} width={100} height={110} fill="url(#dmWin)" opacity={0.8} />
    <circle cx={540} cy={720} r={7} fill="#FFC27A" />
    <text x={310} y={395} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={54} fill="#FFE2B0" stroke="#2A2040" strokeWidth={6} style={{ paintOrder: 'stroke' }}>BAKERY</text>
  </g>
);

const Street: React.FC = () => (
  <g>
    <rect x={-1000} y={GROUND} width={4200} height={300} fill="#4A3F5C" />
    {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${i * 140 - 1000} ${GROUND} L ${i * 140 - 1040} ${GROUND + 70}`} stroke="#3A3050" strokeWidth={3} />)}
    <rect x={-1000} y={GROUND + 70} width={4200} height={14} fill="#6E6280" />
    <rect x={-1000} y={GROUND + 84} width={4200} height={200} fill="#262033" />
    <ellipse cx={-120} cy={GROUND + 20} rx={500} ry={60} fill="#FFB060" opacity={0.18} />
  </g>
);

const LampPost: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 14} y={250} width={28} height={900} fill="#16121F" />
    <rect x={x - 60} y={230} width={120} height={36} rx={10} fill="#16121F" />
  </g>
);

export const DepthDemo: React.FC = () => {
  const t = useCurrentFrame();
  const life = idle(t, 4);
  const hx = 760 + t * 2.2;
  const walk = walkPose(hx, walkPhase(t * 2.2), GROUND, 1.25, {}, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0816' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        <Parallax t={t} len={90} from={[960, 540, 1]} to={[1180, 560, 1.12]} layers={[
          [0.3, <g><DuskSky id="dm" horizonY={700} /><Sun x={1500} y={640} r={60} t={t} /></g>],
          [0.45, <g><Skyline y={720} seed={7} color="#3B2A5E" h={200} /><FarHaze o={0.25} y0={450} y1={760} /></g>],
          [0.7, <g><Skyline y={790} seed={3} color="#2A1E46" h={260} /><Haze y={700} o={0.25} /></g>],
          [1, <g><Bakery x={-40} /><Street /><Glow x={170} y={650} r={420} o={0.75} />
            <Hero pose={{ ...walk, scale: walk.scale * life.breath, blink: life.blink }} rimId="rimL" />
            <Drift t={t} seed={5} kind="dust" n={30} o={0.6} /></g>],
          [1.35, <LampPost x={1800} />, 'blur10'],
        ]} />
        <Vignette o={0.45} />
        <Grain t={t} o={0.07} />
      </svg>
    </AbsoluteFill>
  );
};
