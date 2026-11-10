import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, easeInOut, LOOKS, tone, Look, Glow, Foreground, Tabletop, Tag, FloatLabel,
  Schematic, SCH, SchLabel, DrawOn, Sparkle, ShotProps, walkPose, walkPhase, shake, stand,
} from '../../engine';
import { LivingRoom, TV, Couch, Street, STREET, Backyard, BouncyCastle, Balloon, Office, OfficeDesk, OFFICE, YARD } from '../feel-pain-1/sets';
import {
  HERO, BUDDY, KID_A, KID_B, NEPHEW, SISTER, MAIL, BOSS, BARISTA, PASSER1, PASSER2, SANDWICH_LADY, ENVELOPE_GUY, RED,
  Ring, Throb, Ache, Act, CU, cuHead, cam, Realize, Notepad, Foot, Lego, Tears,
} from '../feel-pain-1/kit';

// Chapter 2: the world is full of tiny hurts. The rules (a notepad), the football night, the sunglasses, the birthday
// party with the bouncy castle, then the turn: you start to see everyone's quiet aches.

const RULES = ['1. NO SPORTS', '2. NO COOKING SHOWS', '3. NEVER WALK PAST A PLAYGROUND'];
const Pad: React.FC<{ t: number; n: number; from: number }> = ({ t, n, from }) => (
  <g transform={`translate(960 540) rotate(${-1 + t * 0.02}) scale(${1 + t * 0.0008}) translate(-960 -540)`}>
    <Tabletop edge={1400} />
    <Glow x={1500} y={160} r={800} o={0.35} />
    <Notepad x={960} y={560} lines={RULES} p={RULES.map((_, i) => (i < n - 1 ? 1 : i === n - 1 ? clamp((t - from) / 40) : 0))} />
    {/* the pen, following the writing */}
    {(() => {
      const k = clamp((t - from) / 40);
      const x = 700 + 620 * k;
      const y = 440 + (n - 1) * 112;
      return <g transform={`translate(${x} ${y}) rotate(-35)`}><rect x={-14} y={-260} width={28} height={260} rx={10} fill="#2A4A8A" /><path d="M -14 0 L 14 0 L 0 30 Z" fill="#1A1A22" /></g>;
    })()}
  </g>
);

// ---------- S1, S5, S7: the rules ----------
export const S1: React.FC<ShotProps> = ({ t }) => <Pad t={t} n={1} from={150} />;
export const S5: React.FC<ShotProps> = ({ t }) => <Pad t={t} n={2} from={36} />;
export const S7: React.FC<ShotProps> = ({ t }) => <Pad t={t} n={3} from={38} />;

// ---------- the football night in the living room ----------
const LINEBACKER: Look = { ...tone(LOOKS.suit, 'black'), extra: 'cap', hair: '#C2353A', jacket: '#C2353A', jacketShade: '#A02A30', sleeve: '#C2353A', accent: '#F2F0E6', limb: '#F2F0E6' };
const QB: Look = { ...tone(LOOKS.mo, 'white'), extra: 'cap', hair: '#2A5AA0', jacket: '#2A5AA0', jacketShade: '#1E4A88', sleeve: '#2A5AA0', accent: '#F2F0E6', limb: '#F2F0E6' };
const Football: React.FC<{ t: number; hit: number }> = ({ t, hit }) => {
  const k = easeInOut(clamp((t - hit + 30) / 30));
  const down = clamp((t - hit) / 8);
  return (
    <g>
      <rect x={TV.x0} y={TV.y0} width={400} height={225} fill="#3A7A44" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${TV.x0 + 40 + i * 80} ${TV.y0} L ${TV.x0 + 20 + i * 80} ${TV.y1}`} stroke="#F2F0E6" strokeWidth={3} opacity={0.7} />)}
      <Hero look={QB} pose={{ ...basePose, x: 1010, y: 560, scale: 0.28, yaw: -0.4, tilt: 60 * down, spin: -70 * down, armR: { a: 150, b: 20 }, expr: down > 0 ? 'dizzy' : 'neutral' }} shadow={0} />
      <Hero look={LINEBACKER} pose={{ ...basePose, x: 820 + 170 * k, y: 560, scale: 0.34, yaw: 0.6, tilt: 30, armL: { a: 90, b: 0 }, armR: { a: 90, b: 0 }, expr: 'smug' }} shadow={0} />
      <rect x={TV.x0} y={TV.y0} width={110} height={30} fill="#0E0D12" opacity={0.7} />
      <text x={TV.x0 + 10} y={TV.y0 + 22} fontFamily="monospace" fontSize={18} fill="#F6EFE3">1ST 12:04</text>
    </g>
  );
};
const COUCH_ME: Pose = { ...basePose, x: 820, y: 700, scale: 1.25, yaw: -0.15, look: 0.3, armL: { a: 30, b: 40 }, armR: { a: 30, b: 40 } };
const COUCH_BUDDY: Pose = { ...basePose, x: 1100, y: 700, scale: 1.25, yaw: 0.15, look: -0.3, armR: { a: 60, b: 70 }, armL: { a: 30, b: 40 } };

// ---------- S2: wide: your buddy and you on the couch, football on the TV ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 560, 1.05], [960, 560, 1.12])}>
    <LivingRoom t={t} id="l2" screen={<Football t={t} hit={9999} />} tvLight="#7FD08A" />
    <Act t={t} look={BUDDY} keys={[{ f: 0, p: { ...COUCH_BUDDY, look: -0.6, yaw: -0.3 } }]} face={[[0, 'happy']]} rim="rimL" shadow={0} />
    <Act t={t} keys={[{ f: 0, p: { ...COUCH_ME, yaw: 0.2 } }]} face={[[0, 'worried']]} shadow={0} />
    <Couch y={760} w={760} />
  </g>
);

// ---------- S3: insert, the TV: the linebacker flattens the quarterback ----------
// hits@72
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(${shake(t, 72, 8, 8)} 0)`}>
    <g transform={cam(t, len, [960, 542, 4.2], [960, 542, 4.4])}>
      <LivingRoom t={t} id="l3" screen={<Football t={t} hit={72} />} />
      <Ring x={1000} y={540} t={t - 72} s={0.25} />
    </g>
  </g>
);

// ---------- S4: wide: you hit the floor; your buddy stares ----------
// hit@22
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 14) / 12));
  return (
    <g transform={cam(t, len, [960, 600, 1.0], [960, 600, 1.05])}>
      <LivingRoom t={t + 100} id="l4" screen={<Football t={t + 200} hit={9999} />} />
      <Act t={t} look={BUDDY} keys={[{ f: 0, p: { ...COUCH_BUDDY, look: -1, yaw: -0.5 } }]} face={[[0, 'happy'], [26, 'shock']]} rim="rimL" shadow={0} />
      <Couch y={760} w={760} />
      <Hero look={HERO} pose={{ ...COUCH_ME, x: 820 - 260 * k, y: 700 + 230 * k, spin: -80 * k, armL: { a: 30 + 120 * k, b: 10 }, armR: { a: 30 + 100 * k, b: 10 }, expr: 'dizzy', glint: k, glintColor: RED }} rimId="rimR" shadow={k * 0.5} />
      <Throb x={600} y={830} t={t - 26} s={0.8} />
    </g>
  );
};

// ---------- S6: close-up: too many knives: a chop on TV, you flinch ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const chop = (t % 10) < 4;
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [12, 'shock']]} hurt={t > 12 ? 1 : 0} p={{ yaw: -0.1, headTilt: kf(t, [[0, 0], [14, 10]]) }}
        bg={<g transform="translate(-900 -700) scale(2.2)"><LivingRoom t={t} id="l6" /></g>} />
      <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" opacity={chop ? 0.05 : 0} />
      <ellipse cx={1500} cy={980} rx={150} ry={120} fill={HERO.hand} stroke={HERO.line} strokeWidth={8} transform="rotate(-20 1500 980)" />
      <Throb x={1560} y={900} t={t - 14} s={0.9} />
      <FloatLabel x={420} y={300} t={t - 14} text="CHOP CHOP" color={RED} size={60} />
    </g>
  );
};

// ---------- S8: medium: outside SHADES: the darkest sunglasses drop on ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [-500, 560, 1.7], [-500, 560, 1.8])}>
    <Street t={t} id="st8" />
    <Hero look={HERO} pose={{ ...basePose, x: -500, y: STREET.walk - 140, scale: 1, yaw: 0.2, look: 0.2, glasses: clamp((t - 30) / 10), expr: t > 36 ? 'cool' : 'neutral' }} shadow={0.5} />
    <Sparkle x={-440} y={500} t={t - 40} s={0.8} />
  </g>
);

// ---------- S9: wide: you walk to work in shades, staring at your shoes ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x = 380 + t * 4;
  return (
    <g transform={cam(t, len, [600, 560, 1.15], [700, 560, 1.15])}>
      <Street t={t + 100} id="st9" />
      <Hero look={HERO} pose={walkPose(x, walkPhase(x - 380, 1), STREET.walk, 1, { yaw: 0.6, headTilt: 18, glasses: 1, look: 0.2 })} shadow={0.5} />
    </g>
  );
};

// ---------- S10: schematic map: your route bends around the gym, the skate park, the dentist ----------
// gym@49 skate@72 dentist@109
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const P = (x: number, y: number, label: string, at: number, c = SCH.line) => (
    <g opacity={clamp((t - at) / 6)}>
      <rect x={x - 110} y={y - 50} width={220} height={100} rx={14} fill="none" stroke={c} strokeWidth={5} />
      <SchLabel x={x} y={y + 14} t={t - at} text={label} size={32} color={c} />
    </g>
  );
  return (
    <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
      <Schematic t={t} id="sc10" />
      <path d="M 300 540 L 1620 540" stroke={SCH.dim} strokeWidth={6} strokeDasharray="20 18" />
      {P(300, 540, 'HOME', 0)}
      {P(1620, 540, 'WORK', 0)}
      {P(700, 540, 'GYM', 46, RED)}
      {P(1000, 540, 'SKATE PARK', 70, RED)}
      {P(1300, 540, 'DENTIST', 106, RED)}
      <DrawOn d="M 410 540 Q 450 240 700 230 Q 860 230 860 400 Q 860 860 1000 860 Q 1140 860 1150 400 Q 1160 220 1300 220 Q 1480 220 1510 540" t={t - 10} dur={130} color={SCH.live} width={9} />
      <SchLabel x={960} y={150} t={t - 12} text="THE LONG WAY" size={56} />
    </g>
  );
};

// ---------- S11: medium: smug in your shades; a DAY counter ----------
// four@47 days@56
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1100 + t * 1.5;
  const day = Math.min(4, 1 + Math.floor(t / 14));
  return (
    <g>
      <g transform={cam(t, len, [x, 560, 1.8], [x, 560, 1.85])}>
        <Street t={t + 300} id="st11" />
        <Hero look={HERO} pose={walkPose(x, walkPhase(t * 1.5, 1), STREET.walk, 1, { yaw: 0.5, glasses: 1, expr: 'cool', headTilt: -4 })} shadow={0.5} />
      </g>
      <Tag x={1600} y={180} t={t} text={`DAY ${day}`} w={200} />
    </g>
  );
};

// ---------- the party ----------
const KIDS: [Look, number, number][] = [[KID_A, 380, 0], [KID_B, 520, 1], [NEPHEW, 660, 2], [{ ...KID_A, hair: '#4AA07A', jacket: '#C49BFF', sleeve: '#C49BFF', jacketShade: '#A47BDF' }, 760, 3]];
const bounce = (t: number, i: number) => Math.abs(Math.sin(t / 7 + i * 1.3)) * 60;
const KidOnCastle: React.FC<{ t: number; look: Look; x: number; i: number; extra?: Partial<Pose> }> = ({ t, look, x, i, extra = {} }) => (
  <Hero look={look} pose={{ ...basePose, x, y: YARD.ground - 170 - 84 - bounce(t, i), scale: 0.6, yaw: i % 2 ? -0.3 : 0.3, armL: { a: 120, b: 20 }, armR: { a: 130, b: 20 }, legL: { a: 20, b: 30 }, legR: { a: -20, b: 30 }, expr: 'happy', ...extra }} shadow={0} />
);
const SIS_POS: Pose = { ...basePose, ...{ x: 1180, y: YARD.ground - 140, scale: 1 }, yaw: -0.3, look: -0.4, armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 } };
const ME_YARD: Pose = { ...basePose, x: 1840, y: YARD.ground - 140, scale: 1, yaw: -0.5, look: -0.6 };

// ---------- S12: wide: the party ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1000, 540, 0.95], [1000, 540, 1.0])}>
    <Backyard t={t} id="y12" />
    {KIDS.map(([l, x, i]) => <KidOnCastle key={i} t={t} look={l} x={x} i={i} />)}
    <Hero look={SISTER} pose={{ ...SIS_POS, expr: 'happy' }} rimId="rimL" shadow={0.5} />
    <Hero look={HERO} pose={{ ...ME_YARD, glasses: 1, expr: 'worried' }} shadow={0.5} />
  </g>
);

// ---------- S13: medium: 12 KIDS, 1 BOUNCY CASTLE, 0 HELMETS ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={cam(t, len, [560, 480, 1.5], [560, 480, 1.6])}>
      <Backyard t={t + 50} id="y13" />
      {KIDS.map(([l, x, i]) => <KidOnCastle key={i} t={t + 50} look={l} x={x} i={i} />)}
    </g>
    <Tag x={1560} y={200} t={t} text="12 KIDS" w={220} />
    <Tag x={1560} y={300} t={t - 42} text="1 BOUNCY CASTLE" w={330} />
    <Tag x={1560} y={400} t={t - 92} text="0 HELMETS" w={250} mark="x" />
  </g>
);

// ---------- S14: medium: two kids bonk heads mid-bounce ----------
// bonks@20, ouch@68 ouch@80
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 6) / 14));
  const back = t > 20 ? clamp((t - 20) / 10) : 0;
  return (
    <g transform={`translate(${shake(t, 20, 8, 10)} 0)`}>
      <g transform={cam(t, len, [560, 470, 2.2], [560, 470, 2.3])}>
        <Backyard t={t + 80} id="y14" />
        <KidOnCastle t={20} look={KID_A} x={470 + 70 * k - 40 * back} i={0} extra={{ y: 520, yaw: 0.6, expr: t > 20 ? 'dizzy' : 'happy' }} />
        <KidOnCastle t={20} look={KID_B} x={650 - 70 * k + 40 * back} i={1} extra={{ y: 520, yaw: -0.6, expr: t > 20 ? 'dizzy' : 'happy' }} />
        <Ring x={560} y={410} t={t - 20} s={0.6} />
        <Ring x={560} y={410} t={t - 32} s={0.4} />
      </g>
    </g>
  );
};

// ---------- S15: close-up: two bumps, both on you ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'oops']]} hurt={1} p={{ yaw: 0.05, glasses: 0, headTilt: kf(t, [[0, 0], [10, -8], [30, 0]]) }}
        bg={<g transform="translate(-800 -500) scale(2.2)"><Backyard t={t} id="y15" /></g>} />
      <Throb x={h.x - h.r * 0.45} y={h.y - h.r * 0.7} t={t - 2} s={0.7} />
      <Throb x={h.x + h.r * 0.45} y={h.y - h.r * 0.75} t={t - 14} s={0.7} />
    </g>
  );
};

// ---------- S16: low insert: a foot comes down on a LEGO ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 2) / 18));
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#4A6A4A" />
      <rect x={0} y={0} width={1920} height={500} fill="#8A6850" />
      <Glow x={1500} y={200} r={700} o={0.4} />
      {Array.from({ length: 60 }).map((_, i) => <path key={i} d={`M ${(i * 137) % 1920} ${600 + (i * 53) % 480} l 10 -40 l 8 36`} stroke="#6A8A5A" strokeWidth={6} fill="none" />)}
      <Lego x={1000} y={860} s={1.8} />
      <Foot x={1100} y={860 - 260 * (1 - k)} s={1.3} sock={false} c="#4A6FA5" />
      <Ring x={1000} y={800} t={t - 20} s={1.2} />
    </g>
  );
};

// ---------- S17: medium: a balloon pops in a kid's face ----------
// popped@30
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1300, 560, 2.0], [1300, 560, 2.08])}>
    <Backyard t={t + 120} id="y17" />
    <Hero look={KID_B} pose={{ ...basePose, x: 1200, y: YARD.ground - 84, scale: 0.6, yaw: 0.5, look: 0.6, armR: { a: 80, b: 10 }, expr: t > 30 ? 'shock' : 'happy', squash: t > 30 && t < 40 ? 0.1 : 0 }} shadow={0.5} />
    <Balloon x={1290} y={600} c="#E8503A" t={t} pop={clamp((t - 26) / 4)} s={1.3} />
    {t > 30 && t < 44 ? Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${1290 + Math.cos(i) * 40} ${600 + Math.sin(i) * 40} l ${Math.cos(i) * 60 * (t - 30) / 8} ${Math.sin(i) * 60 * (t - 30) / 8}`} stroke="#E8503A" strokeWidth={10} strokeLinecap="round" />) : null}
    <Ring x={1240} y={590} t={t - 30} s={0.5} />
  </g>
);

// ---------- S18: wide: the birthday boy falls off the castle onto his elbow ----------
// falls@31 lands@93 elbow@122: lands at 100
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 30) / 70);
  const fx = 760 + 280 * easeOut(k);
  const fy = 460 + (YARD.ground - 90 - 460) * (k * k) - 140 * Math.sin(Math.PI * Math.min(k, 0.5));
  return (
    <g transform={cam(t, len, [800, 560, 1.4], [820, 600, 1.55])}>
      <Backyard t={t + 160} id="y18" />
      {KIDS.slice(0, 2).map(([l, x, i]) => <KidOnCastle key={i} t={t} look={l} x={x} i={i} />)}
      <Hero look={NEPHEW} pose={{ ...basePose, x: fx, y: fy, scale: 0.6, spin: k < 1 ? 160 * k : 90, armL: { a: 150, b: 20 }, armR: { a: 120, b: 30 }, expr: k > 0.95 ? 'dizzy' : 'shock' }} shadow={k >= 1 ? 0.5 : 0} />
      <Ring x={1040} y={YARD.ground - 40} t={t - 100} s={0.9} />
    </g>
  );
};

// ---------- S19: close-up: you're the one crying ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'worried']]} hurt={1} p={{ yaw: -0.1, headTilt: 6 }}
        bg={<g transform="translate(-1100 -500) scale(2.2)"><Backyard t={t} id="y19" /></g>} />
      <Tears x={h.x - 20} y={h.y - 10} t={t} s={1.4} />
      <Throb x={300} y={900} t={t} s={1.2} />
    </g>
  );
};

// ---------- S20: over the shoulder: your sister: are you okay? ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1200, 520, 2.1], [1200, 520, 2.15])}>
    <Backyard t={t + 200} id="y20" />
    <Act t={t} look={SISTER} keys={[{ f: 0, p: { ...SIS_POS, yaw: 0.3, look: 0.5, headTilt: 6 } }, { f: 44, p: { headTilt: 10, armR: { a: 50, b: 30 } } }]} face={[[0, 'worried']]} rim="rimL" shadow={0} />
    <Foreground blur={16}><Hero look={HERO} pose={{ ...basePose, x: 1560, y: 820, scale: 2.4, yaw: -0.6 }} shadow={0} /></Foreground>
  </g>
);

// ---------- S21: medium two-shot: you try to explain ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1500, 520, 1.6], [1500, 520, 1.68])}>
    <Backyard t={t + 260} id="y21" />
    <Act t={t} look={SISTER} keys={[{ f: 0, p: { ...SIS_POS, x: 1260, yaw: 0.4, look: 0.6 } }]} face={[[0, 'worried'], [110, 'shock']]} rim="rimL" shadow={0.5} />
    <Act t={t} keys={[
      { f: 0, p: { ...ME_YARD, x: 1720, armR: { a: 40, b: 60 }, armL: { a: 20, b: 20 } } },
      { f: 50, p: { armR: { a: 70, b: 30 }, headTilt: -8 } },
      { f: 100, p: { armR: { a: 90, b: 20 }, headTilt: 6 } },
    ]} face={[[0, 'oops'], [70, 'happy'], [100, 'oops']]} />
    <Throb x={1660} y={600} t={t + 30} s={0.5} o={0.6} />
  </g>
);

// ---------- S22: close-up: something you didn't expect ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [90, 'shock']]} p={{ yaw: kf(t, [[0, -0.2], [90, 0.3]]), look: kf(t, [[0, -0.4], [90, 0.6]]) }}
        bg={<g transform="translate(-800 -600) scale(2.2)"><Backyard t={t + 300} id="y22" /></g>} />
      <Realize x={h.x + 100} y={h.y - 100} t={t - 92} />
    </g>
  );
};

// ---------- S22b: medium: you look around the party: small red aches on every grown-up ----------
export const S22b: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1300, 540, 1.3], [1350, 540, 1.38])}>
    <Backyard t={t + 400} id="y22b" />
    <Hero look={SISTER} pose={{ ...SIS_POS, expr: 'happy', yaw: 0.3 }} rimId="rimL" shadow={0.5} />
    <Hero look={PASSER2} pose={{ ...basePose, x: 950, y: YARD.ground - 140, yaw: 0.4, armR: { a: 70, b: 80 }, expr: 'happy' }} shadow={0.5} />
    <Hero look={PASSER1} pose={{ ...basePose, x: 1500, y: YARD.ground - 140, yaw: -0.3, expr: 'happy' }} shadow={0.5} />
    <Hero look={HERO} pose={{ ...ME_YARD, look: kf(t, [[0, -1], [60, -0.4]]), expr: 'neutral' }} shadow={0.5} />
    <Ache x={1180} y={YARD.ground - 230} t={t - 10} />
    <Ache x={940} y={YARD.ground - 70} t={t - 30} />
    <Ache x={1520} y={YARD.ground - 300} t={t - 50} />
  </g>
);

// ---------- S23: medium: the mail carrier's knee ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1100 + t * 2.5;
  return (
    <g transform={cam(t, len, [x, 560, 1.8], [x, 560, 1.85])}>
      <Street t={t + 500} id="st23" />
      <Hero look={MAIL} pose={walkPose(x, walkPhase(t * 2.5, 1), STREET.walk, 1, { yaw: 0.6, expr: 'happy', tilt: 3 })} shadow={0.5} />
      <Ache x={x + 10} y={STREET.walk - 70} t={t} s={1.2} />
    </g>
  );
};

// ---------- S24: medium: your boss eases into his chair ----------
// sits@61
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(OFFICE, 0.5, 0.55);
  const sit = easeInOut(clamp((t - 50) / 20));
  return (
    <g transform={cam(t, len, [s.x, 470, 1.8], [s.x, 480, 1.9])}>
      <Office t={t + 800} id="o24" />
      <Hero look={BOSS} pose={{ ...basePose, ...s, y: s.y + 40 * s.scale * sit, yaw: 0.3, tilt: 12 * (1 - sit), armL: { a: 30, b: 60 }, armR: { a: 20, b: 50 }, expr: 'happy', headTilt: sit > 0.5 ? -4 : 6 }} shadow={0} />
      <OfficeDesk u={0.5} w={0.62} />
      <Ache x={s.x - 20} y={s.y - 100 * s.scale} t={t - 20} s={1.2} />
    </g>
  );
};

// ---------- S25: medium: the barista at the café window, a burn she never mentions ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [60, 620, 2.2], [60, 620, 2.3])}>
    <Street t={t + 600} id="st25" />
    <Act t={t} look={BARISTA} keys={[{ f: 0, p: { x: 60, y: 740, scale: 1, yaw: 0.2, look: 0.3, armR: { a: 70, b: 70 }, armL: { a: 30, b: 40 } } }, { f: 60, p: { headTilt: -6 } }]} face={[[0, 'happy']]} shadow={0} />
    <rect x={-200} y={760} width={520} height={60} fill="#5A4A3A" />
    <rect x={-200} y={756} width={520} height={8} fill="#8A6248" />
    <g transform="translate(160 726)"><path d="M -24 30 L -30 -24 L 30 -24 L 24 30 Z" fill="#F2F0E6" /><rect x={-32} y={-34} width={64} height={12} rx={4} fill="#5A3A2A" /></g>
    <Ache x={130} y={690} t={t - 20} s={1.1} />
  </g>
);

// ---------- S26: wide: everyone keeps going, smiling, each with a quiet ache ----------
const CROWD: [Look, number, number, number][] = [[PASSER1, 200, 1, 0.9], [MAIL, 640, -1, 1], [SANDWICH_LADY, 1000, 1, 0.95], [ENVELOPE_GUY, 1400, -1, 1], [PASSER2, 1800, 1, 0.9], [BOSS, 2200, -1, 1]];
const aches = [[-0.1, -0.6], [0.05, 0.4], [-0.05, -0.2], [0.1, 0.5], [0, -0.5], [-0.1, 0.1]];
const Crowd: React.FC<{ t: number; ache: number }> = ({ t, ache }) => (
  <g>
    {CROWD.map(([l, x0, dir, s], i) => {
      const x = x0 + dir * t * 2.6;
      return (
        <g key={i}>
          <Hero look={l} pose={walkPose(x, walkPhase(t * 2.6, s), STREET.walk, s, { yaw: 0.6 * dir, expr: 'happy' }, dir as 1 | -1)} shadow={0.5} />
          <Ache x={x + aches[i][0] * 100} y={STREET.walk - 140 * s + aches[i][1] * 200 * s} t={ache - i * 6} />
        </g>
      );
    })}
  </g>
);
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1100, 560, 0.9], [1150, 560, 0.95])}>
    <Street t={t + 700} id="st26" />
    <Crowd t={t} ache={t} />
  </g>
);

// ---------- S27: close-up: you, moved ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} face={[[0, 'neutral'], [60, 'worried']]} p={{ yaw: 0.2, look: kf(t, [[0, 0.5], [80, -0.3]]), headTilt: kf(t, [[0, 0], [len, 6]]) }}
    bg={<g transform="translate(-900 -600) scale(2.2)"><Street t={t + 900} id="st27" /></g>} />
);

// ---------- S28: wide, high: pull back: the whole street dotted with red aches ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 640, 1.2], [960, 560, 0.72])}>
    <Street t={t + 1000} id="st28" />
    <Crowd t={t + 80} ache={200} />
    <Hero look={HERO} pose={{ ...basePose, x: 1000, y: STREET.walk - 140, yaw: 0, look: 0, expr: 'worried' }} shadow={0.5} />
    {Array.from({ length: 14 }).map((_, i) => <Ache key={i} x={-600 + ((i * 397) % 3200)} y={330 + ((i * 131) % 380)} t={t - i * 5} s={0.8} />)}
  </g>
);
