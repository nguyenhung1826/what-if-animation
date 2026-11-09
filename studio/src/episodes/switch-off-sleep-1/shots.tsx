import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, settle, camT, LOOKS, HEAD, joints, toWorld,
  Bedroom, BedDuvet, bedSit, BEDROOM, Classroom, SchoolDesk, Kid, Study, Desk, Kitchen, KitchenIsland, KITCHEN, islandTop, stand,
  Tabletop, AlarmClock, Paper, PaperStack, Cat, Mug, TitleCard, Glow, Foreground, LightVeil, ShotProps,
} from '../../engine';

// "What if you could switch off sleep?" Chapter 1: the cold open and the title card. Fourteen shots on the bedroom,
// classroom, study and kitchen. The power: one flip and you never feel tired: the lamp dies, the light goes cold and
// your eyes glow in the dark (offLook in index.tsx grades the picture; the glow is the hero's faceGlow + glint).

const HERO = LOOKS.hero;
const GLOW = { ...LOOKS.hero, faceGlow: true };
const ICE = '#9FE4FF';
const on = (p: Pose, g: number): Pose => ({ ...p, glint: g, glintColor: ICE });

// the room at night with the lamp off: darker, bluer
export const Night: React.FC<{ o?: number }> = ({ o = 0.42 }) => <rect x={-2000} y={-2000} width={6000} height={6000} fill="#0A1030" opacity={o} style={{ mixBlendMode: 'multiply' }} />;

// a close-up of the hero against a soft background (pattern from rewind Sh9)
export const CloseUp: React.FC<{ t: number; len: number; bg: React.ReactNode; p?: Partial<Pose>; face: Partial<Pose>; glint: number; x?: number; rim?: string }> = ({ t, len, bg, p = {}, face, glint, x = 980, rim = 'rimBlueL' }) => {
  const sc = 4.2 * (1 + 0.05 * kf(t, [[0, 0], [len, 1]]));
  const head = { x, y: 600 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.15, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...p, ...face };
  return (
    <g>
      <g filter="url(#blur16)">{bg}</g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050712" opacity={0.3} />
      <Hero look={glint > 0 ? GLOW : HERO} pose={on(pose, glint)} shadow={0} rimId={rim} />
    </g>
  );
};

// ---------- S1: insert, the bedside clock: 3:00 ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#1A1626" />
    <rect x={0} y={700} width={1920} height={380} fill="#2A2230" />
    <rect x={0} y={700} width={1920} height={6} fill="#4A3A40" />
    <Glow x={360} y={360} r={700} o={0.55} />
    <Glow x={360} y={360} r={240} o={0.5} />
    <AlarmClock x={1020} y={740} s={2.4} text={t % 30 < 24 ? '3:00' : '3 00'} />
    <Glow x={1020} y={610} r={360} kind="red" o={0.25} />
    <Foreground blur={16}>
      <path d="M 120 1100 L 160 640 L 300 640 L 330 1100 Z" fill="#110E18" />
    </Foreground>
  </g>
);

// ---------- S2: wide, the bedroom at 3 a.m.: you sit up in bed, wide awake ----------
const SIT = bedSit(0.2);
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SIT, yaw: 0.6, look: 0.8, armL: { a: 30, b: 30 }, armR: { a: 30, b: 30 }, headTilt: 4 } },
    { f: 40, p: { headTilt: -2, look: 0.9 } },
    { f: 80, p: { headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 930]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Bedroom t={t + 100} id="b2" clock="3:00" duvet={false} />
      <Hero look={HERO} pose={{ ...pose, expr: 'neutral', blink: t % 70 > 66 ? 1 : 0 }} shadow={0} rimId="rimR" />
      <BedDuvet knees={0.6} />
    </g>
  );
};

// ---------- S3: medium, you turn to us: not you ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SIT, yaw: 0.6, look: 0.8, armL: { a: 30, b: 30 }, armR: { a: 30, b: 30 } } },
    { f: 4, p: {} },
    { f: 11, p: { yaw: 0.05, look: 0, headTilt: -4 }, ease: easeOut },
    { f: 15, p: { headTilt: 0 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [12, 'smug']]);
  return (
    <g transform={camT(SIT.x + 10, SIT.y - 150 * SIT.scale, kf(t, [[0, 2.7], [len, 2.8]]))}>
      <Bedroom t={t + 190} id="b3" clock="3:00" duvet={false} />
      <Hero look={HERO} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <BedDuvet knees={0.6} />
    </g>
  );
};

// ---------- S4: insert, your hand flips the lamp's switch: Off ----------
const FLIP = 28;
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const lit = 1 - clamp((t - FLIP) / 4);
  const down = clamp((t - FLIP + 3) / 3);
  const hand = { x: kf(t, [[0, 1600], [12, 1215], [FLIP - 4, 1200], [FLIP, 1192], [len, 1200]]), y: kf(t, [[0, 1250], [12, 880], [FLIP - 4, 868], [FLIP, 896], [len, 890]]) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill={lit > 0.5 ? '#2E2430' : '#141626'} />
      {/* the nightstand top and the lamp's base and shade */}
      <polygon points="0,700 1920,700 1920,1080 0,1080" fill={lit > 0.5 ? '#5A4238' : '#262634'} />
      <rect x={0} y={700} width={1920} height={8} fill={lit > 0.5 ? '#8A6450' : '#3A3A4C'} />
      <ellipse cx={640} cy={690} rx={170} ry={34} fill="#221A20" />
      <rect x={622} y={260} width={36} height={430} fill="#2A2026" />
      <path d="M 430 60 L 850 60 L 930 290 L 350 290 Z" fill={lit > 0.5 ? '#F2D2A0' : '#4A4250'} />
      <path d="M 350 290 L 930 290" stroke="#FFE7B8" strokeWidth={10} opacity={lit} />
      <Glow x={640} y={300} r={900} o={0.65 * lit} />
      <Glow x={640} y={300} r={300} o={0.6 * lit} />
      {/* the cord and the rocker switch on it */}
      <path d="M 790 690 Q 900 700 1000 760 L 1300 800 Q 1500 830 1980 820" stroke="#1E1A22" strokeWidth={14} fill="none" />
      <g transform="translate(1085 770) rotate(6) scale(1.3)">
        <rect x={-90} y={-40} width={180} height={80} rx={30} fill="#E8E2D6" stroke="#1E1A22" strokeWidth={6} />
        <g transform={`rotate(${-12 + 24 * down})`}>
          <rect x={-46} y={-30} width={92} height={42} rx={14} fill={lit > 0.5 ? '#FF8A3D' : '#9A9AA8'} stroke="#1E1A22" strokeWidth={5} />
        </g>
      </g>
      {/* your forearm (bare under the pushed-up sleeve) and a pointing hand */}
      <g filter="url(#rimL)">
        <path d={`M ${hand.x + 40} ${hand.y + 20} L ${hand.x + 420} ${hand.y + 420}`} stroke={HERO.line} strokeWidth={120} strokeLinecap="round" />
        <path d={`M ${hand.x + 40} ${hand.y + 20} L ${hand.x + 420} ${hand.y + 420}`} stroke={HERO.limb} strokeWidth={100} strokeLinecap="round" />
        <path d={`M ${hand.x + 300} ${hand.y + 300} L ${hand.x + 520} ${hand.y + 520}`} stroke={HERO.sleeve} strokeWidth={150} strokeLinecap="round" />
        <g transform={`translate(${hand.x} ${hand.y}) rotate(-40) scale(5)`}>
          <rect x={-4} y={-34} width={8} height={26} rx={4} fill={HERO.hand} stroke={HERO.line} strokeWidth={2.2} />
          <path d="M -11 2 Q -14 -14 -6 -18 L 7 -18 Q 14 -14 11 2 Q 8 16 0 16 Q -8 16 -11 2 Z" fill={HERO.hand} stroke={HERO.line} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A1030" opacity={0.35 * (1 - lit)} style={{ mixBlendMode: 'multiply' }} />
    </g>
  );
};

// ---------- S5: close-up, your face in the dark, eyes glowing ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const g = clamp(t / 8);
  return (
    <CloseUp t={t} len={len} glint={0.4 + 0.6 * g} face={faceAt(t, [[0, 'neutral'], [6, 'cool']])} p={{ headTilt: kf(t, [[0, 2], [12, -3]]), look: kf(t, [[0, 0.3], [14, 0]]) }}
      bg={<g transform="translate(-700 -560) scale(2.2)"><Bedroom t={t + 300} id="b5" clock="3:00" lamp={0} veil={0.7} /><Night o={0.5} /></g>} />
  );
};

// ---------- S6: medium, first period: a huge yawn ----------
const DESK6 = 1000;
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: DESK6, y: 760, yaw: 0.25, tilt: 6, headTilt: 8, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 2, p: {} },
    { f: 9, p: { tilt: 2, headTilt: -14, armL: { a: 150, b: 30 }, armR: { a: 150, b: 30 } }, ease: easeOut },
    { f: 30, p: { tilt: 0, headTilt: -18, armL: { a: 158, b: 26 }, armR: { a: 158, b: 26 } } },
    { f: 42, p: { tilt: 8, headTilt: 10, armL: { a: 16, b: -6 }, armR: { a: 16, b: -6 } } },
  ]);
  const yawn = t >= 6 && t < 36;
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1000]]), kf(t, [[0, 520], [len, 510]]), kf(t, [[0, 1.7], [len, 1.78]]))}>
      <Classroom t={t + 40} id="c6" />
      <Hero look={HERO} pose={{ ...pose, expr: yawn ? 'shock' : 'tired', blink: yawn ? 0.75 : 0.35 }} shadow={0} rimId="rimL" />
      <SchoolDesk x={DESK6} />
      <Foreground blur={16}>
        <Kid x={560} y={1060} s={2.8} look={{ hair: 'curly', hairC: '#120E18', top: '#1E1A28' }} />
      </Foreground>
    </g>
  );
};

// ---------- S7: close-up, you flick the switch at your temple: Off. You sit up straight ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const g = clamp((t - 7) / 6);
  const arm = poseAt(t, [
    { f: 0, p: { armR: { a: 14, b: -6 }, tilt: 8, headTilt: 12 } },
    { f: 4, p: { armR: { a: 150, b: 120 } }, ease: easeOut },
    { f: 7, p: { armR: { a: 156, b: 128 }, headTilt: 8 } },
    { f: 13, p: { armR: { a: 14, b: -6 }, tilt: -2, headTilt: -4 }, ease: easeOut },
    { f: 18, p: { tilt: 0, headTilt: 0 } },
  ]);
  return (
    <CloseUp t={t} len={len} glint={g} rim="rimL" x={1000}
      face={faceAt(t, [[0, 'tired'], [8, 'cool']])}
      p={{ armR: arm.armR, tilt: arm.tilt, headTilt: arm.headTilt + settle(t - 13, 3), handR: t < 9 ? 'point' : 'open' }}
      bg={<g transform="translate(-590 -452) scale(2.2)"><Classroom t={t + 140} id="c7" /></g>} />
  );
};

// ---------- S8: medium, the study at night: a tall blank stack, the clock at 11:58 ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 712, yaw: 0.4, look: 0.6, tilt: 4, headTilt: 6, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } } },
    { f: 30, p: { tilt: 10, headTilt: 14 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 990]]), 590, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <Study t={t + 60} id="st8" night />
      <Hero look={HERO} pose={{ ...pose, expr: 'tired', blink: 0.3 }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} lamp />
      <PaperStack x={1130} y={660} n={16} w={150} />
      <AlarmClock x={700} y={668} s={0.42} text="11:58" />
    </g>
  );
};

// ---------- S9: top-down over the desk: sheet after sheet done, the stack lands, the clock flips to 4:00 ----------
const SHEETS = 6;
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 8) / 56); // 0..1 through the night
  const doneN = Math.min(SHEETS, Math.floor(k * SHEETS + 0.0001));
  const cur = k * SHEETS - doneN;
  const hours = ['12:06', '12:47', '1:22', '2:05', '2:41', '3:18', '3:52'];
  const clock = t >= 60 ? '4:00' : hours[Math.min(hours.length - 1, Math.floor(k * hours.length))];
  const land = t - 70;
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.03}) scale(${1 + t * 0.0015}) translate(-960 -540)`}>
      <Tabletop edge={1400} />
      <LightVeil id="s9veil" lights={[[1500, 120, 900]]} o={0.6} />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0A1030" opacity={0.3} style={{ mixBlendMode: 'multiply' }} />
      <Glow x={1520} y={140} r={700} o={0.4} />
      {/* blank sheets on the left, shrinking */}
      {Array.from({ length: SHEETS - doneN }).map((_, i) => (
        <Paper key={`b${i}`} x={420 + i * 3} y={560 - i * 4} w={300} rot={-6 + i} done={false} />
      ))}
      {/* the sheet being done now, writing filling in */}
      {doneN < SHEETS ? <Paper x={960} y={560} w={330} rot={2} done fill={cur} grade="A" /> : null}
      {/* the done stack on the right, growing; the last sheet slaps down */}
      {Array.from({ length: doneN }).map((_, i) => (
        <Paper key={`d${i}`} x={1450 + i * 3} y={600 - i * 4 - (i === SHEETS - 1 ? Math.max(0, 40 * (1 - clamp(land / 4))) : 0)} w={300} rot={5 - i} done grade="A" />
      ))}
      <g transform={`translate(1600 160) scale(${t >= 60 ? 1 + 0.12 * Math.sin(clamp((t - 60) / 6) * Math.PI) : 1})`}>
        <AlarmClock x={0} y={0} s={0.9} text={clock} />
      </g>
    </g>
  );
};

// ---------- S10: medium close, the kitchen in the dark: the cat wakes and stares ----------
const CAT = KITCHEN.P(0.78, 0.72, 0.1);
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(CAT.x - 30, CAT.y - 60, kf(t, [[0, 3.0], [len, 3.15]]))}>
    <Kitchen t={t + 200} id="k10" veil={0.7} />
    <Night o={0.45} />
    <Cat x={CAT.x} y={CAT.y} mood={t > 10 ? 'alert' : 'sleep'} f={t} />
    <Glow x={CAT.x - 20} y={CAT.y - 40} r={120} kind="cool" o={0.25} />
  </g>
);

// ---------- S11: medium, you at the island, dressed, raising your mug to the cat ----------
const ST11 = stand(KITCHEN, 0.42, 0.4);
const MUG11 = islandTop(0.5, 0.4);
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: ST11.x, y: ST11.y, scale: ST11.scale, yaw: 0.55, look: 0.9, armL: { a: 12, b: -6 }, armR: { a: 24, b: 30 } } },
    { f: 14, p: {} },
    { f: 22, p: { armR: { a: 70, b: 70 }, headTilt: -4 }, ease: easeOut },
    { f: 60, p: { armR: { a: 72, b: 72 }, headTilt: -2 } },
  ]);
  const raised = t >= 20;
  const hp = { ...basePose, ...pose };
  const hand = toWorld(hp, joints(hp).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1040]]), 540, kf(t, [[0, 1.6], [len, 1.68]]))}>
      <Kitchen t={t + 260} id="k11" veil={0.7} />
      <Night o={0.45} />
      <Cat x={CAT.x} y={CAT.y} mood="alert" f={t + 30} />
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'cool']]) }, 0.9)} rimId="rimBlueL" shadow={0} />
      <KitchenIsland />
      {raised ? <Mug x={hand.x + 6} y={hand.y + 14} rot={-6} f={t} /> : <Mug x={MUG11.x} y={MUG11.y} rot={0} f={t} />}
    </g>
  );
};

// ---------- S12: the title over the dark bedroom ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, ...SIT, yaw: 0, armL: { a: 30, b: 30 }, armR: { a: 30, b: 30 }, expr: 'cool' };
  return (
    <g>
      <g transform={camT(940, kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
        <Bedroom t={t + 400} id="b12" clock="3:00" lamp={0} veil={0.7} duvet={false} />
        <Night o={0.5} />
        <Hero look={GLOW} pose={on(pose, 1)} shadow={0} rimId="rimBlueL" />
        <BedDuvet knees={0.6} />
      </g>
      <rect x={0} y={0} width={1920} height={430} fill="#05060F" opacity={0.35} />
      <TitleCard t={t} lines={['WHAT IF YOU COULD', 'SWITCH OFF SLEEP?']} accent="OFF" accentT={74} size={104} y={175} />
    </g>
  );
};

// ---------- S13: close-up, you in the dark, smug, eyes glowing ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <CloseUp t={t} len={len} glint={1} face={faceAt(t, [[0, 'cool'], [20, 'smug']])} p={{ headTilt: kf(t, [[0, 0], [len, -4]]), look: kf(t, [[0, 0.2], [30, 0]]) }}
    bg={<g transform="translate(-900 -520) scale(2.2)"><Bedroom t={t + 500} id="b13" clock="3:00" lamp={0} veil={0.7} /><Night o={0.5} /></g>} />
);

// ---------- S14: wide, the dark bedroom: you sit awake on the bed while the clock rolls on ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const hrs = Math.floor(3 + t / 18) % 12 || 12;
  const mins = String(Math.floor((t * 7) % 60)).padStart(2, '0');
  const pose: Pose = { ...basePose, ...SIT, yaw: 0.1, look: 0, armL: { a: 30, b: 30 }, armR: { a: 30, b: 30 }, expr: 'cool', headTilt: kf(t, [[0, 0], [len, -3]]) };
  const clockAt = BEDROOM.P(0.455, 0.78, 0.075);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.05], [len, 1.3]]))}>
      <Bedroom t={t * 6 + 600} id="b14" clock={`${hrs}:${mins}`} lamp={0} veil={0.7} duvet={false} />
      <Night o={0.5} />
      <Glow x={clockAt.x} y={clockAt.y - 30} r={90} kind="red" o={0.5} />
      <Hero look={GLOW} pose={on(pose, 1)} shadow={0} rimId="rimBlueL" />
      <BedDuvet knees={0.6} />
    </g>
  );
};
