import React from 'react';
import { lerp, easeInOut } from './anim';

// The cast, drawn entirely in code: one rig, and a costume (a Look) per character. Every character is built
// once here, so they look identical in every shot: that's the "drawn, not guessed" point. Original
// characters only: never a channel's own hero or anything that resembles a famous cartoon character.

export const C = {
  skin: '#F6EFE3',
  skinShade: '#E2D3BE',
  ink: '#1D2033',
  jacket: '#F2B33D',
  jacketShade: '#D4922A',
  shoe: '#2FB7A6',
  orange: '#FF8A3D',
  limb: '#EFE2CC',
};

/** A costume for the rig: the same body and animation, different colours and one optional extra piece. */
export type Look = {
  skin: string;
  skinShade: string;
  hand: string;
  jacket: string;
  jacketShade: string;
  accent: string;
  limb: string;
  line: string;
  shoe: string;
  face: string;
  hair: string;
  extra?: 'hood' | 'curls' | 'bunches' | 'bob' | 'suit' | 'bucket' | 'topbun' | 'beanie' | 'cap' | 'beret' | 'ponytail';
  /** A signature item the character always carries, drawn on the rig so it follows every pose. */
  item?: 'satchel' | 'stopwatch' | 'headlamp' | 'scarf' | 'backpack';
  /** The item's main colour (defaults per item). */
  itemColor?: string;
  /** A jacket cut drawn over the torso (the plain top when unset). */
  coat?: 'biker' | 'bomber' | 'denim' | 'long';
  /** Arm colour, when the sleeves differ from the legs (a jacket's sleeves); defaults to limb. */
  sleeve?: string;
  /** Face style: dot (the default), big (white eyes with pupils), bean (tall capsules), line (calm line eyes at rest). */
  eyes?: 'dot' | 'big' | 'bean' | 'line';
  /** thick: heavy brows that are always on and carry the emotion. */
  brows?: 'thin' | 'thick' | 'slim';
  /** Permanent rosy cheeks. */
  blush?: boolean;
  /** A small lash flick at the outer corner of each eye. */
  lashes?: boolean;
  /** A single springy curl on top instead of the tuft; it reacts to the expression (stands up, droops, spins). */
  curl?: boolean;
  /** The face takes a soft colour wash per expression (warm when happy, blue when shocked...). */
  moodTint?: boolean;
  /** stick: thin single-line limbs with dot hands, instead of the outlined tubes. */
  limbStyle?: 'tube' | 'stick';
  /** The eyes, brows and mouth glow softly in the face colour (for dark heads with coloured features). */
  faceGlow?: boolean;
};
export type CastName = 'hero' | 'heroine' | 'pip' | 'pipHood' | 'pipInk' | 'mo' | 'sis' | 'mom' | 'suit';
export const LOOKS: Record<CastName, Look> = {
  // THE CHANNEL'S HERO (picked 2026-11-09): a dark, bald round head lit by the rim light, cream features that rest in
  // calm curved line eyes (they open to dots when something happens) and slim, always-on arched brows that do the
  // acting. The plum long coat is only the default outfit: costumes change per episode, e.g.
  // { ...LOOKS.hero, coat: 'bomber', jacket: '#2F5D50', jacketShade: '#244A40', sleeve: '#2F5D50', accent: '#FFC266' }.
  // Keep the face (skin, face, eyes, brows, no hair) fixed: that is the identity.
  // THE CHANNEL'S FEMALE CHARACTER (supporting, cast only when a story needs her; the hero leads): the hero's face exactly, plus a short lash flick at the outer corner of each eye. That
  // face is fixed; her hair is free per episode (extra: 'ponytail' | 'topbun' | 'bob' | 'bunches' ..., colour in
  // hair, a shade lighter than the head so the shape reads), like the outfit.
  heroine: { skin: '#17141C', skinShade: '#0E0C12', hand: '#17141C', line: '#08070B', face: '#F6EFE3', hair: '#3A2E44', extra: 'ponytail', accent: '#F1A7B5', eyes: 'line', brows: 'slim', lashes: true, coat: 'denim', jacket: '#4A6FA5', jacketShade: '#3A5884', sleeve: '#4A6FA5', limb: '#2A2733', shoe: '#1C1B22' },
  hero: { skin: '#17141C', skinShade: '#0E0C12', hand: '#17141C', line: '#08070B', face: '#F6EFE3', hair: '#17141C', eyes: 'line', brows: 'slim', coat: 'long', jacket: '#6E3F73', jacketShade: '#57315B', accent: '#F1A7B5', sleeve: '#6E3F73', limb: '#2A2733', shoe: '#1C1B22' },
  // A: Pip as built
  pip: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: C.jacket, jacketShade: C.jacketShade, accent: C.jacketShade, limb: C.limb, line: C.ink, shoe: C.shoe, face: C.ink, hair: C.ink },
  // B: Pip in a dark hoodie with mustard drawstrings: the body goes dark and catches the rim light, the head stays the brightest thing
  pipHood: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#2E2B3D', jacketShade: '#24212F', accent: C.jacket, limb: '#2E2B3D', line: '#121019', shoe: C.shoe, face: C.ink, hair: C.ink, extra: 'hood' },
  // C: a dark head with light features, the genre's high-contrast convention, in Pip's mustard
  pipInk: { skin: '#26232F', skinShade: '#1C1A24', hand: '#26232F', jacket: C.jacket, jacketShade: C.jacketShade, accent: C.jacketShade, limb: '#26232F', line: '#121019', shoe: C.shoe, face: '#F6EFE3', hair: '#26232F' },
  // Mo, Pip's friend: a second recurring character with his own costume (curly hair, headphones round his neck)
  mo: { skin: '#C98E68', skinShade: '#B07A58', hand: '#C98E68', jacket: '#5E6E46', jacketShade: '#4C5A38', accent: '#E9C46A', limb: '#3A3446', line: '#1A1622', shoe: '#D9534F', face: C.ink, hair: '#2A1C18', extra: 'curls' },
  // the formula's recurring cast (beats 5 and 6): Pip's little sister (draw her at about 0.7 of Pip's scale), his mum,
  // and the man in a suit who notices the power. All three are ours: plain shapes, no famous silhouettes.
  sis: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#3E8C86', jacketShade: '#2F6E69', accent: '#F28C6A', limb: '#3A3446', line: '#14121C', shoe: '#F28C6A', face: C.ink, hair: '#3A2620', extra: 'bunches' },
  mom: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#8A5A6A', jacketShade: '#704858', accent: '#E9C46A', limb: '#3A3446', line: '#14121C', shoe: '#5A4A6A', face: C.ink, hair: '#5A3226', extra: 'bob' },
  suit: { skin: '#D9C6AE', skinShade: '#C2AE96', hand: '#D9C6AE', jacket: '#2B2F3A', jacketShade: '#20232C', accent: '#A8323E', limb: '#2B2F3A', line: '#0E0F14', shoe: '#14151A', face: C.ink, hair: '#17141A', extra: 'suit' },
};

// ---------- the hero ----------
/** Mitten hands: open (a palm and a thumb) or pointing (a fist with the index finger out). */
export type HandKind = 'open' | 'point';
export type Expr = 'neutral' | 'happy' | 'smug' | 'shock' | 'worried' | 'oops' | 'cool' | 'dizzy' | 'tired';
export type Limb = { a: number; b: number }; // a: upper segment angle, b: bend of the lower segment (degrees)
export type Pose = {
  x: number;
  y: number; // hip point
  scale: number;
  facing: 1 | -1;
  tilt: number; // torso lean around the hips, degrees, + leans screen-right
  spin: number; // whole-body rotation around the chest (tumbles)
  headTilt: number;
  armL: Limb;
  armR: Limb;
  legL: Limb;
  legR: Limb;
  expr: Expr;
  blink: number; // 0 open, 1 shut
  look: number; // -1..1 eye offset
  glasses: number; // 0..1
  yaw: number; // -1 profile facing screen-left, 0 front, 1 profile facing screen-right
  squash: number; // + squashes (landing), - stretches (jump), about the feet
  handL: HandKind;
  handR: HandKind;
  sway: number; // secondary motion: how far loose things (the hood's drawstrings) swing, degrees-ish
  glint?: number; // 0..1 the eyes light up in the power's colour (set it after poseAt: it isn't interpolated)
  glintColor?: string;
};

export const basePose: Pose = {
  x: 960,
  y: 700,
  scale: 1,
  facing: 1,
  tilt: 0,
  spin: 0,
  headTilt: 0,
  armL: { a: 10, b: -8 },
  armR: { a: 10, b: -8 },
  legL: { a: 5, b: 0 },
  legR: { a: -5, b: 0 },
  expr: 'neutral',
  blink: 0,
  look: 0,
  glasses: 0,
  yaw: 0,
  squash: 0,
  handL: 'open',
  handR: 'open',
  sway: 0,
};

type Key = { f: number; p: Partial<Pose>; ease?: (t: number) => number };

const mixLimb = (a: Limb, b: Limb, t: number): Limb => ({ a: lerp(a.a, b.a, t), b: lerp(a.b, b.b, t) });

/** Interpolates every numeric part of a pose between keys; the face swaps (never morphs) at its key. */
export const poseAt = (f: number, keys: Key[], from: Pose = basePose): Pose => {
  // resolve each key into a full pose, carrying values forward
  const full: { f: number; p: Pose; ease?: (t: number) => number }[] = [];
  let cur = from;
  for (const k of keys) {
    cur = { ...cur, ...k.p };
    full.push({ f: k.f, p: cur, ease: k.ease });
  }
  if (f <= full[0].f) return full[0].p;
  for (let i = 0; i < full.length - 1; i++) {
    const A = full[i];
    const B = full[i + 1];
    if (f <= B.f) {
      const t = (B.ease ?? easeInOut)((f - A.f) / Math.max(1e-6, B.f - A.f));
      return {
        x: lerp(A.p.x, B.p.x, t),
        y: lerp(A.p.y, B.p.y, t),
        scale: lerp(A.p.scale, B.p.scale, t),
        facing: t < 0.5 ? A.p.facing : B.p.facing,
        tilt: lerp(A.p.tilt, B.p.tilt, t),
        spin: lerp(A.p.spin, B.p.spin, t),
        headTilt: lerp(A.p.headTilt, B.p.headTilt, t),
        armL: mixLimb(A.p.armL, B.p.armL, t),
        armR: mixLimb(A.p.armR, B.p.armR, t),
        legL: mixLimb(A.p.legL, B.p.legL, t),
        legR: mixLimb(A.p.legR, B.p.legR, t),
        expr: A.p.expr, // a face swaps when its own key lands, so hold the earlier one
        handL: A.p.handL,
        handR: A.p.handR,
        blink: lerp(A.p.blink, B.p.blink, t),
        look: lerp(A.p.look, B.p.look, t),
        glasses: lerp(A.p.glasses, B.p.glasses, t),
        yaw: lerp(A.p.yaw, B.p.yaw, t),
        squash: lerp(A.p.squash, B.p.squash, t),
        sway: lerp(A.p.sway, B.p.sway, t),
      };
    }
  }
  return full[full.length - 1].p;
};

// body measurements (local space: hips at 0,0, y down)
const UPPER_ARM = 62;
const FORE_ARM = 58;
const THIGH = 72;
const SHIN = 68;
const SHOULDER = { x: 42, y: -108 };
const HIP = { x: 17, y: 0 };
export const HEAD = { x: 0, y: -176, r: 62 };
export const LEG_LEN = THIGH + SHIN;

const rad = (d: number) => (d * Math.PI) / 180;
type P = { x: number; y: number };
const rot = (p: P, deg: number, c: P = { x: 0, y: 0 }): P => {
  const r = rad(deg);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(r) - dy * Math.sin(r), y: c.y + dx * Math.sin(r) + dy * Math.cos(r) };
};

/** Joint positions in local space (before the hip translate/scale), so scenes can attach props to hands. */
export const joints = (pose: Pose) => {
  const side = (s: 1 | -1, limb: Limb, root: P, l1: number, l2: number, isLeg: boolean) => {
    // arms swing outward (away from the body) on their own side; legs swing forward in the facing direction
    const dir = isLeg ? pose.facing : s;
    const d1 = { x: dir * Math.sin(rad(limb.a)), y: Math.cos(rad(limb.a)) };
    const mid = { x: root.x + d1.x * l1, y: root.y + d1.y * l1 };
    const a2 = limb.a + limb.b;
    const d2 = { x: dir * Math.sin(rad(a2)), y: Math.cos(rad(a2)) };
    return { root, mid, end: { x: mid.x + d2.x * l2, y: mid.y + d2.y * l2 } };
  };
  const torsoRot = (p: P) => rot(p, pose.tilt);
  const sp = limbSpread(pose.yaw);
  const shL = { x: -SHOULDER.x * sp + pose.yaw * 6, y: SHOULDER.y };
  const shR = { x: SHOULDER.x * sp + pose.yaw * 6, y: SHOULDER.y };
  const armL = side(-1, pose.armL, shL, UPPER_ARM, FORE_ARM, false);
  const armR = side(1, pose.armR, shR, UPPER_ARM, FORE_ARM, false);
  const legL = side(-1, pose.legL, { x: -HIP.x * sp, y: 0 }, THIGH, SHIN, true);
  const legR = side(1, pose.legR, { x: HIP.x * sp, y: 0 }, THIGH, SHIN, true);
  const r = (o: { root: P; mid: P; end: P }) => ({ root: torsoRot(o.root), mid: torsoRot(o.mid), end: torsoRot(o.end) });
  return { armL: r(armL), armR: r(armR), legL, legR, head: torsoRot(HEAD) };
};

/** How wide the body reads as it turns: full width face-on, about 60% in profile. */
export const turnWidth = (yaw: number) => 1 - 0.4 * Math.min(1, Math.abs(yaw));
/** Shoulders and hips close up as he turns, so in profile the limbs overlap the body. */
export const limbSpread = (yaw: number) => 1 - 0.85 * Math.min(1, Math.abs(yaw));

/** Face swaps happen through a blink: two frames shut either side of each change, as in the genre. */
export const faceAt = (f: number, keys: [number, Expr][]): { expr: Expr; blink: number } => {
  let expr = keys[0][1];
  let blink = 0;
  for (let i = 0; i < keys.length; i++) {
    const [k, e] = keys[i];
    if (f >= k) expr = e;
    if (i > 0 && f >= k - 2 && f < k + 1) blink = 1;
  }
  return { expr, blink };
};

/** A local point to world space, for attaching props (the mug in Pip's hand). */
export const toWorld = (pose: Pose, p: P): P => {
  const spun = rot(p, pose.spin, { x: 0, y: -90 });
  return { x: pose.x + spun.x * pose.scale, y: pose.y + spun.y * pose.scale };
};

/** Straight-arm reach: the right arm angle (local) that points the hand at a world target. */
export const reachAngle = (pose: Pose, target: P) => {
  const sh = toWorld(pose, rot({ x: SHOULDER.x * limbSpread(pose.yaw) + pose.yaw * 6, y: SHOULDER.y }, pose.tilt));
  const world = (Math.atan2(target.x - sh.x, target.y - sh.y) * 180) / Math.PI; // 0 = straight down
  return world - pose.tilt;
};

const Face: React.FC<{ expr: Expr; blink: number; look: number; glasses: number; yaw?: number; ink?: string; glint?: number; glintColor?: string; eyes?: Look['eyes']; browStyle?: Look['brows']; blush?: boolean; lashes?: boolean }> = ({ expr, blink, look, glasses, yaw = 0, ink = C.ink, glint = 0, glintColor = '#8FF0FF', eyes = 'dot', browStyle = 'thin', blush = false, lashes = false }) => {
  const ex = look * 7;
  const ay = Math.min(1, Math.abs(yaw));
  const farHidden = ay > 0.72;
  const farSide = yaw > 0 ? -1 : 1; // facing screen-right hides the screen-left eye
  const eyeY = HEAD.y - 4;
  // heavy lids: half shut when smug or cool, more than half when tired (with dark rings under the eyes)
  const lid = expr === 'smug' || expr === 'cool' ? 0.45 : expr === 'tired' ? 0.58 : 0;
  const open = Math.max(0.08, 1 - Math.max(blink, lid));
  const eye = (cx: number) => {
    if (farHidden && Math.sign(cx) === farSide) return null;
    if (expr === 'happy') return <path d={`M ${cx - 10} ${eyeY + 3} Q ${cx} ${eyeY - 9} ${cx + 10} ${eyeY + 3}`} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (expr === 'oops') return <path d={`M ${cx - 9} ${eyeY - 6} L ${cx + 4} ${eyeY} L ${cx - 9} ${eyeY + 6}`} transform={cx > 0 ? `translate(${2 * cx},0) scale(-1,1)` : undefined} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    if (expr === 'dizzy') return <g stroke={ink} strokeWidth={5} strokeLinecap="round"><path d={`M ${cx - 7} ${eyeY - 7} L ${cx + 7} ${eyeY + 7} M ${cx + 7} ${eyeY - 7} L ${cx - 7} ${eyeY + 7}`} /></g>;
    // shut (a blink's middle frame, or asleep): the closed lid's curve, with the tired rings kept
    if (blink >= 0.95)
      return (
        <g>
          <path d={`M ${cx - 12} ${eyeY + 1} Q ${cx} ${eyeY + 8} ${cx + 12} ${eyeY + 1}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
          {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 15} Q ${cx} ${eyeY + 22} ${cx + 12} ${eyeY + 15}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
        </g>
      );
    if (eyes === 'line' && (expr === 'neutral' || expr === 'smug' || expr === 'cool' || expr === 'tired'))
      return (
        <g>
          <path d={`M ${cx - 12} ${eyeY - 2} Q ${cx} ${eyeY + 6} ${cx + 12} ${eyeY - 2}`} stroke={ink} strokeWidth={5.5} fill="none" strokeLinecap="round" />
          {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 14} Q ${cx} ${eyeY + 21} ${cx + 12} ${eyeY + 14}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
        </g>
      );
    if (eyes === 'big') {
      const wide = expr === 'shock';
      const wry = (wide ? 21 : 17) * open;
      return (
        <g>
          <ellipse cx={cx} cy={eyeY} rx={wide ? 18 : 15} ry={Math.max(2.5, wry)} fill="#FFFFFF" stroke={ink} strokeWidth={4} />
          {open > 0.3 ? (
            <g>
              <ellipse cx={cx + ex * 1.1} cy={eyeY + 2 * open} rx={wide ? 4.5 : 8} ry={(wide ? 4.5 : 10) * open} fill={ink} />
              <circle cx={cx + ex * 1.1 - 3} cy={eyeY - 3 * open} r={wide ? 1.8 : 3} fill="#FFFFFF" />
            </g>
          ) : null}
          {lid ? <path d={expr === 'tired' ? `M ${cx - 16} ${eyeY - 4} Q ${cx} ${eyeY - 8} ${cx + 16} ${eyeY - 4}` : `M ${cx - 16} ${eyeY - 6} L ${cx + 16} ${eyeY - 4}`} stroke={ink} strokeWidth={4.5} strokeLinecap="round" fill="none" /> : null}
          {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 20} Q ${cx} ${eyeY + 27} ${cx + 12} ${eyeY + 20}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
        </g>
      );
    }
    const big = expr === 'shock';
    const rx = big ? 11 : eyes === 'bean' ? 6 : 7;
    const ry = (big ? 13 : eyes === 'bean' ? 13 : 10) * open;
    return (
      <g>
        <ellipse cx={cx + ex} cy={eyeY + (lid ? 3 : 0)} rx={rx} ry={ry} fill={ink} />
        {big && open > 0.5 ? <circle cx={cx + ex + 3.5} cy={eyeY - 4} r={3.4} fill="#fff" /> : null}
        {lid ? <path d={expr === 'tired' ? `M ${cx - 13} ${eyeY - 1} Q ${cx} ${eyeY - 5} ${cx + 13} ${eyeY - 1}` : `M ${cx - 12} ${eyeY - 4} L ${cx + 12} ${eyeY - 2}`} stroke={ink} strokeWidth={4} strokeLinecap="round" fill="none" /> : null}
        {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 14} Q ${cx} ${eyeY + 21} ${cx + 12} ${eyeY + 14}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
      </g>
    );
  };
  const brows: Record<Expr, string> = {
    neutral: '',
    happy: '',
    smug: `M -34 ${eyeY - 22} L -12 ${eyeY - 20} M 12 ${eyeY - 26} L 34 ${eyeY - 30}`,
    shock: `M -32 ${eyeY - 28} Q -21 ${eyeY - 36} -10 ${eyeY - 29} M 10 ${eyeY - 29} Q 21 ${eyeY - 36} 32 ${eyeY - 28}`,
    worried: `M -32 ${eyeY - 18} L -12 ${eyeY - 26} M 12 ${eyeY - 26} L 32 ${eyeY - 18}`,
    oops: `M -32 ${eyeY - 20} L -12 ${eyeY - 16} M 12 ${eyeY - 16} L 32 ${eyeY - 20}`,
    cool: '',
    dizzy: '',
    tired: `M -33 ${eyeY - 17} Q -22 ${eyeY - 21} -11 ${eyeY - 19} M 11 ${eyeY - 19} Q 22 ${eyeY - 21} 33 ${eyeY - 17}`,
  };
  const mY = HEAD.y + 28;
  const mouth: Record<Expr, React.ReactNode> = {
    neutral: <path d={`M -10 ${mY} Q 0 ${mY + 4} 10 ${mY}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    happy: <path d={`M -18 ${mY - 4} Q 0 ${mY + 20} 18 ${mY - 4} Z`} fill={ink} />,
    smug: <path d={`M -12 ${mY + 2} Q 4 ${mY + 8} 16 ${mY - 6}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    shock: <ellipse cx={0} cy={mY + 4} rx={10} ry={14} fill={ink} />,
    worried: <path d={`M -16 ${mY + 4} Q -8 ${mY - 4} 0 ${mY + 4} Q 8 ${mY + 12} 16 ${mY + 4}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    oops: <g><rect x={-18} y={mY - 6} width={36} height={16} rx={6} fill={ink} /><path d={`M -14 ${mY + 2} L 14 ${mY + 2}`} stroke="#fff" strokeWidth={3} /></g>,
    cool: <path d={`M -12 ${mY + 2} Q 4 ${mY + 8} 16 ${mY - 6}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    dizzy: <path d={`M -14 ${mY + 4} Q -7 ${mY - 4} 0 ${mY + 4} Q 7 ${mY + 12} 14 ${mY + 4}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    tired: <path d={`M -11 ${mY + 4} Q 0 ${mY} 11 ${mY + 4}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
  };
  return (
    <g transform={`translate(${yaw * 30} 0) scale(${1 - 0.28 * ay} 1)`}>
      {eye(-21)}
      {eye(21)}
      {lashes && expr !== 'dizzy' && expr !== 'oops'
        ? [-21, 21].map((cx) => {
            if (farHidden && Math.sign(cx) === farSide) return null;
            const o = Math.sign(cx);
            // where the outer corner of this eye shape sits, then a short flick up and out from it
            const calm = eyes === 'line' && (expr === 'neutral' || expr === 'smug' || expr === 'cool' || expr === 'tired');
            const shut = blink >= 0.95;
            const [x0, y0] = expr === 'happy' ? [cx + o * 10, eyeY + 3] : calm || shut ? [cx + o * 12, eyeY - 2] : eyes === 'big' ? [cx + o * 13, eyeY - 9] : [cx + o * 6, eyeY - 7];
            return <path key={`lash${cx}`} d={`M ${x0} ${y0} q ${o * 3.5} -1.5 ${o * 6} -5.5`} stroke={ink} strokeWidth={3.4} fill="none" strokeLinecap="round" />;
          })
        : null}
      {(() => {
        if (browStyle === 'slim') {
          // slim, gently arched brows, always on: a fine line that still acts (arches up, knits, droops)
          const b = (l: [number, number, number], r: [number, number, number]) =>
            `M -34 ${eyeY - l[0]} Q -23 ${eyeY - l[1]} -11 ${eyeY - l[2]} M 11 ${eyeY - r[2]} Q 23 ${eyeY - r[1]} 34 ${eyeY - r[0]}`;
          const slim: Record<Expr, string> = {
            neutral: b([22, 30, 25], [22, 30, 25]),
            happy: b([26, 35, 29], [26, 35, 29]),
            smug: b([20, 23, 20], [32, 38, 28]),
            shock: b([32, 42, 35], [32, 42, 35]),
            worried: b([18, 20, 30], [18, 20, 30]),
            oops: b([22, 20, 16], [22, 20, 16]),
            cool: b([20, 25, 21], [20, 25, 21]),
            dizzy: b([24, 28, 22], [26, 22, 28]),
            tired: b([16, 24, 22], [16, 24, 22]),
          };
          return <path d={slim[expr]} stroke={ink} strokeWidth={3.6} fill="none" strokeLinecap="round" />;
        }
        const d = brows[expr] || (browStyle === 'thick' ? `M -33 ${eyeY - 24} Q -22 ${eyeY - 29} -11 ${eyeY - 24} M 11 ${eyeY - 24} Q 22 ${eyeY - 29} 33 ${eyeY - 24}` : '');
        return d ? <path d={d} stroke={ink} strokeWidth={browStyle === 'thick' ? 9 : 5} fill="none" strokeLinecap="round" /> : null;
      })()}
      {blush ? [-1, 1].map((sd) => <ellipse key={sd} cx={sd * 40} cy={HEAD.y + 18} rx={12} ry={6.5} fill="#F2949A" opacity={0.6} />) : null}
      {mouth[expr]}
      {expr === 'shock' || expr === 'oops' ? <path d={`M 52 ${HEAD.y - 30} q 6 10 0 16 q -6 -6 0 -16 Z`} fill="#8FD3FF" /> : null}
      {/* a power lighting the eyes: a soft halo, a bright iris, a white catchlight (none while the lids are shut) */}
      {glint > 0.01 && blink < 0.95
        ? [-21, 21].map((cx) =>
            farHidden && Math.sign(cx) === farSide ? null : (
              <g key={`gl${cx}`} opacity={Math.min(1, glint)}>
                <circle cx={cx + ex} cy={eyeY} r={17} fill={glintColor} opacity={0.2} />
                <circle cx={cx + ex} cy={eyeY} r={12} fill={glintColor} opacity={0.28} />
                <ellipse cx={cx + ex} cy={eyeY + (lid ? 3 : 0)} rx={8} ry={Math.max(2, 11 * open)} fill={glintColor} />
                <circle cx={cx + ex + 2.5} cy={eyeY - 3} r={2.6} fill="#FFFFFF" />
              </g>
            ),
          )
        : null}
      {glasses > 0.01 ? (
        <g opacity={glasses} transform={`translate(0 ${(1 - glasses) * -60})`}>
          {/* classic shades: a full bar across, two big lenses, one bright glint so it reads at feed size */}
          <path d={`M -58 ${eyeY - 12} L 58 ${eyeY - 12}`} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <path d={`M -50 ${eyeY - 14} L -6 ${eyeY - 14} L -10 ${eyeY + 8} Q -28 ${eyeY + 18} -46 ${eyeY + 8} Z`} fill="#0D0F1C" stroke={ink} strokeWidth={3} />
          <path d={`M 6 ${eyeY - 14} L 50 ${eyeY - 14} L 46 ${eyeY + 8} Q 28 ${eyeY + 18} 10 ${eyeY + 8} Z`} fill="#0D0F1C" stroke={ink} strokeWidth={3} />
          <path d={`M -40 ${eyeY + 2} L -26 ${eyeY - 10} M 16 ${eyeY + 2} L 30 ${eyeY - 10}`} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        </g>
      ) : null}
    </g>
  );
};

export const Hero: React.FC<{ pose: Pose; shadow?: number; rimId?: string; look?: Look }> = ({ pose, shadow = 1, rimId = 'rimR', look = LOOKS.hero }) => {
  const j = joints(pose);
  const L = look;
  // limbs are light with a dark outline, so they read on the dark sets (navy limbs vanished on navy walls)
  const limb = (o: { root: P; mid: P; end: P }, w: number, col: string = L.limb) => {
    const d = `M ${o.root.x} ${o.root.y} L ${o.mid.x} ${o.mid.y} L ${o.end.x} ${o.end.y}`;
    if (L.limbStyle === 'stick')
      return (
        <g>
          <path d={d} stroke={L.line} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    return (
      <g>
        <path d={d} stroke={L.line} strokeWidth={w + 7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  const shoe = (o: { root: P; mid: P; end: P }) => (
    <ellipse cx={o.end.x + pose.facing * 9} cy={o.end.y + 4} rx={22} ry={11} fill={L.shoe} stroke={L.line} strokeWidth={4} />
  );
  // a mitten along the forearm: the palm, the thumb toward the body, two knuckle marks; or a pointing fist
  const hand = (o: { mid: P; end: P }, side: 1 | -1, kind: HandKind) => {
    if (L.limbStyle === 'stick') return <circle cx={o.end.x} cy={o.end.y} r={kind === 'point' ? 7 : 10} fill={L.hand} stroke={L.line} strokeWidth={3.5} />;
    const ang = (Math.atan2(o.end.x - o.mid.x, o.end.y - o.mid.y) * 180) / Math.PI;
    return (
      <g transform={`translate(${o.end.x} ${o.end.y}) rotate(${-ang})`}>
        {kind === 'point' ? (
          <g>
            <rect x={-4} y={10} width={8} height={24} rx={4} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
            <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={L.hand} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
            <ellipse cx={side * 10} cy={6} rx={4.5} ry={7} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
          </g>
        ) : (
          <g>
            <ellipse cx={side * 10} cy={3} rx={5.5} ry={9} transform={`rotate(${side * -28} ${side * 10} 3)`} fill={L.hand} stroke={L.line} strokeWidth={4} />
            <ellipse cx={0} cy={10} rx={11} ry={15} fill={L.hand} stroke={L.line} strokeWidth={4} />
            <path d="M -4 17 L -4 23 M 3 18 L 3 24" stroke={L.line} strokeWidth={2} opacity={0.45} strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };
  const kw = turnWidth(pose.yaw);
  const torso = (
    <g transform={`rotate(${pose.tilt}) translate(${pose.yaw * 6} 0) scale(${kw} 1)`}>
      {L.item === 'backpack' ? (
        // the pack sits behind the body: its sides and top handle peek out, the straps come over the shoulders
        <g>
          <path d="M -14 -128 Q 0 -142 14 -128" stroke={L.line} strokeWidth={6} fill="none" strokeLinecap="round" />
          <rect x={-58} y={-124} width={116} height={108} rx={18} fill={L.itemColor ?? '#3E7C8C'} stroke={L.line} strokeWidth={4} />
        </g>
      ) : null}
      {L.coat === 'long' ? (
        // a long coat: the skirt flares over the thighs to mid-leg, split up the front
        <g>
          <path d="M -46 -112 Q 0 -124 46 -112 L 58 78 Q 30 86 3 80 L 0 20 L -3 80 Q -30 86 -58 78 Z" fill={L.jacket} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 12 0 L 54 4 L 58 78 Q 30 86 6 80 Z" fill={L.jacketShade} opacity={0.5} />
        </g>
      ) : null}
      <path d="M -46 -112 Q 0 -124 46 -112 L 40 2 Q 0 12 -40 2 Z" fill={L.jacket} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 10 -116 Q 30 -114 46 -112 L 40 2 Q 26 8 12 9 Z" fill={L.jacketShade} opacity={0.55} />
      <path d="M 0 -112 L 0 4" stroke={L.jacketShade} strokeWidth={4} />
      {L.extra === 'suit' ? (
        // a white shirt in the V of the jacket and a tie in the accent colour
        <g>
          <path d="M -24 -116 L 0 -54 L 24 -116 Z" fill="#EDE8DE" />
          <path d="M -7 -112 L 7 -112 L 9 -100 L 5 -64 L 0 -56 L -5 -64 L -9 -100 Z" fill={L.accent} />
          <path d="M -26 -116 L 0 -54 M 26 -116 L 0 -54" stroke={L.line} strokeWidth={4} />
        </g>
      ) : L.coat ? null : (
        <path d="M -22 -118 Q 0 -100 22 -118" stroke={L.accent} strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
      {L.coat === 'biker' ? (
        // a biker jacket: wide lapels, an off-centre zip in the accent (metal) colour, zipped pockets, a belt at the hem
        <g>
          <path d="M -22 -117 L 0 -98 L 20 -117 Z" fill="#2B2833" />
          <path d="M 20 -116 L -8 -62 L -6 2" stroke={L.accent} strokeWidth={3.5} fill="none" />
          <path d="M -34 -116 L -6 -86 L -42 -74 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M 20 -116 L 44 -78 L 10 -96 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M -36 -46 L -22 -34 M 22 -50 L 34 -38" stroke={L.accent} strokeWidth={3} strokeLinecap="round" />
          <path d="M -41 -12 L 41 -12" stroke={L.line} strokeWidth={9} />
          <path d="M -41 -12 L 41 -12" stroke={L.jacketShade} strokeWidth={5} />
          <rect x={-30} y={-18} width={12} height={12} rx={2} fill="none" stroke={L.accent} strokeWidth={3} />
        </g>
      ) : null}
      {L.coat === 'bomber' ? (
        // an open bomber: lining in the accent colour at the opening, a tee inside, ribbed collar and hem
        <g>
          <path d="M -15 -114 L -13 -2 L 13 -2 L 15 -114 Z" fill={L.accent} />
          <path d="M -8 -114 L -7 -2 L 7 -2 L 8 -114 Z" fill="#EDE8DE" />
          <path d="M -32 -118 Q 0 -102 32 -118" stroke={L.line} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M -32 -118 Q 0 -102 32 -118" stroke={L.jacketShade} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M -41 -10 Q 0 -2 41 -10 L 40 2 Q 0 12 -40 2 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} />
          {[-30, -18, -6, 6, 18, 30].map((x) => (
            <path key={x} d={`M ${x} -7 L ${x} 4`} stroke={L.line} strokeWidth={2} opacity={0.35} />
          ))}
        </g>
      ) : null}
      {L.coat === 'denim' ? (
        // an open denim jacket over a white tee: pointed collar, flap chest pockets, stitching in the accent colour
        <g>
          <path d="M -16 -114 L -14 4 L 14 4 L 16 -114 Z" fill="#EDE8DE" stroke={L.line} strokeWidth={3} />
          <path d="M -34 -118 L -12 -100 L -38 -94 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M 34 -118 L 12 -100 L 38 -94 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <rect x={sd > 0 ? 20 : -40} y={-84} width={20} height={20} rx={2} fill={L.jacketShade} stroke={L.line} strokeWidth={3} />
              <path d={`M ${sd > 0 ? 20 : -40} -78 L ${sd > 0 ? 40 : -20} -78`} stroke={L.accent} strokeWidth={2} strokeDasharray="3 3" />
            </g>
          ))}
          <path d="M -40 -14 L -16 -14 M 16 -14 L 40 -14" stroke={L.accent} strokeWidth={2.5} strokeDasharray="4 3" />
        </g>
      ) : null}
      {L.coat === 'long' ? (
        // the long coat's top: collar turned up beside the jaw, a tied belt in the shade colour, buckle in the accent
        <g>
          <path d="M -24 -116 L 0 -96 L 24 -116 Z" fill="#2B2833" />
          <path d="M -34 -114 L -64 -152 L -46 -110 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M 34 -114 L 64 -152 L 46 -110 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M -42 -16 L 42 -16" stroke={L.line} strokeWidth={11} />
          <path d="M -42 -16 L 42 -16" stroke={L.jacketShade} strokeWidth={7} />
          <rect x={-8} y={-23} width={16} height={14} rx={2} fill="none" stroke={L.accent} strokeWidth={3} />
          <path d="M 4 -10 L 10 18 M 10 -10 L 18 14" stroke={L.jacketShade} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
      {L.item === 'satchel' ? (
        // a crossbody strap from the left shoulder to a flap bag on the right hip, a pencil poking out
        <g>
          <path d="M -36 -112 L 34 -18" stroke={L.line} strokeWidth={13} strokeLinecap="round" />
          <path d="M -36 -112 L 34 -18" stroke={L.itemColor ?? '#9A6A3E'} strokeWidth={7} strokeLinecap="round" />
          <path d="M 46 -40 L 50 -60 L 54 -40 Z" fill="#F2A65A" stroke={L.line} strokeWidth={3} strokeLinejoin="round" />
          <rect x={16} y={-40} width={50} height={40} rx={7} fill={L.itemColor ?? '#9A6A3E'} stroke={L.line} strokeWidth={4} />
          <path d="M 16 -33 Q 41 -18 66 -33 L 66 -40 L 16 -40 Z" fill="#7A5230" stroke={L.line} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={41} cy={-24} r={3.5} fill="#E8D2A0" />
        </g>
      ) : null}
      {L.item === 'backpack' ? (
        <g>
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <path d={`M ${sd * 30} -116 L ${sd * 32} -22`} stroke={L.line} strokeWidth={13} strokeLinecap="round" />
              <path d={`M ${sd * 30} -116 L ${sd * 32} -22`} stroke={L.itemColor ?? '#3E7C8C'} strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
        </g>
      ) : null}
      {L.item === 'scarf' ? (
        // a chunky plain scarf wound at the neck, one long fringed tail down the front that swings with sway
        (() => {
          const sw = pose.sway * 0.8 - pose.tilt * 0.5;
          const col = L.itemColor ?? '#D9543A';
          return (
            <g>
              <path d={`M -16 -110 Q ${-20 + sw * 0.3} -76 ${-22 + sw} -36 L ${-4 + sw} -36 Q ${-4 + sw * 0.3} -76 0 -110 Z`} fill={col} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
              <path d={`M ${-20 + sw} -36 L ${-21 + sw} -26 M ${-13 + sw} -36 L ${-13 + sw} -26 M ${-6 + sw} -36 L ${-5 + sw} -26`} stroke={col} strokeWidth={3.5} strokeLinecap="round" />
              <path d="M -46 -124 Q 0 -96 46 -124 Q 50 -108 40 -102 Q 0 -84 -40 -102 Q -50 -108 -46 -124 Z" fill={col} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
            </g>
          );
        })()
      ) : null}
      {L.item === 'stopwatch' ? (
        // a stopwatch on a lanyard round the neck: a gold case, a cream dial, one hand, the crown button on top
        <g>
          <path d="M -18 -116 L 0 -66 L 18 -116" stroke={L.itemColor ?? '#E8B64C'} strokeWidth={4} fill="none" strokeLinejoin="round" />
          <rect x={-5} y={-74} width={10} height={8} rx={2} fill={L.itemColor ?? '#E8B64C'} stroke={L.line} strokeWidth={3} />
          <circle cx={0} cy={-50} r={17} fill={L.itemColor ?? '#E8B64C'} stroke={L.line} strokeWidth={4} />
          <circle cx={0} cy={-50} r={11} fill="#FBF3E0" />
          <path d="M 0 -50 L 6 -57" stroke={L.line} strokeWidth={3} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
  const head = (
    <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt} 0 ${HEAD.y + 40})`}>
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={L.skin} stroke={L.line} strokeWidth={4} />
      <path d={`M ${HEAD.x + 14} ${HEAD.y + 58} A ${HEAD.r} ${HEAD.r} 0 0 0 ${HEAD.x + 60} ${HEAD.y + 14} A 70 70 0 0 1 ${HEAD.x + 14} ${HEAD.y + 58} Z`} fill={L.skinShade} />
      {L.moodTint ? (() => {
        // a soft wash over the face per expression: warm, cold, sickly... (none at rest)
        const tint: Partial<Record<Expr, [string, number]>> = { happy: ['#FF9E8A', 0.28], shock: ['#7FA6FF', 0.32], worried: ['#9CCBFF', 0.28], oops: ['#FF7A6A', 0.3], dizzy: ['#A6E08A', 0.35], tired: ['#A28CD6', 0.3], cool: ['#7FD6E0', 0.18] };
        const t = tint[pose.expr];
        return t ? <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r - 2} fill={t[0]} opacity={t[1]} /> : null;
      })() : null}
      {L.curl ? (() => {
        // one springy curl on the crown that acts: up and taut when shocked, drooping when worried or tired,
        // a spiral when dizzy, a bouncy loop otherwise; it trails the body's sway
        const b = HEAD.y - 60;
        const sw = pose.sway * 0.6;
        const up = `M 0 ${b} C 2 ${b - 30} -2 ${b - 50} 0 ${b - 66} C 2 ${b - 80} 18 ${b - 78} 14 ${b - 64}`;
        const shapes: Partial<Record<Expr, string>> = {
          shock: up,
          oops: up,
          worried: `M 0 ${b} C 10 ${b - 26} 38 ${b - 30} 46 ${b - 10} C 50 ${b + 2} 40 ${b + 8} 36 ${b}`,
          tired: `M 0 ${b} C 12 ${b - 22} 44 ${b - 22} 56 ${b + 2} C 60 ${b + 14} 48 ${b + 18} 44 ${b + 8}`,
          dizzy: `M 0 ${b} C 0 ${b - 20} 4 ${b - 36} 0 ${b - 44} a 8 8 0 1 1 16 0 a 11 11 0 1 1 -22 0 a 5 5 0 1 1 10 0`,
          happy: `M 0 ${b} C -10 ${b - 24} 4 ${b - 44} 16 ${b - 44} C 30 ${b - 44} 30 ${b - 26} 18 ${b - 26} C 6 ${b - 26} 8 ${b - 46} 20 ${b - 56}`,
        };
        const d = shapes[pose.expr] ?? `M 0 ${b} C -8 ${b - 26} 6 ${b - 44} 18 ${b - 42} C 30 ${b - 40} 28 ${b - 24} 16 ${b - 26}`;
        return (
          <g transform={`translate(${-pose.yaw * 16} 0) rotate(${sw} 0 ${b})`}>
            <path d={d} stroke={L.line} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} stroke={L.hair} strokeWidth={6.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })() : null}
      {L.extra === 'bunches' || L.extra === 'bob' || L.extra === 'suit' || L.extra === 'bucket' || L.extra === 'topbun' || L.extra === 'beanie' || L.extra === 'cap' || L.extra === 'beret' || L.extra === 'ponytail' || L.curl || L.hair === L.skin ? null : (
        <path transform={`translate(${-pose.yaw * 16} 0)`} d={`M -6 ${HEAD.y - 60} q 10 -26 30 -18 q -16 2 -14 16 q -8 -10 -16 2 Z`} fill={L.hair} />
      )}
      {L.extra === 'bunches' ? (
        // a fringe cap and two bunches tied with coral bands; the bunches swing a little with sway
        <g>
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`rotate(${pose.sway * 0.5} ${sd * 58} ${HEAD.y - 30})`}>
              <circle cx={sd * 72 - pose.yaw * 10} cy={HEAD.y - 24} r={24} fill={L.hair} stroke={L.line} strokeWidth={4} />
              <circle cx={sd * 55 - pose.yaw * 10} cy={HEAD.y - 30} r={8} fill={L.accent} />
            </g>
          ))}
          <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -60 ${HEAD.y - 22} Q -62 ${HEAD.y - 66} 0 ${HEAD.y - 66} Q 62 ${HEAD.y - 66} 60 ${HEAD.y - 22} Q 40 ${HEAD.y - 46} 14 ${HEAD.y - 40} Q 0 ${HEAD.y - 50} -14 ${HEAD.y - 40} Q -40 ${HEAD.y - 46} -60 ${HEAD.y - 22} Z`} fill={L.hair} />
        </g>
      ) : null}
      {L.extra === 'bob' ? (
        // a chin-length bob framing the face, a side parting
        <path
          transform={`translate(${-pose.yaw * 12} 0)`}
          d={`M -74 ${HEAD.y + 34} Q -84 ${HEAD.y - 70} 0 ${HEAD.y - 72} Q 84 ${HEAD.y - 70} 74 ${HEAD.y + 34} L 56 ${HEAD.y + 34} Q 60 ${HEAD.y - 20} 40 ${HEAD.y - 40} Q 10 ${HEAD.y - 34} -16 ${HEAD.y - 48} Q -52 ${HEAD.y - 30} -56 ${HEAD.y + 34} Z`}
          fill={L.hair}
          stroke={L.line}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      ) : null}
      {L.extra === 'suit' ? (
        // short combed-back hair with a hard side parting
        <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -60 ${HEAD.y - 18} Q -64 ${HEAD.y - 70} 4 ${HEAD.y - 68} Q 64 ${HEAD.y - 64} 60 ${HEAD.y - 18} Q 52 ${HEAD.y - 44} 18 ${HEAD.y - 46} L 12 ${HEAD.y - 54} L 6 ${HEAD.y - 46} Q -44 ${HEAD.y - 46} -60 ${HEAD.y - 18} Z`} fill={L.hair} />
      ) : null}
      {L.extra === 'bucket' ? (
        // a soft bucket hat with a drooping brim and a band in the accent colour (worn high, so the brows still act)
        <g transform={`translate(${-pose.yaw * 12} 0)`}>
          <path d={`M -54 ${HEAD.y - 40} Q -58 ${HEAD.y - 102} 0 ${HEAD.y - 104} Q 58 ${HEAD.y - 102} 54 ${HEAD.y - 40} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M -54 ${HEAD.y - 50} Q 0 ${HEAD.y - 62} 54 ${HEAD.y - 50}`} stroke={L.accent} strokeWidth={10} fill="none" />
          <path d={`M -88 ${HEAD.y - 38} Q 0 ${HEAD.y - 62} 88 ${HEAD.y - 38} Q 96 ${HEAD.y - 24} 82 ${HEAD.y - 22} Q 0 ${HEAD.y - 44} -82 ${HEAD.y - 22} Q -96 ${HEAD.y - 24} -88 ${HEAD.y - 38} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
      {L.extra === 'topbun' ? (
        // a big round bun high on the crown, tied with an accent band, over a smooth hairline
        <g transform={`translate(${-pose.yaw * 14} 0)`}>
          <circle cx={0} cy={HEAD.y - 88} r={32} fill={L.hair} stroke={L.line} strokeWidth={4} />
          <rect x={-22} y={HEAD.y - 66} width={44} height={11} rx={5} fill={L.accent} stroke={L.line} strokeWidth={3} />
          <path d={`M -60 ${HEAD.y - 16} Q -64 ${HEAD.y - 68} 0 ${HEAD.y - 66} Q 64 ${HEAD.y - 68} 60 ${HEAD.y - 16} Q 44 ${HEAD.y - 46} 0 ${HEAD.y - 44} Q -44 ${HEAD.y - 46} -60 ${HEAD.y - 16} Z`} fill={L.hair} />
        </g>
      ) : null}
      {L.extra === 'cap' ? (
        // a baseball cap worn backwards: a smooth crown, a button on top, the short peak sticking out behind the head
        (() => {
          const back = pose.yaw >= 0 ? -1 : 1;
          return (
            <g transform={`translate(${-pose.yaw * 12} 0)`}>
              <path d={`M ${back * 40} ${HEAD.y - 44} L ${back * 98} ${HEAD.y - 34} Q ${back * 104} ${HEAD.y - 24} ${back * 92} ${HEAD.y - 22} L ${back * 46} ${HEAD.y - 28} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
              <path d={`M -62 ${HEAD.y - 26} Q -66 ${HEAD.y - 102} 0 ${HEAD.y - 104} Q 66 ${HEAD.y - 102} 62 ${HEAD.y - 26} Q 0 ${HEAD.y - 42} -62 ${HEAD.y - 26} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
              <path d={`M -30 ${HEAD.y - 34} Q 0 ${HEAD.y - 50} 30 ${HEAD.y - 34}`} stroke={L.accent} strokeWidth={7} fill="none" strokeLinecap="round" />
              <circle cx={0} cy={HEAD.y - 103} r={7} fill={L.accent} stroke={L.line} strokeWidth={3} />
            </g>
          );
        })()
      ) : null}
      {L.extra === 'beret' ? (
        // a soft beret tipped to one side, a little stalk on top
        <g transform={`translate(${-pose.yaw * 12} 0) rotate(-9 0 ${HEAD.y - 60})`}>
          <path d={`M 4 ${HEAD.y - 94} L 6 ${HEAD.y - 106}`} stroke={L.line} strokeWidth={6} strokeLinecap="round" />
          <ellipse cx={8} cy={HEAD.y - 62} rx={80} ry={30} fill={L.hair} stroke={L.line} strokeWidth={4} />
          <path d={`M -58 ${HEAD.y - 50} Q 8 ${HEAD.y - 34} 74 ${HEAD.y - 50}`} stroke={L.accent} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {L.extra === 'ponytail' ? (
        // a high ponytail swinging out behind the head (it follows sway), tied with an accent band, smooth hairline
        (() => {
          const back = pose.yaw >= 0 ? -1 : 1;
          const sw = pose.sway * 0.8;
          return (
            <g transform={`translate(${-pose.yaw * 14} 0)`}>
              <path d={`M ${back * 34} ${HEAD.y - 62} Q ${back * 104 + sw} ${HEAD.y - 66} ${back * 96 + sw} ${HEAD.y + 22} Q ${back * 74 + sw * 0.6} ${HEAD.y - 18} ${back * 30} ${HEAD.y - 40} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
              <circle cx={back * 40} cy={HEAD.y - 54} r={9} fill={L.accent} stroke={L.line} strokeWidth={3} />
              <path d={`M -60 ${HEAD.y - 16} Q -64 ${HEAD.y - 68} 0 ${HEAD.y - 66} Q 64 ${HEAD.y - 68} 60 ${HEAD.y - 16} Q 40 ${HEAD.y - 50} ${back * -10} ${HEAD.y - 44} Q -44 ${HEAD.y - 46} -60 ${HEAD.y - 16} Z`} fill={L.hair} />
            </g>
          );
        })()
      ) : null}
      {L.extra === 'beanie' ? (
        // a slouch beanie whose loose top flops over to one side (it swings a little with sway), a ribbed turn-up cuff
        <g transform={`translate(${-pose.yaw * 12} 0)`}>
          <path d={`M -63 ${HEAD.y - 30} Q -72 ${HEAD.y - 106} -6 ${HEAD.y - 114} Q ${70 + pose.sway * 0.6} ${HEAD.y - 124} ${100 + pose.sway} ${HEAD.y - 76} Q ${104 + pose.sway} ${HEAD.y - 54} 80 ${HEAD.y - 56} Q 68 ${HEAD.y - 50} 63 ${HEAD.y - 30} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M 20 ${HEAD.y - 104} Q 58 ${HEAD.y - 100} ${78 + pose.sway * 0.8} ${HEAD.y - 70}`} stroke={L.line} strokeWidth={3} fill="none" opacity={0.3} strokeLinecap="round" />
          <path d={`M -66 ${HEAD.y - 50} Q 0 ${HEAD.y - 62} 66 ${HEAD.y - 50} L 66 ${HEAD.y - 26} Q 0 ${HEAD.y - 38} -66 ${HEAD.y - 26} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          {[-48, -30, -12, 6, 24, 42].map((x) => (
            <path key={x} d={`M ${x + 3} ${HEAD.y - 54} L ${x + 3} ${HEAD.y - 34}`} stroke={L.line} strokeWidth={2.5} opacity={0.3} />
          ))}
        </g>
      ) : null}
      <g filter={L.faceGlow ? 'url(#featGlow)' : undefined}>
      <Face expr={pose.expr} blink={pose.blink} look={pose.look} glasses={pose.glasses} yaw={pose.yaw} ink={L.face} glint={pose.glint} glintColor={pose.glintColor} eyes={L.eyes} browStyle={L.brows} blush={L.blush} lashes={L.lashes} />
      </g>
      {L.item === 'headlamp' ? (
        // a small headlamp on the front of the hat, always lit: a dark housing, a warm lens, a soft halo
        <g transform={`translate(${pose.yaw * 30} 0)`}>
          <path d={`M -42 ${HEAD.y - 46} L 42 ${HEAD.y - 46}`} stroke="#2B2833" strokeWidth={6} strokeLinecap="round" />
          <circle cx={0} cy={HEAD.y - 46} r={26} fill={L.itemColor ?? '#FFE9A8'} opacity={0.25} />
          <rect x={-17} y={HEAD.y - 59} width={34} height={26} rx={8} fill="#2B2833" stroke={L.line} strokeWidth={4} />
          <circle cx={0} cy={HEAD.y - 46} r={8.5} fill={L.itemColor ?? '#FFE9A8'} />
          <circle cx={-2.5} cy={HEAD.y - 49} r={2.6} fill="#FFFFFF" />
        </g>
      ) : null}
      {L.extra === 'curls'
        ? [-150, -125, -100, -78, -55, -30].map((deg, k) => {
            const a = (deg * Math.PI) / 180;
            return <circle key={k} cx={Math.cos(a) * 54} cy={HEAD.y + Math.sin(a) * 54} r={24} fill={L.hair} />;
          })
        : null}
    </g>
  );
  return (
    <g>
      {shadow > 0 ? <ellipse cx={pose.x} cy={pose.y + LEG_LEN * pose.scale + 10} rx={70 * pose.scale} ry={12 * pose.scale} fill="#000" opacity={0.25 * shadow} /> : null}
      <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90)`} filter={`url(#${rimId})`}>
        <g transform={`translate(0 ${LEG_LEN}) scale(${1 + 0.6 * pose.squash} ${1 - pose.squash}) translate(0 ${-LEG_LEN})`}>
          {/* the far side is drawn first, so a turned body overlaps itself the right way */}
          {pose.yaw < 0 ? <>{limb(j.legR, 12)}{shoe(j.legR)}{limb(j.legL, 12)}{shoe(j.legL)}</> : <>{limb(j.legL, 12)}{shoe(j.legL)}{limb(j.legR, 12)}{shoe(j.legR)}</>}
          {pose.yaw < 0 ? <>{limb(j.armR, 11, L.sleeve ?? L.limb)}{hand(j.armR, -1, pose.handR)}</> : <>{limb(j.armL, 11, L.sleeve ?? L.limb)}{hand(j.armL, 1, pose.handL)}</>}
          {torso}
          {pose.yaw < 0 ? <>{limb(j.armL, 11, L.sleeve ?? L.limb)}{hand(j.armL, 1, pose.handL)}</> : <>{limb(j.armR, 11, L.sleeve ?? L.limb)}{hand(j.armR, -1, pose.handR)}</>}
          {L.extra === 'hood' ? (
            <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt * 0.5} 0 ${HEAD.y + 40})`}>
              <path d={`M -70 ${HEAD.y + 14} Q -80 ${HEAD.y - 74} 0 ${HEAD.y - 80} Q 80 ${HEAD.y - 74} 70 ${HEAD.y + 14} Q 52 -100 0 -106 Q -52 -100 -70 ${HEAD.y + 14} Z`} fill={L.jacket} stroke={L.line} strokeWidth={4} />
              {(() => {
                const sw = pose.sway * 0.7 - pose.tilt * 0.6;
                return (
                  <g>
                    <path d={`M -12 -108 Q ${-14 + sw * 0.3} -88 ${-16 + sw} -66 M 12 -108 Q ${14 + sw * 0.3} -88 ${16 + sw} -66`} stroke={L.accent} strokeWidth={5} strokeLinecap="round" fill="none" />
                    <circle cx={-16 + sw} cy={-64} r={5} fill={L.accent} />
                    <circle cx={16 + sw} cy={-64} r={5} fill={L.accent} />
                  </g>
                );
              })()}
            </g>
          ) : null}
          {L.extra === 'curls' ? (
            <g transform={`rotate(${pose.tilt})`}>
              <path d="M -46 -110 Q 0 -86 46 -110" stroke="#E06A5A" strokeWidth={8} fill="none" strokeLinecap="round" />
              <rect x={-60} y={-126} width={20} height={32} rx={8} fill="#E06A5A" stroke={L.line} strokeWidth={4} />
              <rect x={40} y={-126} width={20} height={32} rx={8} fill="#E06A5A" stroke={L.line} strokeWidth={4} />
            </g>
          ) : null}
          {head}
        </g>
      </g>
    </g>
  );
};


/** A character is the rig in a costume: <Actor> is the same as <Hero>, named for scenes with more than one person. */
export const Actor = Hero;

/**
 * A walk in profile. `phase` advances about 0.6 a frame for a normal walk; `ground` is the floor height under the hips
 * (a number, or a function of x for stairs and slopes). Leans into the step, bobs the head, bends the elbows, swings
 * loose things (the drawstrings) a beat behind the body.
 */
export const walkPose = (x: number, phase: number, ground: number | ((x: number) => number), scale = 0.9, extra: Partial<Pose> = {}, facing: 1 | -1 = 1): Pose => {
  const s = Math.sin(phase);
  const g = typeof ground === 'number' ? ground : ground(x);
  return {
    ...basePose,
    x,
    y: g - LEG_LEN * scale - Math.abs(Math.cos(phase)) * 7,
    scale,
    facing,
    yaw: facing,
    tilt: 5 * facing,
    headTilt: 2 * Math.sin(phase * 2),
    sway: 10 * Math.sin(phase + 0.8),
    legL: { a: 28 * s, b: -Math.max(0, 40 * Math.sin(phase + 1.2)) },
    legR: { a: -28 * s, b: -Math.max(0, 40 * Math.sin(phase + 1.2 + Math.PI)) },
    armL: { a: 24 * s, b: 12 + 14 * Math.abs(s) },
    armR: { a: 24 * s, b: 12 + 14 * Math.abs(s) },
    ...extra,
  };
};

/** Where the feet are for a pose standing at hip y: use it to put a character on a floor (y = floor - feetBelowHips). */
export const feetBelowHips = (scale: number) => LEG_LEN * scale;
