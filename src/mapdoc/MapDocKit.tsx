import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_BOLD, FONT_SERIF } from "../palette";
import { districts, LANDMARKS, VIEW } from "./hanoiGeo";

// ============================================================================
// STYLE "BẢN ĐỒ TƯ LIỆU" — cinematic map-documentary (trích từ video mẫu
// TP.HCM 50 năm, quy trình gốc: Remotion + FFmpeg + Whisper).
// Bố cục 2 cột: chữ trái, bản đồ phải; crossfade; phụ đề câu vàng-trắng.
// ============================================================================

export const MD = {
  bg: "#0A0E14",
  panel: "#131A24",
  line: "#243040",
  gold: "#E8C15A",
  cyan: "#4FC3F7",
  white: "#F2F5F8",
  gray: "#8B97A8",
  mapCore: "#242B1E",
  mapDim: "#141A22",
  mapLit: "#354228",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// nền navy + hạt sao mờ (deterministic)
export const NavyBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const dots = React.useMemo(() => {
    let s = 42;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 70 }, () => ({ x: rnd() * 100, y: rnd() * 100, o: 0.08 + rnd() * 0.2, r: 1 + rnd() * 1.6 }));
  }, []);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 60% 40%, #101826 0%, ${MD.bg} 65%)` }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {dots.map((d, i) => (
          <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="#B8C4D4" opacity={d.o} />
        ))}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

export type Cam = { cx: number; cy: number; s: number };

// pin trên bản đồ (tọa độ map-space, di chuyển cùng camera)
export type MapPin = {
  at: number; // frame local
  lm: keyof typeof LANDMARKS | [number, number];
  label: string;
  sub?: string;
  dy?: number; // hướng label (âm = trên)
  color?: string;
};

// bản đồ Hà Nội — camera drift + vùng mở rộng 2008 sáng dần
export const HanoiMap: React.FC<{
  cam: Cam;
  camTo?: Cam;
  camDur?: number;
  expLit?: number; // 0..1 — vùng Hà Tây sáng lên
  dimExp?: boolean; // true (trước 2008): vùng mở rộng tối
  pins?: MapPin[];
  x?: number;
  w?: number;
}> = ({ cam, camTo, camDur = 240, expLit = 0, dimExp = false, pins = [], x = 900, w = 1100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = camTo
    ? {
        cx: interpolate(frame, [0, camDur], [cam.cx, camTo.cx], { ...clamp, easing: ease }),
        cy: interpolate(frame, [0, camDur], [cam.cy, camTo.cy], { ...clamp, easing: ease }),
        s: interpolate(frame, [0, camDur], [cam.s, camTo.s], { ...clamp, easing: ease }),
      }
    : { ...cam, s: cam.s * (1 + frame * 0.00012) };
  return (
    <div style={{ position: "absolute", left: x, top: (1080 - w) / 2, width: w, height: w, filter: "drop-shadow(0 0 26px rgba(232,193,90,0.18))" }}>
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} width={w} height={w} style={{ overflow: "visible" }}>
        <g transform={`translate(${VIEW / 2} ${VIEW / 2}) scale(${t.s}) translate(${-t.cx} ${-t.cy})`}>
          {districts.map((d) => {
            const lit = d.exp ? expLit : 1;
            return (
              <path
                key={d.name}
                d={d.d}
                fill={d.exp ? (dimExp ? MD.mapDim : lit > 0.05 ? MD.mapLit : MD.mapDim) : MD.mapCore}
                fillOpacity={d.exp && !dimExp ? 0.4 + lit * 0.6 : 1}
                stroke={MD.gold}
                strokeOpacity={d.exp ? (dimExp ? 0.18 : 0.25 + lit * 0.55) : 0.55}
                strokeWidth={1.6 / t.s}
              />
            );
          })}
          {pins.map((p, i) => {
            const pos = Array.isArray(p.lm) ? p.lm : (LANDMARKS[p.lm] as [number, number]);
            const sp = spring({ frame: frame - p.at, fps, config: { damping: 13, stiffness: 160 } });
            if (sp < 0.02) return null;
            const dy = p.dy ?? -60;
            const c = p.color ?? MD.cyan;
            const lw = (p.label.length * 8.2 + 30) / t.s;
            const fs = 15 / t.s;
            return (
              <g key={i} opacity={Math.min(1, sp)}>
                <circle cx={pos[0]} cy={pos[1]} r={5 / t.s} fill={c} />
                <circle cx={pos[0]} cy={pos[1]} r={(10 + sp * 4) / t.s} fill="none" stroke={c} strokeWidth={1.4 / t.s} opacity={0.6} />
                <line x1={pos[0]} y1={pos[1]} x2={pos[0]} y2={pos[1] + dy / t.s} stroke={c} strokeWidth={1.4 / t.s} opacity={0.8} />
                <g transform={`translate(${pos[0] - lw / 2} ${pos[1] + dy / t.s + (dy < 0 ? -30 / t.s : 6 / t.s)}) scale(${sp})`}>
                  <rect width={lw} height={26 / t.s} rx={13 / t.s} fill="#0E141D" stroke={c} strokeWidth={1.2 / t.s} />
                  <text x={lw / 2} y={17.5 / t.s} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={800} fontSize={fs} fill={MD.white}>
                    {p.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: ease }),
  translate: `0px ${interpolate(frame, [at, at + 16], [26, 0], { ...clamp, easing: ease })}px`,
});

// kicker vàng nhỏ, có thể kèm khoảng năm
export const Kicker: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 2 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 27, letterSpacing: 5, color: MD.gold, ...rise(frame, at) }}>
      {children}
    </div>
  );
};

export const ChapterTitle: React.FC<{ children: React.ReactNode; at?: number; size?: number }> = ({
  children,
  at = 8,
  size = 62,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT_BOLD,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.16,
        color: MD.white,
        maxWidth: 780,
        ...rise(frame, at),
      }}
    >
      {children}
    </div>
  );
};

export const YearBig: React.FC<{ children: React.ReactNode; at?: number; note?: string }> = ({ children, at = 14, note }) => {
  const frame = useCurrentFrame();
  return (
    <div style={rise(frame, at)}>
      <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 140, lineHeight: 1, color: MD.gold }}>{children}</div>
      {note ? (
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 26, color: MD.gray, marginTop: 10, maxWidth: 560, lineHeight: 1.4 }}>
          {note}
        </div>
      ) : null}
    </div>
  );
};

export const StatBig: React.FC<{ value: string; unit: string; at?: number }> = ({ value, unit, at = 10 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={rise(frame, at)}>
      <span style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 96, color: MD.gold }}>{value}</span>
      <span style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 34, color: MD.gray, marginLeft: 14 }}>{unit}</span>
    </div>
  );
};

export const ChipRow: React.FC<{ items: string[]; at?: number }> = ({ items, at = 20 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 16, ...rise(frame, at) }}>
      {items.map((c) => (
        <div
          key={c}
          style={{
            border: `1.5px solid ${MD.line}`,
            background: "rgba(19,26,36,0.8)",
            borderRadius: 8,
            padding: "10px 20px",
            fontFamily: FONT_BOLD,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 2,
            color: MD.gray,
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
};

export const PhotoMini: React.FC<{
  src: string;
  name: string;
  tag?: string;
  desc?: string;
  at?: number;
  w?: number;
  bw?: boolean;
}> = ({ src, name, tag = "Hôm nay", desc, at = 16, w = 430, bw }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: w,
        borderRadius: 16,
        overflow: "hidden",
        background: MD.panel,
        border: `1px solid ${MD.line}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        ...rise(frame, at),
      }}
    >
      <div style={{ height: w * 0.55, overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: bw ? "grayscale(1) sepia(0.25) contrast(0.95)" : "none",
            scale: String(interpolate(frame, [at, at + 300], [1.02, 1.12], clamp)),
          }}
        />
      </div>
      <div style={{ padding: "16px 22px 18px" }}>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 30, color: MD.white }}>{name}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 6, alignItems: "baseline" }}>
          <span style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 20, color: MD.gold }}>{tag}</span>
          {desc ? <span style={{ fontFamily: FONT_BOLD, fontWeight: 600, fontSize: 20, color: MD.gray }}>{desc}</span> : null}
        </div>
      </div>
    </div>
  );
};

// phụ đề câu đầy đủ — trắng, từ khóa vàng
export type SubPart = { t: string; hot?: boolean };
export type SubLine = { a: number; b: number; parts: SubPart[] };

export const Subtitles: React.FC<{ lines: SubLine[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = lines.find((l) => t >= l.a && t < l.b);
  if (!line) return null;
  const localF = (t - line.a) * fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        padding: "70px 120px 44px",
        background: "linear-gradient(transparent, rgba(6,9,14,0.88) 55%)",
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(localF, [0, 8], [0, 1], clamp),
      }}
    >
      <div style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 36, color: MD.white, textAlign: "center", lineHeight: 1.45, maxWidth: 1500 }}>
        {line.parts.map((p, i) => (
          <span key={i} style={{ color: p.hot ? MD.gold : MD.white, fontWeight: p.hot ? 700 : 600 }}>
            {p.t}
          </span>
        ))}
      </div>
    </div>
  );
};

export const CornerMeta: React.FC<{ tl?: string; tr?: string; br?: string }> = ({ tl, tr, br }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    fontFamily: FONT_BOLD,
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: 3,
    color: MD.gray,
    opacity: 0.85,
  };
  return (
    <>
      {tl ? <div style={{ ...style, left: 90, top: 52 }}>{tl}</div> : null}
      {tr ? <div style={{ ...style, right: 90, top: 52 }}>{tr}</div> : null}
      {br ? <div style={{ ...style, right: 90, bottom: 40, fontSize: 16, letterSpacing: 1 }}>{br}</div> : null}
    </>
  );
};
