import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, HEAD, Look, tone, Expr, Glow, FONT, FocusRings, feetBelowHips,
} from '../../engine';

// Shared by the four chapters of "What if you could feel everyone's pain?": the cast, the small props, the power's
// marks and a few shot helpers. Episode-local (not in the engine library).

export const RED = '#FF4A4A';

// ---------------------------------------------------------------- cast (everyone dressed; skins pure black or white)
export const HERO = LOOKS.hero;
export const ROOMMATE: Look = { ...tone(LOOKS.mo, 'white'), coat: undefined, extra: 'curls', hair: '#6A4A2A', jacket: '#7A8A9A', jacketShade: '#62707E', sleeve: '#7A8A9A', limb: '#5A3A5A', shoe: '#C9C2B4', accent: '#7A8A9A' };
export const COWORKER: Look = { ...tone(LOOKS.mom, 'black'), extra: 'topbun', hair: '#2A2430', jacket: '#C2803A', jacketShade: '#A0682E', sleeve: '#C2803A', coat: 'sweater', limb: '#2A2E3A', accent: '#F2E6C0' };
export const BUDDY: Look = { ...tone(LOOKS.mo, 'black'), extra: 'cap', hair: '#C2353A', coat: 'bomber', jacket: '#C2353A', jacketShade: '#A02A30', sleeve: '#C2353A', accent: '#F2F0E6', limb: '#2A3040' };
export const KID_A: Look = { ...tone(LOOKS.sis, 'white'), extra: 'cap', hair: '#3A6AA0', jacket: '#E9B44A', jacketShade: '#C9942A', sleeve: '#E9B44A', limb: '#3A4A6A', accent: '#3A6AA0' };
export const KID_B: Look = { ...tone(LOOKS.sis, 'black'), jacket: '#E86A9A', jacketShade: '#C8507A', sleeve: '#E86A9A', limb: '#4A3A5A', accent: '#F2C14E', hair: '#2A2230' };
export const NEPHEW: Look = { ...tone(LOOKS.sis, 'black'), extra: 'beanie', hair: '#F2C14E', jacket: '#4AA07A', jacketShade: '#3A805E', sleeve: '#4AA07A', limb: '#2A3A5A', accent: '#E8503A' };
export const SISTER: Look = { ...tone(LOOKS.mom, 'white'), extra: 'ponytail', hair: '#5A3A2A', coat: 'denim', jacket: '#4A6FA5', jacketShade: '#3A5884', sleeve: '#4A6FA5', limb: '#2A2733', accent: '#F2C14E' };
export const ENVELOPE_GUY: Look = { ...tone(LOOKS.suit, 'white'), hair: '#4A3A30', jacket: '#5A6A50', jacketShade: '#4A5840', sleeve: '#5A6A50', accent: '#E9C46A' };
export const SANDWICH_LADY: Look = { ...tone(LOOKS.mom, 'black'), extra: 'beret', hair: '#C2553E', coat: 'long', jacket: '#8A6A9A', jacketShade: '#70547E', sleeve: '#8A6A9A', limb: '#3A3446' };
export const NEIGHBOR: Look = { ...tone(LOOKS.suit, 'black'), extra: 'bucket', hair: '#C9A050', coat: 'denim', jacket: '#B0563A', jacketShade: '#904430', sleeve: '#B0563A', accent: '#E9C46A', limb: '#3A4A6A' };
export const MAIL: Look = { ...tone(LOOKS.mo, 'white'), extra: 'cap', hair: '#2A4A7A', coat: 'bomber', jacket: '#3A5A8A', jacketShade: '#2E4A72', sleeve: '#3A5A8A', limb: '#2A3A5A', item: 'satchel', itemColor: '#6A4A30', accent: '#E9C46A' };
export const BOSS: Look = { ...tone(LOOKS.suit, 'white'), hair: '#8A8A90', jacket: '#3A3A48', jacketShade: '#2C2C38', sleeve: '#3A3A48', accent: '#4A7AA0' };
export const BARISTA: Look = { ...tone(LOOKS.heroine, 'black'), lashes: false, extra: 'topbun', hair: '#2A2430', jacket: '#3A5A4A', jacketShade: '#2E4A3C', sleeve: '#EDE6DA', coat: 'sweater', accent: '#C2803A', limb: '#3A3446' };
export const DOCTOR: Look = { ...tone(LOOKS.mom, 'black'), extra: 'bob', hair: '#2A2430', coat: 'long', jacket: '#ECEEF0', jacketShade: '#C8CCD0', sleeve: '#ECEEF0', accent: '#4A9A8A', limb: '#2A3A4A' };
export const RESEARCHER: Look = { ...tone(LOOKS.suit, 'white'), extra: 'curls', hair: '#C2803A', coat: 'long', jacket: '#ECEEF0', jacketShade: '#C8CCD0', sleeve: '#ECEEF0', accent: '#4A7AA0', limb: '#3A3446' };
export const VOLUNTEER: Look = { ...tone(LOOKS.mo, 'black'), extra: 'curls', hair: '#2A2430', coat: 'sweater', jacket: '#E9B44A', jacketShade: '#C9942A', sleeve: '#E9B44A', limb: '#3A4A6A' };
export const NURSE: Look = { ...tone(LOOKS.mo, 'white'), extra: 'topbun', hair: '#4A2A22', jacket: '#3A8A8A', jacketShade: '#2E6E6E', sleeve: '#3A8A8A', limb: '#3A8A8A', coat: undefined, accent: '#3A8A8A' };
export const TODDLER: Look = { ...tone(LOOKS.sis, 'white'), jacket: '#F2C14E', jacketShade: '#D2A13E', sleeve: '#F2C14E', limb: '#9FC0E6', hair: '#C9A050' };
export const MOM2: Look = { ...tone(LOOKS.mom, 'black'), extra: 'ponytail', hair: '#2A2430', coat: 'biker', jacket: '#6A3A4A', jacketShade: '#542E3A', sleeve: '#6A3A4A', limb: '#2A2E3A' };
export const OLD_MAN: Look = { ...tone(LOOKS.suit, 'white'), hair: '#D8D8D8', jacket: '#9AB0C0', jacketShade: '#7A90A0', sleeve: '#9AB0C0', accent: '#9AB0C0', limb: '#9AB0C0', coat: undefined };
export const TOUGH: Look = { ...tone(LOOKS.mo, 'black'), extra: 'beanie', hair: '#3A3A3A', coat: 'biker', jacket: '#26262E', jacketShade: '#1A1A22', sleeve: '#26262E', limb: '#3A3A4A', accent: '#C2553E' };
export const PASSER1: Look = { ...tone(LOOKS.mom, 'white'), extra: 'bob', hair: '#C2803A', coat: 'long', jacket: '#4A7A6A', jacketShade: '#3A6254', sleeve: '#4A7A6A', limb: '#2A2E3A' };
export const PASSER2: Look = { ...tone(LOOKS.suit, 'black'), jacket: '#7A5A3A', jacketShade: '#62482E', sleeve: '#7A5A3A', accent: '#E9C46A' };

// ---------------------------------------------------------------- the power's marks
/** A red ring expanding from where someone gets hurt (the source). t is frames since the hurt. */
export const Ring: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t < 0 || t > 40) return null;
  const k = t / 40;
  return (
    <g>
      {[0, 10].map((d) => {
        const kk = clamp((t - d) / 30);
        return kk > 0 && kk < 1 ? <circle key={d} cx={x} cy={y} r={(20 + 160 * easeOut(kk)) * s} fill="none" stroke={RED} strokeWidth={10 * s * (1 - kk)} opacity={1 - kk} /> : null;
      })}
      <Glow x={x} y={y} r={120 * s} kind="red" o={0.8 * (1 - k)} />
    </g>
  );
};
/** The same hurt arriving on you: a throbbing red glow with a hot core. o fades it. */
export const Throb: React.FC<{ x: number; y: number; t: number; s?: number; o?: number }> = ({ x, y, t, s = 1, o = 1 }) => {
  if (t < 0) return null;
  const k = clamp(t / 6) * o;
  const p = 1 + 0.18 * Math.sin(t / 3);
  return (
    <g opacity={k}>
      <Glow x={x} y={y} r={150 * s * p} kind="red" o={0.75} />
      <circle cx={x} cy={y} r={16 * s * p} fill="#FFB0A0" opacity={0.9} />
      {[0, 1, 2, 3].map((i) => {
        const a = (i * Math.PI) / 2 + 0.6;
        const r0 = 40 * s * p;
        return <path key={i} d={`M ${x + Math.cos(a) * r0} ${y + Math.sin(a) * r0} L ${x + Math.cos(a) * r0 * 1.7} ${y + Math.sin(a) * r0 * 1.7}`} stroke={RED} strokeWidth={8 * s} strokeLinecap="round" />;
      })}
    </g>
  );
};
/** Small, quiet pain spots on other people (what you start to notice). */
export const Ache: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g opacity={clamp(t / 10) * (0.6 + 0.2 * Math.sin(t / 6))}>
    <Glow x={x} y={y} r={70 * s} kind="red" o={0.7} />
    <circle cx={x} cy={y} r={7 * s} fill="#FF9A8A" />
  </g>
);

// ---------------------------------------------------------------- shot helpers
/** Stand someone on a floor line: hip point for feet at y. */
export const onFloor = (x: number, feet: number, scale: number) => ({ x, y: feet - feetBelowHips(scale), scale });
/** The hero (or anyone) with keys and faces; the hero's eyes take a red glint when hurt > 0. */
export const Act: React.FC<{ t: number; look?: Look; keys: Parameters<typeof poseAt>[1]; face?: [number, Expr][]; hurt?: number; rim?: string; shadow?: number }> = ({ t, look = HERO, keys, face, hurt = 0, rim = 'rimR', shadow = 0.5 }) => {
  const p = poseAt(t, keys);
  const f = face ? faceAt(t, face) : {};
  return <Hero look={look} pose={{ ...p, ...f, glint: hurt, glintColor: RED }} rimId={rim} shadow={shadow} />;
};
/** A close-up: a head at (x, 600) at about 4x, the set blurred behind. */
export const CU: React.FC<{ t: number; len: number; bg: React.ReactNode; look?: Look; p?: Partial<Pose>; face: [number, Expr][]; hurt?: number; x?: number; rim?: string; s?: number }> = ({ t, len, bg, look = HERO, p = {}, face, hurt = 0, x = 980, rim = 'rimR', s = 4.2 }) => {
  const sc = s * (1 + 0.05 * kf(t, [[0, 0], [len, 1]]));
  const pose: Pose = { ...basePose, x, y: 600 - HEAD.y * sc, scale: sc, yaw: 0.2, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...p, ...faceAt(t, face), glint: hurt, glintColor: RED };
  return (
    <g>
      <g filter="url(#blur16)">{bg}</g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050712" opacity={0.28} />
      <Hero look={look} pose={pose} shadow={0} rimId={rim} />
    </g>
  );
};
/** Where a close-up's head is (for marks on it): ear, forehead, mouth, offsets in head radii. */
export const cuHead = (len: number, t: number, x = 980, s = 4.2) => {
  const sc = s * (1 + 0.05 * kf(t, [[0, 0], [len, 1]]));
  return { x, y: 600, r: HEAD.r * sc };
};
/** A slow push from one framing to another. */
export const cam = (t: number, len: number, a: [number, number, number], b: [number, number, number] = a) =>
  camT(kf(t, [[0, a[0]], [len, b[0]]]), kf(t, [[0, a[1]], [len, b[1]]]), kf(t, [[0, a[2]], [len, b[2]]]));
export const Realize: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => <g transform={`translate(${x} ${y}) scale(0.5) translate(${-x} ${-y})`}><FocusRings x={x} y={y} t={t} /></g>;

// ---------------------------------------------------------------- small props
/** A big foot in a sock or sneaker, side-on, toes pointing right (x, y = sole under the toes). */
export const Foot: React.FC<{ x: number; y: number; s?: number; c?: string; sock?: boolean; rot?: number; flip?: boolean }> = ({ x, y, s = 1, c = '#5A3A5A', sock = true, rot = 0, flip = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-330} y={-260} width={150} height={190} fill={c} />
    <path d="M -330 -80 Q -340 0 -300 0 L 40 0 Q 90 0 90 -40 Q 90 -90 20 -100 L -180 -120 L -180 -80 Z" fill={sock ? '#E6E0D4' : '#F2F0E6'} stroke="#2A2430" strokeWidth={6} />
    {sock ? <path d="M -60 -100 Q 0 -110 40 -96" stroke="#C9C2B4" strokeWidth={6} fill="none" /> : <path d="M -330 -16 L 90 -16" stroke="#C2553E" strokeWidth={14} />}
  </g>
);
export const Notepad: React.FC<{ x: number; y: number; lines: string[]; p: number[]; rot?: number; title?: string }> = ({ x, y, lines, p, rot = -3, title = 'RULES' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-380} y={-300} width={760} height={600} rx={10} fill="#000" opacity={0.3} transform="translate(14 18)" />
    <rect x={-380} y={-300} width={760} height={600} rx={10} fill="#F2E6A0" />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M -350 ${-180 + i * 56} L 350 ${-180 + i * 56}`} stroke="#9FC0D0" strokeWidth={3} />)}
    <path d="M -300 -300 L -300 300" stroke="#E68A8A" strokeWidth={4} />
    <text x={-260} y={-210} fontFamily={FONT.hand} fontSize={76} fill="#2A3A6A">{title}</text>
    {lines.map((l, i) => (
      <g key={i}>
        <clipPath id={`np${i}${lines.length}`}><rect x={-300} y={-150 + i * 112 - 60} width={680 * clamp(p[i] ?? 0)} height={110} /></clipPath>
        <text x={-280} y={-120 + i * 112} fontFamily={FONT.hand} fontSize={52} fill="#2A3A6A" clipPath={`url(#np${i}${lines.length})`}>{l}</text>
      </g>
    ))}
  </g>
);
export const Stapler: React.FC<{ x: number; y: number; s?: number; down?: number }> = ({ x, y, s = 1, down = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-20} width={240} height={20} rx={8} fill="#2A2A32" />
    <g transform={`rotate(${-14 * (1 - down)} 110 -20)`}><rect x={-120} y={-56} width={240} height={34} rx={14} fill="#C2353A" /><rect x={-110} y={-52} width={200} height={8} rx={4} fill="#FFFFFF" opacity={0.3} /></g>
  </g>
);
export const Envelope: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-50} width={160} height={100} fill="#F2E6CC" stroke="#8A7A5A" strokeWidth={3} />
    <path d={`M -80 -50 L 0 ${10 - 70 * open} L 80 -50`} fill="#E6D8B8" stroke="#8A7A5A" strokeWidth={3} />
  </g>
);
export const Sandwich: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -60 0 L 60 0 L 0 -70 Z" fill="#E6C08A" />
    <path d="M -54 -4 L 54 -4" stroke="#7AC07A" strokeWidth={8} />
    <path d="M -50 -10 L 50 -10" stroke="#E8503A" strokeWidth={6} />
  </g>
);
export const Hammer: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-6} y={0} width={12} height={110} rx={5} fill="#A0703A" />
    <rect x={-34} y={-16} width={68} height={24} rx={4} fill="#5A5E66" />
  </g>
);
export const Lego: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#E8303A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-40} width={120} height={40} rx={4} fill={c} />
    {[-30, 0, 30].map((dx) => <g key={dx}><rect x={dx - 11} y={-52} width={22} height={14} rx={3} fill={c} /><ellipse cx={dx} cy={-52} rx={11} ry={4} fill="#FF7A7A" /></g>)}
    <rect x={-60} y={-40} width={120} height={8} fill="#FFFFFF" opacity={0.25} />
  </g>
);
export const Peas: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -90 -60 Q 0 -80 90 -60 L 100 60 Q 0 80 -100 60 Z" fill="#3A9A5A" />
    <path d="M -90 -60 Q 0 -80 90 -60 L 90 -44 Q 0 -64 -90 -44 Z" fill="#2A7A44" />
    {[[-40, 0], [-10, 10], [20, -6], [50, 12], [-20, 30], [30, 34]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={14} fill="#8AD06A" />)}
    <rect x={-50} y={-30} width={100} height={30} rx={6} fill="#F2F0E6" />
    <text x={0} y={-8} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#2A7A44">PEAS</text>
    <path d="M -100 60 Q 0 80 100 60" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={6} fill="none" />
  </g>
);
export const Badge: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -10 -260 L -60 -120 M 10 -260 L 60 -120" stroke="#3A8A8A" strokeWidth={10} />
    <rect x={-110} y={-120} width={220} height={300} rx={18} fill="#F2F6F8" />
    <rect x={-110} y={-120} width={220} height={60} rx={18} fill="#B8202A" />
    <text x={0} y={-80} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF" letterSpacing={3}>ER STAFF</text>
    <circle cx={0} cy={10} r={56} fill="#17141C" />
    <path d="M -24 4 Q -14 -6 -4 4 M 4 4 Q 14 -6 24 4" stroke="#F6EFE3" strokeWidth={5} fill="none" />
    <rect x={-70} y={100} width={140} height={14} rx={6} fill="#C8CCD0" />
    <rect x={-50} y={128} width={100} height={12} rx={6} fill="#D8DCE0" />
  </g>
);
export const Tears: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g>
    {[0, 1].map((i) => {
      const k = ((t + i * 11) % 22) / 22;
      return <path key={i} d={`M ${x + (i ? 1 : -1) * 70 * s} ${y + k * 160 * s} q -10 18 0 26 q 10 -8 0 -26 Z`} transform={`scale(1)`} fill="#9FD8FF" opacity={1 - k * 0.6} stroke="#6AB0E6" strokeWidth={3} />;
    })}
  </g>
);
