import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, settle, camT, LOOKS, tone, walkPose, walkPhase, LEG_LEN,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Tabletop, AlarmClock, Cat, Mug, Plate, PlateTop, CookieStack, Cookie,
  PizzaSlice, PizzaBox, Tag, Sparkle, Glow, LightVeil, FloatLabel, Foreground, FONT, ShotProps,
} from '../../engine';
import { CloseUp, Night } from '../switch-off-sleep-1/shots';

// "What if you could switch off sleep?" Chapter 3: the fun part escalates, all in the kitchen. Morning (Mom finds
// you up and dressed), the night snacks (second dinner), the cat, and your little sister at six a.m. The power is on
// all chapter: your eyes glow (faceGlow + an ice-blue glint, as in chapters 1-2), brighter at night.

const GLOW = { ...LOOKS.hero, faceGlow: true };
const ICE = '#9FE4FF';
const on = (p: Pose, g = 0.7): Pose => ({ ...p, glint: g, glintColor: ICE });

// Mom: white, a dusty-rose dressing gown (long coat) over plum pyjama trousers, pink slippers, her dark bob.
export const MOM = { ...tone(LOOKS.mom, 'white'), coat: 'long' as const, jacket: '#B7737F', jacketShade: '#9A5C68', sleeve: '#B7737F', accent: '#F2D5DA', limb: '#5A4A6A', shoe: '#E9B9C2', hair: '#4A2A22' };
// Your little sister: black, teal pyjamas top and bottom, coral slippers, bunches. Drawn at 0.7 of an adult.
export const SIS = { ...tone(LOOKS.sis, 'black'), jacket: '#3E8C86', jacketShade: '#2F6E69', sleeve: '#3E8C86', limb: '#357A75', accent: '#F2C14E', shoe: '#F28C6A', hair: '#3A2E44' };

const R = KITCHEN;
const ME = stand(R, 0.42, 0.4); // you, behind the island
const floorY = (u: number, w: number) => R.P(u, 1, w).y;
const scaleAt = (u: number, w: number, k: number) => stand(R, u, w, k).scale;

// a bowl of cereal, side-on (x, y = bottom centre)
const Bowl: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={52} ry={8} fill="#000" opacity={0.3} />
    <path d="M -50 -34 Q -46 0 0 0 Q 46 0 50 -34 Z" fill="#E9E3D6" />
    <ellipse cx={0} cy={-34} rx={50} ry={10} fill="#F6F1E6" />
    {[-30, -14, 4, 20, 34].map((cx, i) => <circle key={i} cx={cx} cy={-36 + (i % 2) * 3} r={6} fill="#D9A050" />)}
    <path d="M -50 -34 Q -46 0 0 0" stroke="#C9C0B0" strokeWidth={3} fill="none" />
  </g>
);

// breakfast from above: eggs and toast on a plate
const Breakfast: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 230 }) => (
  <g>
    <PlateTop x={x} y={y} r={r} />
    <path d={`M ${x - 140} ${y - 30} q 30 -70 90 -40 q 60 10 30 70 q -20 50 -80 30 q -60 -10 -40 -60 Z`} fill="#FBF8F0" />
    <circle cx={x - 80} cy={y - 10} r={30} fill="#F5B532" />
    <path d={`M ${x + 10} ${y + 30} q 40 -60 100 -30 q 50 30 20 80 q -40 40 -90 20 q -50 -20 -30 -70 Z`} fill="#FBF8F0" />
    <circle cx={x + 60} cy={y + 50} r={30} fill="#F5B532" />
    <rect x={x + 10} y={y - 150} width={120} height={110} rx={18} fill="#C98A48" transform={`rotate(14 ${x + 70} ${y - 95})`} />
    <rect x={x + 22} y={y - 138} width={96} height={86} rx={12} fill="#E9B970" transform={`rotate(14 ${x + 70} ${y - 95})`} />
  </g>
);

// a mug seen from above, steaming
const MugTop: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>
    <circle cx={x + 10} cy={y + 14} r={92} fill="#000" opacity={0.3} />
    <rect x={x + 70} y={y - 22} width={70} height={44} rx={22} fill="#E9E3D6" />
    <circle cx={x} cy={y} r={88} fill="#F4F1EA" />
    <circle cx={x} cy={y} r={70} fill="#5A3828" />
    {[0, 1, 2].map((i) => {
      const k = ((t + i * 16) % 48) / 48;
      return <path key={i} d={`M ${x - 30 + i * 30} ${y - 20 - k * 160} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" opacity={Math.sin(k * Math.PI) * 0.35} />;
    })}
  </g>
);

// ---------- S1: wide, morning: you at the island, dressed, breakfast out; Mom walks in from the right ----------
// "finds" @10 (shot clock)
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const stopX = R.P(0.76, 1, 0.68).x;
  const startX = stopX + 560;
  const k = easeOut(clamp(t / 40));
  const mx = startX + (stopX - startX) * clamp(t / 40);
  const ms = scaleAt(0.76, 0.68, 0.6);
  const walking = t < 40;
  const mom: Pose = walking
    ? walkPose(mx, walkPhase(mx - startX, ms), floorY(0.76, 0.68), ms, { expr: 'neutral' }, -1)
    : { ...basePose, x: stopX, y: floorY(0.76, 0.68) - LEG_LEN * ms, scale: ms, yaw: -0.5, look: -0.8, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 }, tilt: -3 * settle(t - 40, 8), ...faceAt(t, [[0, 'neutral'], [46, 'shock']]) };
  const me = poseAt(t, [
    { f: 0, p: { x: ME.x, y: ME.y, scale: ME.scale, yaw: 0.2, look: 0.2, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } } },
    { f: 34, p: { yaw: 0.5, look: 0.9 } },
    { f: 50, p: { armR: { a: 150, b: 30 } }, ease: easeOut },
    { f: 58, p: { armR: { a: 140, b: 50 } } },
    { f: 66, p: { armR: { a: 150, b: 30 } } },
    { f: 74, p: { armR: { a: 140, b: 50 } } },
  ]);
  const plate = islandTop(0.5, 0.45);
  const mug = islandTop(0.6, 0.5);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 560, kf(t, [[0, 1.0], [len, 1.08]], easeInOut))}>
      <Kitchen t={t} id="k1" />
      <Hero look={GLOW} pose={on({ ...me, ...faceAt(t, [[0, 'neutral'], [40, 'happy']]) }, 0.5)} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Plate x={plate.x} y={plate.y} s={0.6} />
      <rect x={plate.x - 28} y={plate.y - 18} width={30} height={12} rx={4} fill="#E9B970" />
      <ellipse cx={plate.x + 14} cy={plate.y - 12} rx={18} ry={6} fill="#FBF8F0" />
      <circle cx={plate.x + 14} cy={plate.y - 13} r={5} fill="#F5B532" />
      <Mug x={mug.x} y={mug.y} rot={0} f={t} steam={1} />
      <Hero look={MOM} pose={mom} rimId="rimR" shadow={0.4} />
      {k > 0 ? null : null}
    </g>
  );
};

// ---------- S2: top-down insert, the island: breakfast made, the mug steaming; READY ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const slide = easeOut(clamp(t / 10));
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.03}) scale(${1.02 + t * 0.0015}) translate(-960 -540)`}>
      <Tabletop edge={1300} wood="#A89C8A" grain="#968A78" lip="#8E8474" kind="stone" floor="#2C2A30" floorLines="#232127" />
      <LightVeil id="s2veil" lights={[[900, 420, 900]]} o={0.4} />
      <Glow x={700} y={300} r={700} o={0.35} />
      <g transform={`translate(${(1 - slide) * 700} 0)`}>
        <Breakfast x={880} y={560} r={250} />
      </g>
      <MugTop x={1440} y={420} t={t} />
      <rect x={300} y={760} width={360} height={60} rx={8} fill="#C7473C" transform="rotate(-8 480 790)" />
      <rect x={300} y={780} width={360} height={14} fill="#F4F1EA" transform="rotate(-8 480 790)" />
      <Tag x={1450} y={800} t={t - 40} text="READY" mark="check" markT={6} />
    </g>
  );
};

// ---------- S3: two-shot over the island: Mom, worried, asks if you slept; you shrug: kind of ----------
// "slept" @24, "kind" @81 (shot clock)
const MOM3 = stand(R, 0.64, 0.42, 0.64);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const mom = poseAt(t, [
    { f: 0, p: { x: MOM3.x, y: MOM3.y, scale: MOM3.scale, yaw: -0.5, look: -0.9, tilt: 0, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } } },
    { f: 10, p: { tilt: -8, headTilt: -8 }, ease: easeOut },
    { f: 40, p: { tilt: -6, headTilt: -6 } },
    { f: 90, p: { tilt: -2, headTilt: 6, armL: { a: 20, b: 20 } } },
  ]);
  const me = poseAt(t, [
    { f: 0, p: { x: ME.x, y: ME.y, scale: ME.scale, yaw: 0.5, look: 0.9, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } } },
    { f: 40, p: { headTilt: 4 } },
    { f: 74, p: { armL: { a: 50, b: 100 }, armR: { a: 50, b: 100 }, headTilt: -10, y: ME.y - 6 }, ease: easeOut },
    { f: 86, p: { armL: { a: 56, b: 110 }, armR: { a: 56, b: 110 }, headTilt: -12, y: ME.y - 8 } },
    { f: 110, p: { armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 }, headTilt: -4, y: ME.y } },
  ]);
  const mid = (ME.x + MOM3.x) / 2;
  const mug = islandTop(0.6, 0.5);
  return (
    <g transform={camT(kf(t, [[0, mid], [len, mid + 10]]), kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.9], [len, 2.1]], easeInOut))}>
      <Kitchen t={t + 100} id="k3" />
      <Hero look={GLOW} pose={on({ ...me, ...faceAt(t, [[0, 'neutral'], [70, 'smug']]) }, 0.5)} rimId="rimR" shadow={0} />
      <Hero look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Mug x={mug.x} y={mug.y} rot={0} f={t} steam={1} />
      <FloatLabel x={MOM3.x + 60} y={MOM3.y - 250} t={t - 22} text="?" size={90} color="#F6EFE3" />
      <FloatLabel x={ME.x - 60} y={ME.y - 260} t={t - 82} text="kind of..." size={56} color="#FFE27A" />
    </g>
  );
};

// ---------- S4: medium, midnight: the dark kitchen, you at the island, eating; second dinner ----------
// "second" @47 (shot clock)
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const chew = Math.max(0, Math.sin(t * 0.35));
  const me = poseAt(t, [{ f: 0, p: { x: ME.x, y: ME.y, scale: ME.scale, yaw: 0.25, look: 0.3, armL: { a: 30, b: 60 }, armR: { a: 40, b: 120 } } }]);
  const pose: Pose = { ...me, armR: { a: 40 + chew * 15, b: 120 + chew * 20 }, headTilt: -chew * 4, ...faceAt(t, [[0, 'happy']]) };
  const box = islandTop(0.62, 0.55);
  const plates = islandTop(0.34, 0.5);
  const n = Math.min(5, 2 + Math.floor(t / 14));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), 560, kf(t, [[0, 1.75], [len, 1.9]]))}>
      <Kitchen t={t + 200} id="k4" veil={0.7} />
      <Night o={0.5} />
      <Glow x={ME.x} y={ME.y - 300} r={360} kind="warm" o={0.35} />
      <Hero look={GLOW} pose={on(pose, 1)} rimId="rimBlueL" shadow={0} />
      <KitchenIsland />
      <PizzaBox x={box.x} y={box.y} w={110} />
      {Array.from({ length: n }).map((_, i) => <Plate key={i} x={plates.x} y={plates.y - i * 7} s={0.55} />)}
      <Glow x={ME.x} y={ME.y - 170} r={140} kind="cool" o={0.2} />
      <text x={ME.x + 200} y={ME.y - 320} fontFamily={FONT.hand} fontSize={60} fill="#FFE27A" opacity={clamp((t - 46) / 6)} transform={`rotate(-6 ${ME.x + 200} ${ME.y - 320})`}>
        DINNER #2
      </text>
    </g>
  );
};

// ---------- S5: insert side-on, the counter at night: 2:00 and a pizza slice; 4:00 and a shrinking cookie stack ----------
// "two" @25, "Cookies" @59, "four" @81 (shot clock)
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const late = t >= 70;
  const bump = 1 + 0.07 * Math.sin(clamp((t - 70) / 6) * Math.PI) * (late ? 1 : 0);
  const bite = clamp((t - 36) / 4) * 0.3 + clamp((t - 48) / 4) * 0.3;
  const cookies = Math.max(1, 6 - Math.floor(Math.max(0, t - 80) / 14));
  const handY = 520 + Math.sin(t * 0.2) * 8;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#161424" />
      <rect x={0} y={700} width={1920} height={380} fill="#3A3A40" />
      <rect x={0} y={700} width={1920} height={6} fill="#8E8474" />
      <Glow x={1500} y={240} r={700} kind="cool" o={0.35} />
      <g transform={`translate(560 740) scale(${bump}) translate(-560 -740)`}>
        <AlarmClock x={560} y={740} s={2.2} text={late ? '4:00' : '2:00'} />
      </g>
      <Glow x={560} y={620} r={340} kind="red" o={0.25} />
      {!late ? (
        <g>
          <PizzaSlice x={1260} y={handY - 200} len={360} rot={90} bite={bite} drip={clamp(t / 20)} shadow={0} />
          <ellipse cx={1260} cy={handY + 190} rx={70} ry={100} fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} />
        </g>
      ) : (
        <g>
          <Plate x={1260} y={704} s={1.6} />
          <CookieStack x={1260} y={690} n={cookies} s={1.4} />
        </g>
      )}
      {late ? (
        <text x={300} y={260} fontFamily={FONT.hand} fontSize={100} fill="#FFE27A" transform="rotate(-6 300 260)">snack #4</text>
      ) : (
        <text x={300} y={260} fontFamily={FONT.hand} fontSize={100} fill="#FFE27A" transform="rotate(-6 300 260)">snack #3</text>
      )}
    </g>
  );
};

// ---------- S6: medium close, the cat asleep in the sun on the counter (12-16 h a day); the camera finds you: 0 h ----------
// "You" @78 (shot clock)
const CAT = R.P(0.78, 0.72, 0.1);
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pan = easeInOut(clamp((t - 72) / 18));
  const cx = CAT.x - 30 + (ME.x + 40 - (CAT.x - 30)) * pan;
  const cy = CAT.y - 60 + (ME.y - 200 - (CAT.y - 60)) * pan;
  const s = kf(t, [[0, 3.0], [72, 3.15], [90, 2.4], [len, 2.5]]);
  const me = poseAt(t, [
    { f: 0, p: { x: ME.x, y: ME.y, scale: ME.scale, yaw: 0, look: 0, armL: { a: 120, b: 40 }, armR: { a: 120, b: 40 } } },
    { f: 8, p: { armL: { a: 100, b: 60 }, armR: { a: 140, b: 20 } } },
    { f: 16, p: { armL: { a: 140, b: 20 }, armR: { a: 100, b: 60 } } },
  ]);
  const juggle = poseAt(t % 16, [
    { f: 0, p: { armL: { a: 100, b: 60 }, armR: { a: 140, b: 20 } } },
    { f: 8, p: { armL: { a: 140, b: 20 }, armR: { a: 100, b: 60 } } },
    { f: 16, p: { armL: { a: 100, b: 60 }, armR: { a: 140, b: 20 } } },
  ]);
  return (
    <g transform={camT(cx, cy, s)}>
      <Kitchen t={t + 300} id="k6" />
      <Hero look={GLOW} pose={on({ ...me, armL: juggle.armL, armR: juggle.armR, ...faceAt(t, [[0, 'happy']]) }, 0.5)} rimId="rimR" shadow={0} />
      {[0, 1, 2].map((i) => {
        const ph = (t / 16 + i / 3) % 1;
        return <Cookie key={i} x={ME.x - 50 + ph * 100} y={ME.y - 230 - Math.sin(ph * Math.PI) * 80} s={0.35} rot={t * 8} seed={i} />;
      })}
      <KitchenIsland />
      <Cat x={CAT.x} y={CAT.y} mood="sleep" f={t} />
      {[0, 1, 2].map((i) => {
        const k = ((t + i * 14) % 42) / 42;
        return (
          <text key={i} x={CAT.x + 20 + k * 40} y={CAT.y - 50 - k * 110} fontFamily={FONT.hand} fontSize={24 + i * 6} fill="#F6EFE3" opacity={Math.sin(k * Math.PI) * 0.85 * (1 - pan)}>
            z
          </text>
        );
      })}
      <g transform={`translate(${CAT.x - 110} ${CAT.y - 120}) scale(0.4)`} opacity={1 - pan}>
        <Tag x={0} y={0} t={t - 30} text="12-16 HRS" w={230} />
      </g>
      <g transform={`translate(${ME.x + 120} ${ME.y - 290}) scale(0.5)`}>
        <Tag x={0} y={0} t={t - 92} text="0 HRS" />
      </g>
    </g>
  );
};

// ---------- S7: close-up, the cat opens one eye at you: she does not approve ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(CAT.x - 10, CAT.y - 40, kf(t, [[0, 5.0], [len, 5.4]], easeInOut))}>
    <Kitchen t={t + 400} id="k7" />
    <Cat x={CAT.x} y={CAT.y} mood={t > 12 ? 'peek' : 'sleep'} f={t} />
  </g>
);

// ---------- S8: wide, 6:00 a.m.: your little sister shuffles in, rubbing her eyes ----------
const SIS_STOP = { u: 0.74, w: 0.86 };
const sisScale = scaleAt(SIS_STOP.u, SIS_STOP.w, 0.43);
const sisStill = (extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: R.P(SIS_STOP.u, 1, SIS_STOP.w).x, y: floorY(SIS_STOP.u, SIS_STOP.w) - LEG_LEN * sisScale, scale: sisScale, yaw: -0.5, look: -0.9,
  armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, ...extra,
});
const Dawn: React.FC = () => <rect x={-2000} y={-2000} width={6000} height={6000} fill="#3A4A80" opacity={0.25} style={{ mixBlendMode: 'multiply' }} />;
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const stopX = R.P(SIS_STOP.u, 1, SIS_STOP.w).x;
  const startX = stopX + 640;
  const walkLen = 120;
  const x = startX + (stopX - startX) * clamp(t / walkLen);
  const rub = Math.sin(t * 0.5) * 12;
  const sis = walkPose(x, walkPhase(x - startX, sisScale) * 0.8, floorY(SIS_STOP.u, SIS_STOP.w), sisScale, { expr: 'tired', armR: { a: 150 + rub, b: 130 }, blink: t % 50 > 40 ? 1 : 0 }, -1);
  return (
    <g transform={camT(kf(t, [[0, 1480], [len, 1360]]), 600, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Kitchen t={t + 500} id="k8" />
      <Dawn />
      <KitchenIsland />
      <Hero look={SIS} pose={sis} rimId="rimR" shadow={0.4} />
      <text x={1700} y={330} fontFamily={FONT.hand} fontSize={44} fill="#FFE27A" transform="rotate(-5 1700 330)">6:00 AM</text>
    </g>
  );
};

// ---------- S9: two-shot: you are already there, waving with your cereal; she freezes, shock ----------
// "already" @14 (shot clock)
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const me = poseAt(t, [
    { f: 0, p: { x: ME.x, y: ME.y, scale: ME.scale, yaw: 0.5, look: 0.9, armL: { a: 30, b: 60 }, armR: { a: 150, b: 30 } } },
    { f: 6, p: { armR: { a: 140, b: 50 } } },
    { f: 12, p: { armR: { a: 150, b: 30 } } },
    { f: 18, p: { armR: { a: 140, b: 50 } } },
    { f: 24, p: { armR: { a: 150, b: 30 } } },
  ]);
  const hop = settle(t - 32, 10);
  const bowl = islandTop(0.47, 0.45);
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1170]]), 560, kf(t, [[0, 1.45], [len, 1.55]]))}>
      <Kitchen t={t + 600} id="k9" />
      <Dawn />
      <Hero look={GLOW} pose={on({ ...me, ...faceAt(t, [[0, 'happy']]) }, 0.5)} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Bowl x={bowl.x} y={bowl.y} s={0.55} />
      <Hero look={SIS} pose={sisStill({ y: sisStill().y - (t > 32 && t < 44 ? 20 * Math.sin(((t - 32) / 12) * Math.PI) : 0), squash: -0.1 * hop, armL: { a: 40, b: 20 }, armR: { a: 40, b: 20 }, ...faceAt(t, [[0, 'tired'], [22, 'neutral'], [32, 'shock']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// ---------- S10: two-shot, every single morning: MON / TUE / WED / THU; you in a new pose, she in shock each time ----------
const DAYS = ['MON', 'TUE', 'WED', 'THU'];
const MY_POSES: Partial<Pose>[] = [
  { yaw: 0.5, look: 0.9, armL: { a: 30, b: 60 }, armR: { a: 150, b: 30 }, expr: 'happy' },
  { yaw: 0.2, look: 0.5, armL: { a: 40, b: 120 }, armR: { a: 40, b: 120 }, expr: 'smug' },
  { yaw: 0.5, look: 0.9, armL: { a: 165, b: 10 }, armR: { a: 165, b: 10 }, expr: 'happy' },
  { yaw: 0.4, look: 0.8, armL: { a: 30, b: 60 }, armR: { a: 70, b: 70 }, expr: 'cool' },
];
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const i = Math.min(3, Math.floor(t / 25));
  const lt = t - i * 25;
  const hop = settle(lt - 2, 8);
  const bowl = islandTop(0.47, 0.45);
  const mug = islandTop(0.58, 0.5);
  return (
    <g transform={camT(1180 + (i % 2) * 30, 560, 1.5 + i * 0.05)}>
      <Kitchen t={t + 700 + i * 100} id="k10" />
      <Dawn />
      <Hero look={GLOW} pose={on({ ...basePose, x: ME.x, y: ME.y, scale: ME.scale, ...MY_POSES[i] }, 0.5)} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {i === 0 ? <Bowl x={bowl.x} y={bowl.y} s={0.55} /> : null}
      {i === 1 ? <Mug x={mug.x} y={mug.y} rot={0} f={t} /> : null}
      {i === 3 ? <Plate x={bowl.x} y={bowl.y} s={0.6} /> : null}
      <Hero look={SIS} pose={sisStill({ squash: -0.12 * hop, armL: { a: 40, b: 20 }, armR: { a: 40, b: 20 }, headTilt: (i % 2 ? 6 : -6), expr: 'shock' })} rimId="rimR" shadow={0.4} />
      <g transform={`translate(${1500 + (i % 2) * 30} 330)`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT.hand} fontSize={60} fill="#FFE27A" transform={`rotate(${-5 + i * 3}) scale(${0.8 + 0.2 * clamp(lt / 4)})`}>{DAYS[i]}</text>
      </g>
    </g>
  );
};

// ---------- S11: medium close, your sister, eyes narrowed: how? ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const p = sisStill({ yaw: -0.4, look: -0.8, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 }, headTilt: kf(t, [[0, 0], [12, 10], [len, 12]], easeOut), tilt: kf(t, [[0, 0], [12, -5]]), expr: 'tired' });
  return (
    <g>
      <g transform={camT(p.x - 30, p.y - 200 * sisScale * 1.0, kf(t, [[0, 4.2], [len, 4.5]]))}>
        <g filter="url(#blur10)">
          <Kitchen t={t + 800} id="k11" />
        </g>
        <Dawn />
        <Hero look={SIS} pose={p} rimId="rimR" shadow={0} />
      </g>
      <text x={1380} y={330} fontFamily={FONT.hand} fontSize={110} fill="#F6EFE3" opacity={clamp((t - 6) / 5)} transform="rotate(-6 1380 330)">how??</text>
    </g>
  );
};

// ---------- S12: close-up, you put a finger to your lips, eyes glinting: Secret ----------
// "finger" @16, "Secret" @80 (shot clock)
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const g = 0.6 + 0.4 * clamp((t - 94) / 4) - 0.2 * clamp((t - 116) / 20);
  return (
    <g>
      <CloseUp t={t} len={len} glint={g} rim="rimR" x={960}
        face={faceAt(t, [[0, 'smug'], [14, 'cool']])}
        p={{
          yaw: 0.05,
          headTilt: kf(t, [[0, 0], [14, -4], [94, -6], [100, 4], [len, 2]], easeOut),
        }}
        bg={<g transform="translate(-1300 -700) scale(2.2)"><Kitchen t={t + 900} id="k12" /><Dawn /><Hero look={SIS} pose={sisStill({ expr: 'cool' })} rimId="rimR" shadow={0} /></g>} />
      {/* your hand rises into frame, one finger up to your lips (drawn here: the rig's arm can't reach the mouth in a close-up) */}
      <g transform={`translate(0 ${kf(t, [[0, 520], [6, 520], [13, -12], [16, 0]], easeOut)}) rotate(${kf(t, [[6, 12], [16, -4]])} 990 860)`}>
        <path d="M 900 1180 L 930 900 L 1060 900 L 1080 1180 Z" fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} />
        <rect x={958} y={630} width={46} height={190} rx={23} fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} />
        <ellipse cx={995} cy={860} rx={92} ry={78} fill={LOOKS.hero.hand} stroke={LOOKS.hero.line} strokeWidth={8} />
        <path d="M 940 815 Q 990 795 1050 815" stroke="#08070B" strokeWidth={6} fill="none" />
        <path d="M 1004 650 L 1004 800 M 1084 820 Q 1090 880 1060 920" stroke="#F6D9A0" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />
      </g>
      <Sparkle x={860} y={440} t={t - 96} s={1.4} />
      <Sparkle x={1080} y={430} t={t - 100} s={1.0} />
      <text x={1440} y={300} fontFamily={FONT.hand} fontSize={80} fill="#FFE27A" opacity={clamp((t - 96) / 6)} transform="rotate(-6 1440 300)">shh.</text>
    </g>
  );
};
