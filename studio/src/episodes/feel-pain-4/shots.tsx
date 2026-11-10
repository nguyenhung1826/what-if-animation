import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, easeInOut, Glow, Tag, Schematic, SCH, SchLabel, Sparkle, ShotProps,
  stand, shake, walkPose, walkPhase, FloatLabel, FONT,
} from '../../engine';
import { Ward, WARD, wardBed, WardBlanket, Monitor, ParkingLot, LOT, APT, Apartment, AptTable, aptTop } from '../feel-pain-1/sets';
import {
  HERO, DOCTOR, NURSE, TODDLER, MOM2, OLD_MAN, TOUGH, PASSER2, ROOMMATE, RED,
  Ring, Throb, Ache, Act, CU, cuHead, cam, Realize, Foot, Peas, Badge,
} from '../feel-pain-1/kit';

// Chapter 4: the job only you can do. The ER bay (patients who can't say where it hurts), the end of the shift, the
// parking lot at sunrise, then home: the roommate's toe again, a laugh, two bags of frozen peas. A closed ending.

const ME = stand(WARD, 0.84, 0.52);
const DOC = stand(WARD, 0.16, 0.52);
const BED = wardBed(0.5, 0.14);
const SIT_UP = { ...BED, yaw: 0, armL: { a: 20, b: 30 }, armR: { a: 20, b: 30 } };
const Bay: React.FC<{ t: number; id: string; patient?: React.ReactNode; me?: Partial<Pose> | null; meFace?: [number, any][]; doc?: Partial<Pose> | null; docFace?: [number, any][]; extra?: React.ReactNode; fast?: number; amp?: number; bpm?: number; hurt?: number }> = ({ t, id, patient, me = {}, meFace = [[0, 'neutral']], doc = null, docFace = [[0, 'neutral']], extra, fast, amp, bpm, hurt = 0 }) => (
  <g>
    <Ward t={t} id={id} fast={fast} amp={amp} bpm={bpm} />
    {patient}
    <WardBlanket w0={0.22} />
    {doc ? <Act t={t} look={DOCTOR} keys={[{ f: 0, p: { ...DOC, yaw: 0.5, look: 0.6, ...doc } }]} face={docFace} /> : null}
    {me ? <Act t={t} keys={[{ f: 0, p: { ...ME, yaw: -0.5, look: -0.6, ...me } }]} face={meFace} rim="rimL" hurt={hurt} /> : null}
    {extra}
  </g>
);
const Patient: React.FC<{ look: any; t: number; p?: Partial<Pose>; face?: [number, any][]; s?: number }> = ({ look, t, p = {}, face = [[0, 'neutral']], s = 1 }) => (
  <Act t={t} look={look} keys={[{ f: 0, p: { ...SIT_UP, scale: BED.scale * s, y: BED.y + (1 - s) * 30, ...p } }]} face={face} shadow={0} />
);

// ---------- S1: wide: three months later, the ER bay ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.08])}>
      <Bay t={t} id="w1" patient={<Patient t={t} look={PASSER2} face={[[0, 'tired']]} />} me={{ yaw: -0.3 }} meFace={[[0, 'neutral']]} />
    </g>
    <Tag x={260} y={140} t={t - 6} text="3 MONTHS LATER" w={340} />
  </g>
);

// ---------- S2: close-up: a wry smile ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [26, 'smug']]} p={{ yaw: -0.3, look: -0.4, headTilt: kf(t, [[0, 0], [30, -6]]) }} rim="rimL"
        bg={<g transform="translate(-900 -500) scale(2.2)"><Ward t={t} id="w2" /></g>} />
      {[[-0.9, 0.4], [0.9, -0.5]].map(([dx, dy], i) => <Ache key={i} x={h.x + dx * h.r * 1.6} y={h.y + dy * h.r * 1.4} t={t - i * 10} s={1.4} />)}
    </g>
  );
};

// ---------- S3: medium two-shot: the doctor and you ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 480, 1.35], [960, 480, 1.42])}>
    <Bay t={t + 100} id="w3" doc={{ armR: { a: 70, b: 40 } }} docFace={[[0, 'happy']]} meFace={[[0, 'neutral']]} patient={<Patient t={t} look={PASSER2} face={[[0, 'tired']]} />} />
  </g>
);

// ---------- S4: wide: where does it hurt? ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const n = stand(WARD, 0.22, 0.6);
  return (
    <g transform={cam(t, len, [960, 540, 1.05], [960, 540, 1.1])}>
      <Bay t={t + 200} id="w4" me={null} patient={<Patient t={t} look={PASSER2} p={{ armL: { a: 60, b: 60 }, armR: { a: 60, b: 60 } }} face={[[0, 'worried']]} />}
        extra={<g><Act t={t} look={NURSE} keys={[{ f: 0, p: { ...n, yaw: 0.6, look: 0.7, armR: { a: 70, b: 80 } } }]} face={[[0, 'neutral']]} /><rect x={n.x + 60} y={n.y - 90} width={70} height={90} rx={6} fill="#C9A26A" /><text x={n.x + 300} y={n.y - 260} fontFamily={FONT.hand} fontSize={110} fill="#FFE27A">?</text></g>} />
    </g>
  );
};

// ---------- S5: medium: a baby crying in the bed ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [BED.x, BED.y - 80, 2.3], [BED.x, BED.y - 80, 2.4])}>
    <Bay t={t + 300} id="w5" me={null} patient={<Patient t={t} look={TODDLER} s={0.45} p={{ armL: { a: 150, b: 40 }, armR: { a: 150, b: 40 }, headTilt: Math.sin(t) * 4 }} face={[[0, 'worried']]} />} />
    <FloatLabel x={BED.x + 120} y={BED.y - 180} t={t} text="WAAH" color="#9FD8FF" size={50} />
  </g>
);

// ---------- S6: medium: a patient shrugs, lost for words ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [BED.x, BED.y - 100, 2.0], [BED.x, BED.y - 100, 2.05])}>
    <Bay t={t + 400} id="w6" me={null} patient={<Patient t={t} look={PASSER2} p={{ armL: { a: kf(t, [[0, 20], [12, 70]]), b: 90 }, armR: { a: kf(t, [[0, 20], [12, 70]]), b: 90 }, headTilt: 8 }} face={[[0, 'oops']]} />} />
  </g>
);

// ---------- S7: medium: a tough guy, arms crossed, sweating: fine ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [BED.x, BED.y - 100, 2.0], [BED.x, BED.y - 100, 2.1])}>
    <Bay t={t + 500} id="w7" me={null} patient={<Patient t={t} look={TOUGH} p={{ armL: { a: 70, b: 110 }, armR: { a: 70, b: 110 }, yaw: 0.2 }} face={[[0, 'cool']]} />} />
    <path d={`M ${BED.x + 50} ${BED.y - 250 + ((t * 2) % 60)} q -8 14 0 20 q 8 -6 0 -20 Z`} fill="#9FD8FF" />
    <Ache x={BED.x + 10} y={BED.y - 90} t={t} s={0.9} />
  </g>
);

// ---------- S8 / S9: close-ups: you can't read their minds; but you can see them ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} face={[[0, 'neutral']]} p={{ yaw: -0.25, look: -0.5 }} rim="rimL" bg={<g transform="translate(-700 -500) scale(2.2)"><Ward t={t} id="w8" /></g>} />
);
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t, 980, 4.8);
  return (
    <g>
      <CU t={t} len={len} s={4.8} face={[[0, 'neutral'], [95, 'smug']]} hurt={clamp((t - 20) / 10)} p={{ yaw: -0.05, look: -0.2 }} rim="rimL" bg={<g transform="translate(-700 -500) scale(2.2)"><Ward t={t + 60} id="w9" /></g>} />
      <Realize x={h.x} y={h.y - 30} t={t - 24} />
    </g>
  );
};

// ---------- S10: medium: a toddler crying on his mom's lap ----------
const MomOnBed: React.FC<{ t: number; cry?: boolean; ear?: number }> = ({ t, cry = true, ear = 0 }) => (
  <g>
    <Patient t={t} look={MOM2} p={{ armL: { a: 50, b: 60 }, armR: { a: 50, b: 60 }, yaw: 0.2, look: 0.3 }} face={[[0, 'worried']]} />
    <Act t={t} look={TODDLER} keys={[{ f: 0, p: { ...SIT_UP, x: BED.x + 30, y: BED.y - 30, scale: BED.scale * 0.5, armL: { a: cry ? 140 : 30, b: 40 }, armR: { a: cry ? 140 : 30, b: 40 }, headTilt: Math.sin(t / 2) * 5 * (cry ? 1 : 0) } }]} face={[[0, cry ? 'worried' : 'neutral']]} shadow={0} />
  </g>
);
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [BED.x, BED.y - 100, 1.9], [BED.x, BED.y - 100, 2.0])}>
    <Bay t={t + 600} id="w10" me={null} patient={<MomOnBed t={t} />} />
    <FloatLabel x={BED.x + 160} y={BED.y - 160} t={t % 40} text="WAAH" color="#9FD8FF" size={46} />
  </g>
);

// ---------- S11: close-up: two seconds; your left ear throbs ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [64, 'worried']]} hurt={t > 60 ? 1 : 0} p={{ yaw: -0.3, look: -0.5, headTilt: kf(t, [[0, 0], [70, -10]]) }} rim="rimL"
        bg={<g transform="translate(-700 -500) scale(2.2)"><Ward t={t + 120} id="w11" /></g>} />
      <Throb x={h.x + h.r * 0.95} y={h.y + 10} t={t - 66} s={1.2} />
      <Tag x={300} y={180} t={t - 22} text="2 SECONDS" w={240} />
    </g>
  );
};

// ---------- S12: medium: the doctor checks the toddler's ear: EAR INFECTION ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={cam(t, len, [(DOC.x + BED.x) / 2, BED.y - 100, 1.6], [(DOC.x + BED.x) / 2, BED.y - 100, 1.65])}>
      <Bay t={t + 700} id="w12" me={null} doc={{ x: DOC.x + 140, armR: { a: 80, b: 30 }, tilt: 8 }} docFace={[[0, 'happy']]} patient={<MomOnBed t={t} cry={false} />} />
    </g>
    <Tag x={1480} y={220} t={t - 4} text="EAR INFECTION" mark="check" w={330} />
  </g>
);

// ---------- S13: medium: an old man in bed: fine, just tired ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [BED.x, BED.y - 100, 2.0], [BED.x, BED.y - 100, 2.1])}>
    <Bay t={t + 800} id="w13" me={null} patient={<Patient t={t} look={OLD_MAN} p={{ armR: { a: kf(t, [[0, 20], [30, 60], [50, 30]]), b: 60 }, yaw: 0.2 }} face={[[0, 'happy'], [55, 'tired']]} />} />
  </g>
);

// ---------- S14: close-up: your chest goes tight ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CU t={t} len={len} s={3.4} face={[[0, 'neutral'], [18, 'shock']]} hurt={t > 16 ? 1 : 0} p={{ yaw: -0.2, look: -0.3, tilt: kf(t, [[0, 0], [24, 6]]) }} rim="rimL"
      bg={<g transform="translate(-700 -500) scale(2.2)"><Ward t={t + 200} id="w14" /></g>} />
    <Throb x={960} y={1000} t={t - 20} s={1.6} />
  </g>
);

// ---------- S15: insert: the monitor spikes ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(${shake(t, 20, 6, 4)} 0)`}>
    <rect x={0} y={0} width={1920} height={1080} fill="#1A2428" />
    <Glow x={960} y={540} r={900} kind="cool" o={0.25} />
    <Monitor x={960} y={560} s={4.6} t={t * 3} fast={3} amp={1.6} bpm={148} />
    <rect x={0} y={0} width={1920} height={1080} fill={RED} opacity={(Math.floor(t / 8) % 2) * 0.08} />
  </g>
);

// ---------- S16: medium: the doctor and the nurse at the bed: caught in time ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const n = stand(WARD, 0.8, 0.55);
  return (
    <g>
      <g transform={cam(t, len, [960, 480, 1.3], [960, 480, 1.36])}>
        <Bay t={t + 900} id="w16" me={null} doc={{ x: DOC.x + 100, armR: { a: 80, b: 20 }, tilt: 6 }} docFace={[[0, 'worried'], [40, 'happy']]} fast={2} amp={1.3} bpm={120}
          patient={<Patient t={t} look={OLD_MAN} face={[[0, 'tired'], [50, 'happy']]} />}
          extra={<Act t={t} look={NURSE} keys={[{ f: 0, p: { ...n, yaw: -0.5, look: -0.6, armL: { a: 80, b: 30 } } }]} face={[[0, 'worried'], [44, 'happy']]} rim="rimL" />} />
      </g>
      <Tag x={1460} y={200} t={t - 52} text="CAUGHT IN TIME" mark="check" w={330} />
    </g>
  );
};

// ---------- S17: wide: end of the shift, slumped on a bench in the empty bay ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(WARD, 0.5, 0.62);
  return (
    <g transform={cam(t, len, [960, 560, 1.0], [960, 580, 1.1])}>
      <Ward t={t + 1000} id="w17" bpm={0} amp={0} />
      <rect x={s.x - 230} y={s.y + 10} width={460} height={30} rx={8} fill="#5A6A70" />
      {[-200, 200].map((d) => <path key={d} d={`M ${s.x + d} ${s.y + 40} L ${s.x + d} ${s.y + 130}`} stroke="#2A3034" strokeWidth={10} />)}
      <Act t={t} keys={[{ f: 0, p: { ...s, y: s.y + 10, legL: { a: 80, b: -80 }, legR: { a: 76, b: -80 }, facing: -1, yaw: -0.6, tilt: -10, headTilt: 18, armL: { a: 10, b: 10 }, armR: { a: 10, b: 10 } } }]} face={[[0, 'tired']]} rim="rimL" />
      {[[-40, -220], [30, -60], [-20, 80]].map(([dx, dy], i) => <Ache key={i} x={s.x + dx} y={s.y + dy} t={t - i * 8} s={1} />)}
    </g>
  );
};

// ---------- S18: schematic: your body tally ----------
// marathon@29 arm@72 toothaches@116
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
    <Schematic t={t} id="c18" />
    <Hero look={HERO} pose={{ ...basePose, x: 960, y: 600, scale: 1.6, yaw: 0, expr: 'tired' }} shadow={0} />
    {[[29, 940, 800, 'MARATHON LEGS', 520, 820], [72, 870, 600, 'BROKEN ARM', 440, 560], [116, 975, 360, '3 TOOTHACHES', 1450, 330]].map(([at, x, y, l, lx, ly], i) => (
      <g key={i}>
        <Throb x={x as number} y={y as number} t={t - (at as number)} s={0.7} />
        <SchLabel x={lx as number} y={ly as number} t={t - (at as number)} text={l as string} size={44} color={RED} />
      </g>
    ))}
  </g>
);

// ---------- S19: close-up: a tired laugh ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} face={[[0, 'tired'], [40, 'happy']]} p={{ yaw: -0.2, headTilt: kf(t, [[0, 10], [44, -6], [60, 2], [76, -4]]) }} rim="rimL"
    bg={<g transform="translate(-700 -500) scale(2.2)"><Ward t={t + 300} id="w19" /></g>} />
);

// ---------- S20: medium: you smile, gently ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [ME.x - 60, ME.y - 120, 2.0], [ME.x - 60, ME.y - 130, 2.15])}>
    <Bay t={t + 1100} id="w20" patient={<Patient t={t} look={OLD_MAN} p={{ blink: 1 }} face={[[0, 'happy']]} />} me={{ yaw: -0.4, look: -0.5, headTilt: 6 }} meFace={[[0, 'neutral'], [60, 'happy']]} />
  </g>
);

// ---------- S21: insert: your ER STAFF badge ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill={HERO.jacket} />
    {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${i * 70} 0 L ${i * 70} 1080`} stroke="#1A3060" strokeWidth={6} opacity={0.5} />)}
    <Glow x={1300} y={300} r={700} o={0.35} />
    <g transform={`rotate(${Math.sin(t / 20) * 3} 960 260)`}><Badge x={960} y={560} s={1.6} /></g>
    <Sparkle x={1180} y={420} t={t - 30} s={1.3} />
  </g>
);

// ---------- S22: wide: out of the ER doors into the sunrise ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const x = 140 + t * 3.2;
  return (
    <g transform={cam(t, len, [600, 560, 0.95], [700, 560, 1.0])}>
      <ParkingLot t={t} id="p22" sunY={kf(t, [[0, 700], [len, 640]])} />
      <Hero look={HERO} pose={walkPose(x, walkPhase(t * 3.2, 1), LOT.ground, 1, { yaw: 0.6, tilt: 4, headTilt: 8, expr: 'tired' })} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- S23: low angle: you against the rising sun, aching and smiling ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [1300, 560, 1.7], [1300, 540, 1.8])}>
    <ParkingLot t={t + 100} id="p23" sunY={600} />
    <Act t={t} keys={[{ f: 0, p: { x: 1180, y: LOT.ground - 140, scale: 1, yaw: 0.5, look: 0.6, headTilt: -6, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } }]} face={[[0, 'tired'], [70, 'happy']]} rim="rimR" />
    {[[-20, -200], [10, -60]].map(([dx, dy], i) => <Ache key={i} x={1180 + dx} y={LOT.ground - 140 + dy} t={t} s={0.8} />)}
  </g>
);

// ---------- home again ----------
const AT_TABLE = (() => { const s = stand(APT, 0.52, 0.42); return { x: s.x, y: s.y + 46 * s.scale, scale: s.scale }; })();
const SEAT = { ...AT_TABLE, yaw: -0.3, look: -0.4, armL: { a: 50, b: 50 }, armR: { a: 55, b: 45 } };
const rmPath = (t: number) => {
  const u = 0.1 + 0.27 * easeInOut(clamp(t / 110));
  const s = stand(APT, u, 0.64);
  return walkPose(s.x, walkPhase((u - 0.1) * 1800, s.scale), APT.P(u, 1, 0.64).y, s.scale, { yaw: 0.55, look: 0.2, headTilt: 10, tilt: 6, armL: { a: 6, b: -4 }, armR: { a: 6, b: -4 }, expr: 'tired' });
};
const RM_AT = (() => { const s = stand(APT, 0.36, 0.64); return { ...basePose, ...s }; })();
const Home: React.FC<{ t: number; id: string; me?: Partial<Pose>; face?: [number, any][]; hurt?: number; rm?: Pose | null; peas?: number }> = ({ t, id, me = {}, face = [[0, 'neutral']], hurt = 0, rm = null, peas = 0 }) => (
  <g>
    <Apartment t={t} id={id} />
    <Act t={t} keys={[{ f: 0, p: { ...SEAT, ...me } }]} face={face} hurt={hurt} />
    <AptTable />
    {(() => { const p = aptTop(0.47, 0.35); return <g transform={`translate(${p.x} ${p.y - 20}) scale(0.5)`}>{peas > 0 ? <Peas x={0} y={0} /> : null}</g>; })()}
    {(() => { const p = aptTop(0.6, 0.4); return peas > 1 ? <g transform={`translate(${p.x} ${p.y - 20}) scale(0.5)`}><Peas x={0} y={0} rot={10} /></g> : null; })()}
    {rm ? <Hero look={ROOMMATE} pose={rm} rimId="rimL" shadow={0.5} /> : null}
  </g>
);

// ---------- S24: wide: home; the roommate shuffles in, again ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [900, 560, 1.12])}>
    <Home t={t + 200} id="h24" me={{ look: -0.7, yaw: -0.35, headTilt: 8 }} face={[[0, 'tired']]} rm={{ ...rmPath(t - 20), blink: 0.7 }} />
  </g>
);

// ---------- S25: low insert: his toe slams into the table leg (same as chapter 1) ----------
// leg@63: the hit at 58
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 28) / 30));
  const back = t > 58 ? 20 * Math.exp(-(t - 58) / 6) : 0;
  return (
    <g transform={`translate(${shake(t, 58, 8, 14)} 0)`}>
      <rect x={0} y={0} width={1920} height={1080} fill="#2E2230" />
      <rect x={0} y={760} width={1920} height={320} fill="#3A2C2A" />
      <Glow x={1500} y={300} r={700} o={0.5} />
      <rect x={1180} y={-40} width={110} height={830} fill="#5E3E30" />
      <rect x={1180} y={-40} width={16} height={830} fill="#FFB46A" opacity={0.4} />
      <ellipse cx={1235} cy={796} rx={110} ry={16} fill="#000" opacity={0.4} />
      <Foot x={300 + 760 * k - back} y={800} s={1.15} c="#5A3A5A" rot={t > 58 && t < 66 ? -6 : 0} />
      <Ring x={1150} y={720} t={t - 58} s={1.4} />
      <Tag x={300} y={180} t={t - 85} text="AGAIN" w={180} />
    </g>
  );
};

// ---------- S26: close-up: OUCH ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g transform={`translate(${shake(t, 0, 10, 12)} 0)`}>
      <CU t={t} len={len} face={[[0, 'shock'], [70, 'oops']]} hurt={1} p={{ headTilt: kf(t, [[0, 8], [10, -6], [30, 0]]), yaw: -0.15 }}
        bg={<g transform="translate(-900 -600) scale(2.2)"><Apartment t={t} id="h26" /></g>} />
      <FloatLabel x={h.x + 420} y={300} t={t - 4} text="OUCH!" color={RED} size={110} />
    </g>
  );
};

// ---------- S27: medium: you laugh ----------
// laugh@101
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [AT_TABLE.x, 560, 1.85], [AT_TABLE.x, 560, 1.95])}>
    <Home t={t + 300} id="h27" face={[[0, 'oops'], [60, 'neutral'], [96, 'happy']]} hurt={0.6}
      me={{ yaw: 0.05, look: 0, tilt: t > 96 ? -6 + Math.sin(t / 3) * 3 : 0, headTilt: t > 96 ? -12 : 0, armL: { a: t > 96 ? 70 : 50, b: 60 }, armR: { a: t > 96 ? 70 : 55, b: 60 } }} />
    <Sparkle x={AT_TABLE.x + 200} y={350} t={t - 100} s={1} />
  </g>
);

// ---------- S28: medium: the roommate stares at you like you're crazy ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [RM_AT.x + 80, RM_AT.y - 120, 2.0], [RM_AT.x + 80, RM_AT.y - 120, 2.1])}>
    <Home t={t + 400} id="h28" face={[[0, 'happy']]} rm={{ ...RM_AT, yaw: 0.5, look: 0.8, headTilt: 10, armL: { a: 20, b: 40 }, armR: { a: 30, b: 60 }, expr: 'worried' }} />
  </g>
);

// ---------- S29: insert: two bags of frozen peas from the freezer ----------
// grab@14 peas@62
export const S29: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 10) / 16));
  return (
    <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.06])}>
      <rect x={0} y={0} width={1920} height={1080} fill="#BFE6F2" />
      <rect x={0} y={0} width={1920} height={1080} fill="#0A2030" opacity={0.25} />
      {[300, 560, 820].map((y) => <rect key={y} x={0} y={y} width={1920} height={14} fill="#E6F6FA" />)}
      <Glow x={960} y={200} r={900} kind="cool" o={0.6} />
      <rect x={180} y={600} width={300} height={200} rx={20} fill="#E6E0D4" />
      <rect x={1460} y={620} width={260} height={180} rx={20} fill="#F2B0B8" />
      <Peas x={760 + 60 * k} y={600 - 60 * k} s={2.2} rot={-8} />
      <Peas x={1160 + 40 * k} y={620 - 80 * k} s={2.2} rot={8} />
      <path d={`M ${2100} ${900} Q 1700 ${700 - 60 * k} ${1360 + 40 * k} ${560 - 60 * k}`} stroke={HERO.jacket} strokeWidth={150} strokeLinecap="round" fill="none" />
      <ellipse cx={1300 + 40 * k} cy={540 - 60 * k} rx={120} ry={95} fill={HERO.hand} stroke={HERO.line} strokeWidth={8} />
    </g>
  );
};

// ---------- S30: medium two-shot: one for him, one for you ----------
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const give = easeInOut(clamp((t - 4) / 16));
  return (
    <g transform={cam(t, len, [(RM_AT.x + AT_TABLE.x) / 2, 460, 1.55], [(RM_AT.x + AT_TABLE.x) / 2, 460, 1.62])}>
      <Home t={t + 500} id="h30" face={[[0, 'happy']]} me={{ yaw: -0.5, look: -0.7, armR: { a: 30 + 60 * give, b: 20 } }} peas={t > 32 ? 1 : 0}
        rm={{ ...RM_AT, yaw: 0.5, look: 0.7, armR: { a: 20 + 60 * give, b: 30 }, expr: t > 20 ? 'happy' : 'worried' }} />
      <g transform={`translate(${AT_TABLE.x - 160 * give - 60} ${AT_TABLE.y - 120}) scale(0.45)`}><Peas x={0} y={0} rot={-10} /></g>
    </g>
  );
};

// ---------- S31: wide: pull back: the two of you at the table in the sunrise ----------
export const S31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [AT_TABLE.x, 520, 1.5], [960, 540, 0.95])}>
    <Home t={t + 600} id="h31" face={[[0, 'happy']]} me={{ yaw: -0.4, look: -0.6, armL: { a: 40, b: 60 } }} peas={2}
      rm={{ ...RM_AT, y: RM_AT.y + 46 * RM_AT.scale, yaw: 0.4, look: 0.6, expr: 'happy', armL: { a: 40, b: 60 } }} />
    <Glow x={1060} y={520} r={600} o={0.25} />
  </g>
);

// ---------- S32: close-up, to camera: would you want this power? ----------
export const S32: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CU t={t} len={len} face={[[0, 'happy'], [64, 'smug'], [118, 'happy']]} p={{ yaw: 0, look: 0, headTilt: kf(t, [[0, 0], [60, 6], [118, -4]]) }}
      bg={<g transform="translate(-1000 -650) scale(2.2)"><Apartment t={t + 700} id="h32" /></g>} />
    <text x={1500} y={330} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={700} fontSize={170} fill="#FFE27A" opacity={clamp((t - 44) / 8)}>?</text>
  </g>
);
