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
import type { Chunk } from "../chunks";

// ============================================================================
// KHO TEMPLATE SCENE — đúc từ 8 video đã dựng. Mỗi cảnh là 1 component nhận
// palette, nên đổi màu/đổi đề tài không phải viết lại layout.
// ============================================================================

export type Palette = {
  bg: string; // nền chính (solid hoặc gradient CSS)
  card: string;
  line: string;
  accent: string; // màu nhấn chính (highlight, số liệu)
  accentSoft: string;
  onAccent: string; // chữ trên nền accent
  text: string;
  sub: string; // chữ phụ
  glowRGBA?: string; // quầng sáng radial sau lưng (vd "255,0,51")
  serifTitle?: boolean; // true = title dùng serif (kiểu tưởng niệm)
};

// 5 palette đã kiểm chứng qua video thật
export const PALETTES = {
  news24h: {
    bg: "#F5F5F5", card: "#FFFFFF", line: "#EBEBEB",
    accent: "#78B43D", accentSoft: "#8CC63F", onAccent: "#FFFFFF",
    text: "#252525", sub: "#8A8A8A", glowRGBA: "120,180,61",
  },
  memorial: {
    bg: "#0F1114", card: "#1A1E24", line: "#2A3038",
    accent: "#C9A227", accentSoft: "#E3C466", onAccent: "#241C05",
    text: "#EAE3D2", sub: "#9A937F", glowRGBA: "201,162,39", serifTitle: true,
  },
  ytDark: {
    bg: "#0F0F0F", card: "#1F1F1F", line: "#303030",
    accent: "#FF0033", accentSoft: "#FF5252", onAccent: "#FFFFFF",
    text: "#FFFFFF", sub: "#AAAAAA", glowRGBA: "255,0,51",
  },
  goldDark: {
    bg: "#0B0A08", card: "#1A160E", line: "#3A3020",
    accent: "#F5C542", accentSoft: "#FFDE8A", onAccent: "#241C05",
    text: "#FFF7E8", sub: "#9A9080", glowRGBA: "245,197,66",
  },
  agriAd: {
    bg: "linear-gradient(170deg, #17813F 0%, #0E5A2F 100%)", card: "#FFF9EC", line: "#DCD2B8",
    accent: "#FFD34D", accentSoft: "#FFE58A", onAccent: "#123319",
    text: "#FFFFFF", sub: "#CDE3CF", glowRGBA: "255,211,77",
  },
} satisfies Record<string, Palette>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });

export const outlineOn = (bgIsDark: boolean, px = 5) => {
  const c = bgIsDark ? "#000" : "#252525";
  const s: string[] = [];
  for (let dx = -px; dx <= px; dx += px / 2)
    for (let dy = -px; dy <= px; dy += px / 2)
      if (dx || dy) s.push(`${dx}px ${dy}px 0 ${c}`);
  s.push(`0px ${px + 3}px 8px rgba(0,0,0,0.5)`);
  return s.join(", ");
};

export const TplBG: React.FC<{ p: Palette; children?: React.ReactNode }> = ({ p, children }) => (
  <AbsoluteFill
    style={{
      background: p.glowRGBA
        ? `radial-gradient(ellipse 95% 55% at 50% 34%, rgba(${p.glowRGBA},0.12) 0%, transparent 62%), ${p.bg}`
        : p.bg,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
  <AbsoluteFill
    style={{
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", gap, padding: "0 60px",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const TplTag: React.FC<{ p: Palette; children: React.ReactNode; at?: number }> = ({
  p, children, at = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: p.accent, color: p.onAccent, fontFamily: FONT_BOLD, fontWeight: 900,
        fontSize: 42, letterSpacing: 3, padding: "16px 40px", borderRadius: 999,
        boxShadow: `0 12px 34px rgba(${p.glowRGBA ?? "0,0,0"},0.35)`,
        scale: String(pop(frame, fps, at)), whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

export const TplChip: React.FC<{
  p: Palette; children: React.ReactNode; at: number; hot?: boolean; size?: number;
}> = ({ p, children, at, hot, size = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: hot ? p.accent : p.card, color: hot ? p.onAccent : p.text,
        border: `3px solid ${hot ? p.accent : p.line}`, fontFamily: FONT_BOLD, fontWeight: 900,
        fontSize: size, padding: "20px 46px", borderRadius: 999,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)", scale: String(pop(frame, fps, at)),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// Ảnh trong card bo góc + ken-burns; nhận effects của @remotion/effects qua prop
export const TplPhoto: React.FC<{
  src: string; caption?: string; w?: number; h?: number;
  fit?: "cover" | "contain"; effects?: React.ComponentProps<typeof Img>["effects"];
}> = ({ src, caption, w = 940, h = 560, fit = "cover", effects }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: w, height: h, borderRadius: 26, overflow: "hidden", position: "relative",
        boxShadow: "0 30px 70px rgba(0,0,0,0.45)", background: fit === "contain" ? "#fff" : "#111",
      }}
    >
      <Img
        src={staticFile(src)}
        effects={effects}
        style={{
          position: "absolute", width: "100%", height: "100%", objectFit: fit,
          scale: String(interpolate(frame, [0, 240], [1.0, 1.09], clamp)),
        }}
      />
      {caption ? (
        <div
          style={{
            position: "absolute", left: 20, bottom: 20, background: "rgba(0,0,0,0.78)",
            color: "#fff", fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 27,
            padding: "8px 18px", borderRadius: 8,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

// ---- CÁC SCENE HOÀN CHỈNH ----

// 1. Hook: tag + (ảnh) + title
export const TplHook: React.FC<{
  p: Palette; tag: string; title: React.ReactNode; img?: string; caption?: string;
}> = ({ p, tag, title, img, caption }) => {
  const frame = useCurrentFrame();
  return (
    <TplBG p={p}>
      <Col gap={38}>
        <TplTag p={p}>{tag}</TplTag>
        {img ? <TplPhoto src={img} caption={caption} h={540} /> : null}
        <div
          style={{
            fontFamily: p.serifTitle ? FONT_SERIF : FONT_BOLD, fontWeight: p.serifTitle ? 700 : 900,
            fontSize: 92, color: p.text, textAlign: "center", lineHeight: 1.16,
            opacity: interpolate(frame, [10, 24], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [10, 24], [40, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          {title}
        </div>
      </Col>
    </TplBG>
  );
};

// 2. Danh sách chip bung theo voice
export const TplChipList: React.FC<{
  p: Palette; tag?: string; items: { label: React.ReactNode; at: number; hot?: boolean }[];
}> = ({ p, tag, items }) => (
  <TplBG p={p}>
    <Col gap={30}>
      {tag ? <TplTag p={p}>{tag}</TplTag> : null}
      {items.map((it, i) => (
        <TplChip key={i} p={p} at={it.at} hot={it.hot} size={54}>
          {it.label}
        </TplChip>
      ))}
    </Col>
  </TplBG>
);

// 3. Số đếm lớn (counter)
export const TplStat: React.FC<{
  p: Palette; kicker?: string; to: number; decimals?: number; suffix: string;
  note?: string; noteAt?: number; startAt?: number;
}> = ({ p, kicker, to, decimals = 0, suffix, note, noteAt = 20, startAt = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [startAt, startAt + 34], [0, to], { ...clamp, easing: ease });
  return (
    <TplBG p={p}>
      <Col gap={26}>
        {kicker ? (
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 44, color: p.sub }}>{kicker}</div>
        ) : null}
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 190, color: p.accent, lineHeight: 1, scale: String(pop(frame, fps, startAt)) }}>
          {decimals ? v.toFixed(decimals).replace(".", ",") : Math.round(v).toLocaleString("vi-VN")}
          <span style={{ fontSize: 100 }}> {suffix}</span>
        </div>
        {note ? (
          <TplChip p={p} at={noteAt} hot>
            {note}
          </TplChip>
        ) : null}
      </Col>
    </TplBG>
  );
};

// 4. Gauge phần trăm
export const TplGauge: React.FC<{
  p: Palette; tag?: string; percent: number; label: string; badge?: string; badgeAt?: number;
}> = ({ p, tag, percent, label, badge, badgeAt = 40 }) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [10, 70], [0, percent / 100], { ...clamp, easing: ease });
  const R = 220;
  const circ = Math.PI * R;
  return (
    <TplBG p={p}>
      <Col gap={36}>
        {tag ? <TplTag p={p}>{tag}</TplTag> : null}
        <div style={{ background: p.card, borderRadius: 28, padding: "56px 70px 40px", border: `3px solid ${p.line}` }}>
          <svg width={560} height={310} viewBox="0 0 560 310">
            <path d={`M 60 280 A ${R} ${R} 0 0 1 500 280`} stroke={p.line} strokeWidth={44} fill="none" strokeLinecap="round" />
            <path
              d={`M 60 280 A ${R} ${R} 0 0 1 500 280`} stroke={p.accent} strokeWidth={44} fill="none"
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - prog)}
            />
            <text x={280} y={230} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={130} fill={p.accent}>
              {Math.round(prog * 100)}%
            </text>
            <text x={280} y={292} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={34} fill={p.text} opacity={0.75}>
              {label}
            </text>
          </svg>
        </div>
        {badge ? (
          <TplChip p={p} at={badgeAt} hot>
            {badge}
          </TplChip>
        ) : null}
      </Col>
    </TplBG>
  );
};

// 5. Đối đầu (winner nổi bật)
export const TplVs: React.FC<{
  p: Palette; tag?: string; winner: { name: string; note: string };
  rivals: { name: string; note?: string; at: number }[];
}> = ({ p, tag, winner, rivals }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <TplBG p={p}>
      <Col gap={34}>
        {tag ? <TplTag p={p}>{tag}</TplTag> : null}
        <div
          style={{
            background: p.card, border: `4px solid ${p.accent}`, borderRadius: 26,
            padding: "30px 60px", minWidth: 820, textAlign: "center", scale: String(pop(frame, fps, 6)),
          }}
        >
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 36, color: p.sub }}>{winner.note}</div>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 84, color: p.accent }}>{winner.name}</div>
        </div>
        {rivals.map((r) => (
          <div
            key={r.name}
            style={{
              background: p.card, border: `3px solid ${p.line}`, borderRadius: 22,
              padding: "24px 50px", minWidth: 820, textAlign: "center", opacity: 0.85,
              scale: String(pop(frame, fps, r.at)),
            }}
          >
            {r.note ? (
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 32, color: p.sub }}>{r.note}</div>
            ) : null}
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 60, color: p.text }}>{r.name}</div>
          </div>
        ))}
      </Col>
    </TplBG>
  );
};

// 6. Beat chuyển chương — màn màu đặc + chữ to
export const TplBeat: React.FC<{ p: Palette; children: React.ReactNode }> = ({ p, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: p.accent, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 130, color: p.onAccent,
          textAlign: "center", lineHeight: 1.15, scale: String(pop(frame, fps)),
          textShadow: "0 12px 0 rgba(0,0,0,0.18)", padding: "0 60px",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// 7. Ảnh full-bleed + chữ đè (hook kiểu báo chí)
export const TplPhotoFull: React.FC<{
  p: Palette; img: string; tag?: string; title: React.ReactNode; dim?: number;
}> = ({ p, img, tag, title, dim = 0.5 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      <Img
        src={staticFile(img)}
        style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          scale: String(interpolate(frame, [0, 200], [1.05, 1.16], clamp)),
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(rgba(0,0,0,${dim * 0.8}) 0%, transparent 35%, transparent 52%, rgba(0,0,0,${Math.min(0.9, dim + 0.35)}) 100%)` }} />
      {tag ? (
        <div style={{ position: "absolute", top: 130, width: "100%", display: "flex", justifyContent: "center" }}>
          <TplTag p={p}>{tag}</TplTag>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute", bottom: 560, width: "100%", textAlign: "center",
          fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 86, lineHeight: 1.16,
          color: "#fff", textShadow: outlineOn(true, 4), padding: "0 50px",
          opacity: interpolate(frame, [8, 22], [0, 1], clamp),
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

// 8. Kết + CTA + credit
export const TplEnd: React.FC<{
  p: Palette; title: React.ReactNode; chips?: { label: string; at: number }[];
  credit: string; creditAt?: number;
}> = ({ p, title, chips = [], credit, creditAt = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <TplBG p={p}>
      <Col gap={36}>
        <div
          style={{
            fontFamily: p.serifTitle ? FONT_SERIF : FONT_BOLD, fontWeight: p.serifTitle ? 700 : 900,
            fontSize: 90, color: p.text, textAlign: "center", lineHeight: 1.2,
            scale: String(pop(frame, fps, 4)),
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, maxWidth: 900 }}>
          {chips.map((c) => (
            <TplChip key={c.label} p={p} at={c.at} hot size={44}>
              {c.label}
            </TplChip>
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 32, color: p.sub,
            opacity: interpolate(frame, [creditAt, creditAt + 14], [0, 1], clamp),
          }}
        >
          {credit}
        </div>
      </Col>
    </TplBG>
  );
};

// 9. Captions karaoke theo palette
export const TplCaptions: React.FC<{
  p: Palette; chunks: Chunk[]; hidden?: { from: number; to: number }[]; fontSize?: number;
}> = ({ p, chunks, hidden = [], fontSize = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (hidden.some((h) => t >= h.from && t < h.to)) return null;
  const chunk = chunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const n = chunk.words.length;
  const hi = Math.min(n - 1, Math.floor(((t - chunk.start) / (chunk.end - chunk.start)) * n));
  const localF = (t - chunk.start) * fps;
  const darkBg = p.bg.startsWith("#0") || p.bg.startsWith("#1") || p.bg.includes("gradient");
  return (
    <div
      style={{
        position: "absolute", left: 0, top: "80%", width: "100%", display: "flex",
        justifyContent: "center", gap: 22, pointerEvents: "none",
        scale: String(0.9 + 0.1 * Math.min(1, localF / 3)),
      }}
    >
      {chunk.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_BOLD, fontWeight: 900, fontSize,
            color: i === hi ? p.accentSoft : "#FFFFFF",
            textShadow: outlineOn(darkBg, 5), whiteSpace: "nowrap",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};
