import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, easeInOut, Glow, Foreground, Tabletop, Tag, Paper,
  Schematic, SCH, SchLabel, DrawOn, Arrow, CountUp, BrainOutline, NeedleDial, Sparkle, ShotProps, stand, shake,
} from '../../engine';
import { Apartment, LivingRoom, TV, Couch, Street, STREET, Clinic, CLINIC } from '../feel-pain-1/sets';
import {
  HERO, BUDDY, RESEARCHER, VOLUNTEER, DOCTOR, PASSER1, PASSER2, SANDWICH_LADY, ENVELOPE_GUY, MAIL, SISTER, RED,
  Ring, Throb, Act, CU, cuHead, cam, Realize,
} from '../feel-pain-1/kit';

// Chapter 3: it's real. The science on the schematic (the brain's touch map, the dial, mirror-touch synesthesia, the
// 567-person study), then the clinic: the doctor runs every test, knocks her hand, and you rub your own knuckle.

// ---------- S1: close-up: at night, wondering: superpower or real? ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [86, 'worried']]} p={{ yaw: 0.3, look: kf(t, [[0, 0.6], [90, -0.2]]), headTilt: kf(t, [[0, 6], [90, -6]]) }} rim="rimBlueL"
        bg={<g transform="translate(-1000 -700) scale(2.2)"><Apartment t={t} id="a1" night /></g>} />
      <text x={h.x + 360} y={300} fontFamily="Bricolage Grotesque, sans-serif" fontSize={150} fontWeight={700} fill="#FFE27A" opacity={clamp((t - 80) / 8)}>?</text>
    </g>
  );
};

// ---------- S2: schematic: REAL? and a tick ----------
// real@75
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.05])}>
    <Schematic t={t} id="c2" />
    <SchLabel x={960} y={560} t={t - 4} text={t > 75 ? 'REAL' : 'REAL?'} size={180} color={t > 75 ? SCH.live : SCH.line} />
    <Tag x={1380} y={760} t={t - 78} text="A VERSION OF IT" mark="check" w={360} />
  </g>
);

// ---------- S3: schematic: a hand gets touched; the watcher's brain lights up too ----------
// touched@32 hurt@53 light@133
const Hand: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 120 L -60 -10 Q -60 -40 -40 -40 Q -20 -40 -20 -10 L -20 -80 Q -20 -110 0 -110 Q 20 -110 20 -80 L 20 -10 L 20 -70 Q 20 -100 40 -100 Q 60 -100 60 -70 L 60 120 Z" fill="none" stroke={SCH.line} strokeWidth={6} />
  </g>
);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const tap = easeInOut(clamp((t - 20) / 12));
  const lit = clamp((t - 128) / 10);
  return (
    <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.03])}>
      <Schematic t={t} id="c3" />
      <Hand x={420} y={620} s={1.4} />
      <path d={`M ${640 - 120 * tap} ${380 + 150 * tap} l -90 -30`} stroke={SCH.dim} strokeWidth={10} strokeLinecap="round" />
      <Ring x={440} y={520} t={t - 32} s={0.7} />
      <SchLabel x={420} y={900} t={t - 20} text="THEM" size={44} color={SCH.dim} />
      <BrainOutline x={1330} y={520} s={0.7} t={t - 40} />
      <circle cx={1450} cy={430} r={60} fill={RED} opacity={0.6 * lit} />
      <Glow x={1450} y={430} r={200} kind="red" o={0.8 * lit} />
      <Arrow x0={640} y0={520} x1={980} y1={520} t={t - 60} />
      <SchLabel x={1330} y={900} t={t - 70} text="YOUR BRAIN" size={44} />
      <SchLabel x={1330} y={820} t={t - 132} text="YOUR OWN BODY MAP" size={36} color={RED} />
    </g>
  );
};

// ---------- S4: schematic: a brain scan: the touch area and the insula glow ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [980, 520, 1.1])}>
    <Schematic t={t + 200} id="c4" />
    <BrainOutline x={960} y={560} s={1} t={60} />
    {[[1150, 420, 'TOUCH AREA'], [930, 600, 'INSULA']].map(([x, y, l], i) => (
      <g key={i}>
        <circle cx={x as number} cy={y as number} r={70 + 8 * Math.sin(t / 4 + i)} fill={RED} opacity={0.5 * clamp((t - 10 - i * 12) / 8)} />
        <Glow x={x as number} y={y as number} r={220} kind="red" o={0.7 * clamp((t - 10 - i * 12) / 8)} />
        <SchLabel x={(x as number) + 130} y={(y as number) + 10} t={t - 14 - i * 12} text={l as string} size={40} color={RED} anchor="start" />
      </g>
    ))}
    <SchLabel x={960} y={120} t={t} text="BRAIN SCAN" size={48} color={SCH.dim} />
  </g>
);

// ---------- S5: schematic: inside the brain, a tiny figure copies what the other person feels ----------
// simulation@55 feeling@107
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const wince = t > 100 ? 1 : 0;
  return (
    <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
      <Schematic t={t + 300} id="c5" />
      <BrainOutline x={960} y={560} s={1} t={60} />
      <Hero look={HERO} pose={{ ...basePose, x: 900, y: 560, scale: 0.6, yaw: 0, expr: wince ? 'shock' : 'neutral', armL: { a: 20 + 40 * wince, b: 30 }, armR: { a: 20 + 40 * wince, b: 30 }, headTilt: 10 * wince }} shadow={0} />
      <rect x={700} y={400} width={400} height={290} rx={20} fill="none" stroke={SCH.live} strokeWidth={4} strokeDasharray="14 10" opacity={clamp((t - 40) / 10)} />
      <SchLabel x={900} y={770} t={t - 52} text="TINY SIMULATION" size={44} color={SCH.live} />
      <Throb x={940} y={600} t={t - 106} s={0.4} />
    </g>
  );
};

// ---------- S6: wide: your buddy flinches at the TV ----------
// hit@83
const Game: React.FC<{ t: number; hit: number }> = ({ t, hit }) => (
  <g>
    <rect x={TV.x0} y={TV.y0} width={400} height={225} fill="#3A7A44" />
    <circle cx={980} cy={540} r={36} fill="#F2F0E6" opacity={t > hit ? 0.8 : 0} />
    <rect x={TV.x0} y={TV.y0} width={400} height={225} fill="#FFFFFF" opacity={t > hit && t < hit + 3 ? 0.6 : 0} />
  </g>
);
const BUDDY_COUCH: Pose = { ...basePose, x: 960, y: 700, scale: 1.25, yaw: 0, look: 0, armL: { a: 30, b: 40 }, armR: { a: 30, b: 40 } };
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const fl = t > 83 ? 1 : 0;
  return (
    <g transform={cam(t, len, [960, 560, 1.05], [960, 560, 1.12])}>
      <LivingRoom t={t} id="l6" screen={<Game t={t} hit={83} />} tvLight="#7FD08A" />
      <Hero look={BUDDY} pose={{ ...BUDDY_COUCH, yaw: 0.2, expr: fl ? 'shock' : 'neutral', headTilt: -10 * fl, tilt: -8 * fl, armL: { a: 30 + 80 * fl, b: 60 }, armR: { a: 30 + 80 * fl, b: 60 } }} rimId="rimL" shadow={0} />
      <Couch y={760} w={760} />
    </g>
  );
};

// ---------- S7: medium: he grabs his own knee as a player goes down ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 620, 1.9], [960, 620, 2.0])}>
    <LivingRoom t={t + 100} id="l7" screen={<Game t={t} hit={60} />} tvLight="#7FD08A" />
    <Act t={t} look={BUDDY} keys={[{ f: 0, p: { ...BUDDY_COUCH, yaw: 0.2 } }, { f: 26, p: { tilt: 18, armL: { a: 40, b: 10 }, armR: { a: 30, b: 10 }, headTilt: 10 }, ease: easeOut }]} face={[[0, 'neutral'], [28, 'worried']]} rim="rimL" shadow={0} />
    <Couch y={760} w={760} />
  </g>
);

// ---------- S8 / S9: the simulation dial: low for most, into the red for some ----------
// wince@104 shiver@142
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
    <Schematic t={t + 400} id="c8" />
    <NeedleDial x={960} y={700} r={380} p={0.1 + 0.08 * Math.sin(t / 8) + (t > 104 && t < 120 ? 0.12 : 0) + (t > 142 && t < 158 ? 0.1 : 0)} red={0.66} redLabel="FEEL IT" left="QUIET" right="LOUD" t={t} />
    <SchLabel x={960} y={150} t={t} text="THE SIMULATION" size={52} />
    <Tag x={500} y={860} t={t - 104} text="A WINCE" w={220} />
    <Tag x={1420} y={860} t={t - 142} text="A SHIVER" w={230} />
  </g>
);
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(${shake(t, 68, 10, 8)} 0)`}>
    <g transform={cam(t, len, [960, 540, 1.0], [960, 560, 1.1])}>
      <Schematic t={t + 600} id="c9" />
      <NeedleDial x={960} y={700} r={380} p={0.15 + 0.75 * easeOut(clamp((t - 48) / 20))} red={0.66} redLabel="FEEL IT" left="QUIET" right="LOUD" flash={clamp((t - 68) / 4)} t={t} />
      <SchLabel x={960} y={150} t={t - 6} text="FOR SOME PEOPLE" size={52} color={RED} />
    </g>
  </g>
);

// ---------- S10: schematic: MIRROR-TOUCH SYNESTHESIA ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.05], [960, 540, 1.0])}>
    <Schematic t={t + 800} id="c10" />
    <BrainOutline x={960} y={620} s={1} t={60} />
    <Glow x={1150} y={480} r={300} kind="red" o={0.5} />
    <rect x={260} y={110} width={1400} height={170} rx={20} fill={SCH.ground} opacity={0.85} />
    <SchLabel x={960} y={190} t={t - 16} text="MIRROR-TOUCH" size={96} color={SCH.live} />
    <SchLabel x={960} y={260} t={t - 44} text="SYNESTHESIA" size={60} />
  </g>
);

// ---------- the lab (the clinic room set up for the study) ----------
const R_SEAT = (() => { const s = stand(CLINIC, 0.3, 0.5); return { x: s.x, y: s.y + 46 * s.scale, scale: s.scale }; })();
const V_SEAT = (() => { const s = stand(CLINIC, 0.68, 0.5); return { x: s.x, y: s.y + 46 * s.scale, scale: s.scale }; })();
const SITTING = { legL: { a: 80, b: -80 }, legR: { a: 78, b: -80 } };
const Chair: React.FC<{ x: number; y: number; s: number; flip?: boolean }> = ({ x, y, s, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-50} y={-10} width={100} height={16} rx={6} fill="#4A5A64" />
    <rect x={-56} y={-110} width={14} height={110} rx={6} fill="#4A5A64" />
    <path d="M -40 6 L -46 120 M 40 6 L 46 120" stroke="#2A3034" strokeWidth={8} />
  </g>
);
const LabPair: React.FC<{ t: number; id: string; rFace?: [number, any][]; vFace?: [number, any][]; rArm?: number; vArm?: number }> = ({ t, id, rFace = [[0, 'neutral']], vFace = [[0, 'neutral']], rArm = 0, vArm = 0 }) => (
  <g>
    <Clinic t={t} id={id} lab />
    <Chair x={R_SEAT.x} y={R_SEAT.y + 10} s={R_SEAT.scale} />
    <Chair x={V_SEAT.x} y={V_SEAT.y + 10} s={V_SEAT.scale} flip />
    <Act t={t} look={RESEARCHER} keys={[{ f: 0, p: { ...R_SEAT, ...SITTING, yaw: 0.8, look: 0.8, armR: { a: 30 + 120 * rArm, b: 40 + 60 * rArm }, armL: { a: 30, b: 50 } } }]} face={rFace} shadow={0} />
    <Act t={t} look={VOLUNTEER} keys={[{ f: 0, p: { ...V_SEAT, ...SITTING, facing: -1, yaw: -0.8, look: -0.8, armL: { a: 30 + 120 * vArm, b: 40 + 60 * vArm }, armR: { a: 30, b: 50 } } }]} face={vFace} rim="rimL" shadow={0} />
  </g>
);

// ---------- S11: medium two-shot: she touches her own cheek; he feels it on his ----------
// touch@54 feel@78
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 520, 1.55], [960, 520, 1.62])}>
    <LabPair t={t} id="k11" rArm={easeInOut(clamp((t - 40) / 14))} vArm={0} rFace={[[0, 'neutral'], [40, 'happy']]} vFace={[[0, 'neutral'], [74, 'shock']]} />
    <Ring x={R_SEAT.x + 40} y={R_SEAT.y - 180 * R_SEAT.scale} t={t - 54} s={0.5} />
    <Throb x={V_SEAT.x - 40} y={V_SEAT.y - 180 * V_SEAT.scale} t={t - 78} s={0.5} />
  </g>
);

// ---------- S12: wide: the study room ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.05])}>
    <LabPair t={t + 100} id="k12" rFace={[[0, 'happy']]} vFace={[[0, 'neutral']]} />
    {[0.86, 0.94].map((u, i) => { const s = stand(CLINIC, u, 0.3); return <Hero key={i} look={[PASSER1, ENVELOPE_GUY][i]} pose={{ ...basePose, ...s, yaw: -0.5, look: -0.6, expr: 'neutral' }} shadow={0.5} />; })}
    <SchLabel x={960} y={140} t={t - 10} text="BRITAIN, 2009" size={44} color="#F6EFE3" />
  </g>
);

// ---------- S13 / S14: 567 people; nine of them: 1.6% ----------
const LIT = [37, 101, 158, 222, 290, 333, 401, 470, 539];
const Dots: React.FC<{ t: number; fill: number; lit: number }> = ({ t, fill, lit }) => (
  <g>
    {Array.from({ length: 567 }).map((_, i) => {
      const x = 330 + (i % 27) * 46;
      const y = 240 + Math.floor(i / 27) * 30;
      const on = i < fill;
      const red = LIT.indexOf(i) >= 0 && LIT.indexOf(i) < lit;
      return <circle key={i} cx={x} cy={y} r={red ? 14 : 9} fill={red ? RED : on ? SCH.dim : SCH.grid} />;
    })}
  </g>
);
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.03])}>
    <Schematic t={t + 900} id="c13" />
    <Dots t={t} fill={Math.round(567 * easeOut(clamp((t - 6) / 46)))} lit={0} />
    <CountUp x={960} y={950} t={t - 6} to={567} dur={46} size={110} />
    <SchLabel x={960} y={150} t={t} text="PEOPLE TESTED" size={44} color={SCH.dim} />
  </g>
);
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.03])}>
    <Schematic t={t + 1000} id="c14" />
    <Dots t={t} fill={567} lit={Math.min(9, Math.floor(t / 3))} />
    <rect x={640} y={860} width={640} height={150} rx={20} fill={SCH.ground} opacity={0.9} />
    <SchLabel x={960} y={960} t={t - 40} text="9 / 567 ≈ 1.6%" size={90} color={RED} />
    <SchLabel x={960} y={150} t={t} text="HAD IT" size={44} color={RED} />
  </g>
);

// ---------- S15: a row of 60, one lit ----------
const Person: React.FC<{ x: number; y: number; s?: number; c: string }> = ({ x, y, s = 1, c }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-46} r={14} fill={c} />
    <path d="M -16 -26 Q 0 -32 16 -26 L 14 10 L -14 10 Z" fill={c} />
    <path d="M -8 10 L -8 40 M 8 10 L 8 40" stroke={c} strokeWidth={8} />
  </g>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
    <Schematic t={t + 1100} id="c15" />
    {Array.from({ length: 60 }).map((_, i) => {
      const k = clamp((t - i * 0.4) / 6);
      const me = i === 41;
      return <g key={i} opacity={k}><Person x={250 + (i % 20) * 75} y={400 + Math.floor(i / 20) * 170} c={me && t > 30 ? RED : SCH.dim} s={me && t > 30 ? 1.3 : 1} /></g>;
    })}
    {t > 30 ? <Glow x={250 + 1 * 75} y={720} r={140} kind="red" o={0.6} /> : null}
    <SchLabel x={960} y={170} t={t - 30} text="ABOUT 1 IN 60" size={80} color={SCH.live} />
  </g>
);

// ---------- S16: CLASS, BUS, JOB: one lit figure in each ----------
// class@32 bus@57 job@84
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.03])}>
    <Schematic t={t + 1200} id="c16" />
    {['CLASS', 'BUS', 'JOB'].map((l, i) => {
      const at = [28, 53, 80][i];
      const x = 400 + i * 560;
      return (
        <g key={l} opacity={clamp((t - at) / 6)}>
          <rect x={x - 230} y={300} width={460} height={420} rx={24} fill="none" stroke={SCH.line} strokeWidth={5} />
          {Array.from({ length: 12 }).map((_, k) => <Person key={k} x={x - 160 + (k % 4) * 106} y={420 + Math.floor(k / 4) * 110} s={0.9} c={k === (i * 5 + 3) % 12 ? RED : SCH.dim} />)}
          <SchLabel x={x} y={800} t={t - at} text={l} size={56} color={SCH.live} />
        </g>
      );
    })}
  </g>
);

// ---------- S17: wide: in a crowd, one person surrounded by rings ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const crowd = [[PASSER1, 600], [MAIL, 760], [SANDWICH_LADY, 1180], [PASSER2, 1340], [ENVELOPE_GUY, 1500]] as const;
  return (
    <g transform={cam(t, len, [1000, 560, 1.15], [1000, 560, 1.22])}>
      <Street t={t + 1300} id="st17" />
      {crowd.map(([l, x], i) => <Hero key={i} look={l} pose={{ ...basePose, x: x + Math.sin(t / 10 + i) * 20, y: STREET.walk - 140, yaw: i % 2 ? -0.5 : 0.5, expr: 'neutral' }} shadow={0.5} />)}
      <Hero look={SISTER} pose={{ ...basePose, x: 970, y: STREET.walk - 140, yaw: 0, expr: 'tired', headTilt: 10, tilt: 4 }} shadow={0.5} />
      {[[700, 500], [1250, 520], [1450, 600], [800, 660], [1100, 420]].map(([x, y], i) => <Ring key={i} x={x} y={y} t={(t + i * 9) % 40} s={0.5} />)}
    </g>
  );
};

// ---------- S18: medium: someone hides behind a cushion at the TV ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 600, 1.7], [960, 600, 1.8])}>
    <LivingRoom t={t + 200} id="l18" screen={<rect x={TV.x0} y={TV.y0} width={400} height={225} fill={(t >> 2) % 2 ? '#C2353A' : '#2A1A2A'} />} tvLight="#C2353A" />
    <Hero look={SISTER} pose={{ ...BUDDY_COUCH, yaw: 0.1, expr: 'worried', armL: { a: 120, b: 80 }, armR: { a: 120, b: 80 }, blink: 1 }} rimId="rimL" shadow={0} />
    <rect x={850} y={480} width={220} height={150} rx={50} fill="#C9A050" transform={`rotate(${Math.sin(t / 3) * 2} 960 555)`} />
    <Couch y={760} w={760} />
  </g>
);

// ---------- S19 / S19b: the volunteer comforts someone; understanding people ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 520, 1.55], [960, 520, 1.62])}>
    <LabPair t={t + 300} id="k19" vArm={0.5} rFace={[[0, 'worried']]} vFace={[[0, 'neutral'], [40, 'happy']]} />
    <path d={`M ${V_SEAT.x - 110} ${V_SEAT.y - 120} Q ${(R_SEAT.x + V_SEAT.x) / 2} ${V_SEAT.y - 190} ${R_SEAT.x + 120} ${R_SEAT.y - 110}`} stroke="#FFD7A0" strokeWidth={4} strokeDasharray="10 12" fill="none" opacity={clamp((t - 40) / 20)} />
  </g>
);
export const S19b: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CU t={t} len={len} look={VOLUNTEER} face={[[0, 'happy']]} p={{ yaw: -0.3, look: -0.5, headTilt: kf(t, [[0, 0], [40, -6]]) }} rim="rimL"
      bg={<g transform="translate(-900 -600) scale(2.2)"><Clinic t={t} id="k19b" lab /></g>} />
    <Sparkle x={1400} y={320} t={t - 30} s={1.2} />
  </g>
);

// ---------- the exam room ----------
const ON_TABLE = (() => { const p = CLINIC.P(0.6, 0.74, 0.22); const s = stand(CLINIC, 0.6, 0.22); return { x: p.x, y: p.y - 6, scale: s.scale }; })();
const DOC = stand(CLINIC, 0.28, 0.5);
const Exam: React.FC<{ t: number; id: string; me?: Partial<Pose>; meFace?: [number, any][]; doc?: Partial<Pose>; docFace?: [number, any][]; scan?: number }> = ({ t, id, me = {}, meFace = [[0, 'neutral']], doc = {}, docFace = [[0, 'neutral']], scan = 0 }) => (
  <g>
    <Clinic t={t} id={id} scan={scan} />
    <Act t={t} keys={[{ f: 0, p: { ...ON_TABLE, ...SITTING, facing: -1, yaw: -0.7, look: -0.6, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 }, ...me } }]} face={meFace} rim="rimL" />
    <Act t={t} look={DOCTOR} keys={[{ f: 0, p: { ...DOC, yaw: 0.6, look: 0.6, armR: { a: 40, b: 60 }, ...doc } }]} face={docFace} />
  </g>
);

// ---------- S20: wide: back to you, on the exam table ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 560, 1.08])}>
    <Exam t={t} id="e20" docFace={[[0, 'neutral']]} meFace={[[0, 'worried']]} />
  </g>
);

// ---------- S21: insert: the clipboard: BLOODWORK, REFLEXES, BRAIN SCAN ----------
// Reflexes@37 scan@84
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${2 - t * 0.02}) translate(-960 -540)`}>
    <Tabletop edge={1400} kind="stone" />
    <rect x={620} y={140} width={680} height={860} rx={24} fill="#8A6248" />
    <rect x={660} y={200} width={600} height={780} fill="#F6F2EA" />
    <rect x={860} y={120} width={200} height={70} rx={14} fill="#9AA0A4" />
    {['BLOODWORK', 'REFLEXES', 'BRAIN SCAN'].map((l, i) => {
      const at = [2, 37, 84][i];
      const y = 360 + i * 200;
      return (
        <g key={l}>
          <rect x={720} y={y - 50} width={60} height={60} rx={8} fill="none" stroke="#3A4A5A" strokeWidth={5} />
          <text x={820} y={y} fontFamily="monospace" fontSize={52} fill="#2A3A4A">{l}</text>
          {t > at + 6 ? <path d={`M ${728} ${y - 22} L ${748} ${y} L ${790} ${y - 70}`} stroke="#3A9A5A" strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={140 * (1 - clamp((t - at - 6) / 6))} /> : null}
        </g>
      );
    })}
  </g>
);

// ---------- S22: insert: the brain scan on the lightbox: NORMAL ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={cam(t, len, [655, 455, 4.6], [655, 455, 4.8])}>
      <Clinic t={t} id="e22" scan={1} />
    </g>
    <Tag x={1450} y={820} t={t - 20} text="NORMAL" mark="check" w={240} />
  </g>
);

// ---------- S23: medium: the doctor: you might just be wired differently ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [DOC.x + 150, 470, 1.8], [DOC.x + 150, 470, 1.9])}>
    <Exam t={t + 100} id="e23" doc={{ armR: { a: kf(t, [[0, 40], [40, 80], [100, 60], [130, 90]]), b: 40 }, headTilt: kf(t, [[0, 0], [50, 6], [100, -4]]) }} docFace={[[0, 'happy'], [60, 'neutral'], [110, 'smug']]} meFace={[[0, 'neutral']]} />
  </g>
);

// ---------- S24: insert: her knuckle knocks the table edge ----------
// bumps@16 knock@98
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 6) / 12));
  return (
    <g transform={`translate(${shake(t, 18, 6, 6)} 0)`}>
      <rect x={0} y={0} width={1920} height={1080} fill="#3A4A50" />
      <Glow x={1500} y={200} r={700} o={0.3} />
      <rect x={-100} y={620} width={2120} height={120} fill="#5A8A9A" />
      <rect x={-100} y={620} width={2120} height={10} fill="#FFB46A" opacity={0.4} />
      <rect x={-100} y={740} width={2120} height={400} fill="#3A4A52" />
      <rect x={-100} y={560} width={2120} height={60} fill="#F2F0E6" opacity={0.85} />
      <path d={`M 2000 ${200} Q 1500 ${300} ${1180 - 120 * k} ${520 + 60 * k}`} stroke={DOCTOR.jacket} strokeWidth={170} strokeLinecap="round" fill="none" />
      <ellipse cx={1080 - 120 * k} cy={600 + 50 * k} rx={150} ry={110} fill={DOCTOR.hand} stroke={DOCTOR.line} strokeWidth={8} />
      <Ring x={960} y={640} t={t - 18} s={1} />
    </g>
  );
};

// ---------- S25: close-up: you rub your own knuckle: same spot ----------
// rubbing@61 knuckle@74 Same@104
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const rub = Math.sin(t / 3) * 14;
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [52, 'worried']]} hurt={t > 50 ? 1 : 0} p={{ yaw: -0.2, look: 0.4, headTilt: kf(t, [[0, 0], [60, 8]]) }} rim="rimL"
        bg={<g transform="translate(-700 -600) scale(2.2)"><Clinic t={t} id="e25" /></g>} />
      <ellipse cx={1240} cy={1010} rx={150} ry={110} fill={HERO.hand} stroke={HERO.line} strokeWidth={8} transform="rotate(-15 1240 1010)" />
      {t > 54 ? <ellipse cx={1210 + rub} cy={940} rx={110} ry={80} fill={HERO.hand} stroke={HERO.line} strokeWidth={8} /> : null}
      <Throb x={1300} y={960} t={t - 50} s={0.9} />
    </g>
  );
};

// ---------- S26: close-up: the doctor stares ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} look={DOCTOR} face={[[0, 'shock']]} p={{ yaw: 0.3, look: 0.5, headTilt: kf(t, [[0, 0], [30, 6]]) }}
    bg={<g transform="translate(-1100 -600) scale(2.2)"><Clinic t={t + 50} id="e26" /></g>} />
);

// ---------- S27: medium two-shot: she leans in: do that again ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [(DOC.x + ON_TABLE.x) / 2, 470, 1.6], [(DOC.x + ON_TABLE.x) / 2, 470, 1.75])}>
    <Exam t={t + 200} id="e27" doc={{ x: DOC.x + 80, tilt: 14, yaw: 0.7, look: 0.9, armR: { a: 70, b: 20 } }} docFace={[[0, 'smug']]} meFace={[[0, 'oops']]} />
  </g>
);
