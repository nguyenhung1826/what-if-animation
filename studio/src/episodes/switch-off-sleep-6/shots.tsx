import React from 'react';
import {
  Hero, Pose, Look, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, tone, LEG_LEN, HEAD,
  walkPose, walkPhase, joints, toWorld, Rooftop, Tag, Glow, FONT, ShotProps,
} from '../../engine';
import { CloseUp } from '../switch-off-sleep-1/shots';

// "What if you could switch off sleep?" Chapter 6: the choice, and the Part 1 cliffhanger. Twelve shots on the
// rooftop at sunrise (day seven). The power is still on: the hero's eyes glow (faceGlow + an ice-blue glint, as in
// chapters 1-2). The sister (in pajamas: she followed you straight out of bed) and the man in the suit (the voice on
// the phone) both want the switch; the city lights up as he pitches it; it all goes dark on "day twelve".

const GLOW = { ...LOOKS.hero, faceGlow: true };
const ICE = '#9FE4FF';
const on = (p: Pose, g = 0.9): Pose => ({ ...p, glint: g, glintColor: ICE });

// costumes (on the storyboard for approval): the man in a charcoal suit and red tie
// the sister exactly as chapter 3 drew her: black, teal pajamas top and bottom, coral slippers, bunches
export const SIS: Look = { ...tone(LOOKS.sis, 'black'), jacket: '#3E8C86', jacketShade: '#2F6E69', sleeve: '#3E8C86', limb: '#357A75', accent: '#F2C14E', shoe: '#F28C6A', hair: '#3A2E44' };
export const SUIT: Look = tone(LOOKS.suit, 'black');
const SIS_S = 0.7; // the sister at 0.7 of the others

// the roof's parapet top and the deck where feet stand, for a given `low`
const LEDGE = (low: number) => 790 + low;
const DECK = (low: number) => 846 + low;

// a wooden crate on the deck to sit on; the hero sits on it side-on (thighs forward, shins down to the deck)
export const Crate: React.FC<{ x: number; top: number; bottom: number; w: number }> = ({ x, top, bottom, w }) => {
  const h = bottom - top;
  return (
    <g>
      <ellipse cx={x} cy={bottom + 4} rx={w * 0.62} ry={w * 0.08} fill="#000" opacity={0.3} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={4} fill="#7A5236" stroke="#2A1A12" strokeWidth={Math.max(2, w * 0.03)} />
      {[0.33, 0.66].map((k) => <rect key={k} x={x - w / 2} y={top + h * k - w * 0.015} width={w} height={w * 0.03} fill="#4E3222" />)}
      <rect x={x - w / 2} y={top} width={w} height={w * 0.035} fill="#E8A070" opacity={0.6} />
      <path d={`M ${x - w / 2 + 6} ${top + 6} L ${x + w / 2 - 6} ${bottom - 6}`} stroke="#5E3E28" strokeWidth={w * 0.04} />
    </g>
  );
};
const crateTop = (low: number, scale: number) => DECK(low) - 74 * scale;
const sitting = (x: number, low: number, scale: number, p: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: crateTop(low, scale) - 4 * scale, scale, yaw: 0.8, facing: 1, legL: { a: 86, b: -86 }, legR: { a: 80, b: -78 },
  armL: { a: 30, b: 50 }, armR: { a: 30, b: 50 }, ...p,
});
const Seat: React.FC<{ x: number; low: number; scale: number }> = ({ x, low, scale }) => (
  <Crate x={x + 6 * scale} top={crateTop(low, scale)} bottom={DECK(low)} w={110 * scale} />
);

const standing = (x: number, low: number, scale: number, p: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: DECK(low) - LEG_LEN * scale, scale, ...p });

// a phone in a hand: a dark slab with a lit screen
const HandPhone: React.FC<{ pose: Pose; side?: 'armL' | 'armR'; lit?: number }> = ({ pose, side = 'armR', lit = 1 }) => {
  const h = toWorld(pose, joints(pose)[side].end);
  const s = pose.scale;
  return (
    <g transform={`translate(${h.x} ${h.y}) rotate(-12) scale(${s})`}>
      <rect x={-11} y={-30} width={22} height={42} rx={5} fill="#101018" stroke="#05050A" strokeWidth={2} />
      <rect x={-8} y={-26} width={16} height={32} rx={3} fill="#9FC0FF" opacity={0.35 + 0.5 * lit} />
    </g>
  );
};

// ---------- S1: wide, low: the roof at sunrise; you sit alone on the parapet. "Sunrise" @62 ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const low = 120;
  const pose = poseAt(t, [
    { f: 0, p: sitting(860, low, 0.78, { look: 0.7, headTilt: 6, armL: { a: 22, b: 40 }, armR: { a: 22, b: 40 } }) },
    { f: 60, p: { headTilt: 2, look: 0.9 } },
    { f: 90, p: { headTilt: 8 }, ease: easeInOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 560], [len, 590]]), kf(t, [[0, 1.0], [len, 1.1]], easeInOut))}>
      <Rooftop t={t} sunX={1330} sunY={kf(t, [[0, 720], [len, 670]])} low={low} />
      <Seat x={860} low={low} scale={0.78} />
      <Hero look={GLOW} pose={on({ ...pose, expr: 'neutral', blink: t % 80 > 76 ? 1 : 0 }, 0.8)} rimId="rimR" shadow={0} />
      {t >= 60 ? (
        <text x={330} y={230} fontFamily={FONT.hand} fontSize={110} fill="#FFE27A" opacity={clamp((t - 60) / 6)} transform="rotate(-6 330 230)">
          DAY 7
        </text>
      ) : null}
    </g>
  );
};

// ---------- S2: medium wide: your sister pads out in pajamas, happy, and comes over. "She" @53, "switch" @73 ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const low = 80;
  const sx = kf(t, [[0, 120], [62, 700]], easeOut);
  const sc = 1.15 * SIS_S;
  const sis = t < 62 ? walkPose(sx, walkPhase(sx - 120, sc), DECK(low), sc, {}, 1) : standing(700, low, sc, { armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } });
  const hero = poseAt(t, [
    { f: 0, p: sitting(1180, low, 1.15, { look: 0.6 }) },
    { f: 30, p: { yaw: -0.4, look: -0.8, headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 920]]), 600, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 140} sunX={1500} sunY={640} low={low} />
      <Seat x={1180} low={low} scale={1.15} />
      <Hero look={GLOW} pose={on({ ...hero, ...faceAt(t, [[0, 'neutral'], [36, 'worried']]) })} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, yaw: t < 62 ? 0.8 : 0.3, look: 0.6, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- S3: medium close: sis bouncing, points at you: she wants one. "wants" @9, "one" @19 ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const low = 300;
  const sc = 2.4 * SIS_S;
  const bounce = Math.abs(Math.sin(t / 5)) * 16;
  const pose = poseAt(t, [
    { f: 0, p: standing(900, low, sc, { yaw: 0.2, look: 0.4, armL: { a: 20, b: 10 }, armR: { a: 30, b: 60 } }) },
    { f: 10, p: { armR: { a: 95, b: -6 }, handR: 'point', headTilt: -8 }, ease: easeOut },
    { f: 22, p: { headTilt: 6 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur6)">
        <Rooftop t={t + 240} sunX={1250} sunY={560} low={low} />
      </g>
      <Hero look={SIS} pose={{ ...pose, y: pose.y - bounce, squash: -bounce / 200, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S4: low angle: the man in the suit by the parapet, phone at his ear; lowers it: for everyone. "For" @63 ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const low = 260;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1120, y: 790, scale: 1.8, yaw: -0.25, look: -0.4, armL: { a: 14, b: 6 }, armR: { a: 22, b: 148 } } },
    { f: 52, p: {} },
    { f: 64, p: { armR: { a: 26, b: 40 }, yaw: -0.1, look: -0.6, headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.08]], easeInOut))}>
      <Rooftop t={t + 300} sunX={720} sunY={560} low={low} />
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [60, 'smug']]) }} rimId="rimL" shadow={0} />
      <HandPhone pose={pose} lit={1} />
    </g>
  );
};

// ---------- S5: wide: the whole city lights up. "city" @15, all on after "sleeps" @56 ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const lit = t < 15 ? 0.5 : t < 56 ? 1.4 : 2.9;
  const flash = t >= 56 ? clamp(1 - (t - 56) / 12) : 0;
  return (
    <g transform={camT(960, kf(t, [[0, 500], [len, 480]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Rooftop t={t + 360} sunX={1560} sunY={700} low={-40} cityLit={lit} />
      <rect x={-400} y={-400} width={2720} height={1900} fill="#FFE2B0" opacity={0.25 * flash} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

// ---------- S6: wide: the three of you, the city behind filling with lights. "city" @94 ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const low = 40;
  const hero = sitting(900, low, 0.72, { yaw: 0.5, look: 0.5, headTilt: 4 });
  const sis = standing(660, low, 0.72 * SIS_S, { yaw: 0.4, look: 0.6, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } });
  const suit = poseAt(t, [
    { f: 0, p: standing(1240, low, 0.76, { yaw: -0.3, look: -0.5, armL: { a: 14, b: 6 }, armR: { a: 26, b: 40 } }) },
    { f: 20, p: { armL: { a: 110, b: -10 }, yaw: -0.6, look: 0.4 }, ease: easeOut },
    { f: 80, p: { armL: { a: 120, b: -6 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.12]], easeInOut))}>
      <Rooftop t={t + 400} sunX={1500} sunY={650} low={low} cityLit={kf(t, [[0, 1.2], [len, 3.2]])} />
      <Seat x={900} low={low} scale={0.72} />
      <Hero look={GLOW} pose={on({ ...hero, ...faceAt(t, [[0, 'worried']]), blink: t % 70 > 66 ? 1 : 0 }, 0.8)} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" shadow={0.5} />
      <HandPhone pose={suit} lit={0.6} />
    </g>
  );
};

// ---------- S7: over the suit's shoulder onto the glowing city; tags; he turns, hand out: who'd say no? ----------
// "close" @34, "Schools" @61, "end" @95, "Who'd" @124, "no" @139
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 360, y: 820, scale: 2.7, yaw: 0.85, look: 1, armL: { a: 14, b: 6 }, armR: { a: 20, b: 20 } } },
    { f: 112, p: {} },
    { f: 126, p: { yaw: 0.15, look: 0.2, armR: { a: 70, b: -6 }, headTilt: 6 }, ease: easeOut },
    { f: 140, p: { armR: { a: 76, b: -8 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 540, kf(t, [[0, 1.0], [len, 1.1]], easeInOut))}>
      <Rooftop t={t + 520} sunX={1640} sunY={700} low={-20} cityLit={kf(t, [[0, 2.4], [len, 3.4]])} />
      <Tag x={1180} y={420} t={t - 4} text="FACTORIES: 24/7" w={620} />
      <Tag x={1250} y={560} t={t - 62} text="SCHOOL: NEVER ENDS" w={720} />
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [124, 'smug']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S8: two-shot: sis tugs your sleeve; you look down at her. "tugs" @21, "cartoons" @96 ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const low = 200;
  const hs = 1.6;
  const tug = t > 18 ? Math.sin((t - 18) / 3.2) * 8 * clamp((t - 18) / 6) : 0;
  const hero = poseAt(t, [
    { f: 0, p: sitting(1080, low, hs, { yaw: 0.6, look: 0.6, headTilt: 4 }) },
    { f: 24, p: {} },
    { f: 36, p: { yaw: -0.35, look: -0.9, headTilt: -10, armL: { a: 40 + tug * 0.3, b: 30 } }, ease: easeOut },
  ]);
  const ss = hs * SIS_S;
  const sis = poseAt(t, [
    { f: 0, p: standing(780, low, ss, { yaw: 0.4, look: 0.8, armL: { a: 20, b: 10 }, armR: { a: 70, b: 10 } }) },
    { f: 18, p: { armR: { a: 82 + tug, b: 6 }, headTilt: 8 } },
    { f: 90, p: { headTilt: -6 } },
  ]);
  const bounce = t > 92 ? Math.abs(Math.sin((t - 92) / 5)) * 12 : 0;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 1.0], [len, 1.08]], easeInOut))}>
      <Rooftop t={t + 700} sunX={1560} sunY={600} low={low} cityLit={2.6} />
      <Seat x={1080} low={low} scale={hs} />
      <Hero look={GLOW} pose={on({ ...hero, armL: { a: hero.armL.a + tug * 0.4, b: hero.armL.b }, ...faceAt(t, [[0, 'worried'], [40, 'neutral']]) }, 0.8)} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, armR: { a: sis.armR.a + (t > 18 ? tug : 0), b: sis.armR.b }, y: sis.y - bounce, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- S9: close-up: you, worried. "costs" @17, "They" @53 ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <CloseUp t={t} len={len} glint={1} rim="rimR" x={940}
    face={faceAt(t, [[0, 'worried']])}
    p={{ headTilt: kf(t, [[0, 2], [50, 2], [62, -6], [len, -8]], easeOut), look: kf(t, [[0, 0.1], [50, 0.1], [60, -0.5]]), yaw: kf(t, [[0, 0.1], [50, 0.1], [62, -0.25]], easeOut) }}
    bg={<g transform="translate(-1000 -900) scale(2.2)"><Rooftop t={t + 800} sunX={1200} sunY={620} cityLit={2.6} /></g>} />
);

// ---------- S10: insert: your hand over the switch, set to OFF; flip it back on? "flip" @24, "back on" @35, "lose" @66 ----------
export const PowerSwitch: React.FC<{ x: number; y: number; s: number; down: number; glow?: number }> = ({ x, y, s, down, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-120} width={160} height={240} rx={18} fill="#E8E2D6" stroke="#1E1A22" strokeWidth={6} />
    <text x={0} y={-82} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#3A3444">ON</text>
    <text x={0} y={104} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#3A3444">OFF</text>
    <rect x={-38} y={-60} width={76} height={120} rx={12} fill="#C9C2B6" stroke="#1E1A22" strokeWidth={5} />
    <g transform={`translate(0 ${-28 + 56 * down})`}>
      <rect x={-34} y={-30} width={68} height={60} rx={10} fill={down > 0.5 ? '#9A9AA8' : '#FF8A3D'} stroke="#1E1A22" strokeWidth={5} />
    </g>
    <Glow x={0} y={60} r={140} kind="cool" o={0.35 * glow} />
  </g>
);
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const press = kf(t, [[0, 0], [30, 0], [40, 0.18], [62, 0.2], [72, 0]], easeInOut);
  const tremble = Math.sin(t * 1.7) * 3;
  const hand = { x: kf(t, [[0, 1500], [20, 1080], [36, 1010], [62, 1010], [78, 1160], [len, 1180]], easeOut) + tremble, y: kf(t, [[0, 1100], [20, 560], [36, 520], [62, 520], [78, 620], [len, 640]], easeOut) };
  const H = LOOKS.hero;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-800 -1100) scale(2.4)"><Rooftop t={t + 900} sunX={700} sunY={560} cityLit={2.6} /></g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050712" opacity={0.35} />
      <PowerSwitch x={900} y={560} s={2.3} down={1 - press} />
      <g filter="url(#rimL)">
        <path d={`M ${hand.x + 40} ${hand.y + 20} L ${hand.x + 420} ${hand.y + 420}`} stroke={H.line} strokeWidth={120} strokeLinecap="round" />
        <path d={`M ${hand.x + 40} ${hand.y + 20} L ${hand.x + 420} ${hand.y + 420}`} stroke={H.limb} strokeWidth={100} strokeLinecap="round" />
        <path d={`M ${hand.x + 300} ${hand.y + 300} L ${hand.x + 520} ${hand.y + 520}`} stroke={H.sleeve} strokeWidth={150} strokeLinecap="round" />
        <g transform={`translate(${hand.x} ${hand.y}) rotate(-40) scale(5)`}>
          <rect x={-4} y={-34} width={8} height={26} rx={4} fill={H.hand} stroke={H.line} strokeWidth={2.2} />
          <path d="M -11 2 Q -14 -14 -6 -18 L 7 -18 Q 14 -14 11 2 Q 8 16 0 16 Q -8 16 -11 2 Z" fill={H.hand} stroke={H.line} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
};

// ---------- S11: low angle: you look into the sun; everything dies at once; your eyes in the black. "twelve" @76 ----------
const OUT = 90;
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const dead = t >= OUT;
  const black = clamp((t - OUT - 6) / 8);
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 840, y: 800, scale: 1.9, yaw: 0.3, look: 0.7, armL: { a: 16, b: 6 }, armR: { a: 16, b: 6 } } },
    { f: 60, p: { look: 1, headTilt: -6 } },
    { f: OUT, p: { headTilt: -2, look: 0.2, yaw: 0.05 }, ease: easeOut },
  ]);
  const head = toWorld(pose, joints(pose).head);
  return (
    <g transform={camT(kf(t, [[0, 940], [OUT, 900]]), kf(t, [[0, 540], [OUT, 470]]), kf(t, [[0, 1.0], [OUT, 1.3]], easeInOut))}>
      <Rooftop t={t + 1000} sunX={1180} sunY={480} low={260} cityLit={2.6} lightsOut={dead ? 1 : 0} blackout={dead ? 1 : 0} red={dead ? 0.6 : 0} />
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'neutral'], [OUT, 'cool']]) }, dead ? 1 : 0.8)} rimId="rimR" shadow={0} />
      <rect x={-400} y={-400} width={2720} height={1900} fill="#000" opacity={black} />
      {black > 0 ? (
        <g opacity={clamp(1 - (t - 128) / 12)}>
          <Glow x={head.x - 26 * pose.scale} y={head.y - 4 * pose.scale} r={50} kind="cool" o={0.9 * black} />
          <Glow x={head.x + 26 * pose.scale} y={head.y - 4 * pose.scale} r={50} kind="cool" o={0.9 * black} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S12: the end card on black: what would you do? the two choices, then THE END. "Tell" @2 ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <rect x={-200} y={-200} width={2320} height={1480} fill="#07060C" />
    <text x={960} y={300} textAnchor="middle" fontFamily={FONT.hand} fontSize={110} fill="#FFE27A" opacity={clamp(t / 6)}>
      what would you do?
    </text>
    {[
      ['FLIP IT BACK ON', 560, 6, '#FF8A3D'],
      ['KEEP IT', 1360, 14, ICE],
    ].map(([txt, x, d, col]) => {
      const k = easeOut(clamp((t - (d as number)) / 7));
      return (
        <g key={txt as string} opacity={k} transform={`translate(${x} 560) scale(${0.8 + 0.2 * k})`}>
          <rect x={-300} y={-80} width={600} height={160} rx={30} fill="none" stroke={col as string} strokeWidth={7} />
          <text x={0} y={24} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={66} fill={col as string}>{txt}</text>
        </g>
      );
    })}
    <text x={960} y={570} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={54} fill="#8A8496" opacity={clamp((t - 18) / 6)}>or</text>
    <text x={960} y={880} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={64} letterSpacing={14} fill="#F6EFE3" opacity={clamp((t - 44) / 10)}>
      THE END
    </text>
  </g>
);
