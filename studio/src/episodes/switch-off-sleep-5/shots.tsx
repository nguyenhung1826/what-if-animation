import React from 'react';
import {
  BrainOutline, BrainCells, NeedleDial, ramp, Night, Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, Bedroom, BedDuvet, bedSit, LAMP, CAL, Kitchen,
  Tabletop, LightVeil, AlarmClock, WallCalendar, calendarDay, Phone, Schematic, SCH, SchLabel, CountUp, DrawOn, Tag,
  Glow, FONT, ShotProps,
} from '../../engine';
import { CloseUp } from '../switch-off-sleep-1/shots';

// "What if you could switch off sleep?" Chapter 5: the twist, the real cost. Sixteen shots: the dark bedroom (the lamp
// and its switch, the wall calendar, the phone on the nightstand), four schematic cards for the science (the brain's
// wash, +60% in mice, no wash, a reaction-test dial), and day six in close: the shaking pour, the sliding words, and
// you looking straight at us. The power stays on: the hero's eyes glow ice blue (faceGlow + glint, as in chapter 1).

const GLOW = { ...LOOKS.hero, faceGlow: true };
const ICE = '#9FE4FF';
const on = (p: Pose, g = 0.9): Pose => ({ ...p, glint: g, glintColor: ICE });
const SIT = bedSit(0.2);
const HAND = LOOKS.hero;

// the dark bedroom behind a close-up (as chapter 1 S5)
const DarkRoom: React.FC<{ t: number; id: string; dx?: number; dy?: number }> = ({ t, id, dx = -700, dy = -560 }) => (
  <g transform={`translate(${dx} ${dy}) scale(2.2)`}>
    <Bedroom t={t} id={id} clock="2:47" lamp={0} veil={0.7} crossed={6} />
    <Night o={0.5} />
  </g>
);

// a wall in the dark bedroom with the calendar on it (inserts)
const CalWall: React.FC<{ crossed: number; drawing?: number; w?: number }> = ({ crossed, drawing = 0, w = 600 }) => (
  <g>
    <rect x={-1000} y={-1000} width={4000} height={3000} fill="#2E3352" />
    <rect x={-1000} y={-1000} width={4000} height={3000} fill="url(#g3cool)" opacity={0.12} />
    <Glow x={1500} y={200} r={900} kind="cool" o={0.22} />
    <WallCalendar x={960} y={150} w={w} crossed={crossed} drawing={drawing} />
    <Night o={0.35} />
  </g>
);

// ---------- S1: wide, the dark bedroom: you sit on the bed, eyes glowing, and look at the lamp's switch ----------
// "catch" @12, "The switch" @43-48
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SIT, yaw: 0.1, look: 0, armL: { a: 30, b: 30 }, armR: { a: 30, b: 30 }, headTilt: -2 } },
    { f: 30, p: {} },
    { f: 42, p: { yaw: 0.6, look: 0.9, headTilt: 6 }, ease: easeOut },
    { f: 70, p: { headTilt: 10, tilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 860]], easeInOut), kf(t, [[0, 540], [len, 500]], easeInOut), kf(t, [[0, 1.3], [len, 1.9]], easeInOut))}>
      <Bedroom t={t + 100} id="b51" clock="2:47" lamp={0} veil={0.7} duvet={false} crossed={3} />
      <Night o={0.4} />
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'neutral'], [44, 'worried']]) })} shadow={0} rimId="rimR" />
      <BedDuvet knees={0.6} />
      <Glow x={LAMP.x} y={LAMP.y + 80} r={120} kind="cool" o={0.25 * clamp((t - 40) / 10)} />
    </g>
  );
};

// ---------- S2: insert, the lamp's switch on its cord: OFF ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1085, 760, kf(t, [[0, 1.0], [len, 1.35]], easeInOut))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#141626" />
    <polygon points="-400,700 2400,700 2400,1500 -400,1500" fill="#262634" />
    <rect x={-400} y={700} width={2800} height={8} fill="#3A3A4C" />
    <ellipse cx={640} cy={690} rx={170} ry={34} fill="#221A20" />
    <rect x={622} y={260} width={36} height={430} fill="#2A2026" />
    <path d="M 430 60 L 850 60 L 930 290 L 350 290 Z" fill="#4A4250" />
    <path d="M 790 690 Q 900 700 1000 760 L 1300 800 Q 1500 830 2400 820" stroke="#1E1A22" strokeWidth={14} fill="none" />
    <g transform="translate(1085 770) rotate(6) scale(1.3)">
      <rect x={-90} y={-40} width={180} height={80} rx={30} fill="#E8E2D6" stroke="#1E1A22" strokeWidth={6} />
      <g transform="rotate(12)">
        <rect x={-46} y={-30} width={92} height={42} rx={14} fill="#9A9AA8" stroke="#1E1A22" strokeWidth={5} />
      </g>
      <text x={0} y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#9FE4FF" opacity={0.85}>OFF</text>
    </g>
    {/* the blue of your eyes catching the switch from off screen */}
    <Glow x={1240} y={660} r={420} kind="cool" o={0.3 + 0.08 * Math.sin(t / 9)} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A1030" opacity={0.35} style={{ mixBlendMode: 'multiply' }} />
  </g>
);

// ---------- S3-S5: the wall calendar, one red X a day: 4, 5, 6 ("four"/"five"/"six" @10) ----------
const dayX = (t: number) => clamp((t - 11) / 12);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const d = calendarDay(960, 150, 600, 4);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, d.x]]), kf(t, [[0, 420], [len, d.y]]), kf(t, [[0, 1.15], [len, 1.3]]))}>
      <CalWall crossed={3} drawing={dayX(t)} />
    </g>
  );
};
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const d = calendarDay(960, 150, 600, 5);
  return (
    <g transform={`rotate(-6 960 540)`}>
      <g transform={camT(d.x, d.y, kf(t, [[0, 1.9], [len, 2.1]]))}>
        <CalWall crossed={4} drawing={dayX(t)} />
      </g>
    </g>
  );
};
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const d = calendarDay(960, 150, 600, 6);
  return (
    <g transform={`rotate(5 960 540)`}>
      <g transform={camT(d.x, d.y, kf(t, [[0, 3.2], [len, 3.5]]))}>
        <CalWall crossed={5} drawing={dayX(t)} />
      </g>
    </g>
  );
};

// ---------- S6: schematic, the brain's wash: the gaps open and fluid carries the waste out ----------
// "cells" @83, "open up" @98-112, "fluid" @130, "washes out" @147-161, "waste" @188
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const lens = ramp(t, 40, 14);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="sc51" />
      <BrainOutline x={560} y={520} s={0.85} t={t} />
      <SchLabel x={560} y={860} t={t - 10} text="YOUR BRAIN, ASLEEP" size={40} color={SCH.dim} />
      {lens > 0 ? <path d={`M 700 400 L ${700 + (1060 - 700) * lens} ${400 + (340 - 400) * lens}`} stroke={SCH.dim} strokeWidth={4} strokeDasharray="12 10" /> : null}
      <circle cx={700} cy={400} r={30} fill="none" stroke={SCH.live} strokeWidth={5} opacity={lens} />
      <BrainCells x={1350} y={540} r={300} t={t} id="bc6" o={ramp(t, 46, 10)} gap={ramp(t, 98, 22)} flow={ramp(t, 128, 14)} waste={0.6} />
      <SchLabel x={1350} y={180} t={t - 60} text="BRAIN CELLS" size={44} />
      <SchLabel x={1350} y={940} t={t - 132} text="FLUID WASHES OUT WASTE" size={40} color="#5AC8FF" />
    </g>
  );
};

// ---------- S7: schematic, awake vs asleep: the gaps grow about 60% (in mice) ----------
// "mice" @8, "sixty percent" @67-83, "That's real" @112-121
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.04], [len, 1.0]]))}>
    <Schematic t={t + 240} id="sc52" />
    <BrainCells x={560} y={500} r={250} t={t} id="bc7a" gap={0} waste={0.4} label="AWAKE" o={ramp(t, 0, 8)} />
    <BrainCells x={1360} y={500} r={250} t={t} id="bc7b" gap={ramp(t, 30, 20)} flow={0.8} waste={0.4} label="ASLEEP" o={ramp(t, 4, 8)} />
    <CountUp x={960} y={900} t={t - 64} to={60} dur={22} size={150} format={(v) => `+${Math.round(v)}%`} />
    <SchLabel x={960} y={985} t={t - 86} text="MORE SPACE BETWEEN CELLS" size={36} color={SCH.dim} />
    <SchLabel x={960} y={120} t={t - 6} text="(IN MICE)" size={44} color={SCH.dim} />
    <Tag x={1560} y={880} t={t - 118} text="REAL" mark="check" markT={6} />
  </g>
);

// ---------- S8: schematic, no sleep, no wash: the gaps close, the flow stops, the waste piles up ----------
// "No sleep" @2-9, "no wash" @27-34, "The waste" @59-64, "stays" @110
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1 - ramp(t, 4, 18);
  const flow = 1 - ramp(t, 26, 12);
  const waste = ramp(t, 50, 80);
  const flick = t > 126 && t < 140 && Math.floor(t / 2) % 2 === 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.22]], easeInOut))}>
      <Schematic t={t + 400} id="sc53" />
      <g transform={flick ? 'translate(8 -4)' : undefined} opacity={flick ? 0.75 : 1}>
        <BrainCells x={960} y={520} r={320} t={t} id="bc8" gap={g} flow={flow} waste={0.4 + 0.6 * waste} label="NO SLEEP" />
      </g>
      <SchLabel x={960} y={960} t={t - 30} text="NO WASH" size={60} color={SCH.live} />
      {flick ? <rect x={-200} y={-200} width={2400} height={1500} fill="#FF5A4A" opacity={0.08} /> : null}
    </g>
  );
};

// ---------- S9: schematic, a reaction-test dial: a day awake sends the needle past the legal limit ----------
// "a day awake" @25-33, "reactions test" @57-79, "too drunk" @129-139, "drive" @163, "That's real too" @191-206
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const hours = 24 * easeOut(clamp((t - 10) / 30));
  const p = kf(t, [[0, 0.08], [50, 0.1], [140, 0.8], [150, 0.76], [len, 0.78]], easeInOut) + (t > 140 ? Math.sin(t * 1.3) * 0.006 : 0);
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 580]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t + 600} id="sc54" />
      <SchLabel x={960} y={150} t={t - 50} text="REACTION TEST" size={54} />
      <NeedleDial x={960} y={760} r={400} p={p} red={0.66} redLabel="DRUNK DRIVING LIMIT" left="RESTED" right="DRUNK" flash={ramp(t, 128, 6)} t={t} />
      <g transform="translate(260 300)">
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} letterSpacing={2}>HOURS AWAKE</text>
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT.ui} fontSize={120} fill={SCH.line} opacity={clamp((t - 6) / 6)}>{Math.round(hours)}</text>
      </g>
      <Tag x={1640} y={300} t={t - 196} text="REAL" mark="check" markT={6} />
    </g>
  );
};

// ---------- S10: close-up, day six: tired lids, the eyes still glowing ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CloseUp t={t} len={len} glint={1} rim="rimL" x={1040}
      face={{ ...faceAt(t, [[0, 'tired']]), blink: t > 28 && t < 34 ? 0.6 : 0 }}
      p={{ headTilt: 6 + Math.sin(t / 7) * 1.5, yaw: 0.25, tilt: 2 }}
      bg={<g transform="translate(-800 -500) scale(2.2)"><Kitchen t={t + 50} id="k510" veil={0.7} tint="night" tintO={0.55} /></g>} />
    <text x={300} y={260} fontFamily={FONT.hand} fontSize={110} fill="#FF7A6A" opacity={clamp((t - 8) / 6)} transform="rotate(-6 300 260)">DAY 6</text>
  </g>
);

// ---------- S11: insert, your hand shakes as it pours cereal; flakes miss the bowl ----------
// "shake" @20, "cereal" @45
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const sh = { x: Math.sin(t * 2.3) * 9 + Math.sin(t * 5.1) * 4, r: Math.sin(t * 1.7) * 3 };
  const tilt = kf(t, [[0, 0], [10, 1]], easeOut);
  const flakes = Array.from({ length: 22 }).map((_, i) => {
    const t0 = 8 + i * 3;
    const k = (t - t0) / 14;
    if (k < 0) return null;
    const miss = i % 3 === 1 ? (i % 2 ? 1 : -1) * (110 + (i * 37) % 80) : ((i * 53) % 120) - 60;
    const x = 1010 + sh.x * 0.6 + miss * Math.min(1, k);
    const y = Math.min(500 + 520 * k * k, miss > 100 || miss < -100 ? 930 : 690 + ((i * 17) % 30));
    return <ellipse key={i} cx={x} cy={y} rx={18} ry={11} fill="#E8B04A" stroke="#7A5420" strokeWidth={4} transform={`rotate(${i * 47} ${x} ${y})`} />;
  });
  return (
    <g transform={camT(980, 620, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#1A1C2C" />
      <rect x={-200} y={880} width={2400} height={500} fill="#3A3442" />
      <rect x={-200} y={880} width={2400} height={8} fill="#5A5266" />
      <Glow x={1500} y={150} r={900} kind="cool" o={0.25} />
      {/* the bowl */}
      <path d="M 820 720 Q 830 920 1000 930 Q 1170 920 1180 720 Z" fill="#E8E2D6" stroke="#1E1A22" strokeWidth={6} />
      <ellipse cx={1000} cy={720} rx={180} ry={30} fill="#C8C0B0" stroke="#1E1A22" strokeWidth={6} />
      <ellipse cx={1000} cy={722} rx={150} ry={20} fill="#E8B04A" />
      {flakes}
      {/* the box in your shaking hand: the arm comes in from the left, the box tips its top down to the right */}
      <path d={`M -200 ${120 + sh.x * 0.3} L ${700 + sh.x} ${300}`} stroke={HAND.line} strokeWidth={118} strokeLinecap="round" />
      <path d={`M -200 ${120 + sh.x * 0.3} L ${700 + sh.x} ${300}`} stroke={HAND.limb} strokeWidth={100} strokeLinecap="round" />
      <path d={`M -200 ${120 + sh.x * 0.3} L ${300 + sh.x * 0.5} ${220}`} stroke={HAND.sleeve} strokeWidth={150} strokeLinecap="round" />
      <g transform={`translate(${860 + sh.x} ${300}) rotate(${115 * tilt + sh.r})`}>
        <rect x={-120} y={-200} width={240} height={360} rx={10} fill="#D9534F" stroke="#1E1A22" strokeWidth={6} />
        <rect x={-90} y={-130} width={180} height={110} rx={10} fill="#F6EFE3" />
        <text x={0} y={-58} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#D9534F">O's</text>
      </g>
      <ellipse cx={720 + sh.x} cy={300} rx={70} ry={90} fill={HAND.hand} stroke={HAND.line} strokeWidth={8} />
      <Night o={0.3} />
    </g>
  );
};

// ---------- S12: top-down, the open book: the words slide around; one line highlighted again and again ----------
// "slide around" @35-47, "You keep reading the same line" @71-108
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const drift = 0.3 + clamp((t - 30) / 40);
  const lines = Array.from({ length: 9 }).map((_, j) => j);
  const hl = t > 64 ? ((t - 64) % 34) / 30 : 0; // the highlight runs along line 3 and jumps back
  const page = (x0: number, side: number) =>
    lines.map((j) => {
      const y = 330 + j * 62;
      return Array.from({ length: 5 }).map((_, i) => {
        const w = 60 + ((i * 37 + j * 23 + side * 11) % 70);
        const x = x0 + i * 120 + Math.sin(t / 9 + i * 1.7 + j + side) * 18 * drift;
        const dy = Math.cos(t / 11 + i + j * 2.1) * 8 * drift;
        return <rect key={`${side}-${j}-${i}`} x={x} y={y + dy} width={w} height={20} rx={10} fill="#4A4438" opacity={0.85} />;
      });
    });
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.02}) scale(${1.05 + t * 0.0015}) translate(-960 -540)`}>
      <Tabletop edge={1400} />
      <LightVeil id="s12veil" lights={[[1500, 120, 900]]} o={0.6} />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0A1030" opacity={0.35} style={{ mixBlendMode: 'multiply' }} />
      <rect x={300} y={240} width={1320} height={680} rx={14} fill="#3A4A6A" />
      <rect x={320} y={250} width={630} height={650} rx={8} fill="#EFE6D2" />
      <rect x={970} y={250} width={630} height={650} rx={8} fill="#F7F0E0" />
      <rect x={950} y={250} width={20} height={650} fill="#C8BCA4" />
      {t > 64 ? <rect x={370} y={330 + 3 * 62 - 10} width={560 * clamp(hl)} height={40} rx={8} fill="#FFE27A" opacity={0.75} /> : null}
      {page(370, 0)}
      {page(1020, 1)}
      <Glow x={1500} y={160} r={600} o={0.3} />
    </g>
  );
};

// ---------- S13: close-up, you turn and look straight at us: you feel fine; the scary part ----------
// "fine" @52, "That's the scary part" @91-116
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 520, kf(t, [[0, 1.0], [86, 1.0], [len, 1.18]], easeInOut))}>
    <CloseUp t={t} len={len} glint={1} rim="rimBlueL"
      face={{ ...faceAt(t, [[0, 'tired'], [16, 'neutral']]), blink: t > 120 && t < 125 ? 1 : 0 }}
      p={{ yaw: kf(t, [[0, 0.5], [10, 0.5], [22, 0]], easeOut), look: kf(t, [[0, 0.6], [22, 0]], easeOut), headTilt: kf(t, [[0, 6], [22, 0]], easeOut) }}
      bg={<DarkRoom t={t + 300} id="b513" />} />
  </g>
);

// ---------- S14: the calendar, six days crossed; a red circle round day 11: the longest ever watched ----------
// "watched" @55, "About eleven days" @128-149
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const d = calendarDay(960, 150, 600, 11);
  const ring = clamp((t - 134) / 18);
  const r = d.r * 1.7;
  return (
    <g transform={camT(kf(t, [[0, 960], [110, 960], [150, d.x]], easeInOut), kf(t, [[0, 470], [110, 470], [150, d.y + 40]], easeInOut), kf(t, [[0, 1.05], [110, 1.15], [150, 2.0], [len, 2.1]], easeInOut))}>
      <CalWall crossed={6} />
      {ring > 0 ? (
        <path d={`M ${d.x + r} ${d.y} A ${r} ${r * 0.85} 0 1 1 ${d.x + r * 0.98} ${d.y - 12}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(ring)} stroke="#D93A3A" strokeWidth={9} fill="none" strokeLinecap="round" />
      ) : null}
      {t > 60 ? (
        <text x={1310} y={330} fontFamily={FONT.hand} fontSize={58} fill="#FFE27A" opacity={clamp((t - 60) / 8)} transform="rotate(-5 1310 330)">LONGEST EVER</text>
      ) : null}
      {t > 70 ? (
        <text x={1310} y={400} fontFamily={FONT.hand} fontSize={58} fill="#FFE27A" opacity={clamp((t - 70) / 8)} transform="rotate(-5 1310 400)">WATCHED</text>
      ) : null}
      {t > 150 ? (
        <text x={d.x + 70} y={d.y + 100} fontFamily={FONT.hand} fontSize={30} fill="#D93A3A" opacity={clamp((t - 150) / 6)}>~11 DAYS</text>
      ) : null}
    </g>
  );
};

// ---------- S15: insert, your phone lights up on the nightstand, buzzing: UNKNOWN ----------
// "rings" @19, "Unknown number" @37-48
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const ringing = t > 10;
  const buzz = ringing ? (Math.floor((t - 10) / 24) % 2 === 0 ? 1 : 0) : 0;
  return (
    <g transform={camT(980, 600, kf(t, [[0, 1.0], [len, 1.2]], easeInOut))}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#141626" />
      <polygon points="-200,760 2400,760 2400,1500 -200,1500" fill="#262634" />
      <rect x={-200} y={760} width={2400} height={8} fill="#3A3A4C" />
      <AlarmClock x={560} y={790} s={1.8} text="2:47" />
      <Glow x={560} y={660} r={300} kind="red" o={0.2} />
      <Phone x={1060} y={560} w={300} rot={-8} on={ringing ? 1 : 0} buzz={buzz} f={t} caller="UNKNOWN" />
      <Glow x={1060} y={560} r={600} kind="cool" o={ringing ? 0.35 : 0} />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0A1030" opacity={0.3} style={{ mixBlendMode: 'multiply' }} />
    </g>
  );
};

// ---------- S16: close-up, you in the dark, lit blue by the phone: someone knows ----------
// "kid who never sleeps" @26-43
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = Math.floor(t / 24) % 2 === 0 ? 1 : 0.6;
  return (
    <g transform={camT(990, 540, kf(t, [[0, 1.0], [len, 1.12]], easeInOut))}>
      <CloseUp t={t} len={len} glint={1} rim="rimBlueL" x={1000}
        face={faceAt(t, [[0, 'neutral'], [8, 'worried'], [44, 'shock'], [56, 'worried']])}
        p={{ yaw: 0.35, look: 0.7, headTilt: kf(t, [[0, 8], [40, 10], [50, 2]]) }}
        bg={<DarkRoom t={t + 500} id="b516" dx={-1000} dy={-640} />} />
      <Glow x={1500} y={1000} r={700} kind="cool" o={0.3 * pulse} />
    </g>
  );
};
