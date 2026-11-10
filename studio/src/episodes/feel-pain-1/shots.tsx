import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, easeInOut, camT, stand, TitleCard, Glow, Foreground, Tabletop, Bowl, Phone, Tag, FloatLabel,
  Schematic, SCH, SchLabel, DrawOn, PaperStack, Sparkle, ShotProps, walkPose, walkPhase, shake,
} from '../../engine';
import { APT, Apartment, AptTable, aptTop, Bus, BUS, Office, OfficeDesk, OFFICE, LivingRoom, Couch, Street, STREET, Backyard } from './sets';
import {
  HERO, ROOMMATE, BUDDY, KID_A, KID_B, ENVELOPE_GUY, SANDWICH_LADY, COWORKER, NEIGHBOR, PASSER1, PASSER2, RED,
  Ring, Throb, Act, CU, cuHead, cam, Realize, onFloor, Foot, Envelope, Sandwich, Stapler, Hammer,
} from './kit';

// Chapter 1: the power. Thirty shots: the street (title), the living room, the apartment at dawn, the bus, the office,
// the street again and the neighbor's yard. Red is the power: a ring where someone else gets hurt, a throb on you.

const TITLE: [string, string] = ['WHAT IF YOU COULD', "FEEL EVERYONE'S PAIN?"];

// the hero at the apartment table (sitting: hips dropped behind the table), the roommate's path in front of it
const AT_TABLE = (() => { const s = stand(APT, 0.52, 0.42); return { x: s.x, y: s.y + 46 * s.scale, scale: s.scale }; })();
const SEAT = { ...AT_TABLE, yaw: -0.3, look: -0.4, armL: { a: 50, b: 50 }, armR: { a: 55, b: 45 } };
const AptScene: React.FC<{ t: number; id: string; me?: Partial<Pose>; face?: [number, any][]; hurt?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, me = {}, face = [[0, 'neutral']], hurt = 0, children, front }) => (
  <g>
    <Apartment t={t} id={id} />
    {children}
    <Act t={t} keys={[{ f: 0, p: { ...SEAT, ...me } }]} face={face} hurt={hurt} />
    <AptTable />
    {(() => { const p = aptTop(0.47, 0.35); return <Bowl x={p.x} y={p.y} s={0.9} />; })()}
    {front}
  </g>
);

// ---------- S1: wide, title: the street at dusk, you walk past the shops ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = 300 + t * 4.2;
  const s = 0.95;
  return (
    <g>
      <g transform={cam(t, len, [700, 560, 0.85], [760, 560, 0.9])}>
        <Street t={t} id="s1" />
        <Hero look={HERO} pose={walkPose(x, walkPhase(x - 300, s), STREET.walk, s, { look: 0.3, yaw: 0.6 })} rimId="rimR" shadow={0.5} />
        <Hero look={PASSER1} pose={walkPose(1300 - t * 3.6, walkPhase(t * 3.6, 0.9), STREET.walk, 0.9, { yaw: -0.6 }, -1)} rimId="rimL" shadow={0.5} />
      </g>
      <TitleCard t={t - 46} lines={TITLE} accent="PAIN" accentT={44} size={104} />
    </g>
  );
};

// ---------- S2: medium two-shot: your buddy's cracked phone, "I feel your pain" ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pat = Math.sin(clamp((t - 30) / 40) * Math.PI * 3) * 8;
  return (
    <g transform={cam(t, len, [960, 560, 1.55], [960, 570, 1.65])}>
      <LivingRoom t={t + 40} id="s2" screen={<rect x={0} y={0} width={1920} height={1080} fill="#101418" />} tvLight="#101418" />
      <Act t={t} look={BUDDY} keys={[{ f: 0, p: { x: 1090, y: 700, scale: 1.25, yaw: -0.4, look: -0.6, armR: { a: 70, b: 70 }, armL: { a: 20, b: -10 } } }]} face={[[0, 'worried']]} rim="rimL" shadow={0} />
      <Act t={t} keys={[{ f: 0, p: { x: 820, y: 705, scale: 1.25, yaw: 0.45, look: 0.6, armR: { a: 95 + pat, b: 10 }, armL: { a: 14, b: -6 } } }]} face={[[0, 'neutral'], [36, 'worried']]} />
      <Couch y={760} w={760} />
      <g transform="translate(1010 640) rotate(-18)">
        <Phone x={0} y={0} w={110} on={1} f={t} />
        <path d="M -40 -70 L 10 -20 L -10 10 L 30 60 M 10 -20 L 45 -40" stroke="#F6EFE3" strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

// ---------- S3: close-up: I mean actually feel it ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} face={[[0, 'neutral']]} p={{ yaw: 0.05, look: 0, headTilt: kf(t, [[0, 0], [30, -4]]) }} hurt={clamp((t - 30) / 10) * 0.8}
    bg={<g transform="translate(-1000 -700) scale(2.2)"><Apartment t={t} id="s3" /></g>} />
);

// ---------- S4: wide, morning: you stretch by the window ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(APT, 0.6, 0.25);
  return (
    <g transform={cam(t, len, [960, 540, 1.0], [980, 540, 1.06])}>
      <Apartment t={t + 100} id="s4" veil={0.3} />
      <Act t={t} keys={[
        { f: 0, p: { ...s, yaw: 0.2, look: 0.3, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 }, headTilt: 8 } },
        { f: 20, p: { armL: { a: 168, b: 10 }, armR: { a: 168, b: 10 }, headTilt: -10, squash: -0.04 }, ease: easeOut },
        { f: 60, p: { armL: { a: 172, b: 6 }, armR: { a: 172, b: 6 } } },
      ]} face={[[0, 'tired'], [24, 'happy']]} />
      <AptTable />
    </g>
  );
};

// ---------- S5: schematic, the rule: a hurt seen on one figure lands on the other ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const other: Pose = { ...basePose, x: 560, y: 640, scale: 1.25, yaw: 0.4, expr: t > 12 ? 'shock' : 'neutral', armL: { a: 30, b: 20 }, armR: { a: 30, b: 20 } };
  const me: Pose = { ...basePose, x: 1360, y: 640, scale: 1.25, yaw: -0.4, look: -0.6, expr: t > 52 ? 'shock' : 'neutral', glint: t > 52 ? 1 : 0, glintColor: RED };
  return (
    <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
      <Schematic t={t} id="sc5" />
      <Hero look={PASSER2} pose={other} shadow={0} />
      <Hero look={HERO} pose={me} shadow={0} />
      {/* the eye line: you see it */}
      <DrawOn d="M 1300 420 C 1100 360 800 380 620 760" t={t - 18} dur={16} color={SCH.dim} width={4} />
      <Ring x={600} y={810} t={t - 12} s={0.8} />
      <Throb x={1330} y={810} t={t - 52} s={0.7} />
      <SchLabel x={560} y={960} t={t - 20} text="YOU SEE IT" size={40} color={SCH.dim} />
      <SchLabel x={1360} y={960} t={t - 52} text="YOU FEEL IT" size={40} color={RED} />
      <SchLabel x={960} y={170} t={t - 80} text="SAME SPOT" size={64} />
      <SchLabel x={960} y={250} t={t - 108} text="SAME STRENGTH" size={64} color={SCH.live} />
    </g>
  );
};

// ---------- S6: wide, the roommate shuffles in half asleep; you at the table with cereal ----------
const rmPath = (t: number) => {
  const u = 0.1 + 0.27 * easeInOut(clamp(t / 110));
  const s = stand(APT, u, 0.64);
  return walkPose(s.x, walkPhase((u - 0.1) * 1800, s.scale), APT.P(u, 1, 0.64).y, s.scale, { yaw: 0.55, look: 0.2, headTilt: 10, tilt: 6, armL: { a: 6, b: -4 }, armR: { a: 6, b: -4 }, expr: 'tired' });
};
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [900, 560, 1.12])}>
    <AptScene t={t + 200} id="s6" me={{ look: -0.7, yaw: -0.35 }} face={[[0, 'happy']]}
      front={<Hero look={ROOMMATE} pose={{ ...rmPath(t), blink: 0.7 }} rimId="rimL" shadow={0.5} />} />
  </g>
);

// ---------- S7: low insert: his sock slams into the table leg ----------
// slams@2, leg@45: the hit lands at 40
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 26) / 30));
  const back = t > 56 ? 20 * Math.exp(-(t - 56) / 6) : 0;
  return (
    <g transform={`translate(${shake(t, 56, 8, 14)} 0)`}>
      <rect x={0} y={0} width={1920} height={1080} fill="#2E2230" />
      <rect x={0} y={760} width={1920} height={320} fill="#3A2C2A" />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${i * 300 - 200} 1080 L ${i * 260 + 100} 760`} stroke="#2A1E1C" strokeWidth={4} />)}
      <Glow x={1500} y={300} r={700} o={0.4} />
      {/* the table leg */}
      <rect x={1180} y={-40} width={110} height={830} fill="#5E3E30" />
      <rect x={1180} y={-40} width={16} height={830} fill="#FFB46A" opacity={0.4} />
      <ellipse cx={1235} cy={796} rx={110} ry={16} fill="#000" opacity={0.4} />
      <Foot x={300 + 760 * k - back} y={800} s={1.15} c="#5A3A5A" rot={t > 56 && t < 64 ? -6 : 0} />
      <Ring x={1150} y={720} t={t - 56} s={1.4} />
    </g>
  );
};

// ---------- S8: close-up: OUCH ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g transform={`translate(${shake(t, 0, 10, 12)} 0)`}>
      <CU t={t} len={len} face={[[0, 'shock']]} hurt={1} p={{ headTilt: kf(t, [[0, 8], [10, -6], [30, 0]]), yaw: -0.15 }}
        bg={<g transform="translate(-900 -600) scale(2.2)"><Apartment t={t} id="s8" /></g>} />
      <rect x={0} y={0} width={1920} height={1080} fill={RED} opacity={0.25 * Math.exp(-t / 12)} style={{ mixBlendMode: 'screen' }} />
      <FloatLabel x={h.x + 420} y={300} t={t - 4} text="OUCH!" color={RED} size={110} />
    </g>
  );
};

// ---------- S9: top-down insert: your spoon and cereal splash down ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 10));
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.03}) translate(-960 -540)`}>
      <Tabletop edge={1300} />
      <circle cx={960} cy={560} r={250} fill="#000" opacity={0.3} transform="translate(16 20)" />
      <circle cx={960} cy={560} r={250} fill="#E8E2D6" />
      <circle cx={960} cy={560} r={200} fill="#F6F2EA" />
      {Array.from({ length: 22 }).map((_, i) => <ellipse key={i} cx={960 + Math.cos(i * 2.4) * 140 * ((i % 5) / 5 + 0.3)} cy={560 + Math.sin(i * 2.4) * 140 * ((i % 5) / 5 + 0.3)} rx={24} ry={16} fill="#E9B44A" transform={`rotate(${i * 40} ${960 + Math.cos(i * 2.4) * 100} ${560 + Math.sin(i * 2.4) * 100})`} />)}
      {/* the splash: milk drops and flakes flying out */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = i * 0.52 + 0.3;
        const r = 230 + 220 * k;
        return <circle key={i} cx={960 + Math.cos(a) * r} cy={560 + Math.sin(a) * r} r={14 - i % 3 * 3} fill={i % 3 ? '#F6F2EA' : '#E9B44A'} opacity={1 - clamp((t - 20) / 30)} />;
      })}
      <g transform={`translate(${1240 - 40 * k} ${520 + 30 * k}) rotate(${30 + 20 * k})`}>
        <rect x={-20} y={-250} width={40} height={250} rx={18} fill="#C8CCD0" />
        <ellipse cx={0} cy={-270} rx={50} ry={70} fill="#C8CCD0" />
      </g>
    </g>
  );
};

// ---------- S10: low insert: your sock foot under the table, glowing, touching nothing ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [980, 560, 1.08])}>
    <rect x={0} y={0} width={1920} height={1080} fill="#241A22" />
    <rect x={0} y={760} width={1920} height={320} fill="#3A2C2A" />
    <rect x={260} y={-40} width={90} height={830} fill="#4E342A" />
    <rect x={1600} y={-40} width={90} height={830} fill="#4E342A" />
    <rect x={0} y={-40} width={1920} height={120} fill="#5E3E30" />
    <Glow x={960} y={300} r={600} o={0.2} />
    <Foot x={1040} y={800} s={1.1} c="#3A3A44" rot={kf(t, [[0, 0], [10, -4], [30, 0], [64, -3], [80, 0]])} />
    <Throb x={1100} y={740} t={t} s={1.3} />
  </g>
);

// ---------- S11: medium, puzzled: okay, weird, maybe you slept on it funny ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [AT_TABLE.x, 560, 1.85], [AT_TABLE.x + 20, 560, 1.95])}>
    <AptScene t={t + 300} id="s11" face={[[0, 'worried'], [30, 'oops'], [60, 'neutral'], [88, 'smug']]}
      me={{ yaw: 0.1, look: 0, headTilt: kf(t, [[0, 0], [30, 10], [60, -6], [90, 0]]), armL: { a: kf(t, [[0, 50], [60, 50], [70, 70], [100, 50]]), b: 60 }, armR: { a: kf(t, [[0, 55], [60, 55], [70, 75], [100, 55]]), b: 60 } }} />
  </g>
);

// ---------- the bus: passengers face the camera (we look toward the back of the bus) ----------
const seat = (u: number, w: number) => { const p = BUS.P(u, 0.6, w); return { x: p.x, y: p.y, scale: 0.38 * BUS.s(w) }; };
const SITTER = (u: number, w: number, extra: Partial<Pose> = {}): Pose => ({ ...basePose, ...seat(u, w), legL: { a: 80, b: -80 }, legR: { a: 78, b: -80 }, ...extra });

// ---------- S12: wide, the bus: a kid flicks his little sister's ear; you a row behind ----------
// ear@62: the flick at 58
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const flick = clamp((t - 50) / 8);
  return (
    <g transform={cam(t, len, [960, 470, 1.45], [960, 470, 1.52])}>
      <Bus t={t} id="s12" />
      <Hero look={HERO} pose={SITTER(0.8, 0.62, { yaw: -0.3, look: -0.6 })} rimId="rimL" shadow={0} />
      <Hero look={KID_A} pose={SITTER(0.14, 0.7, { scale: seat(0.14, 0.7).scale * 0.75, yaw: 0.4, look: 0.6, armR: { a: 40 + 50 * flick, b: 40 }, expr: 'smug' })} shadow={0} />
      <Hero look={KID_B} pose={SITTER(0.26, 0.7, { scale: seat(0.26, 0.7).scale * 0.65, yaw: -0.2, expr: t > 58 ? 'shock' : 'happy', headTilt: t > 58 ? 10 : 0 })} shadow={0} />
      <Ring x={seat(0.26, 0.7).x - 30} y={seat(0.26, 0.7).y - 170} t={t - 58} s={0.8} />
    </g>
  );
};

// ---------- S13: close-up: your ear stings ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [8, 'shock']]} hurt={1} p={{ yaw: 0.25, headTilt: kf(t, [[0, 0], [10, 12], [40, 8]]) }}
        bg={<g transform="translate(-700 -500) scale(2.2)"><Bus t={t} id="s13" /></g>} />
      <Throb x={h.x - h.r * 0.95} y={h.y + 10} t={t - 6} s={1.2} />
    </g>
  );
};

// ---------- S14: medium: a man opens an envelope: a paper cut ----------
// cuts@13: the cut at 20
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const p = SITTER(0.18, 0.6, { yaw: 0.35, look: 0.5, armR: { a: 70, b: 60 }, armL: { a: 60, b: 70 }, expr: t > 20 ? 'shock' : 'neutral' });
  return (
    <g transform={cam(t, len, [p.x + 60, p.y - 120, 2.3], [p.x + 60, p.y - 120, 2.4])}>
      <Bus t={t + 80} id="s14" />
      <Hero look={ENVELOPE_GUY} pose={p} shadow={0} />
      <Envelope x={p.x + 70} y={p.y - 50} s={0.45} rot={-10} open={clamp((t - 6) / 14)} />
      <Ring x={p.x + 40} y={p.y - 40} t={t - 20} s={0.4} />
    </g>
  );
};

// ---------- S15: insert: your hand, the same finger glows ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.06])}>
    <g filter="url(#blur16)"><g transform="translate(-600 -400) scale(1.8)"><Bus t={t} id="s15" /></g></g>
    <rect x={0} y={0} width={1920} height={1080} fill="#050712" opacity={0.3} />
    <path d="M -100 1150 Q 500 900 760 700" stroke={HERO.jacket} strokeWidth={170} strokeLinecap="round" fill="none" />
    <ellipse cx={860} cy={640} rx={150} ry={120} fill={HERO.hand} stroke={HERO.line} strokeWidth={8} transform={`rotate(-20 860 640) translate(0 ${Math.sin(t / 3) * 3})`} />
    <path d="M 960 560 Q 1080 470 1130 500" stroke={HERO.hand} strokeWidth={60} strokeLinecap="round" fill="none" />
    <Throb x={1120} y={500} t={t - 4} s={0.9} />
  </g>
);

// ---------- S16: medium two-shot: she bites her tongue on a sandwich; you bite yours ----------
// bites@33 (her bite at 34), biting@109 (yours at 100)
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const lady = SITTER(0.2, 0.55, { yaw: 0.4, look: 0.4, armR: { a: 120, b: 80 }, expr: t > 34 ? 'shock' : 'happy', headTilt: t > 34 ? -8 : 0 });
  const me = SITTER(0.8, 0.55, { yaw: -0.4, look: -0.5, expr: t > 96 ? 'oops' : t > 40 ? 'worried' : 'neutral', headTilt: t > 96 ? 8 : 0, glint: t > 96 ? 1 : 0, glintColor: RED });
  return (
    <g transform={cam(t, len, [960, 400, 1.5], [960, 410, 1.6])}>
      <Bus t={t + 140} id="s16" />
      <Hero look={SANDWICH_LADY} pose={lady} shadow={0} />
      <Sandwich x={lady.x + 60} y={lady.y - 170} s={0.5} rot={-20} />
      <Hero look={HERO} pose={me} rimId="rimL" shadow={0} />
      <Ring x={lady.x + 30} y={lady.y - 165} t={t - 34} s={0.5} />
      <Throb x={me.x - 18} y={me.y - 160} t={t - 98} s={0.45} />
    </g>
  );
};

// ---------- the office ----------
const DESK = stand(OFFICE, 0.5, 0.55);
const DeskScene: React.FC<{ t: number; id: string; me: Partial<Pose>; face: [number, any][]; hurt?: number; children?: React.ReactNode; front?: React.ReactNode; veil?: number }> = ({ t, id, me, face, hurt = 0, children, front, veil }) => (
  <g>
    <Office t={t} id={id} veil={veil} />
    {children}
    <Act t={t} keys={[{ f: 0, p: { ...DESK, y: DESK.y + 40 * DESK.scale, yaw: 0.2, armL: { a: 40, b: 50 }, armR: { a: 40, b: 50 }, ...me } }]} face={face} hurt={hurt} />
    <OfficeDesk u={0.5} w={0.62} mon="#9FD0FF" />
    {front}
  </g>
);

// ---------- S17: wide, the office: you trudge to your desk; the tally ----------
// three@59 toes@81 hangnail@107 sunburn@133
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const u = 0.2 + 0.28 * easeInOut(clamp(t / 70));
  const s = stand(OFFICE, u, 0.55);
  return (
    <g>
      <g transform={cam(t, len, [960, 540, 1.0], [980, 550, 1.06])}>
        <Office t={t} id="s17" veil={0.32} />
        <Hero look={HERO} pose={walkPose(s.x, walkPhase((u - 0.2) * 1600, s.scale), OFFICE.P(u, 1, 0.55).y, s.scale, { yaw: 0.6, look: 0.3, headTilt: 12, tilt: 4, expr: 'tired' })} shadow={0.5} />
        <OfficeDesk u={0.5} w={0.62} />
      </g>
      <Tag x={1520} y={200} t={t - 70} text="3 STUBBED TOES" w={330} />
      <Tag x={1520} y={300} t={t - 104} text="1 HANGNAIL" w={260} />
      <Tag x={1520} y={400} t={t - 130} text="1 SUNBURN (NOT YOURS)" w={440} />
    </g>
  );
};

// ---------- S18: close-up: you close your eyes; the red fades; silence ----------
// close@71 eyes@84 Nothing@110 Silence@137
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const shut = clamp((t - 80) / 8);
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'tired']]} p={{ yaw: 0.1, blink: shut, headTilt: kf(t, [[0, 0], [90, -4]]) }} hurt={0}
        bg={<g transform="translate(-900 -500) scale(2.2)"><Office t={t} id="s18" /></g>} />
      {[[-0.9, 0.2], [0.8, 0.6], [0.2, 1.1]].map(([dx, dy], i) => <Throb key={i} x={h.x + dx * h.r} y={h.y + dy * h.r} t={20 + t} s={0.6} o={1 - shut} />)}
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.25 * shut} />
    </g>
  );
};

// ---------- S19: medium: eyes shut, leaning back, relieved ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [DESK.x, 470, 1.9], [DESK.x, 470, 2.0])}>
    <DeskScene t={t + 400} id="s19" face={[[0, 'happy']]} me={{ blink: 1, tilt: -6, headTilt: -8, armL: { a: 160, b: 120 }, armR: { a: 160, b: 120 } }} />
  </g>
);

// ---------- S20: schematic: TOUCH (a hand) crossed out; SEEING (an eye) ticked ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [960, 540, 1.0], [960, 540, 1.04])}>
    <Schematic t={t} id="sc20" />
    <DrawOn d="M 460 700 L 460 470 Q 460 440 490 440 Q 520 440 520 470 L 520 600 L 520 420 Q 520 390 550 390 Q 580 390 580 420 L 580 600 L 580 410 Q 580 380 610 380 Q 640 380 640 410 L 640 610 L 640 450 Q 640 420 670 420 Q 700 420 700 450 L 700 720 Q 700 820 600 830 L 520 830 Q 460 820 440 760 L 400 640 Q 395 610 420 605 Q 445 600 460 640" t={t - 4} dur={18} />
    <SchLabel x={560} y={930} t={t - 20} text="TOUCH" size={56} />
    {t > 50 ? <path d="M 380 380 L 760 860 M 760 380 L 380 860" stroke={RED} strokeWidth={16} strokeLinecap="round" strokeDasharray={1300} strokeDashoffset={1300 * (1 - clamp((t - 50) / 10))} /> : null}
    <DrawOn d="M 1160 620 Q 1360 440 1560 620 Q 1360 800 1160 620 Z" t={t - 56} dur={14} width={7} />
    {t > 64 ? <circle cx={1360} cy={620} r={70 * easeOut(clamp((t - 64) / 8))} fill={SCH.live} /> : null}
    {t > 64 ? <circle cx={1360} cy={620} r={30 * easeOut(clamp((t - 64) / 8))} fill={SCH.ground} /> : null}
    <SchLabel x={1360} y={930} t={t - 70} text="SEEING" size={56} color={SCH.live} />
    <Tag x={1600} y={420} t={t - 76} text="IT'S THIS" mark="check" w={220} />
  </g>
);

// ---------- S21: close-up: an idea ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'neutral'], [22, 'smug']]} p={{ yaw: 0.3, look: 0.5, headTilt: kf(t, [[0, 0], [24, -6]]) }}
        bg={<g transform="translate(-900 -500) scale(2.2)"><Office t={t + 50} id="s21" /></g>} />
      <Realize x={h.x + 120} y={h.y - 120} t={t - 22} />
      <Sparkle x={h.x + 360} y={h.y - 260} t={t - 24} s={1.4} />
    </g>
  );
};

// ---------- S22: medium: your coworker raises the stapler over a stack of papers ----------
// staple@44
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const cw = stand(OFFICE, 0.66, 0.55);
  const lift = clamp((t - 30) / 20);
  return (
    <g transform={cam(t, len, [1080, 470, 1.7], [1090, 470, 1.8])}>
      <DeskScene t={t + 500} id="s22" face={[[0, 'neutral'], [60, 'worried']]} me={{ yaw: 0.5, look: 0.7 }}
        front={
          <g>
            <Act t={t} look={COWORKER} keys={[{ f: 0, p: { ...cw, y: cw.y + 40 * cw.scale, yaw: -0.3, look: -0.4, armR: { a: 30 + 70 * lift, b: 40 }, armL: { a: 40, b: 50 } } }]} face={[[0, 'happy']]} rim="rimL" shadow={0} />
            <OfficeDesk u={0.7} w={0.62} mon="#FFD7A0" />
            <PaperStack x={cw.x - 40} y={OFFICE.P(0.66, 0.73, 0.62).y} n={8} w={120} />
            <Stapler x={cw.x - 40} y={OFFICE.P(0.66, 0.73, 0.62).y - 40 - 90 * lift} s={0.45} />
          </g>
        } />
    </g>
  );
};

// ---------- S23: medium close: you snap your head away, eyes shut; clack, ow ----------
// clack@57 ow@94
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const away = easeOut(clamp((t - 6) / 6));
  return (
    <g transform={cam(t, len, [DESK.x + 60, 450, 2.4], [DESK.x + 60, 450, 2.5])}>
      <DeskScene t={t + 600} id="s23" face={[[0, 'worried'], [12, 'smug']]} me={{ yaw: 0.5 - 1.2 * away, look: -0.6 * away, blink: away, headTilt: -10 * away, tilt: -4 * away }} />
      <Foreground blur={16}><rect x={1500} y={300} width={500} height={600} fill="#1A1820" /></Foreground>
    </g>
  );
};

// ---------- S24: close-up: nothing. One eye opens, smug ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} face={[[0, 'smug'], [20, 'cool']]} p={{ yaw: -0.2, look: 0.3, headTilt: kf(t, [[0, -4], [20, 4]]) }}
    bg={<g transform="translate(-900 -500) scale(2.2)"><Office t={t + 90} id="s24" /></g>} />
);

// ---------- S25: medium: arms up in your chair: genius ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={cam(t, len, [DESK.x, 470, 1.6], [DESK.x, 480, 1.7])}>
    <DeskScene t={t + 700} id="s25" face={[[0, 'happy'], [40, 'smug']]} me={{ armL: { a: kf(t, [[0, 40], [10, 165]], easeOut), b: 10 }, armR: { a: kf(t, [[0, 40], [10, 165]], easeOut), b: 10 }, tilt: -4, headTilt: -8, yaw: 0.1 }} />
    <Sparkle x={DESK.x - 160} y={300} t={t - 10} s={1} />
    <Sparkle x={DESK.x + 180} y={260} t={t - 14} s={0.8} />
  </g>
);

// ---------- S26: close-up: easy, right? A grin ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <CU t={t} len={len} face={[[0, 'happy']]} p={{ yaw: 0.35, look: 0.2, headTilt: kf(t, [[0, 0], [20, -6], [len, -4]]) }}
    bg={<g transform="translate(-900 -500) scale(2.2)"><Office t={t + 140} id="s26" /></g>} />
);

// ---------- S27: wide, the street: a man trips on the curb ----------
// trip@48
export const S27: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1100 + t * 3;
  const trip = clamp((t - 44) / 10);
  return (
    <g transform={cam(t, len, [1100, 560, 1.15], [1120, 560, 1.2])}>
      <Street t={t + 200} id="s27" />
      <Hero look={PASSER2} pose={{ ...walkPose(x, walkPhase(t * 3, 1), STREET.walk, 1, { yaw: 0.6, look: 0.4 }), tilt: 30 * trip, armL: { a: 10 + 100 * trip, b: 20 }, armR: { a: 10 + 120 * trip, b: 20 }, expr: trip > 0 ? 'shock' : 'neutral' }} shadow={0.5} />
      <Ring x={x + 40} y={STREET.walk - 10} t={t - 48} s={0.8} />
    </g>
  );
};

// ---------- S28: wide, the park: a kid drops off the monkey bars ----------
// fall@19
export const S28: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeOut(clamp((t - 14) / 10));
  const kid: Pose = { ...basePose, x: 1960, y: 700 + 60 * fall, scale: 0.7, armL: { a: 175 - 150 * fall, b: 0 }, armR: { a: 175 - 140 * fall, b: 0 }, legL: { a: 10 - 60 * fall, b: 40 * fall }, legR: { a: -10 - 50 * fall, b: 50 * fall }, expr: fall > 0.5 ? 'shock' : 'happy', squash: fall > 0.9 ? 0.15 : 0 };
  return (
    <g transform={cam(t, len, [1960, 560, 1.3], [1960, 580, 1.4])}>
      <Street t={t + 260} id="s28" />
      <Hero look={KID_A} pose={kid} shadow={0.5 * fall} />
      <Ring x={1960} y={810} t={t - 24} s={0.8} />
    </g>
  );
};

// ---------- S29: medium, over the fence: the neighbor hammers his own thumb ----------
// thumb@38
export const S29: React.FC<ShotProps> = ({ t, len }) => {
  const swing = Math.sin(clamp(t / 44) * Math.PI * 3);
  const hit = t > 44 && t < 50;
  const nb: Pose = { ...basePose, x: 1000, y: 640, scale: 1.4, yaw: 0.3, look: 0.6, armR: { a: 110 + 40 * swing, b: 60 }, armL: { a: 70, b: 70 }, expr: t > 46 ? 'shock' : 'neutral' };
  return (
    <g transform={cam(t, len, [1000, 560, 1.6], [1000, 560, 1.68])}>
      <Backyard t={t} id="s29" castle={false} />
      <Hero look={NEIGHBOR} pose={nb} shadow={0} />
      {/* the fence top in front of him, a plank he's nailing */}
      <rect x={600} y={700} width={800} height={200} fill="#80604A" />
      {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={600 + i * 74} y={696} width={66} height={210} fill={i % 2 ? '#8A6850' : '#80604A'} />)}
      <rect x={880} y={680} width={300} height={36} fill="#9A7458" />
      <Hammer x={1100} y={hit ? 640 : 560 - 40 * swing} rot={hit ? -80 : -40 - 40 * swing} s={1.2} />
      <Ring x={1080} y={690} t={t - 46} s={0.8} />
    </g>
  );
};

// ---------- S30: close-up: you can't close your eyes forever ----------
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const h = cuHead(len, t);
  return (
    <g>
      <CU t={t} len={len} face={[[0, 'worried']]} p={{ yaw: 0.05, look: kf(t, [[0, -0.6], [20, 0.6], [40, 0]]), headTilt: 4 }}
        bg={<g transform="translate(-1000 -700) scale(2.2)"><Street t={t} id="s30" /></g>} />
      {[[300, 300, 0], [1650, 240, 12], [220, 820, 22], [1700, 820, 30]].map(([x, y, d], i) => <Ring key={i} x={x} y={y} t={(t - d) % 40} s={0.6} />)}
      <rect x={0} y={0} width={1920} height={1080} fill="none" stroke={RED} strokeWidth={60} opacity={0.15 + 0.1 * Math.sin(t / 5)} style={{ filter: 'blur(30px)' }} />
    </g>
  );
};
