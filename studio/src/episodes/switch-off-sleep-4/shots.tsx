import React from 'react';
import {
  EnergyCan, Chalk, MO_BOMBER, TEACHER_TWEED, Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, easeInOut, settle, camT, LOOKS, LEG_LEN, tone, reachAngle,
  Classroom, SchoolDesk, Kid, Stairwell, Banister, hipGround, stepTop, walkPose, walkPhase, Tabletop, Paper, WallCalendar,
  Schematic, SCH, SchLabel, Tag, FloatLabel, DizzyStars, Glow, LightVeil, Foreground, FONT, ShotProps, Look,
} from '../../engine';
import { CloseUp } from '../switch-off-sleep-1/shots';

// "What if you could switch off sleep?" Chapter 4: the first crack. Classroom (S1-S10, plus a calendar insert) and the
// stairwell (S11-S15), then a schematic for the science. The power is still on: the hero's eyes glow (faceGlow + ice
// glint) until the microsleep, where the glow flickers out.

const GLOW = { ...LOOKS.hero, faceGlow: true };
const ICE = '#9FE4FF';
const on = (p: Pose, g = 0.9): Pose => ({ ...p, glint: g, glintColor: ICE });

const DESK = 1000; // the hero's desk (ch1 S6 pattern)
const MODESK = 1420;
const SEAT = (x: number): Partial<Pose> => ({ x, y: 760, yaw: 0, look: 0, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } });

// a board full of solved formulas (S1)
const SolvedBoard: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {['2x + 5 = 17   x = 6', 'a² + b² = c²', '√144 = 12', '3/4 = 0.75'].map((s, i) => (
      <g key={i}>
        <Chalk x={450} y={250 + i * 72} text={s} size={44} p={1} id={`sb${i}`} />
        {t > 6 + i * 6 ? <path d={`M ${880} ${240 + i * 72} l 14 14 l 28 -30`} stroke="#9FE07A" strokeWidth={7} fill="none" strokeLinecap="round" /> : null}
      </g>
    ))}
  </g>
);

// today's question and your (yesterday's) answer (S9, S10)
const QBoard: React.FC<{ write: number; x?: boolean; t?: number }> = ({ write, x = false, t = 0 }) => (
  <g>
    <text x={450} y={250} fontFamily={FONT.hand} fontSize={40} fill="#F2F0E6" opacity={0.9}>TODAY: Name the capital of Canada.</text>
    <Chalk x={520} y={380} text="x = 7" size={84} p={write} id="qb1" color="#FFE27A" />
    {x ? (
      <g stroke="#E0463A" strokeWidth={14} strokeLinecap="round">
        <path d={`M 500 300 L ${500 + 280 * clamp(t / 4)} ${300 + 120 * clamp(t / 4)}`} />
        {t > 4 ? <path d={`M 780 300 L ${780 - 280 * clamp((t - 4) / 4)} ${300 + 120 * clamp((t - 4) / 4)}`} /> : null}
      </g>
    ) : null}
    {x && t > 10 ? <text x={450} y={500} fontFamily={FONT.hand} fontSize={38} fill="#E0463A" transform="rotate(-4 450 500)">(that was YESTERDAY)</text> : null}
  </g>
);

const Room: React.FC<{ t: number; id: string; board?: React.ReactNode; laugh?: number }> = ({ t, id, board, laugh = 0 }) => (
  <Classroom t={t} id={id} board={board} laugh={laugh} />
);

// ---------- S1: wide, the class at dusk: a board of solved formulas, you at your desk, hand up ----------
// unbeatable @37
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT(DESK), yaw: -0.2, look: -0.3 } },
    { f: 20, p: {} },
    { f: 28, p: { armL: { a: 160, b: -14 }, sway: 8 }, ease: easeOut },
    { f: 34, p: { armL: { a: 152, b: -10 }, sway: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 1000]]), kf(t, [[0, 520], [len, 510]]), kf(t, [[0, 1.25], [len, 1.4]], easeInOut))}>
      <Room t={t} id="c4s1" board={<SolvedBoard t={t} />} />
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'happy'], [30, 'smug']]) })} shadow={0} rimId="rimL" />
      <SchoolDesk x={DESK} />
    </g>
  );
};

// ---------- S2: top-down, quiz papers slap down, each stamped A+ ----------
// question @16, Every @40, quiz @52
export const S2: React.FC<ShotProps> = ({ t }) => {
  const sheets = [{ t0: 2, x: 700, r: -6 }, { t0: 16, x: 1000, r: 4 }, { t0: 38, x: 1260, r: -3 }, { t0: 52, x: 960, r: 2 }];
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.03}) scale(${1.02 + t * 0.002}) translate(-960 -540)`}>
      <Tabletop edge={1400} />
      <LightVeil id="c4s2" lights={[[300, 100, 900]]} o={0.4} />
      {sheets.map((s, i) => {
        const k = easeOut(clamp((t - s.t0) / 5));
        if (k <= 0) return null;
        const stamp = clamp((t - s.t0 - 6) / 4);
        return (
          <g key={i} transform={`translate(0 ${(1 - k) * -700})`}>
            <Paper x={s.x} y={560} w={360} rot={s.r} done grade="" />
            <text x={s.x} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#3A3444" transform={`rotate(${s.r} ${s.x} 560)`}>QUIZ {i + 1}</text>
            {stamp > 0 ? (
              <text x={s.x + 90} y={470} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110 * (1.4 - 0.4 * stamp)} fill="#D93A3A" opacity={stamp} transform={`rotate(${-12 + s.r} ${s.x + 90} 470)`}>A+</text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------- S3: medium two-shot, Mo slumped on his desk; you upright, glowing ----------
// awake @66
const MO_SLUMP: Partial<Pose> = { ...SEAT(MODESK), y: 800, yaw: -0.3, tilt: -6, headTilt: -30, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 }, squash: 0.08, expr: 'tired', blink: 0.55 };
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const hero = poseAt(t, [
    { f: 0, p: { ...SEAT(DESK), yaw: 0.35, look: 0.6 } },
    { f: 50, p: {} },
    { f: 60, p: { headTilt: 6, look: 0.8 } },
  ]);
  const mo = { ...basePose, ...MO_SLUMP, headTilt: -26 + Math.sin(t / 9) * 3, blink: t % 50 > 40 ? 1 : 0.6 } as Pose;
  return (
    <g transform={camT(kf(t, [[0, 1200], [len, 1215]]), 560, kf(t, [[0, 1.75], [len, 1.85]]))}>
      <Room t={t + 90} id="c4s3" board={<SolvedBoard t={99} />} />
      <Hero look={MO_BOMBER} pose={mo} shadow={0} rimId="rimL" />
      <SchoolDesk x={MODESK} />
      <EnergyCan x={MODESK + 110} y={752} s={0.55} />
      <EnergyCan x={MODESK + 150} y={752} s={0.55} color="#E0463A" rot={6} />
      <Hero look={GLOW} pose={on({ ...hero, ...faceAt(t, [[0, 'happy'], [62, 'smug']]) })} shadow={0} rimId="rimL" />
      <SchoolDesk x={DESK} />
    </g>
  );
};

// ---------- S4: insert, Mo's desk: two cans, his hand drags in the third ----------
// third @26, drink @55
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 14) / 12));
  const lift = easeOut(clamp((t - 50) / 10));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#3A3040" />
      <rect x={0} y={0} width={1920} height={700} fill="#4A3E4E" />
      <Glow x={300} y={200} r={800} o={0.45} />
      <rect x={0} y={720} width={1920} height={360} fill="#8A6452" />
      <rect x={0} y={720} width={1920} height={6} fill="#C99B7A" />
      <EnergyCan x={620} y={800} s={2.2} rot={-4} />
      <EnergyCan x={900} y={800} s={2.2} color="#E0463A" rot={3} />
      <g transform={`translate(${(1 - k) * 700} ${-lift * 120})`}>
        <EnergyCan x={1200} y={800} s={2.2} color="#3E7AD0" rot={-lift * 30} />
        <ellipse cx={1330} cy={680} rx={90} ry={120} fill={MO_BOMBER.hand} stroke={MO_BOMBER.line} strokeWidth={8} transform="rotate(-20 1330 680)" />
        <path d="M 1380 720 L 1980 620 L 1980 840 L 1380 790 Z" fill={MO_BOMBER.jacket} />
      </g>
      {t > 26 ? <Tag x={1500} y={240} t={t - 26} text="3" /> : null}
    </g>
  );
};

// ---------- S5: medium, you, an empty desk, a cool shrug: 0 ----------
// zero @17
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT(DESK), yaw: 0.1 } },
    { f: 8, p: { armL: { a: 40, b: -70 }, armR: { a: 40, b: -70 }, headTilt: -6 }, ease: easeOut },
    { f: 30, p: { armL: { a: 36, b: -64 }, armR: { a: 36, b: -64 } } },
  ]);
  return (
    <g transform={camT(DESK, kf(t, [[0, 500], [len, 490]]), kf(t, [[0, 2.3], [len, 2.45]]))}>
      <Room t={t + 180} id="c4s5" board={<SolvedBoard t={99} />} />
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'happy'], [10, 'cool']]) }, 1)} shadow={0} rimId="rimL" />
      <SchoolDesk x={DESK} />
      {t > 14 ? <Tag x={DESK - 300} y={400} t={t - 14} text="0" mark="check" markT={6} /> : null}
    </g>
  );
};

// ---------- S6: over the teacher's shoulder: the teacher points, the kids turn, you answer, smug ----------
// calling @24, right @77
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const hero = poseAt(t, [
    { f: 0, p: { ...SEAT(1300), yaw: -0.2, look: -0.4 } },
    { f: 30, p: { armL: { a: 150, b: -12 } }, ease: easeOut },
    { f: 70, p: { armL: { a: 150, b: -12 } } },
    { f: 80, p: { armL: { a: 14, b: -6 }, headTilt: -6 } },
  ]);
  const turn = clamp((t - 20) / 8);
  const tp0: Pose = { ...basePose, x: 640, y: 720 - LEG_LEN * 0.8, scale: 0.8, yaw: 0.6, look: 0.7, headTilt: 4, ...faceAt(t, [[0, 'neutral'], [80, 'happy']]) };
  const tp: Pose = { ...tp0, armR: { a: kf(t, [[0, 14], [24, reachAngle(tp0, { x: 1300, y: 560 })]], easeOut), b: 0 }, handR: 'point' };
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 1000]]), 540, kf(t, [[0, 1.4], [len, 1.48]]))}>
      <Room t={t + 240} id="c4s6" board={<SolvedBoard t={99} />} />
      <Hero look={TEACHER_TWEED} pose={tp} shadow={0.4} rimId="rimL" />
      <Hero look={GLOW} pose={on({ ...hero, ...faceAt(t, [[0, 'neutral'], [40, 'happy'], [78, 'smug']]) })} shadow={0} rimId="rimL" />
      <SchoolDesk x={1300} />
      <Kid x={820} y={1000} s={1.6} look={{ hair: 'pony', hairC: '#2A1C18', top: '#6A8A9A' }} turn={turn} />
      {t > 79 ? <FloatLabel x={1300} y={300} t={t - 79} text="CORRECT" color="#9FE07A" size={60} /> : null}
    </g>
  );
};

// ---------- S7: insert, the wall calendar: day 3 gets its red cross ----------
// three @11
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#2E3046" />
    <Glow x={1500} y={200} r={900} o={0.35} />
    <WallCalendar x={960} y={150} w={560} crossed={2} drawing={clamp((t - 4) / 10)} rot={-2} />
    <text x={300} y={300} fontFamily={FONT.hand} fontSize={130} fill="#FFE27A" opacity={clamp((t - 8) / 6)} transform="rotate(-6 300 300)">DAY 3</text>
  </g>
);

// ---------- S8: close-up, you: one slow heavy blink, the glow flickers ----------
// slipping @22
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const blink = kf(t, [[0, 0], [10, 0], [22, 1], [34, 1], [44, 0]], easeInOut);
  const g = t > 30 && t < 42 ? (Math.floor(t / 2) % 2 ? 0.2 : 0.9) : 0.9;
  return (
    <CloseUp t={t} len={len} glint={g} rim="rimL"
      face={{ ...faceAt(t, [[0, 'neutral'], [40, 'worried']]), blink }}
      p={{ headTilt: kf(t, [[0, 0], [22, 8], [44, 2]], easeInOut) }}
      bg={<g transform="translate(-590 -452) scale(2.2)"><Classroom t={t + 300} id="c4s8" /></g>} />
  );
};

// ---------- S9: medium, you at the board writing the answer, confident ----------
// board @44, answer @92
const BOARD_POSE: Partial<Pose> = { x: 960, y: 720 - LEG_LEN * 0.8, scale: 0.8, yaw: -0.6, look: -0.6 };
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const write = clamp((t - 6) / 34);
  const scrib = t > 6 && t < 40 ? Math.sin(t * 1.4) * 6 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { ...BOARD_POSE, armL: { a: 120, b: 10 }, armR: { a: 14, b: -6 } } },
    { f: 40, p: { armL: { a: 110, b: 20 } } },
    { f: 52, p: { armL: { a: 14, b: -6 }, yaw: 0.2, look: 0.3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 850]]), 430, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Room t={t + 340} id="c4s9" board={<QBoard write={write} />} />
      <Hero look={GLOW} pose={on({ ...pose, armL: { a: pose.armL.a + scrib, b: pose.armL.b }, ...faceAt(t, [[0, 'happy'], [52, 'smug']]) })} shadow={0.4} rimId="rimL" />
    </g>
  );
};

// ---------- S10: wide, red X: that was yesterday's question; the class laughs; you, oops ----------
// yesterday's @8, question @24
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...BOARD_POSE, yaw: 0.2, look: 0.3, armL: { a: 14, b: -6 } } },
    { f: 10, p: { yaw: -0.4, look: -0.6 } },
    { f: 36, p: {} },
    { f: 46, p: { yaw: 0.1, look: 0, headTilt: -8, armR: { a: 140, b: 120 } }, ease: easeOut },
  ]);
  const sh = t > 40 && t < 48 ? Math.sin(t * 3) * 6 : 0;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]) + sh, 520, kf(t, [[0, 1.25], [len, 1.32]]))}>
      <Room t={t + 480} id="c4s10" laugh={t > 46 ? 1 : 0} board={<QBoard write={1} x t={t - 38} />} />
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'smug'], [14, 'neutral'], [40, 'shock'], [48, 'oops']]) }, 0.5)} shadow={0.4} rimId="rimL" />
    </g>
  );
};

// ---------- the stairwell walk (S11-S14) ----------
const SC = 0.9;
const X0 = 230;
const SPEED = 7.4; // px a frame: about 2 steps a second at scale 0.9
const walkX = (t: number) => X0 + SPEED * Math.min(t, 72);
const walkP = (x: number, extra: Partial<Pose> = {}): Pose => walkPose(x, walkPhase(x - X0, SC), hipGround, SC, extra);

// ---------- S11: wide, you walk down the stairs, mid-step: the world blinks (12 frames of black) ----------
// stairs @29, blinks @62; black f74-86
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const x = walkX(t);
  const after = t >= 86;
  let pose = walkP(x, { ...faceAt(t, [[0, 'neutral']]), blink: kf(t, [[0, 0], [56, 0], [72, 0.8]]) });
  if (after) pose = { ...pose, tilt: kf(t, [[86, 14], [len, 30]], easeIn), armL: { a: 70, b: 30 }, armR: { a: 60, b: 20 }, expr: 'shock', blink: 0 };
  return (
    <g>
      <g transform={camT(clamp(x + 120, 700, 1100), kf(t, [[0, 520], [len, 580]]), 1.15)}>
        <Stairwell t={t} id="c4s11" />
        <Hero look={GLOW} pose={on(pose, after ? 0 : kf(t, [[0, 0.9], [60, 0.9], [72, 0.2]]))} shadow={0.5} rimId="rimR" />
        <Banister />
      </g>
      {t >= 74 && t < 86 ? <rect x={-100} y={-100} width={2200} height={1300} fill="#000" /> : null}
    </g>
  );
};

// ---------- S12: medium, you pitch forward off the step, arms flailing ----------
// Gone @44
const FALL_X = walkX(72);
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 30);
  const flail = Math.sin(t * 0.7) * 40;
  const pose: Pose = {
    ...walkP(FALL_X + 40 * easeIn(k)),
    tilt: 30 + 28 * easeIn(k),
    armL: { a: 120 + flail, b: 30 },
    armR: { a: 120 - flail, b: 20 },
    ...faceAt(t, [[0, 'shock']]),
  };
  pose.y += 16 * easeIn(k);
  const sh = t > 28 && t < 38 ? Math.sin(t * 3.3) * 8 : 0;
  return (
    <g transform={camT(FALL_X + 60 + sh, stepTop(FALL_X) - 200, kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Stairwell t={t + 120} id="c4s12" />
      <Hero look={HERO_DARK} pose={pose} shadow={0.4} rimId="rimR" />
      <Banister />
    </g>
  );
};
const HERO_DARK = LOOKS.hero;

// ---------- S13: medium two-shot, Mo grabs you; you hang there dizzy, stars circling ----------
// catches @10, asleep @64, Standing @93
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const hx = FALL_X + 40;
  const grab = easeOut(clamp(t / 8));
  const hero: Pose = {
    ...walkP(hx),
    tilt: kf(t, [[0, 58], [10, 50], [40, 34], [len, 26]], easeOut) + settle(t - 10, 4),
    armL: { a: 40, b: 30 },
    armR: { a: 30, b: 20 },
    ...faceAt(t, [[0, 'shock'], [12, 'dizzy']]),
  };
  const moX = hx - 230 + 60 * (1 - grab);
  const mo0: Pose = { ...walkP(moX), tilt: 18, yaw: 0.6, look: 0.5, ...faceAt(t, [[0, 'shock'], [50, 'worried']]) };
  const tgt = { x: hx - 20, y: hero.y - 150 };
  const mo: Pose = { ...mo0, armR: { a: reachAngle(mo0, tgt), b: 10 }, armL: { a: reachAngle(mo0, { x: tgt.x - 10, y: tgt.y + 30 }), b: 20 } };
  return (
    <g transform={camT(hx - 80, stepTop(hx) - 230, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Stairwell t={t + 200} id="c4s13" />
      <Hero look={MO_BOMBER} pose={mo} shadow={0.4} rimId="rimR" />
      <Hero look={HERO_DARK} pose={hero} shadow={0.4} rimId="rimR" />
      <DizzyStars x={hx + 70} y={hero.y - 330} t={t - 12} rx={90} ry={34} />
      <Banister />
      {t > 64 && t < 100 ? (
        <g>
          <rect x={moX - 220} y={hero.y - 560} width={300} height={90} rx={30} fill="#F6EFE3" stroke="#14121C" strokeWidth={5} />
          <text x={moX - 70} y={hero.y - 500} textAnchor="middle" fontFamily={FONT.hand} fontSize={50} fill="#14121C">ZZZ?!</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S14: close-up, you, dazed: you don't remember any of it ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CloseUp t={t} len={len} glint={0} rim="rimR" x={1000}
      face={faceAt(t, [[0, 'dizzy'], [30, 'worried']])}
      p={{ headTilt: kf(t, [[0, 10], [30, -4], [len, -2]], easeOut), yaw: kf(t, [[0, 0.4], [30, -0.2], [60, 0.2]], easeInOut) }}
      bg={<g transform="translate(-900 -500) scale(2.0)"><Stairwell t={t + 300} id="c4s14" /></g>} />
    <g opacity={clamp(1 - t / 40)}>
      <DizzyStars x={1000} y={240} t={t + 20} rx={260} ry={60} />
    </g>
  </g>
);

// ---------- S15: close-up, you, shocked: MICROSLEEP floats up ----------
// microsleep @48
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CloseUp t={t} len={len} glint={0} rim="rimR" x={1000}
      face={faceAt(t, [[0, 'worried'], [44, 'shock']])}
      p={{ headTilt: kf(t, [[0, 0], [44, 0], [50, -6], [len, -4]], easeOut) }}
      bg={<g transform="translate(-900 -500) scale(2.0)"><Stairwell t={t + 400} id="c4s15" /></g>} />
    <rect x={0} y={0} width={1920} height={1080} fill="#2A0A30" opacity={0.25 * clamp((t - 44) / 8)} />
    <FloatLabel x={960} y={250} t={Math.min(t - 44, 12)} text="MICROSLEEP" color="#FFE27A" size={130} />
  </g>
);

// ---------- S16: schematic, a day as a bar: AWAKE runs on, then a few seconds of SLEEP cut in, uninvited; REAL ----------
// grabs @23, seconds @46, sleep @65, ask @104, first @113, That's @142
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const run = clamp(t / 100);
  const y = 520;
  const x0 = 260;
  const W = 1400;
  const gapA = 0.46;
  const gapB = 0.56;
  const shown = Math.min(run, 1);
  const cut = clamp((t - 23) / 6);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="c4s16" />
      <SchLabel x={960} y={200} t={t} text="YOUR BRAIN, AWAKE" size={52} color={SCH.dim} />
      <rect x={x0} y={y - 40} width={W * shown} height={80} rx={14} fill={SCH.live} opacity={0.9} />
      {cut > 0 ? (
        <g>
          <rect x={x0 + W * gapA} y={y - 60 * cut} width={W * (gapB - gapA)} height={120 * cut} rx={12} fill="#6A5AD0" stroke={SCH.line} strokeWidth={5} />
          <text x={x0 + W * (gapA + gapB) / 2} y={y + 16} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.line} opacity={cut}>z z z</text>
          <SchLabel x={x0 + W * (gapA + gapB) / 2} y={y - 110} t={t - 40} text="A FEW SECONDS" size={44} color={SCH.glow} />
          <SchLabel x={x0 + W * (gapA + gapB) / 2} y={y + 160} t={t - 62} text="SLEEP" size={60} color="#B9AEFF" />
        </g>
      ) : null}
      <SchLabel x={960} y={820} t={t - 100} text="NO WARNING. NO PERMISSION." size={58} />
      <Tag x={1560} y={920} t={t - 140} text="REAL" mark="check" markT={6} />
    </g>
  );
};
