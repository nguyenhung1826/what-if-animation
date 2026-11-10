import React from 'react';
import {
  makeRoom, Box, S3, Room, RoomShell, BackWindow, Pendant, pendantLight, WallLight, FloorShadow, FloorPlant, WallFrame, WallClock,
  Glow, LightVeil, Dust, Dawn, Night, DuskSky, Sun, Skyline, Haze, Bokeh, rnd, FONT, clamp,
} from '../../engine';

// "What if you could feel everyone's pain?": the places of this video (episode-local, not in the engine library).
// Interiors use the room kit; exteriors are side-on like the rooftop. Every set takes the shot clock t and an id.

const Leg: React.FC<{ r: Room; u: number; w: number; v0: number; c?: string; k?: number }> = ({ r, u, w, v0, c = '#2A2026', k = 9 }) => {
  const a = r.P(u, v0, w);
  const b = r.P(u, 1, w);
  const s = r.s(w) / r.s(0.5);
  return (
    <g>
      <ellipse cx={b.x} cy={b.y + 2} rx={18 * s} ry={5 * s} fill="#000" opacity={0.35} />
      <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={c} strokeWidth={k * s} strokeLinecap="round" />
    </g>
  );
};

/** A table: top at v, legs at the four corners. Draw it after characters standing behind it. */
export const RoomTable: React.FC<{ r: Room; u: [number, number]; w: [number, number]; v?: number; top?: string; edge?: string; legs?: string }> = ({ r, u, w, v = 0.74, top = '#8A6248', edge = '#5E3E30', legs = '#2A2026' }) => (
  <g>
    <FloorShadow r={r} u={u} w={w} o={0.4} />
    {[[u[0] + 0.01, w[0] + 0.01], [u[1] - 0.01, w[0] + 0.01], [u[0] + 0.01, w[1] - 0.01], [u[1] - 0.01, w[1] - 0.01]].map(([a, b], i) => (
      <Leg key={i} r={r} u={a} w={b} v0={v} c={legs} />
    ))}
    <Box r={r} u={u} v={[v - 0.025, v]} w={w} front={edge} top={top} side={edge} rim />
  </g>
);

// ---------------------------------------------------------------- the apartment (studio flat, morning)
// Kitchenette along the left wall, a big window in the back wall, the bed in the back-right corner, a dining table in
// the middle (its legs are what you stub your toe on). Stand people behind the table at w 0.45 and draw AptTable after.
export const APT = makeRoom({ x: 960, y: 500 }, { x0: 520, x1: 1400, y0: 330, y1: 745 }, 3.4);
export const Apartment: React.FC<{ t: number; id: string; veil?: number; night?: boolean }> = ({ t, id, veil = 0.42, night = false }) => {
  const R = APT;
  const { P, Q } = R;
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#4A4352" side="#3A3442" floorC="#3A2C2A" />
      <BackWindow r={R} id={`${id}w`} t={t} x0={900} x1={1220} y0={372} y1={600} sun={{ x: 1110, y: 586 }} cols={3} curtains night={night} />
      {/* kitchenette on the left wall: base cabinets, worktop, upper cabinets, a fridge at the back */}
      <Box r={R} u={[0, 0.14]} v={[0.08, 1]} w={[0, 0.12]} front="#C9CED2" side="#9AA0A6" top="#B0B6BA" />
      <path d={`M ${P(0.14, 0.42, 0.12).x} ${P(0.14, 0.42, 0.12).y} L ${P(0.01, 0.42, 0.12).x} ${P(0.01, 0.42, 0.12).y}`} stroke="#7E848A" strokeWidth={3} />
      <Box r={R} u={[0, 0.1]} v={[0.73, 1]} w={[0.14, 0.62]} front="#5E7A8A" side="#4A6270" />
      <Box r={R} u={[0, 0.115]} v={[0.71, 0.73]} w={[0.13, 0.63]} front="#D8D0C0" top="#E8E0D0" side="#B8B0A0" rim />
      <Box r={R} u={[0, 0.06]} v={[0.12, 0.38]} w={[0.16, 0.58]} front="#5E7A8A" side="#4A6270" />
      {[0.22, 0.36, 0.5].map((w, i) => {
        const p = P(0.1, 0.71, w);
        const c = ['#E9B44A', '#C2553E', '#9FB49A'][i];
        return <g key={i}><rect x={p.x - 14} y={p.y - 38} width={28} height={38} rx={6} fill={c} /><rect x={p.x - 10} y={p.y - 34} width={5} height={28} fill="#fff" opacity={0.3} /></g>;
      })}
      {/* coffee maker and a toaster on the worktop */}
      {(() => { const p = P(0.09, 0.71, 0.3); return <g><rect x={p.x - 30} y={p.y - 70} width={52} height={70} rx={6} fill="#26222A" /><circle cx={p.x - 4} cy={p.y - 48} r={6} fill="#FF6A4A" /></g>; })()}
      {/* the bed in the back-right corner: frame, mattress, duvet, pillows; a poster and a shelf over it */}
      <FloorShadow r={R} u={[0.72, 1]} w={[0.02, 0.4]} />
      <Box r={R} u={[0.72, 1]} v={[0.86, 1]} w={[0.02, 0.4]} front="#4A3640" side="#3A2A32" top="#4A3640" />
      <Box r={R} u={[0.73, 1]} v={[0.8, 0.86]} w={[0.03, 0.39]} front="#D9D2C8" top="#E6DFD4" side="#BDB4A8" />
      <Box r={R} u={[0.74, 1]} v={[0.78, 0.81]} w={[0.13, 0.4]} front="#5A7A9A" top="#6A8AAA" side="#4A6A8A" rim />
      <polygon points={Q([[0.76, 0.78, 0.04], [0.95, 0.78, 0.04], [0.95, 0.74, 0.1], [0.76, 0.74, 0.1]])} fill="#EDE6DA" />
      <WallFrame x={P(0.86, 0.3, 0).x - 70} y={P(0.86, 0.3, 0).y - 70} w={140} h={170} art={1} />
      {/* left of the window: a wall clock, a calendar-free cork board with notes */}
      <WallClock x={P(0.28, 0.17, 0).x} y={P(0.28, 0.17, 0).y} r={28} t={t} />
      <rect x={P(0.24, 0.3, 0).x} y={P(0.24, 0.3, 0).y} width={130} height={95} rx={4} fill="#8A6A4A" />
      {[[10, 12, '#F2E6A0'], [62, 20, '#9FD0E6'], [30, 52, '#F2B0B8'], [80, 58, '#F2E6A0']].map(([dx, dy, c], i) => (
        <rect key={i} x={P(0.24, 0.3, 0).x + (dx as number)} y={P(0.24, 0.3, 0).y + (dy as number)} width={36} height={30} fill={c as string} transform={`rotate(${i % 2 ? 6 : -5} ${P(0.24, 0.3, 0).x + (dx as number)} ${P(0.24, 0.3, 0).y + (dy as number)})`} />
      ))}
      {/* a rug, a plant, shoes by the door */}
      <polygon points={Q([[0.3, 1, 0.35], [0.72, 1, 0.35], [0.78, 1, 0.8], [0.24, 1, 0.8]])} fill="#6A4A5A" opacity={0.55} />
      <FloorPlant r={R} u={0.68} w={0.06} size={1.1} />
      <WallLight r={R} u={1} v={0.36} w={0.6} />
      <Pendant r={R} u={0.5} w={0.52} v={0.26} t={t} />
      <LightVeil id={`${id}veil`} lights={[[1060, 520, 380], pendantLight(R, 0.5, 0.52, 0.26), [P(1, 0.36, 0.6).x, P(1, 0.36, 0.6).y, 260]]} o={veil} />
      <Glow x={pendantLight(R, 0.5, 0.52, 0.26)[0]} y={pendantLight(R, 0.5, 0.52, 0.26)[1] - 40} r={260} o={0.3} />
      <Dust t={t} seed={81} x0={900} y0={420} w={360} h={360} n={30} />
      {night ? <Night o={0.4} /> : <Dawn o={0.18} />}
    </g>
  );
};
export const AptTable: React.FC = () => (
  <g>
    <RoomTable r={APT} u={[0.38, 0.64]} w={[0.48, 0.62]} v={0.74} />
    {[[0.36, 0.67], [0.66, 0.67]].map(([u, w], i) => {
      const s = APT.P(u, 0.8, w);
      const f = APT.P(u, 1, w);
      return (
        <g key={i}>
          <path d={`M ${s.x - 26} ${s.y} L ${f.x - 30} ${f.y} M ${s.x + 26} ${s.y} L ${f.x + 30} ${f.y}`} stroke="#2A2026" strokeWidth={8} />
          <ellipse cx={s.x} cy={s.y} rx={44} ry={12} fill="#7A5A48" />
        </g>
      );
    })}
  </g>
);
/** A point on the apartment table's top: u across, d 0 back edge .. 1 front edge. */
export const aptTop = (u: number, d: number) => APT.P(u, 0.715, 0.48 + 0.14 * d);

// ---------------------------------------------------------------- the city bus (looking forward down the aisle)
// Seats in rows on both sides, windows with the city sliding past, poles and hanging straps, a strip light.
export const BUS = makeRoom({ x: 960, y: 470 }, { x0: 760, x1: 1160, y0: 330, y1: 600 }, 6);
export const busSeat = (side: -1 | 1, row: number) => {
  // hip point and scale for someone seated in row (0 near .. 5 far) on the left (-1) or right (1)
  const w = 0.82 - row * 0.15;
  const p = BUS.P(side < 0 ? 0.12 : 0.88, 0.62, w);
  return { x: p.x, y: p.y, scale: 1.25 * BUS.s(w) / BUS.s(0.5) * 0.38 };
};
export const Bus: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const R = BUS;
  const { P, Q } = R;
  const rows = [0.04, 0.19, 0.34, 0.49, 0.64, 0.79];
  return (
    <g>
      <rect x={-600} y={-600} width={3200} height={2400} fill="#2A2830" />
      <polygon points={Q([[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]])} fill="#B8B4AC" />
      <polygon points={Q([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]])} fill="#3A3640" />
      <polygon points={Q([[0.32, 1, 0], [0.68, 1, 0], [0.68, 1, 1], [0.32, 1, 1]])} fill="#4A4450" />
      {[-1, 1].map((side) => (
        <g key={side}>
          <polygon points={Q(side < 0 ? [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] : [[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]])} fill="#6A7480" />
          {/* windows: dusk city sliding past */}
          {rows.map((w, i) => {
            const u = side < 0 ? 0 : 1;
            const pts = Q([[u, 0.12, w + 0.01], [u, 0.12, w + 0.13], [u, 0.5, w + 0.13], [u, 0.5, w + 0.01]]);
            const c = P(u, 0.3, w + 0.07);
            const k = (t * 0.02 + i * 0.37) % 1;
            return (
              <g key={i}>
                <polygon points={pts} fill="#E8906A" />
                <polygon points={pts} fill="#6A4A7A" opacity={0.45 + 0.3 * Math.sin(k * Math.PI)} />
                <circle cx={c.x + (side < 0 ? 1 : -1) * 40 * k} cy={c.y + 30} r={22 * R.s(w)} fill="#FFD7A0" opacity={0.35} />
                <polygon points={pts} fill="none" stroke="#2A2830" strokeWidth={6 * R.s(w) / 2} />
              </g>
            );
          })}
        </g>
      ))}
      {/* the windshield far away */}
      <rect x={790} y={350} width={340} height={120} fill="#F2A27A" />
      <rect x={790} y={430} width={340} height={40} fill="#5A3A5A" opacity={0.7} />
      <rect x={760} y={470} width={400} height={130} fill="#2A2830" />
      {/* seats: left and right, far to near */}
      {[...rows].reverse().map((w, i) => (
        <g key={i}>
          {[[0.02, 0.3], [0.7, 0.98]].map(([u0, u1], j) => (
            <g key={j}>
              <Box r={R} u={[u0, u1]} v={[0.66, 0.72]} w={[w + 0.04, w + 0.12]} front="#2F5A7A" top="#3A6A8A" side="#244A66" />
              <Box r={R} u={[u0, u1]} v={[0.38, 0.72]} w={[w + 0.03, w + 0.045]} front="#3A6A8A" top="#4A7A9A" side="#2F5A7A" rim />
              <Box r={R} u={[u0 + 0.02, u1 - 0.02]} v={[0.72, 1]} w={[w + 0.06, w + 0.1]} front="#1E1C24" />
            </g>
          ))}
        </g>
      ))}
      {/* poles and hanging straps */}
      {[0.3, 0.7].map((u) => [0.35, 0.65].map((w) => {
        const a = P(u, 0, w);
        const b = P(u, 1, w);
        return <path key={`${u}${w}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#E8C24A" strokeWidth={10 * R.s(w) / 2} />;
      }))}
      {Array.from({ length: 8 }).map((_, i) => {
        const w = 0.1 + i * 0.11;
        return [0.32, 0.68].map((u) => {
          const a = P(u, 0.02, w);
          const sw = Math.sin(t / 14 + i) * 4;
          const k = R.s(w) / 2;
          return <g key={`${i}${u}`}><path d={`M ${a.x} ${a.y} L ${a.x + sw} ${a.y + 40 * k}`} stroke="#3A3640" strokeWidth={4 * k} /><circle cx={a.x + sw} cy={a.y + 52 * k} r={11 * k} fill="none" stroke="#3A3640" strokeWidth={4 * k} /></g>;
        });
      })}
      {/* strip lights */}
      {[0.2, 0.45, 0.7].map((w) => <polygon key={w} points={Q([[0.44, 0, w], [0.56, 0, w], [0.56, 0, w + 0.12], [0.44, 0, w + 0.12]])} fill="#FFF2D0" />)}
      <LightVeil id={`${id}veil`} lights={[[960, 200, 700], [300, 400, 380], [1620, 400, 380]]} o={0.3} />
      <Glow x={960} y={120} r={600} o={0.25} />
    </g>
  );
};

// ---------------------------------------------------------------- the open-plan office at dusk
export const OFFICE = makeRoom({ x: 960, y: 480 }, { x0: 420, x1: 1500, y0: 300, y1: 720 }, 3.2);
export const OfficeDesk: React.FC<{ u: number; w: number; mon?: string }> = ({ u, w, mon = '#9FD0FF' }) => {
  const R = OFFICE;
  const p = R.P(u, 0.73, w + 0.02);
  const k = R.s(w) / R.s(0.5);
  return (
    <g>
      <RoomTable r={R} u={[u - 0.09, u + 0.09]} w={[w - 0.03, w + 0.05]} v={0.75} top="#C9C2B4" edge="#8E877A" legs="#3A3640" />
      <rect x={p.x - 52 * k} y={p.y - 80 * k} width={104 * k} height={66 * k} rx={4} fill="#1A1820" />
      <rect x={p.x - 46 * k} y={p.y - 74 * k} width={92 * k} height={54 * k} fill={mon} opacity={0.75} />
      <rect x={p.x - 6 * k} y={p.y - 14 * k} width={12 * k} height={14 * k} fill="#1A1820" />
      <Glow x={p.x} y={p.y - 50 * k} r={110 * k} kind="cool" o={0.35} />
    </g>
  );
};
export const Office: React.FC<{ t: number; id: string; veil?: number; desks?: boolean }> = ({ t, id, veil = 0.4, desks = true }) => {
  const R = OFFICE;
  const { P } = R;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#3E4652" side="#323A46" floorC="#2E3038" lines="#26282E" />
      <BackWindow r={R} id={`${id}w`} t={t} x0={500} x1={1420} y0={340} y1={600} sun={{ x: 1180, y: 590 }} cols={5} curtains={false} />
      {/* ceiling strip lights */}
      {[0.25, 0.5, 0.75].map((u) => [0.3, 0.6].map((w) => {
        const a = P(u - 0.08, 0, w);
        const b = P(u + 0.08, 0, w);
        const k = R.s(w);
        return <rect key={`${u}${w}`} x={a.x} y={a.y - 6 * k} width={b.x - a.x} height={10 * k} fill="#FFF4DA" />;
      }))}
      {/* a water cooler, a plant, a printer, a whiteboard on the left wall */}
      <Box r={R} u={[0.9, 0.97]} v={[0.62, 1]} w={[0.04, 0.1]} front="#D8DCE0" side="#A8ACB0" />
      <rect x={P(0.935, 0.5, 0.07).x - 18} y={P(0.935, 0.5, 0.07).y - 10} width={36} height={60} rx={10} fill="#7FC0E6" opacity={0.8} />
      <FloorPlant r={R} u={0.05} w={0.08} size={1.2} />
      <Box r={R} u={[0.8, 0.88]} v={[0.8, 1]} w={[0.04, 0.12]} front="#5A5E66" side="#46494F" top="#6A6E76" />
      <polygon points={R.Q([[0, 0.25, 0.25], [0, 0.25, 0.55], [0, 0.6, 0.55], [0, 0.6, 0.25]])} fill="#E6E8EA" opacity={0.85} />
      {desks ? [[0.25, 0.2, '#9FD0FF'], [0.5, 0.2, '#C49BFF'], [0.75, 0.2, '#9FFFC8'], [0.2, 0.42, '#FFD7A0']].map(([u, w, c], i) => <OfficeDesk key={i} u={u as number} w={w as number} mon={c as string} />) : null}
      <LightVeil id={`${id}veil`} lights={[[1180, 560, 420], [600, 260, 300], [960, 240, 340], [1320, 260, 300]]} o={veil} />
      <Dust t={t} seed={91} x0={1000} y0={420} w={400} h={300} n={24} />
    </g>
  );
};

// ---------------------------------------------------------------- the living room (TV on the back wall, a couch near camera)
export const LIV = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 740 }, 3.3);
export const TV = { x0: 760, x1: 1160, y0: 430, y1: 655 };
export const LivingRoom: React.FC<{ t: number; id: string; screen?: React.ReactNode; tvLight?: string; veil?: number }> = ({ t, id, screen, tvLight = '#9FC0FF', veil = 0.5 }) => {
  const R = LIV;
  const { P } = R;
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#3A3A50" side="#2E2E40" floorC="#2C2426" />
      {/* the TV on a console, its picture, its light on the wall */}
      <Box r={R} u={[0.22, 0.78]} v={[0.82, 1]} w={[0, 0.1]} front="#4A3A34" side="#3A2C28" top="#5A463E" rim />
      <rect x={TV.x0 - 14} y={TV.y0 - 14} width={TV.x1 - TV.x0 + 28} height={TV.y1 - TV.y0 + 28} rx={8} fill="#0E0D12" />
      <clipPath id={`${id}tv`}><rect x={TV.x0} y={TV.y0} width={TV.x1 - TV.x0} height={TV.y1 - TV.y0} /></clipPath>
      <rect x={TV.x0} y={TV.y0} width={TV.x1 - TV.x0} height={TV.y1 - TV.y0} fill="#2A3A5A" />
      <g clipPath={`url(#${id}tv)`}>{screen}</g>
      <Glow x={960} y={540} r={520} kind="cool" o={0.28} />
      {/* shelves left with books and a plant; floor lamp right; window on the left wall */}
      <Box r={R} u={[0.02, 0.18]} v={[0.15, 1]} w={[0, 0.07]} front="#5B4038" side="#3A2826" />
      {[0.3, 0.5, 0.7].map((v, i) => Array.from({ length: 6 }).map((_, k) => {
        const p = P(0.03 + k * 0.024, v, 0.06);
        return <rect key={`${i}${k}`} x={p.x} y={p.y - 46 + rnd(i, k) * 12} width={16} height={46 - rnd(i, k) * 12} fill={['#C2553E', '#4A7AA0', '#E9C46A', '#6A8A5A'][(i + k) % 4]} />;
      }))}
      <polygon points={R.Q([[0, 0.2, 0.3], [0, 0.2, 0.62], [0, 0.62, 0.62], [0, 0.62, 0.3]])} fill="#2A2050" />
      <polygon points={R.Q([[0, 0.2, 0.3], [0, 0.2, 0.62], [0, 0.62, 0.62], [0, 0.62, 0.3]])} fill="none" stroke="#1A1420" strokeWidth={10} />
      {(() => { const b = P(0.88, 1, 0.15); const top = P(0.88, 0.32, 0.15); return <g><path d={`M ${b.x} ${b.y} L ${top.x} ${top.y}`} stroke="#1A1620" strokeWidth={6} /><path d={`M ${top.x - 40} ${top.y} L ${top.x + 40} ${top.y} L ${top.x + 26} ${top.y - 50} L ${top.x - 26} ${top.y - 50} Z`} fill="#E9C48A" /><Glow x={top.x} y={top.y} r={260} o={0.5} /></g>; })()}
      <WallFrame x={P(0.3, 0.12, 0).x} y={P(0.3, 0.12, 0).y} w={120} h={90} art={2} />
      <WallFrame x={P(0.62, 0.1, 0).x} y={P(0.62, 0.1, 0).y} w={160} h={110} art={0} />
      <polygon points={R.Q([[0.25, 1, 0.3], [0.75, 1, 0.3], [0.8, 1, 0.7], [0.2, 1, 0.7]])} fill="#5A4A3A" opacity={0.5} />
      <LightVeil id={`${id}veil`} lights={[[960, 545, 420], [P(0.88, 0.32, 0.15).x, P(0.88, 0.32, 0.15).y, 320]]} o={veil} />
      <rect x={-500} y={-500} width={2900} height={2100} fill={tvLight} opacity={0.05} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};
/** The couch, seen from behind-ish at three-quarter: draw after the people sitting on it (seat at y 760). */
export const Couch: React.FC<{ x?: number; w?: number; y?: number }> = ({ x = 960, w = 900, y = 760 }) => (
  <g>
    <ellipse cx={x} cy={y + 150} rx={w * 0.55} ry={28} fill="#000" opacity={0.4} />
    <rect x={x - w / 2} y={y + 10} width={w} height={130} rx={30} fill="#6A4A5A" />
    <rect x={x - w / 2} y={y + 10} width={w} height={14} rx={7} fill="#FFB46A" opacity={0.3} />
    <rect x={x - w / 2 - 50} y={y - 40} width={90} height={180} rx={40} fill="#5A3E4C" />
    <rect x={x + w / 2 - 40} y={y - 40} width={90} height={180} rx={40} fill="#5A3E4C" />
  </g>
);

// ---------------------------------------------------------------- the street at dusk (side-on, wide: x -800 .. 2700)
// Storefronts left to right: SHADES (sunglasses), a café with a walk-up window, a GYM, a DENTAL office, then a small
// park with monkey bars. The sidewalk top is y 820 (feet), the curb at y 880, the road below.
export const STREET = { walk: 820, curb: 880 };
const Store: React.FC<{ x: number; w: number; sign: string; c: string; awning: string; glow?: string; children?: React.ReactNode }> = ({ x, w, sign, c, awning, glow = '#FFD7A0', children }) => (
  <g>
    <rect x={x} y={300} width={w} height={520} fill={c} />
    <rect x={x} y={300} width={w} height={8} fill="#000" opacity={0.25} />
    {[0, 1].map((r) => [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={x + 30 + k * (w - 60) / 3} y={330 + r * 90} width={(w - 60) / 3 - 20} height={60} fill="#FFC27A" opacity={(r + k) % 2 ? 0.55 : 0.2} />))}
    <rect x={x + 20} y={540} width={w - 40} height={56} rx={6} fill="#1A1620" />
    <text x={x + w / 2} y={582} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={glow} letterSpacing={6}>{sign}</text>
    <Glow x={x + w / 2} y={568} r={w * 0.5} o={0.25} />
    <path d={`M ${x + 10} 600 L ${x + w - 10} 600 L ${x + w + 10} 650 L ${x - 10} 650 Z`} fill={awning} />
    {Array.from({ length: Math.floor(w / 40) }).map((_, i) => <path key={i} d={`M ${x + 10 + i * 40} 600 L ${x + i * 40} 650`} stroke="#000" strokeOpacity={0.15} strokeWidth={14} />)}
    <rect x={x + 30} y={665} width={w - 60} height={150} fill="#2A2030" />
    <rect x={x + 36} y={671} width={w - 72} height={138} fill={glow} opacity={0.22} />
    {children}
  </g>
);
export const Street: React.FC<{ t: number; id: string; walkers?: boolean }> = ({ t, id }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={760} x0={-1200} w={4400} />
    <Sun x={1500} y={430} r={120} t={t} />
    <Skyline y={760} seed={7} color="#5A4070" h={260} />
    <g transform="translate(1920 0)"><Skyline y={760} seed={9} color="#5A4070" h={260} /></g>
    <g transform="translate(-1920 0)"><Skyline y={760} seed={11} color="#5A4070" h={260} /></g>
    <Haze y={560} o={0.3} />
    <Store x={-760} w={520} sign="SHADES" c="#5A3A4A" awning="#C2553E">
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${-640 + k * 140} 740)`}><circle cx={-22} cy={0} r={20} fill="#111" /><circle cx={22} cy={0} r={20} fill="#111" /><path d="M -2 0 L 2 0" stroke="#111" strokeWidth={5} /></g>)}
    </Store>
    <Store x={-200} w={520} sign="CAFÉ" c="#4A4A3A" awning="#2F6A5A">
      <rect x={-80} y={690} width={280} height={14} fill="#8A6248" />
    </Store>
    <Store x={360} w={600} sign="GYM" c="#3A3A52" awning="#3A6AA0" glow="#9FD0FF" />
    <Store x={1000} w={520} sign="DENTAL" c="#4A5260" awning="#4A9A8A" glow="#CFF2FF" />
    {/* the park: a fence, trees, monkey bars */}
    <rect x={1560} y={760} width={1200} height={60} fill="#3A5A3A" />
    {[1640, 1960, 2400].map((x, i) => <g key={i}><rect x={x - 10} y={560} width={20} height={240} fill="#3A2A2A" /><circle cx={x} cy={540} r={110} fill="#3E5A44" /><circle cx={x - 50} cy={580} r={70} fill="#4A6A4E" /></g>)}
    <g stroke="#E86A3A" strokeWidth={12} fill="none" strokeLinecap="round">
      <path d="M 1780 820 L 1780 600 M 2160 820 L 2160 600 M 1780 600 L 2160 600" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M ${1820 + i * 50} 590 L ${1820 + i * 50} 612`} />)}
    </g>
    {/* streetlights */}
    {[-300, 620, 1540, 2400].map((x) => <g key={x}><path d={`M ${x} 820 L ${x} 470 Q ${x} 440 ${x + 40} 440`} stroke="#1A1620" strokeWidth={10} fill="none" /><ellipse cx={x + 48} cy={446} rx={22} ry={8} fill="#FFE2B0" /><Glow x={x + 48} y={460} r={180} o={0.6} /></g>)}
    {/* sidewalk, curb, road */}
    <rect x={-1200} y={STREET.walk} width={4400} height={60} fill="#6A6070" />
    {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M ${-1200 + i * 110} ${STREET.walk} L ${-1220 + i * 110} ${STREET.curb}`} stroke="#4A4250" strokeWidth={3} />)}
    <rect x={-1200} y={STREET.walk} width={4400} height={3} fill="#FFB46A" opacity={0.4} />
    <rect x={-1200} y={STREET.curb} width={4400} height={16} fill="#8A8090" />
    <rect x={-1200} y={STREET.curb + 16} width={4400} height={400} fill="#2A2632" />
    {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-1200 + i * 220} y={STREET.curb + 110} width={110} height={10} fill="#E9C46A" opacity={0.6} />)}
    <Bokeh seed={4} n={12} x0={-800} y0={300} w={3400} h={400} t={t} />
  </g>
);

// ---------------------------------------------------------------- the backyard party (late afternoon)
// A fence, the house corner with a lit window, paper lanterns, a bouncy castle centre-left, the party table right.
export const YARD = { ground: 830 };
export const BouncyCastle: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const b = 1 + 0.015 * Math.sin(t / 5);
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * b})`}>
      <ellipse cx={0} cy={6} rx={360} ry={30} fill="#000" opacity={0.35} />
      <rect x={-330} y={-170} width={660} height={170} rx={40} fill="#E8503A" />
      <rect x={-300} y={-150} width={600} height={60} rx={24} fill="#F2C14E" />
      {[-330, 330].map((dx) => <g key={dx}><rect x={dx - 60} y={-420} width={120} height={420} rx={50} fill="#3A8AD0" /><circle cx={dx} cy={-430} r={62} fill="#F2C14E" /><path d={`M ${dx - 50} -470 L ${dx} -540 L ${dx + 50} -470 Z`} fill="#E8503A" /></g>)}
      <rect x={-270} y={-400} width={540} height={240} rx={30} fill="#5AB0E6" opacity={0.9} />
      {[-200, -60, 80, 220].map((dx) => <rect key={dx} x={dx - 8} y={-400} width={16} height={240} fill="#F2F0E6" opacity={0.6} />)}
      <path d="M -300 -410 Q -150 -460 0 -410 Q 150 -460 300 -410" stroke="#F2C14E" strokeWidth={24} fill="none" />
      <rect x={-330} y={-170} width={660} height={10} rx={5} fill="#FFFFFF" opacity={0.25} />
    </g>
  );
};
export const Balloon: React.FC<{ x: number; y: number; c: string; t: number; i?: number; s?: number; pop?: number }> = ({ x, y, c, t, i = 0, s = 1, pop = 0 }) => {
  const sw = Math.sin(t / 16 + i) * 8;
  if (pop >= 1) return null;
  return (
    <g transform={`translate(${x + sw} ${y}) scale(${s * (1 + pop * 0.4)})`}>
      <path d={`M 0 46 Q ${-sw} 120 ${sw * 0.5} 200`} stroke="#E6E0D4" strokeWidth={2} fill="none" />
      <ellipse cx={0} cy={0} rx={38} ry={46} fill={c} />
      <ellipse cx={-12} cy={-16} rx={9} ry={14} fill="#fff" opacity={0.4} />
      <path d="M -5 46 L 5 46 L 0 54 Z" fill={c} />
    </g>
  );
};
export const Backyard: React.FC<{ t: number; id: string; castle?: boolean }> = ({ t, id, castle = true }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={700} x0={-800} w={3600} />
    <Sun x={1500} y={520} r={110} t={t} />
    <Haze y={520} o={0.25} />
    {/* trees over the fence */}
    {[200, 700, 1300, 1800].map((x, i) => <g key={i}><circle cx={x} cy={480} r={170} fill="#3A4A44" /><circle cx={x + 90} cy={540} r={120} fill="#44564C" /></g>)}
    {/* the fence */}
    <rect x={-800} y={560} width={3600} height={270} fill="#7A5A44" />
    {Array.from({ length: 50 }).map((_, i) => <g key={i}><rect x={-800 + i * 74} y={552} width={66} height={278} fill={i % 2 ? '#8A6850' : '#80604A'} /><path d={`M ${-800 + i * 74} 552 L ${-767 + i * 74} 536 L ${-734 + i * 74} 552 Z`} fill="#8A6850" /></g>)}
    <rect x={-800} y={640} width={3600} height={10} fill="#5A4030" />
    {/* the house corner on the left with a lit window */}
    <rect x={-800} y={200} width={780} height={640} fill="#4A4258" />
    <rect x={-400} y={330} width={260} height={200} fill="#FFC27A" opacity={0.8} />
    <path d="M -400 430 L -140 430 M -270 330 L -270 530" stroke="#2A2430" strokeWidth={10} />
    <Glow x={-270} y={430} r={300} o={0.5} />
    {/* paper lanterns on a line */}
    <path d={`M -20 300 Q 900 ${400 + Math.sin(t / 20) * 6} 1920 300`} stroke="#1A1420" strokeWidth={3} fill="none" />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 120 + i * 210;
      const y = 300 + 100 * (1 - Math.pow((x - 950) / 970, 2));
      const c = ['#F2C14E', '#E8503A', '#5AB0E6'][i % 3];
      return <g key={i}><ellipse cx={x} cy={y + 30} rx={30} ry={36} fill={c} /><ellipse cx={x} cy={y + 30} rx={30} ry={36} fill="#FFF" opacity={0.25} /><Glow x={x} y={y + 30} r={80} o={0.5} /></g>;
    })}
    {/* grass */}
    <rect x={-800} y={830} width={3600} height={400} fill="#3E5A3A" />
    {Array.from({ length: 120 }).map((_, i) => <path key={i} d={`M ${-600 + rnd(3, i) * 3000} ${850 + rnd(4, i) * 220} l 6 -18 l 4 16`} stroke="#5A7A4A" strokeWidth={3} fill="none" />)}
    {castle ? <BouncyCastle x={560} y={YARD.ground} t={t} /> : null}
    {/* the party table: cloth, cake, presents, cups */}
    <rect x={1240} y={700} width={460} height={20} fill="#F2F0E6" />
    <path d="M 1240 720 L 1700 720 L 1690 800 L 1250 800 Z" fill="#E6E0D4" />
    {[1260, 1680].map((x) => <path key={x} d={`M ${x} 800 L ${x} ${YARD.ground}`} stroke="#3A2A2A" strokeWidth={8} />)}
    <rect x={1400} y={640} width={140} height={60} rx={8} fill="#F2B0B8" />
    <rect x={1420} y={604} width={100} height={40} rx={8} fill="#FFF2E6" />
    {[1440, 1470, 1500].map((x) => <g key={x}><rect x={x - 3} y={584} width={6} height={22} fill="#9FD0FF" /><ellipse cx={x} cy={578} rx={5} ry={9} fill="#FFD27A" /><Glow x={x} y={578} r={30} o={0.8} /></g>)}
    {[[1290, '#5AB0E6'], [1340, '#F2C14E'], [1600, '#E8503A'], [1650, '#7AC07A']].map(([x, c], i) => <g key={i}><rect x={(x as number) - 24} y={i % 2 ? 660 : 670} width={48} height={i % 2 ? 40 : 30} fill={c as string} /><path d={`M ${x} ${i % 2 ? 660 : 670} L ${x} 700`} stroke="#fff" strokeWidth={5} /></g>)}
    {[['#E8503A', 1250, 420], ['#F2C14E', 1310, 380], ['#5AB0E6', 1690, 400], ['#C49BFF', 1740, 440]].map(([c, x, y], i) => <Balloon key={i} x={x as number} y={y as number} c={c as string} t={t} i={i} />)}
  </g>
);

// ---------------------------------------------------------------- the clinic: a doctor's exam room (lab: a study room)
export const CLINIC = makeRoom({ x: 960, y: 500 }, { x0: 500, x1: 1420, y0: 320, y1: 745 }, 3.4);
export const Clinic: React.FC<{ t: number; id: string; lab?: boolean; veil?: number; scan?: number }> = ({ t, id, lab = false, veil = 0.36, scan = 0 }) => {
  const R = CLINIC;
  const { P, Q } = R;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#4E6064" side="#3E5054" floorC="#3A4044" lines="#30363A" />
      {/* a window with blinds */}
      <rect x={1150} y={380} width={220} height={210} fill="#E8906A" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1150} y={380 + i * 17.5} width={220} height={10} fill="#D8D2C4" opacity={0.85} />)}
      <rect x={1144} y={374} width={232} height={222} fill="none" stroke="#2A3034" strokeWidth={10} />
      <Glow x={1260} y={485} r={320} o={0.35} />
      {/* the x-ray lightbox with a brain scan, a chart, the counter with a sink and jars */}
      <rect x={560} y={380} width={190} height={150} rx={6} fill="#1A2024" />
      <rect x={570} y={390} width={170} height={130} fill="#BFE6FF" opacity={0.55 + 0.3 * scan} />
      <ellipse cx={655} cy={455} rx={58} ry={46} fill="none" stroke="#0E2A3A" strokeWidth={6} opacity={0.7} />
      <path d="M 610 455 Q 630 430 655 445 Q 680 425 700 455 M 620 475 Q 655 460 690 475" stroke="#0E2A3A" strokeWidth={4} fill="none" opacity={0.6} />
      <Glow x={655} y={455} r={200} kind="cool" o={0.4} />
      <rect x={800} y={390} width={110} height={150} fill="#E6E8E0" />
      <path d="M 820 420 L 890 420 M 820 445 L 880 445 M 820 470 L 890 470 M 820 495 L 860 495" stroke="#7A8A8E" strokeWidth={5} />
      <Box r={R} u={[0, 0.3]} v={[0.74, 1]} w={[0, 0.1]} front="#D8DCD8" side="#A8ACA8" />
      <Box r={R} u={[0, 0.31]} v={[0.72, 0.74]} w={[0, 0.11]} front="#B8BCB8" top="#E8ECE8" side="#989C98" rim />
      {[0.06, 0.1, 0.14].map((u, i) => { const p = P(u, 0.72, 0.05); return <rect key={i} x={p.x - 10} y={p.y - 34} width={20} height={34} rx={4} fill={['#9FD0E6', '#F2E6C0', '#E6B0B8'][i]} />; })}
      {lab ? (
        <g>
          {/* lab: a whiteboard of results and two chairs facing each other */}
          <polygon points={Q([[1, 0.18, 0.2], [1, 0.18, 0.55], [1, 0.55, 0.55], [1, 0.55, 0.2]])} fill="#EDEFEA" />
          {Array.from({ length: 5 }).map((_, i) => { const a = P(1, 0.25 + i * 0.06, 0.25); const b = P(1, 0.25 + i * 0.06, 0.5); return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#4A6A8A" strokeWidth={4} />; })}
        </g>
      ) : (
        <g>
          {/* the exam table with its paper roll, a step, a stool, the blood pressure cuff on the wall */}
          <FloorShadow r={R} u={[0.42, 0.78]} w={[0.12, 0.32]} />
          <Box r={R} u={[0.44, 0.76]} v={[0.8, 1]} w={[0.14, 0.3]} front="#3A4A52" side="#2E3C44" />
          <Box r={R} u={[0.42, 0.78]} v={[0.74, 0.8]} w={[0.12, 0.32]} front="#5A8A9A" top="#6A9AAA" side="#4A7A8A" rim />
          <polygon points={Q([[0.5, 0.74, 0.12], [0.7, 0.74, 0.12], [0.7, 0.74, 0.32], [0.5, 0.74, 0.32]])} fill="#F2F0E6" opacity={0.85} />
          <rect x={P(0.86, 0.36, 0).x - 30} y={P(0.86, 0.36, 0).y} width={60} height={70} rx={8} fill="#2A3034" />
          <circle cx={P(0.86, 0.36, 0).x} cy={P(0.86, 0.36, 0).y + 34} r={20} fill="#E6E8E0" />
        </g>
      )}
      <Pendant r={R} u={0.5} w={0.4} v={0.22} t={t} />
      <LightVeil id={`${id}veil`} lights={[pendantLight(R, 0.5, 0.4, 0.22), [1260, 485, 300], [655, 455, 220]]} o={veil} />
      <Dust t={t} seed={71} x0={1100} y0={420} w={300} h={300} n={20} />
    </g>
  );
};

// ---------------------------------------------------------------- the ER: a curtained bay (bed, monitor, IV pole)
// The bed is drawn by the set at the back (patient lies on it via the shot), curtains on both sides, the corridor
// glimpsed through the gap. Night-ish cool light from a strip overhead; the monitor's green glow.
export const WARD = makeRoom({ x: 960, y: 480 }, { x0: 480, x1: 1440, y0: 300, y1: 740 }, 3.2);
export const ecg = (x: number, y: number, w: number, t: number, fast = 1, amp = 1) => {
  let d = `M ${x} ${y}`;
  for (let i = 0; i <= 60; i++) {
    const px = x + (w * i) / 60;
    const ph = ((i / 60) * 3 + t * 0.03 * fast) % 1;
    const spike = ph > 0.45 && ph < 0.5 ? -60 * amp : ph >= 0.5 && ph < 0.53 ? 30 * amp : ph > 0.7 && ph < 0.8 ? -10 * amp : 0;
    d += ` L ${px} ${y + spike}`;
  }
  return d;
};
export const Monitor: React.FC<{ x: number; y: number; s?: number; t: number; fast?: number; amp?: number; bpm?: number }> = ({ x, y, s = 1, t, fast = 1, amp = 1, bpm = 72 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-90} width={240} height={170} rx={12} fill="#1A1E22" />
    <rect x={-108} y={-78} width={216} height={130} fill="#06140E" />
    <path d={ecg(-104, -10, 170, t, fast, amp * 0.6)} stroke="#4AFF8A" strokeWidth={3.5} fill="none" />
    <text x={96} y={36} textAnchor="end" fontFamily={FONT.ui} fontSize={28} fill="#4AFF8A">{bpm}</text>
    <Glow x={0} y={-10} r={160} kind="cool" o={0.3} />
  </g>
);
export const Ward: React.FC<{ t: number; id: string; veil?: number; fast?: number; amp?: number; bpm?: number; bed?: boolean }> = ({ t, id, veil = 0.4, fast = 1, amp = 1, bpm = 72, bed = true }) => {
  const R = WARD;
  const { P, Q } = R;
  const curtain = (u0: number, u1: number, w: number, c: string) => {
    const n = 9;
    const out: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const a = P(u0 + ((u1 - u0) * i) / n, 0.06, w);
      const b = P(u0 + ((u1 - u0) * (i + 1)) / n, 0.94, w);
      out.push(<rect key={i} x={a.x} y={a.y} width={b.x - a.x + 1} height={b.y - a.y} fill={i % 2 ? c : '#3A7A7A'} />);
    }
    return out;
  };
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#5A6A70" side="#4A5A60" floorC="#4A5258" lines="#3E464C" ceiling="#2A3034" />
      {/* wall panel behind the bed: outlets, oxygen, a light */}
      <rect x={720} y={420} width={480} height={70} rx={6} fill="#C8CCC8" />
      {[760, 820, 1100, 1160].map((x) => <circle key={x} cx={x} cy={455} r={14} fill={x > 1000 ? '#4A9A6A' : '#E6E8E0'} stroke="#2A3034" strokeWidth={3} />)}
      <rect x={880} y={432} width={160} height={14} rx={6} fill="#FFF4DA" />
      <Glow x={960} y={440} r={260} o={0.4} />
      {/* curtains on their track, side walls */}
      <path d={`M ${P(0, 0.05, 0.2).x} ${P(0, 0.05, 0.2).y} L ${P(0.2, 0.05, 0.2).x} ${P(0.2, 0.05, 0.2).y}`} stroke="#8A9094" strokeWidth={6} />
      {curtain(0, 0.16, 0.2, '#4A8A8A')}
      {curtain(0.84, 1, 0.2, '#4A8A8A')}
      {/* the IV pole and the monitor on its arm */}
      {(() => { const b = P(0.78, 1, 0.12); const top = P(0.78, 0.2, 0.12); return <g><ellipse cx={b.x} cy={b.y + 4} rx={50} ry={10} fill="#000" opacity={0.35} /><path d={`M ${b.x} ${b.y} L ${top.x} ${top.y} M ${top.x - 40} ${top.y} L ${top.x + 40} ${top.y}`} stroke="#9AA0A4" strokeWidth={8} /><rect x={top.x - 34} y={top.y + 8} width={36} height={60} rx={8} fill="#CFF2FF" opacity={0.7} /><path d={`M ${top.x - 16} ${top.y + 68} Q ${top.x - 60} ${top.y + 260} ${P(0.62, 0.7, 0.2).x} ${P(0.62, 0.7, 0.2).y}`} stroke="#CFF2FF" strokeWidth={3} fill="none" opacity={0.7} /></g>; })()}
      <Monitor x={P(0.2, 0.28, 0.02).x + 40} y={P(0.2, 0.28, 0.02).y} s={0.9} t={t} fast={fast} amp={amp} bpm={bpm} />
      {bed ? <HospitalBed /> : null}
      {/* strip light */}
      <polygon points={Q([[0.35, 0, 0.3], [0.65, 0, 0.3], [0.65, 0, 0.42], [0.35, 0, 0.42]])} fill="#F2FAFF" />
      <LightVeil id={`${id}veil`} lights={[[960, 440, 360], [960, 260, 460], [P(0.2, 0.28, 0.02).x + 40, P(0.2, 0.28, 0.02).y, 220]]} o={veil} />
      <rect x={-500} y={-500} width={2900} height={2100} fill="#7FD0E6" opacity={0.05} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};
/** The hospital bed at the back of the bay (head against the wall): mattress top at v 0.76. Lie or sit a patient at wardBed(u). */
export const HospitalBed: React.FC = () => {
  const R = WARD;
  return (
    <g>
      <FloorShadow r={R} u={[0.3, 0.7]} w={[0.02, 0.5]} o={0.45} />
      {[[0.32, 0.04], [0.68, 0.04], [0.32, 0.48], [0.68, 0.48]].map(([u, w], i) => { const a = R.P(u, 0.84, w); const b = R.P(u, 1, w); return <g key={i}><path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#8A9094" strokeWidth={8} /><circle cx={b.x} cy={b.y} r={8} fill="#2A3034" /></g>; })}
      <Box r={R} u={[0.31, 0.69]} v={[0.8, 0.84]} w={[0.02, 0.5]} front="#9AA0A4" side="#7A8084" top="#AAB0B4" />
      <Box r={R} u={[0.32, 0.68]} v={[0.76, 0.8]} w={[0.03, 0.49]} front="#E6ECEE" top="#F2F6F8" side="#C6CCCE" />
      <Box r={R} u={[0.31, 0.69]} v={[0.55, 0.8]} w={[0.02, 0.04]} front="#B8BEC2" side="#9AA0A4" top="#C8CED2" rim />
      <polygon points={R.Q([[0.36, 0.74, 0.05], [0.64, 0.74, 0.05], [0.64, 0.7, 0.12], [0.36, 0.7, 0.12]])} fill="#FFFFFF" />
    </g>
  );
};
export const wardBed = (u: number, w = 0.14) => {
  const p = WARD.P(u, 0.74, w);
  return { x: p.x, y: p.y, scale: (0.62 * 440 * WARD.s(w)) / 378 };
};
/** A blanket over the bed from w0 to the foot, drawn over a patient's legs. */
export const WardBlanket: React.FC<{ w0?: number }> = ({ w0 = 0.2 }) => (
  <g>
    <polygon points={WARD.Q([[0.33, 0.745, w0], [0.67, 0.745, w0], [0.67, 0.75, 0.49], [0.33, 0.75, 0.49]])} fill="#7FB0C8" />
    <polygon points={WARD.Q([[0.33, 0.75, 0.49], [0.67, 0.75, 0.49], [0.67, 0.83, 0.5], [0.33, 0.83, 0.5]])} fill="#6A9AB0" />
    <path d={`M ${WARD.P(0.33, 0.745, w0).x} ${WARD.P(0.33, 0.745, w0).y} L ${WARD.P(0.67, 0.745, w0).x} ${WARD.P(0.67, 0.745, w0).y}`} stroke="#FFFFFF" strokeWidth={10} opacity={0.6} />
  </g>
);

// ---------------------------------------------------------------- the hospital parking lot at sunrise (side-on)
export const LOT = { ground: 840 };
export const Car: React.FC<{ x: number; y?: number; c: string; s?: number; flip?: boolean }> = ({ x, y = LOT.ground, c, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={200} ry={16} fill="#000" opacity={0.4} />
    <path d="M -190 -20 L -180 -70 Q -170 -86 -140 -88 L -90 -90 L -50 -140 Q -40 -150 -20 -150 L 70 -150 Q 90 -150 100 -140 L 140 -92 L 170 -88 Q 190 -84 192 -60 L 194 -20 Z" fill={c} />
    <path d="M -36 -134 L 60 -134 L 92 -96 L -66 -96 Z" fill="#2A3040" />
    <path d="M -36 -134 L 0 -134 L -20 -96 L -66 -96 Z" fill="#FFD7A0" opacity={0.4} />
    {[-110, 120].map((dx) => <g key={dx}><circle cx={dx} cy={-20} r={36} fill="#14141A" /><circle cx={dx} cy={-20} r={16} fill="#6A6E76" /></g>)}
    <rect x={160} y={-74} width={26} height={12} rx={4} fill="#FFE8B0" />
    <path d="M -180 -70 L 190 -70" stroke="#FFFFFF" strokeOpacity={0.2} strokeWidth={4} />
  </g>
);
export const ParkingLot: React.FC<{ t: number; id: string; sunY?: number }> = ({ t, id, sunY = 640 }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={760} x0={-800} w={3600} />
    <Sun x={1380} y={sunY} r={150} t={t} />
    <Skyline y={770} seed={17} color="#6A4A72" h={200} />
    <Haze y={620} o={0.35} />
    {/* the hospital on the left: blocks of windows, the EMERGENCY sign over the doors */}
    <rect x={-700} y={160} width={1120} height={690} fill="#4A4A62" />
    <rect x={-700} y={160} width={1120} height={12} fill="#FFB46A" opacity={0.35} />
    {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 12 }).map((__, k) => (
      <rect key={`${r}${k}`} x={-660 + k * 90} y={200 + r * 70} width={56} height={40} fill={rnd(r, k) > 0.55 ? '#FFD7A0' : '#2E3048'} opacity={0.85} />
    )))}
    <rect x={-60} y={660} width={360} height={190} fill="#2A2C3A" />
    <rect x={-40} y={680} width={150} height={170} fill="#CFE6F2" opacity={0.75} />
    <rect x={130} y={680} width={150} height={170} fill="#CFE6F2" opacity={0.75} />
    <Glow x={120} y={760} r={260} kind="cool" o={0.5} />
    <rect x={-70} y={600} width={380} height={56} rx={6} fill="#B8202A" />
    <text x={120} y={642} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FFFFFF" letterSpacing={6}>EMERGENCY</text>
    <Glow x={120} y={628} r={220} kind="red" o={0.4} />
    {/* lamp posts, the lot, painted lines, cars */}
    {[620, 1700].map((x) => <g key={x}><path d={`M ${x} ${LOT.ground} L ${x} 420`} stroke="#1A1620" strokeWidth={12} /><rect x={x - 46} y={408} width={92} height={18} rx={6} fill="#1A1620" /><ellipse cx={x} cy={428} rx={36} ry={6} fill="#FFE2B0" opacity={clamp(1 - (640 - sunY) / 300)} /></g>)}
    <rect x={-800} y={LOT.ground} width={3600} height={400} fill="#3A3644" />
    <rect x={-800} y={LOT.ground} width={3600} height={4} fill="#FFB46A" opacity={0.4} />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-500 + i * 240} ${LOT.ground + 20} L ${-560 + i * 240} ${LOT.ground + 200}`} stroke="#E6E0D0" strokeWidth={8} opacity={0.6} />)}
    <Car x={900} c="#4A7AA0" />
    <Car x={1960} c="#C2553E" flip />
    <ellipse cx={1380} cy={LOT.ground + 60} rx={500} ry={30} fill="#FFB46A" opacity={0.15} />
  </g>
);
