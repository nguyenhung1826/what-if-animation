import React from 'react';
import { SCH, DrawOn, FONT, clamp, easeOut } from '../../engine';

// Reusable schematic pieces made for chapter 5. Kept in the episode folder while the chapters are made in parallel;
// listed in LIBRARY-TODO.md to move into src/engine/sets/schematic.tsx later.

export const FLUID = '#5AC8FF';

// a brain from the side (front to the left), centre-ish at (0, 0), about 800 wide at s = 1
const BRAIN = 'M -380 40 C -420 -120 -300 -250 -150 -250 C -80 -310 80 -320 170 -260 C 300 -260 410 -160 390 -30 C 420 70 340 160 230 160 C 170 220 50 220 -10 180 L -40 290 L -100 290 L -90 175 C -210 190 -350 150 -380 40 Z';
const GYRI = [
  'M -260 -120 C -200 -170 -120 -140 -90 -190',
  'M -40 -230 C -20 -160 60 -170 80 -230',
  'M 180 -180 C 140 -120 220 -80 280 -110',
  'M -300 20 C -220 -40 -140 20 -60 -40',
  'M -20 -80 C 40 -20 120 -90 190 -30',
  'M 260 40 C 300 0 330 20 340 60',
  'M -200 120 C -120 80 -60 130 20 100',
  'M 80 60 C 130 110 200 70 230 120',
];

/** A brain from the side drawing on from t = 0 (outline, then the folds). x, y its centre, s its scale. */
export const BrainOutline: React.FC<{ x: number; y: number; s?: number; t: number; color?: string }> = ({ x, y, s = 1, t, color = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <DrawOn d={BRAIN} t={t} dur={24} color={color} width={6 / s} />
    {GYRI.map((d, i) => (
      <DrawOn key={i} d={d} t={t - 14 - i * 2} dur={10} color={SCH.dim} width={4 / s} />
    ))}
  </g>
);

const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * A magnified circle of brain tissue: cells (rounded blobs) with gaps between them.
 * gap 0..1 (awake narrow -> asleep about 60% wider), flow 0..1 (blue fluid streaming through the gaps),
 * waste 0..1 (orange specks stuck between the cells; with flow they are carried out), t the clock for the motion,
 * o the fade-in. id must be unique per use (clip path).
 */
export const BrainCells: React.FC<{ x: number; y: number; r?: number; t: number; gap?: number; flow?: number; waste?: number; o?: number; id: string; label?: string }> = ({
  x, y, r = 300, t, gap = 0, flow = 0, waste = 0, o = 1, id, label,
}) => {
  if (o <= 0) return null;
  const cols = 4;
  const rows = 4;
  const W = 2 * r;
  const g = 18 + 34 * gap; // the gap in px
  const cw = (W - (cols + 1) * g) / cols;
  const ch = (W - (rows + 1) * g) / rows;
  const x0 = x - r;
  const y0 = y - r;
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const k = i * rows + j;
      const cx = x0 + g + i * (cw + g) + cw / 2 + Math.sin(t / 30 + k) * 2;
      const cy = y0 + g + j * (ch + g) + ch / 2 + Math.cos(t / 34 + k) * 2;
      cells.push(
        <g key={k}>
          <rect x={cx - cw / 2} y={cy - ch / 2} width={cw} height={ch} rx={Math.min(cw, ch) * 0.42} fill="#22324E" stroke={SCH.line} strokeWidth={4} />
          <circle cx={cx + (rnd(k) - 0.5) * cw * 0.3} cy={cy + (rnd(k + 9) - 0.5) * ch * 0.3} r={Math.min(cw, ch) * 0.13} fill={SCH.dim} opacity={0.7} />
        </g>,
      );
    }
  // the channels: horizontal gaps between rows (rows + 1 of them) for the flow and the waste
  const chanY = (j: number) => y0 + g / 2 + j * (ch + g);
  const chanX = (i: number) => x0 + g / 2 + i * (cw + g);
  const streaks: React.ReactNode[] = [];
  if (flow > 0)
    for (let j = 0; j <= rows; j++)
      for (let n = 0; n < 5; n++) {
        const u = (rnd(j * 7 + n) + t / 70) % 1;
        const sx = x0 + u * W;
        streaks.push(<path key={`f${j}-${n}`} d={`M ${sx - 40} ${chanY(j)} L ${sx + 40} ${chanY(j)}`} stroke={FLUID} strokeWidth={Math.max(4, g * 0.35)} strokeLinecap="round" opacity={flow * Math.sin(u * Math.PI)} />);
      }
  const specks: React.ReactNode[] = [];
  const nW = Math.round(8 + 46 * waste);
  for (let n = 0; n < nW; n++) {
    const vertical = rnd(n * 3 + 1) > 0.5;
    const lane = Math.floor(rnd(n * 5 + 2) * (vertical ? cols + 1 : rows + 1));
    let along = rnd(n * 11 + 3);
    if (flow > 0 && !vertical) along = (along + (t / 60) * flow) % 1.2; // carried out to the right
    if (along > 1) continue;
    const px = vertical ? chanX(lane) : x0 + along * W;
    const py = vertical ? y0 + along * W : chanY(lane);
    const sz = 5 + 5 * rnd(n * 13) + 4 * waste;
    const jit = waste > 0.5 ? Math.sin(t * 0.9 + n) * 1.5 : 0;
    specks.push(<circle key={`w${n}`} cx={px + jit} cy={py} r={sz} fill={SCH.live} opacity={0.9} />);
  }
  return (
    <g opacity={o}>
      <defs>
        <clipPath id={`${id}clip`}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r + 10} fill={SCH.ground} />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={x - r} y={y - r} width={W} height={W} fill="#0C2236" />
        {streaks}
        {cells}
        {specks}
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={SCH.line} strokeWidth={8} />
      {label ? (
        <text x={x} y={y - r - 34} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.line} letterSpacing={3}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/**
 * A half-circle dial with a needle (a meter, a test score). p 0..1 the needle, red 0..1 where the red zone starts,
 * redLabel the mark at the red line, left / right the ends' labels, flash 0..1 pulses the red zone.
 */
export const NeedleDial: React.FC<{ x: number; y: number; r?: number; p: number; red?: number; redLabel?: string; left?: string; right?: string; flash?: number; t?: number }> = ({
  x, y, r = 380, p, red = 0.66, redLabel, left, right, flash = 0, t = 0,
}) => {
  const ang = (u: number) => Math.PI * (1 - u); // 0 -> left, 1 -> right
  const pt = (u: number, rr: number) => ({ x: x + rr * Math.cos(ang(u)), y: y - rr * Math.sin(ang(u)) });
  const arc = (u0: number, u1: number, rr: number) => {
    const a = pt(u0, rr);
    const b = pt(u1, rr);
    return `M ${a.x} ${a.y} A ${rr} ${rr} 0 0 1 ${b.x} ${b.y}`;
  };
  const tip = pt(clamp(p, 0, 1.02), r * 0.86);
  const redO = 0.75 + 0.25 * flash * (0.5 + 0.5 * Math.sin(t * 0.8));
  const rl = pt(red, r + 46);
  return (
    <g>
      <path d={arc(0, red, r)} stroke={SCH.dim} strokeWidth={34} fill="none" />
      <path d={arc(red, 1, r)} stroke="#E0443A" strokeWidth={34} fill="none" opacity={redO} />
      {Array.from({ length: 11 }).map((_, i) => {
        const a = pt(i / 10, r - 34);
        const b = pt(i / 10, r - 64);
        return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={SCH.line} strokeWidth={5} />;
      })}
      {/* the red line */}
      <path d={`M ${pt(red, r - 70).x} ${pt(red, r - 70).y} L ${pt(red, r + 24).x} ${pt(red, r + 24).y}`} stroke="#FF5A4A" strokeWidth={10} />
      {redLabel ? (
        <text x={rl.x + 20} y={rl.y - 10} textAnchor="start" fontFamily={FONT.ui} fontSize={38} fill="#FF7A6A" letterSpacing={2}>
          {redLabel}
        </text>
      ) : null}
      {left ? (
        <text x={x - r} y={y + 70} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.dim} letterSpacing={2}>
          {left}
        </text>
      ) : null}
      {right ? (
        <text x={x + r} y={y + 70} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FF7A6A" letterSpacing={2}>
          {right}
        </text>
      ) : null}
      <path d={`M ${x} ${y} L ${tip.x} ${tip.y}`} stroke={SCH.live} strokeWidth={14} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      <circle cx={x} cy={y} r={30} fill={SCH.live} />
      <circle cx={x} cy={y} r={12} fill={SCH.ground} />
    </g>
  );
};

/** easing helper re-exported for the shots */
export const ramp = (t: number, a: number, d: number) => easeOut(clamp((t - a) / d));
