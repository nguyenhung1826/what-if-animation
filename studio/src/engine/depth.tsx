import React from 'react';
import { kf, rnd, clamp } from './anim';

/**
 * Depth and finish for a set: parallax layers, a vignette, film grain and idle life.
 * The layer recipe and the "one light, near/middle/far" rules come from story-animator
 * (github.com/deenukhan/story-animator, MIT); see references/scenes.md.
 */

export type CamKey = [number, number, number]; // centre x, centre y, zoom

/**
 * The shot's camera at time t, eased between two framings (or one, for a still camera).
 * Same framing numbers as camT(cx, cy, s).
 */
export const camAt = (t: number, len: number, a: CamKey, b: CamKey = a): CamKey => [
  kf(t, [[0, a[0]], [len, b[0]]]),
  kf(t, [[0, a[1]], [len, b[1]]]),
  Math.exp(kf(t, [[0, Math.log(a[2])], [len, Math.log(b[2])]])),
];

/**
 * One depth layer. depth 1 moves with the camera (the world the characters stand in); 0.3-0.5 for the far sky,
 * skyline and hills; 0.7 for the middle (buildings across the street); 1.2-1.4 for the blurred foreground. The
 * layer follows the camera's pan and zoom by `depth` of the move, measured from `rest` (the shot's first framing).
 */
export const Layer: React.FC<{ cam: CamKey; rest: CamKey; depth: number; children: React.ReactNode; blur?: string }> = ({ cam, rest, depth, children, blur }) => {
  const cx = rest[0] + (cam[0] - rest[0]) * depth;
  const cy = rest[1] + (cam[1] - rest[1]) * depth;
  const z = rest[2] * Math.pow(cam[2] / rest[2], depth);
  return (
    <g transform={`translate(960 540) scale(${z}) translate(${-cx} ${-cy})`} filter={blur ? `url(#${blur})` : undefined}>
      {children}
    </g>
  );
};

/**
 * A whole parallax shot: list the layers far to near; each is drawn in world units (the same space as camT).
 *   <Parallax t={t} len={len} from={[960, 540, 1]} to={[1100, 540, 1.1]} layers={[[0.35, <Sky/>], [0.7, <Shops/>], [1, <Street/>], [1.3, <Lamp/>]]} />
 */
export const Parallax: React.FC<{ t: number; len: number; from: CamKey; to?: CamKey; layers: [number, React.ReactNode, string?][] }> = ({ t, len, from, to, layers }) => {
  const cam = camAt(t, len, from, to ?? from);
  return (
    <g>
      {layers.map(([d, el, blur], i) => (
        <Layer key={i} cam={cam} rest={from} depth={d} blur={blur}>
          {el}
        </Layer>
      ))}
    </g>
  );
};

/** Haze over a far layer: cools and lifts it so near things read darker and warmer (aerial perspective). */
export const FarHaze: React.FC<{ o?: number; color?: string; y0?: number; y1?: number }> = ({ o = 0.35, color = '#7C86B8', y0 = 0, y1 = 1080 }) => (
  <rect x={-2000} y={y0} width={6000} height={y1 - y0} fill={color} opacity={o} />
);

/** Darkened corners: the frame's last layer before UI. o 0.35-0.55. */
export const Vignette: React.FC<{ o?: number; id?: string }> = ({ o = 0.45, id = 'vig' }) => (
  <g pointerEvents="none">
    <defs>
      <radialGradient id={id} cx="50%" cy="48%" r="75%">
        <stop offset="55%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#000" stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id})`} opacity={o} />
  </g>
);

/**
 * Film grain: fine noise that changes every 2 frames, so flat fills stop looking like vector stock. Keep it faint
 * (o 0.05-0.09). It costs render time; one per frame, over everything, after the vignette.
 */
export const Grain: React.FC<{ t: number; o?: number }> = ({ t, o = 0.07 }) => {
  const seed = Math.floor(t / 2) % 50;
  return (
    <g pointerEvents="none" style={{ mixBlendMode: 'overlay' }} opacity={o}>
      <filter id={`grain${seed}`} x={0} y={0} width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={seed} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect x={0} y={0} width={1920} height={1080} filter={`url(#grain${seed})`} />
    </g>
  );
};

/**
 * Idle life for a held character: breathing and a blink every 3-5 s.
 *   const life = idle(t, 3);
 *   pose={{ ...p, scale: p.scale * life.breath, blink: Math.max(p.blink ?? 0, life.blink) }}
 */
export const idle = (t: number, seed: number) => {
  const breath = 1 + 0.015 * Math.sin((t / 30) * Math.PI * 0.55 + seed);
  const period = 90 + Math.floor(rnd(seed, 1) * 60);
  const ph = (t + Math.floor(rnd(seed, 2) * period)) % period;
  const blink = ph < 2 ? 1 : ph < 4 ? 0.5 : 0;
  return { breath, blink };
};

/** Seeded drifting particles for a mood: 'dust' (warm motes), 'snow', 'petal', 'ember', 'rain'. */
export const Drift: React.FC<{ t: number; seed: number; kind: 'dust' | 'snow' | 'petal' | 'ember' | 'rain'; n?: number; o?: number }> = ({ t, seed, kind, n = 40, o = 0.7 }) => {
  const C = { dust: '#FFE2B0', snow: '#F4F7FF', petal: '#FFB3C6', ember: '#FF9A3D', rain: '#A9C4FF' }[kind];
  const fall = { dust: -0.15, snow: 1.2, petal: 1.6, ember: -1.4, rain: 26 }[kind];
  return (
    <g style={{ mixBlendMode: kind === 'ember' || kind === 'dust' ? 'screen' : undefined }} opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const sp = 0.5 + rnd(seed + 3, i);
        const x = ((rnd(seed, i) * 2100 + Math.sin(t / 25 + i) * 30 * (kind === 'rain' ? 0 : 1) + t * (kind === 'rain' ? 4 : 0.4) * sp) % 2100) - 90;
        const y = ((((rnd(seed + 1, i) * 1200 + t * fall * sp) % 1200) + 1200) % 1200) - 60;
        if (kind === 'rain') return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 34} stroke={C} strokeWidth={2.5} opacity={0.6} />;
        const r = (kind === 'petal' ? 8 : kind === 'snow' ? 5 : 3) * (0.6 + rnd(seed + 2, i));
        return kind === 'petal'
          ? <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.55} fill={C} transform={`rotate(${(t * 3 + i * 40) % 360} ${x} ${y})`} />
          : <circle key={i} cx={x} cy={y} r={r} fill={C} opacity={0.4 + 0.6 * clamp(Math.sin(t / 12 + i) * 0.5 + 0.5)} />;
      })}
    </g>
  );
};
