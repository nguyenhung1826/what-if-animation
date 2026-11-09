import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import {
  Hero, Mug, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, camT, joints, toWorld, reachAngle, walkPose, walkPhase,
  Study, Desk, Foreground, ShotFrame, TitleCard, HudChip, LOOKS, FONT,
} from '../engine';

// A 10-second test clip with no voice, built only from the library: "What if you could pause time?"
// The hero knocks his mug off the desk, pauses the world mid-fall, walks over, puts it back, and unpauses.
// 300 frames at 30 fps. Audio is library clips copied to public/demo/.
//   npx remotion render src/index.ts PauseDemo out/demo/pause-demo.mp4

const HERO = LOOKS.hero;
const FREEZE = 80; // the frame the world stops
const UNFREEZE = 222; // the frame it starts again
const DESK_Y = 700;
const MUG0 = 1300; // the mug's spot on the desk
/** Voice lines (trimmed, in frames): placed between the actions they describe. */
const VO = [
  { n: 0, start: 8, frames: 41 }, // What if you could pause time?
  { n: 1, start: 60, frames: 21 }, // Oops.
  { n: 2, start: 84, frames: 21 }, // Freeze.
  { n: 3, start: 108, frames: 62 }, // The whole world just... stops.
  { n: 4, start: 172, frames: 53 }, // So you stroll over, put it back...
  { n: 5, start: 227, frames: 44 }, // and nobody ever knows.
];

/** How paused the world looks, 0..1, with short ramps in and out. */
const pauseLevel = (f: number) => Math.min(clamp((f - FREEZE + 1) / 3), clamp((UNFREEZE - f) / 8));
/** The world's clock: it stops while paused and carries on afterwards. */
const worldT = (f: number) => (f < FREEZE ? f : f < UNFREEZE ? FREEZE : f - (UNFREEZE - FREEZE));

/** The falling mug, driven by the world clock (so it hangs in the air while paused). */
const mugFall = (w: number) => {
  if (w < 58) return { x: MUG0, y: DESK_Y, r: 0 };
  if (w < 70) {
    const p = easeOut((w - 58) / 12);
    return { x: lerp(MUG0, 1384, p), y: DESK_Y, r: 32 * easeIn(p) };
  }
  const d = w - 70;
  return { x: 1384 + d * 1.2, y: DESK_Y + 0.35 * d * d, r: 32 + d * 7 };
};

/** Coffee drops thrown from the rim as it tips; frozen with the world. */
const Drops: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  if (w < 66) return null;
  const d = w - 66;
  return (
    <g>
      {[[-18, -62, 9], [6, -74, 7], [24, -58, 6], [-30, -48, 5], [14, -88, 4]].map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx * (0.6 + d * 0.08)} cy={y + dy * (0.5 + d * 0.05) + 0.2 * d * d} r={r} fill="#5A3A22" />
      ))}
    </g>
  );
};

const Room: React.FC<{ f: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ f, children, front }) => (
  <g>
    <Study t={worldT(f)} id="pd" veil={0.3} />
    {children}
    <Desk x0={560} x1={1360} y={DESK_Y} lamp={false} />
    {front}
  </g>
);

// ---------- A (0-76): wide, the title, the knock ----------
const ShotA: React.FC<{ f: number }> = ({ f }) => {
  const pose = poseAt(f, [
    { f: 0, p: { x: 1180, y: 712, yaw: 0.4, look: 0.5, armR: { a: 14, b: -6 } } },
    { f: 50, p: { armR: { a: 22, b: -8 }, look: 0.8 } },
    { f: 58, p: { armR: { a: 78, b: -10 }, tilt: 4 }, ease: easeOut },
    { f: 70, p: { armR: { a: 44, b: -30 }, armL: { a: 40, b: 30 }, tilt: 0 } },
  ]);
  const m = mugFall(f);
  return (
    <g transform={camT(1060, 560, kf(f, [[0, 0.9], [76, 0.97]]))}>
      <Room
        f={f}
        front={
          <g>
            <Mug x={m.x} y={m.y} rot={m.r} f={f} steam={f < 58 ? 1 : 0} />
            <Drops x={m.x} y={m.y} w={f} />
          </g>
        }
      >
        <Hero look={HERO} pose={{ ...pose, ...faceAt(f, [[0, 'happy'], [62, 'shock']]) }} shadow={0} />
      </Room>
      {f < 66 ? <TitleCard t={f} lines={['WHAT IF YOU COULD', 'PAUSE TIME?']} accent="PAUSE" accentT={30} y={210} size={110} /> : null}
    </g>
  );
};

// ---------- B (76-140): close on the mug; the world stops mid-fall ----------
const ShotB: React.FC<{ f: number }> = ({ f }) => {
  const w = worldT(f);
  const m = mugFall(w);
  const t = f - 76;
  return (
    <g transform={camT(1330, 640, kf(t, [[0, 1.7], [64, 1.95]]))}>
      <Room
        f={f}
        front={
          <g>
            <Mug x={m.x} y={m.y} rot={m.r} f={w} steam={0} />
            <Drops x={m.x} y={m.y} w={w} />
          </g>
        }
      >
        <Hero look={HERO} pose={{ ...basePose, x: 1180, y: 712, yaw: 0.4, look: 1, armR: { a: 44, b: -30 }, armL: { a: 40, b: 30 }, expr: t < 30 ? 'shock' : 'smug' }} shadow={0} />
      </Room>
    </g>
  );
};

// ---------- C (140-222): the hero walks round the desk end in the frozen world, takes the mug, puts it back ----------
const STAND_X = 1470; // beside the desk's right end, where nothing hides his arm
const PLACE = { x: 1335, y: DESK_Y }; // where the mug goes back, on the desk's right edge
/** Left-arm reach: the angle that points the left hand at a world target. */
const reachL = (pose: Pose, target: { x: number; y: number }) => {
  const sh = toWorld(pose, joints(pose).armL.root);
  return (Math.atan2(-(target.x - sh.x), target.y - sh.y) * 180) / Math.PI - pose.tilt;
};
const shotCPose = (t: number): Pose => {
  const frozen = mugFall(FREEZE);
  // a calm walk: 290 px in 38 frames, the feet planted by walkPhase (no sliding, no running legs)
  if (t < 38) {
    const x = lerp(1180, STAND_X, easeInOut(clamp(t / 38)));
    return { ...walkPose(x, walkPhase(x - 1180), 852, 1), expr: 'smug' };
  }
  const turn = easeOut(clamp((t - 38) / 6));
  const reachP = easeOut(clamp((t - 42) / 10));
  const backP = easeOut(clamp((t - 54) / 12));
  const target = { x: lerp(frozen.x + 6, PLACE.x, backP), y: lerp(frozen.y - 30, PLACE.y - 40, backP) };
  const p0: Pose = { ...basePose, x: STAND_X, y: 712, yaw: lerp(0.6, -0.45, turn), look: -0.8, tilt: lerp(0, -10, Math.max(reachP * (1 - backP), backP)), expr: t > 68 ? 'happy' : 'smug' };
  const a = reachL(p0, target);
  const armA = t < 42 ? 14 : t < 68 ? lerp(14, a, reachP) : lerp(a, 14, easeOut(clamp((t - 68) / 10)));
  return { ...p0, armL: { a: armA, b: 0 }, armR: { a: 12, b: -8 } };
};
const ShotC: React.FC<{ f: number }> = ({ f }) => {
  const t = f - 140;
  const frozen = mugFall(FREEZE);
  const pose = shotCPose(t);
  const held = t >= 52 && t < 68;
  const hand = toWorld(pose, joints(pose).armL.end);
  const mug = t < 52 ? frozen : held ? { x: hand.x, y: hand.y + 30, r: lerp(frozen.r, 0, clamp((t - 52) / 10)) } : { ...PLACE, r: 0 };
  return (
    <g transform={camT(1360, 600, 1.3)}>
      <Room
        f={f}
        front={
          <g>
            {pose.x > 1390 ? <Hero look={HERO} pose={pose} shadow={0.5} /> : null}
            <Mug x={mug.x} y={mug.y} rot={mug.r} f={FREEZE} steam={0} />
            {t < 52 ? <Drops x={frozen.x} y={frozen.y} w={FREEZE} /> : null}
          </g>
        }
      >
        {pose.x <= 1390 ? <Hero look={HERO} pose={pose} shadow={0} /> : null}
      </Room>
    </g>
  );
};

// ---------- D (222-300): time runs again; shades on ----------
const ShotD: React.FC<{ f: number }> = ({ f }) => {
  const t = f - 222;
  const pose = poseAt(t, [
    { f: 0, p: { x: STAND_X, y: 712, yaw: -0.3, look: -0.3, armR: { a: 12, b: -8 }, expr: 'happy' } },
    { f: 18, p: { glasses: 0 } },
    { f: 28, p: { glasses: 1, headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(1400, 580, kf(t, [[0, 1.45], [78, 1.6]]))}>
      <Room f={f} front={<g><Hero look={HERO} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [30, 'cool']]) }} shadow={0.5} /><Mug x={PLACE.x} y={PLACE.y} rot={0} f={worldT(f)} /></g>} />
    </g>
  );
};

export const PauseDemo: React.FC = () => {
  const f = useCurrentFrame();
  const p = pauseLevel(f);
  const shot = f < 76 ? <ShotA f={f} /> : f < 140 ? <ShotB f={f} /> : f < 222 ? <ShotC f={f} /> : <ShotD f={f} />;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0C1E' }}>
      <AbsoluteFill style={{ filter: p > 0 ? `saturate(${1 - 0.6 * p}) hue-rotate(${-22 * p}deg) brightness(${1 - 0.06 * p})` : undefined }}>
        <ShotFrame>{shot}</ShotFrame>
      </AbsoluteFill>
      {/* the paused-world overlay: a cool vignette and the PAUSE chip */}
      {p > 0 ? (
        <AbsoluteFill style={{ opacity: p }}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080">
            <defs>
              <radialGradient id="pzVig" cx="50%" cy="50%" r="70%">
                <stop offset="0.55" stopColor="#1B2A5A" stopOpacity={0} />
                <stop offset="1" stopColor="#1B2A5A" stopOpacity={0.55} />
              </radialGradient>
            </defs>
            <rect width={1920} height={1080} fill="url(#pzVig)" />
            <HudChip f={f} label="PAUSED" icon="pause" />
          </svg>
        </AbsoluteFill>
      ) : null}
      {f >= 250 ? (
        <AbsoluteFill>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080">
            <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFFFFF" stroke="#0A0810" strokeWidth={10} paintOrder="stroke" opacity={clamp((f - 250) / 6)}>
              Not a single drop spilled.
            </text>
          </svg>
        </AbsoluteFill>
      ) : null}
      {/* sound: library clips, levels set from measured loudness: the voice sits at -16 LUFS, the music about 14 dB
          under it while someone talks, the effects about 8 dB under it */}
      {/* the voice: one ElevenLabs line per beat (src/demos/pause_demo_voice.py), each on its own frame */}
      {VO.map((v) => (
        <Sequence key={v.n} from={v.start}><Audio src={staticFile(`demo/vo_${v.n}.wav`)} volume={1} /></Sequence>
      ))}
      {/* the music ducks under every voice line */}
      <Audio src={staticFile('demo/music.mp3')} volume={(fr) => (VO.some((v) => fr >= v.start - 6 && fr < v.start + v.frames + 8) ? 0.13 : 0.24)} />
      <Sequence from={4}><Audio src={staticFile('demo/title_boom.mp3')} volume={0.18} /></Sequence>
      <Sequence from={FREEZE}><Audio src={staticFile('demo/glitch.mp3')} volume={0.15} /></Sequence>
      <Sequence from={208}><Audio src={staticFile('demo/clink.mp3')} volume={0.9} /></Sequence>
      {[144, 158, 168].map((fr) => (
        <Sequence key={fr} from={fr}><Audio src={staticFile('demo/step.mp3')} volume={0.7} /></Sequence>
      ))}
      <Sequence from={UNFREEZE}><Audio src={staticFile('demo/sparkle.mp3')} volume={1} /></Sequence>
      <Sequence from={244}><Audio src={staticFile('demo/shades.mp3')} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};
