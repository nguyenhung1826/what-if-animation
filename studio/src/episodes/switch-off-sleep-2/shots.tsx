import React from 'react';
import {
  Night, Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, settle, camT, LOOKS, STUDY, Study, Desk,
  Tabletop, AlarmClock, Paper, PaperStack, OpenBook, BookFlat, BookTower, LaptopBack, Phone, Mug,
  Schematic, SCH, SchLabel, CountUp, DrawOn, Tag, Sparkle, Glow, LightVeil, FONT, ShotProps,
} from '../../engine';
import { CloseUp } from '../switch-off-sleep-1/shots';

// "What if you could switch off sleep?" Chapter 2: night one, the fun part. Thirteen shots, all in the study at night
// (and at sunrise at the end), plus two schematic cards for the number. The power is on the whole night: the hero's
// eyes glow (faceGlow + an ice-blue glint, as in chapter 1), the room stays warm: this is the fun part.

const GLOW = { ...LOOKS.hero, faceGlow: true };
const ICE = '#9FE4FF';
const on = (p: Pose, g = 0.9): Pose => ({ ...p, glint: g, glintColor: ICE });

// the hero behind the study desk (pattern from chapter 1 S8)
const AT_DESK = { x: 960, y: 712, yaw: 0, look: 0, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } };
// the night study with the desk, the hero and a laptop in front of the hero
const StudyDesk: React.FC<{ t: number; id: string; pose: Pose; laptop?: number; night?: boolean; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, pose, laptop = 1, night = true, children, front }) => (
  <g>
    <Study t={t} id={id} night={night} />
    {children}
    <Hero look={GLOW} pose={on(pose)} rimId="rimR" shadow={0} />
    <Desk x0={560} x1={1360} y={700} laptop={false} />
    {laptop > 0 ? <LaptopBack x={900} y={698} w={190} glow={laptop} /> : null}
    {front}
  </g>
);

// a desk seen from above at night (inserts)
const DeskTop: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <Tabletop edge={1400} />
    <LightVeil id={id} lights={[[1500, 120, 900]]} o={0.6} />
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0A1030" opacity={0.3} style={{ mixBlendMode: 'multiply' }} />
    <Glow x={1520} y={140} r={700} o={0.4} />
  </g>
);

// ---------- S1: insert, the desk clock flips 11, 12, 1: NIGHT 1 ----------
// words: Eleven @42, Twelve @62, One @89 (shot clock)
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const flips: [number, string][] = [[0, '10:59'], [42, '11:00'], [62, '12:00'], [89, '1:00']];
  const cur = flips.filter(([f]) => t >= f).pop()!;
  const bump = 1 + 0.07 * Math.sin(clamp((t - cur[0]) / 6) * Math.PI) * (cur[0] > 0 ? 1 : 0);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#1A1626" />
      <rect x={0} y={700} width={1920} height={380} fill="#3A2A2A" />
      <rect x={0} y={700} width={1920} height={6} fill="#7A5747" />
      <Glow x={1500} y={300} r={700} o={0.5} />
      <Glow x={1500} y={300} r={220} o={0.45} />
      <g transform={`translate(860 740) scale(${bump}) translate(-860 -740)`}>
        <AlarmClock x={860} y={740} s={2.4} text={cur[1]} />
      </g>
      <Glow x={860} y={610} r={360} kind="red" o={0.25} />
      <BookFlat x={1480} y={712} w={300} th={40} i={2} />
      <BookFlat x={1490} y={672} w={270} th={36} i={5} rot={-3} />
      {t >= 4 ? (
        <text x={300} y={260} fontFamily={FONT.hand} fontSize={120} fill="#FFE27A" opacity={clamp((t - 4) / 6)} transform={`rotate(-6 300 260)`}>
          NIGHT 1
        </text>
      ) : null}
    </g>
  );
};

// ---------- S2: medium pushing in to a close: you at the desk, the laptop's glow; tonight, they're yours ----------
// Tonight @80
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...AT_DESK, yaw: 0.35, look: 0.6, headTilt: 4 } },
    { f: 60, p: { headTilt: 6 } },
    { f: 74, p: { yaw: 0.05, look: 0, headTilt: -4 }, ease: easeOut },
    { f: 84, p: { headTilt: 0 } },
  ]);
  const z = kf(t, [[0, 1.7], [70, 1.9], [90, 2.9], [len, 3.0]], easeInOut);
  return (
    <g transform={camT(kf(t, [[0, 960], [90, 950]]), kf(t, [[0, 560], [90, 470]], easeInOut), z)}>
      <StudyDesk t={t + 60} id="s2" pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [78, 'smug']]) }} />
    </g>
  );
};

// ---------- S3: top-down, an open book, pages flipping fast ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const turn = t < 6 ? 0 : ((t - 6) * 0.11) % 1;
  return (
    <g transform={`translate(960 560) rotate(${-3 + t * 0.04}) scale(${1 + t * 0.002}) translate(-960 -560)`}>
      <DeskTop id="s3veil" />
      <OpenBook x={960} y={820} w={980} turn={turn} cover="#4A5A7A" />
      <Mug x={1560} y={900} rot={0} f={t} steam={1} />
      <text x={440} y={220} fontFamily={FONT.hand} fontSize={64} fill="#F6EFE3" opacity={0.85} transform="rotate(-4 440 220)">
        p. {Math.round(12 + t * 4.2)}
      </text>
    </g>
  );
};

// ---------- S4: wide, the shelf empties: books fly to the desk and stack into a tower ----------
const N4 = 12;
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const tower = { x: 1230, y: 700 };
  const flying: React.ReactNode[] = [];
  let landed = 0;
  for (let i = 0; i < N4; i++) {
    const t0 = 4 + i * 6.5;
    const k = (t - t0) / 12;
    if (k >= 1) {
      landed++;
      continue;
    }
    if (k < 0) continue;
    const a = STUDY.P(0.07, STUDY_V[i % STUDY_V.length], 0.2 + 0.25 * ((i * 0.37) % 1));
    const b = { x: tower.x, y: tower.y - i * 20 };
    const e = easeInOut(k);
    flying.push(<BookFlat key={i} x={a.x + (b.x - a.x) * e} y={a.y + (b.y - a.y) * e - 220 * Math.sin(Math.PI * k)} w={110} th={18} i={i} rot={(1 - k) * 260} />);
  }
  const pose = poseAt(t, [
    { f: 0, p: { ...AT_DESK, yaw: 0.1, look: 0, tilt: 4, headTilt: 10 } },
    { f: 50, p: { yaw: -0.3, look: -0.5, headTilt: 0 } },
    { f: 80, p: { yaw: 0.3, look: 0.6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Study t={t + 100} id="s4" night shelf={1 - landed / N4} veil={0.3} />
      <Hero look={GLOW} pose={on({ ...pose, expr: 'happy' })} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} />
      <OpenBook x={930} y={700} w={190} turn={(t * 0.08) % 1} />
      <BookTower x={tower.x} y={tower.y} n={landed} />
      {flying}
    </g>
  );
};
const STUDY_V = [0.3, 0.5, 0.7, 0.9];

// ---------- S5: schematic, 8 h x 365 nights: count to 2,920 hours, a year of nights filling in ----------
// "two" @40, "year" @114
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const filled = Math.round(365 * easeOut(clamp((t - 36) / 74)));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t} id="sc5" />
      <SchLabel x={960} y={170} t={t - 2} text="8 HOURS  ×  365 NIGHTS" size={56} />
      {/* a year of nights: 365 cells, 53 columns by 7 */}
      {Array.from({ length: 365 }).map((_, i) => (
        <rect key={i} x={430 + Math.floor(i / 7) * 20} y={300 + (i % 7) * 20} width={14} height={14} rx={3} fill={i < filled ? SCH.live : SCH.grid} opacity={i < filled ? 0.95 : 1} />
      ))}
      <CountUp x={960} y={700} t={t - 36} to={2920} dur={74} size={190} />
      <SchLabel x={960} y={830} t={t - 100} text="HOURS A YEAR" size={60} color={SCH.dim} />
    </g>
  );
};

// ---------- S6: schematic, about four months: four month blocks drop in; every year; that's real ----------
// Every @54, That's @82
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const months = ['MONTH 1', 'MONTH 2', 'MONTH 3', 'MONTH 4'];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1.0]]))}>
      <Schematic t={t + 140} id="sc6" />
      <SchLabel x={960} y={200} t={t} text="2,920 h  ÷  24  ≈  122 DAYS" size={52} color={SCH.dim} />
      {months.map((m, i) => {
        const k = clamp((t - 4 - i * 7) / 8);
        if (k <= 0) return null;
        const x = 390 + i * 300;
        const y = 300 + (1 - easeOut(k)) * -260 + settle(t - 12 - i * 7, 6) * 0;
        return (
          <g key={m} opacity={k}>
            <rect x={x} y={y} width={240} height={250} rx={16} fill="none" stroke={SCH.live} strokeWidth={6} />
            <rect x={x} y={y} width={240} height={56} rx={16} fill={SCH.live} />
            <text x={x + 120} y={y + 40} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SCH.ground}>{m}</text>
            {Array.from({ length: 20 }).map((_, j) => (
              <rect key={j} x={x + 22 + (j % 5) * 42} y={y + 76 + Math.floor(j / 5) * 40} width={28} height={26} rx={4} fill={SCH.glow} opacity={0.55} />
            ))}
          </g>
        );
      })}
      <SchLabel x={960} y={690} t={t - 20} text="+4 MONTHS AWAKE" size={92} color={SCH.live} />
      <SchLabel x={960} y={800} t={t - 54} text="EVERY YEAR" size={60} />
      <Tag x={1500} y={900} t={t - 82} text="REAL" mark="check" markT={6} />
    </g>
  );
};

// ---------- S7: medium, you at the desk: done sheets flying onto a growing stack ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const n = 4 + Math.floor(t / 3);
  const k = (t % 3) / 3;
  const pose = poseAt(t, [
    { f: 0, p: { ...AT_DESK, yaw: 0.2, look: 0.2, tilt: 6, headTilt: 12, armR: { a: 40, b: 80 } } },
    { f: 3, p: { armR: { a: 50, b: 60 } } },
    { f: 6, p: { armR: { a: 40, b: 80 } } },
  ]);
  const arm = poseAt(t % 6, [{ f: 0, p: { armR: { a: 40, b: 80 } } }, { f: 3, p: { armR: { a: 52, b: 58 } } }, { f: 6, p: { armR: { a: 40, b: 80 } } }]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1030]]), 600, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <StudyDesk t={t + 220} id="s7" laptop={0} pose={{ ...pose, armR: arm.armR, expr: 'happy' }}
        front={
          <g>
            <PaperStack x={760} y={696} n={10} w={150} />
            <PaperStack x={1180} y={696} n={n} w={150} />
            <g transform={`translate(${780 + 400 * k} ${650 - 50 * Math.sin(Math.PI * k)}) rotate(${k * 30})`}>
              <Paper x={0} y={0} w={110} done grade="A" />
            </g>
          </g>
        } />
    </g>
  );
};

// ---------- S8: top-down, a sheet DUE: MAY gets its A; more future sheets slide in ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sheets = [
    { due: 'DUE: MAY 12', t0: 0 },
    { due: 'DUE: JUNE 3', t0: 34 },
    { due: 'DUE: NEXT YEAR', t0: 58 },
  ];
  return (
    <g transform={`translate(960 540) rotate(${2 - t * 0.03}) scale(${1 + t * 0.002}) translate(-960 -540)`}>
      <DeskTop id="s8veil" />
      {sheets.map((s, i) => {
        const k = easeOut(clamp((t - s.t0) / 8));
        if (k <= 0) return null;
        const x = 600 + i * 380 + (1 - k) * 900;
        const fill = clamp((t - s.t0 - 6) / 16);
        return (
          <g key={i}>
            <Paper x={x} y={560} w={330} rot={-4 + i * 4} done fill={fill} grade="A" />
            <text x={x} y={300} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#C2453A" transform={`rotate(${-4 + i * 4} ${x} 560)`}>
              {s.due}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S9: medium, you lean back and watch: the laptop's light flickers scene to scene, EP 1 .. EP 10 ----------
const SCENE = ['#7FB2FF', '#FF9A6A', '#9FFFC8', '#FFE27A', '#C49BFF', '#FF6A8A'];
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const ep = Math.min(10, 1 + Math.floor(t / 12));
  const col = SCENE[Math.floor(t / 9) % SCENE.length];
  const pose = poseAt(t, [
    { f: 0, p: { ...AT_DESK, tilt: -6, yaw: 0, look: 0, headTilt: -4, armL: { a: 150, b: 120 }, armR: { a: 150, b: 120 } } },
    { f: 60, p: { headTilt: -8 } },
    { f: 100, p: { headTilt: -2 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 2.0], [len, 2.15]]))}>
      <StudyDesk t={t + 300} id="s9" pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [50, 'shock'], [60, 'happy']]) }} laptop={0.8 + 0.2 * Math.sin(t)}
        front={<Glow x={960} y={560} r={420} kind="cool" o={0.18} />} />
      <rect x={0} y={0} width={1920} height={1080} fill={col} opacity={0.08} style={{ mixBlendMode: 'screen' }} />
      <g transform="translate(1620 160)">
        <rect x={-130} y={-50} width={260} height={90} rx={20} fill="#0B0A10" opacity={0.75} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#F6EFE3">EP {ep}</text>
      </g>
    </g>
  );
};

// ---------- S10: insert, the phone in your hands: you text the group; delivered; no reply ----------
// "Nobody" @93 (shot clock)
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const pop = (f: number) => clamp((t - f) / 5);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <g filter="url(#blur16)">
        <Study t={t + 400} id="s10" night />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050712" opacity={0.45} />
      {/* your hands round the phone */}
      <ellipse cx={720} cy={900} rx={120} ry={170} fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} transform="rotate(20 720 900)" />
      <ellipse cx={1200} cy={900} rx={120} ry={170} fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} transform="rotate(-20 1200 900)" />
      <Phone x={960} y={600} w={430} rot={-2} on={1} f={t} title="THE SQUAD"
        chat={[
          { text: 'THAT FINALE!!!', me: true, o: pop(8) },
          { text: 'who else is up', me: true, o: pop(40) },
          { text: 'hello??', me: true, o: pop(84) },
        ]}
        status={t > 96 ? 'Delivered' : undefined} />
      <ellipse cx={1200} cy={930} rx={60} ry={100} fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} transform={`rotate(-30 1150 860) translate(0 ${t < 80 ? Math.sin(t * 1.3) * 10 : 0})`} />
    </g>
  );
};

// ---------- S11: close-up, you: they're asleep. Losers. (smug, ZZZ drifting) ----------
// "Losers" @50
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CloseUp t={t} len={len} glint={1} face={faceAt(t, [[0, 'neutral'], [44, 'smug']])}
      p={{ headTilt: kf(t, [[0, 0], [44, 0], [52, -8], [len, -6]], easeOut), look: kf(t, [[0, 0.5], [30, 0.2], [44, 0]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } }}
      bg={<g transform="translate(-900 -560) scale(2.2)"><Study t={t + 500} id="s11" night /></g>} />
    {[0, 1, 2].map((i) => {
      const k = ((t + i * 14) % 42) / 42;
      return (
        <text key={i} x={400 + k * 120} y={700 - k * 380} fontFamily={FONT.hand} fontSize={70 + i * 16} fill="#CFE6FF" opacity={Math.sin(k * Math.PI) * 0.8}>
          z
        </text>
      );
    })}
  </g>
);

// ---------- S12: wide, the sun comes up: the tower of books, the done stack; you stretch, happy ----------
// "great" @180 (shot clock)
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const day = easeInOut(clamp(t / 140));
  const pose = poseAt(t, [
    { f: 0, p: { ...AT_DESK, yaw: 0.2, look: 0.4, headTilt: 4 } },
    { f: 120, p: {} },
    { f: 140, p: { armL: { a: 168, b: 10 }, armR: { a: 168, b: 10 }, headTilt: -10, tilt: -4 }, ease: easeOut },
    { f: 170, p: { armL: { a: 172, b: 6 }, armR: { a: 172, b: 6 }, headTilt: -12 } },
    { f: 190, p: { armL: { a: 120, b: 40 }, armR: { a: 120, b: 40 }, headTilt: -2, tilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 540], [len, 560]]), kf(t, [[0, 1.0], [len, 1.15]]))}>
      <Study t={t + 600} id="s12n" night shelf={0} veil={0.3} />
      <g opacity={day}>
        <Study t={t + 600} id="s12d" shelf={0} veil={0.3} />
      </g>
      <Hero look={GLOW} pose={on({ ...pose, ...faceAt(t, [[0, 'happy'], [140, 'happy']]), blink: t > 140 && t < 170 ? 1 : 0 }, 0.9 - 0.4 * day)} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={day < 0.5} />
      <BookTower x={1230} y={700} n={12} />
      <PaperStack x={700} y={696} n={22} w={150} />
      <Mug x={1060} y={698} rot={0} f={t} steam={0} />
      <Sparkle x={960} y={330} t={t - 180} s={1.4} />
    </g>
  );
};

// ---------- S13: close-up, wide awake in the sunrise; the full mug beside you, untouched ----------
// "yawning" @29, "Nothing" @52 (shot clock)
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CloseUp t={t} len={len} glint={0.5} rim="rimR" x={1080}
      face={faceAt(t, [[0, 'happy'], [26, 'neutral'], [36, 'smug'], [52, 'happy']])}
      p={{ headTilt: kf(t, [[0, -2], [26, 4], [36, -4], [52, 0]], easeOut), yaw: kf(t, [[0, 0.15], [26, 0.4], [36, 0.15]]) }}
      bg={<g transform="translate(-1100 -700) scale(2.2)"><Study t={t + 700} id="s13" shelf={0} /></g>} />
    <g transform="translate(470 1060) scale(3.2)">
      <Mug x={0} y={0} rot={0} f={t} steam={0} />
    </g>
    <Sparkle x={1360} y={330} t={t - 52} s={1.2} />
    <Sparkle x={820} y={260} t={t - 58} s={0.9} />
  </g>
);
