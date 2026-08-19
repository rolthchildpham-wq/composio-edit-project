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
import { FONT_BOLD } from "../palette";

// YouTube-dark theme for the faceless-AI niches video
export const Y = {
  bg: "#0F0F0F",
  card: "#1F1F1F",
  line: "#303030",
  red: "#FF0033",
  redSoft: "#FF5252",
  white: "#FFFFFF",
  gray: "#AAAAAA",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });

export const outlineDark = (px: number) => {
  const s: string[] = [];
  for (let dx = -px; dx <= px; dx += px / 2)
    for (let dy = -px; dy <= px; dy += px / 2)
      if (dx || dy) s.push(`${dx}px ${dy}px 0 #000`);
  s.push(`0px ${px + 3}px 8px rgba(0,0,0,0.6)`);
  return s.join(", ");
};

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 38 }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap,
      padding: "0 60px",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const DarkYtBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 55% at 50% 38%, rgba(255,0,51,0.10) 0%, transparent 62%), ${Y.bg}`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const PlayButton: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={style}>
    <rect width={200} height={140} rx={34} fill={Y.red} />
    <polygon points="78,42 78,98 132,70" fill={Y.white} />
  </svg>
);

// animated view counter like "2,3 TRIỆU"
const Counter: React.FC<{ to: number; decimals?: number; from?: number; at: number; suffix: string }> = ({
  to,
  decimals = 1,
  from = 0,
  at,
  suffix,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + 34], [from, to], { ...clamp, easing: ease });
  const txt = decimals ? v.toFixed(decimals).replace(".", ",") : String(Math.round(v));
  return (
    <span>
      {txt} {suffix}
    </span>
  );
};

// S1 — hook
export const YtHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <DarkYtBG>
      <Col gap={44}>
        <PlayButton size={220} style={{ scale: String(pop(frame, fps, 3)), rotate: "-4deg" }} />
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 100,
            color: Y.white,
            textAlign: "center",
            lineHeight: 1.12,
            opacity: interpolate(frame, [8, 20], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [8, 20], [40, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          5 NGÁCH
          <br />
          <span style={{ color: Y.redSoft }}>FACELESS AI</span>
          <br />
          TRIỆU VIEW
        </div>
        <div
          style={{
            background: Y.red,
            color: Y.white,
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 44,
            padding: "18px 40px",
            borderRadius: 999,
            scale: String(pop(frame, fps, 16)),
          }}
        >
          KHÔNG LỘ MẶT · KIẾM TIỀN THẬT
        </div>
      </Col>
    </DarkYtBG>
  );
};

// generic niche scene: number chip + title + screenshot + animated stat
export const YtNiche: React.FC<{
  index: number;
  title: string;
  img?: string;
  icon?: string;
  statAt: number;
  statTo: number;
  statDecimals?: number;
  statSuffix: string;
  statNote?: string;
}> = ({ index, title, img, icon, statAt, statTo, statDecimals = 1, statSuffix, statNote }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <DarkYtBG>
      <Col gap={34}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, scale: String(pop(frame, fps, 2)) }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              background: Y.red,
              color: Y.white,
              fontFamily: FONT_BOLD,
              fontWeight: 900,
              fontSize: 56,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {index}
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 62, color: Y.white, maxWidth: 760, lineHeight: 1.15 }}>
            {title}
          </div>
        </div>
        <div
          style={{
            width: 960,
            height: 560,
            borderRadius: 24,
            overflow: "hidden",
            border: `3px solid ${Y.line}`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
            position: "relative",
            background: Y.card,
          }}
        >
          {img ? (
            <>
              <Img
                src={staticFile(img)}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  scale: String(interpolate(frame, [0, 240], [1.0, 1.08], clamp)),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  background: "rgba(0,0,0,0.78)",
                  color: Y.white,
                  fontFamily: FONT_BOLD,
                  fontWeight: 700,
                  fontSize: 26,
                  padding: "8px 18px",
                  borderRadius: 8,
                }}
              >
                Ảnh: bài viết AI Plus
              </div>
            </>
          ) : (
            <AbsoluteFill
              style={{
                background: `radial-gradient(circle at 50% 45%, rgba(255,0,51,0.25), transparent 70%), ${Y.card}`,
                justifyContent: "center",
                alignItems: "center",
                fontSize: 220,
              }}
            >
              <div style={{ rotate: `${Math.sin(frame / 20) * 4}deg` }}>{icon}</div>
            </AbsoluteFill>
          )}
        </div>
        <div
          style={{
            background: Y.card,
            border: `3px solid ${Y.red}`,
            borderRadius: 24,
            padding: "26px 60px",
            textAlign: "center",
            scale: String(pop(frame, fps, statAt)),
          }}
        >
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 88, color: Y.redSoft, lineHeight: 1.1 }}>
            ▶ <Counter to={statTo} decimals={statDecimals} at={statAt} suffix={statSuffix} />
          </div>
          {statNote ? (
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 38, color: Y.gray, marginTop: 6 }}>
              {statNote}
            </div>
          ) : null}
        </div>
      </Col>
    </DarkYtBG>
  );
};

// S3 — whole-channel stat
export const YtChannelStat: React.FC<{ badgeAt: number }> = ({ badgeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <DarkYtBG>
      <Col gap={30}>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 44, color: Y.gray }}>CẢ KÊNH ĐÃ VƯỢT</div>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 210,
            color: Y.white,
            lineHeight: 1,
            scale: String(pop(frame, fps, 4)),
          }}
        >
          <Counter to={76} decimals={0} at={4} suffix="" />
          <span style={{ color: Y.redSoft }}> TRIỆU</span>
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 66, color: Y.white }}>LƯỢT XEM</div>
        <div
          style={{
            background: "#1E8E3E",
            color: Y.white,
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 46,
            padding: "20px 46px",
            borderRadius: 999,
            scale: String(pop(frame, fps, badgeAt)),
          }}
        >
          💰 DOANH THU QUẢNG CÁO ĐỀU ĐẶN
        </div>
      </Col>
    </DarkYtBG>
  );
};

// S8 — monetization tip: Join / Thanks buttons
export const YtMonetize: React.FC<{ btnAt: number[]; noteAt: number }> = ({ btnAt, noteAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = (label: string, at: number, filled: boolean) => (
    <div
      style={{
        background: filled ? Y.white : "transparent",
        color: filled ? "#0F0F0F" : Y.white,
        border: `3px solid ${Y.white}`,
        fontFamily: FONT_BOLD,
        fontWeight: 900,
        fontSize: 54,
        padding: "22px 60px",
        borderRadius: 999,
        scale: String(pop(frame, fps, at)),
      }}
    >
      {label}
    </div>
  );
  return (
    <DarkYtBG>
      <Col gap={32}>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 64, color: Y.white, textAlign: "center", lineHeight: 1.2 }}>
          KÊNH CÓ <span style={{ color: Y.redSoft }}>KIẾM TIỀN</span> KHÔNG?
        </div>
        <div
          style={{
            width: 940,
            height: 470,
            borderRadius: 24,
            overflow: "hidden",
            border: `3px solid ${Y.line}`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
            position: "relative",
            background: Y.card,
            scale: String(pop(frame, fps, 4)),
          }}
        >
          <Img
            src={staticFile("yt_3.png")}
            style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              bottom: 20,
              background: "rgba(0,0,0,0.78)",
              color: Y.white,
              fontFamily: FONT_BOLD,
              fontWeight: 700,
              fontSize: 26,
              padding: "8px 18px",
              borderRadius: 8,
            }}
          >
            Kênh mở membership · Ảnh: bài viết AI Plus
          </div>
        </div>
        <div style={{ display: "flex", gap: 34 }}>
          {btn("⭐ Join", btnAt[0], true)}
          {btn("💵 Thanks", btnAt[1], false)}
        </div>
        <div
          style={{
            background: Y.card,
            border: `3px solid #1E8E3E`,
            borderRadius: 20,
            padding: "24px 46px",
            fontFamily: FONT_BOLD,
            fontWeight: 800,
            fontSize: 42,
            color: Y.white,
            textAlign: "center",
            scale: String(pop(frame, fps, noteAt)),
          }}
        >
          Có nút này = đang trong
          <br />
          <span style={{ color: "#4CD964" }}>YouTube Partner Program</span>
        </div>
      </Col>
    </DarkYtBG>
  );
};

// S9 — the 3-step formula
export const YtFormula: React.FC<{ stepAt: number[] }> = ({ stepAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { n: "1", label: "TẠO ẢNH", tool: "Nano Banana Pro" },
    { n: "2", label: "ẢNH → VIDEO", tool: "Kling" },
    { n: "3", label: "GIỌNG / NHẠC AI", tool: "Voice AI · Suno" },
  ];
  return (
    <DarkYtBG>
      <Col gap={36}>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 66, color: Y.white }}>
          CÔNG THỨC <span style={{ color: Y.redSoft }}>CHUNG</span>
        </div>
        {steps.map((s, i) => (
          <div
            key={s.n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              background: Y.card,
              border: `3px solid ${Y.line}`,
              borderRadius: 24,
              padding: "26px 44px",
              minWidth: 780,
              scale: String(pop(frame, fps, stepAt[i])),
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 999,
                background: Y.red,
                color: Y.white,
                fontFamily: FONT_BOLD,
                fontWeight: 900,
                fontSize: 44,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {s.n}
            </div>
            <div>
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 34, color: Y.gray }}>{s.label}</div>
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 54, color: Y.white }}>{s.tool}</div>
            </div>
          </div>
        ))}
      </Col>
    </DarkYtBG>
  );
};

// S10 — ending
export const YtEnd: React.FC<{ creditAt: number }> = ({ creditAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const niches = ["LỊCH SỬ", "ASMR", "ANIME 3D", "NHẠC AI", "ĐỘNG LỰC"];
  return (
    <DarkYtBG>
      <Col gap={40}>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 92,
            color: Y.white,
            textAlign: "center",
            lineHeight: 1.18,
            scale: String(pop(frame, fps, 4)),
          }}
        >
          BẠN THỬ
          <br />
          <span style={{ color: Y.redSoft }}>NGÁCH NÀO?</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, maxWidth: 900 }}>
          {niches.map((n, i) => (
            <div
              key={n}
              style={{
                background: Y.card,
                border: `3px solid ${Y.red}`,
                color: Y.white,
                fontFamily: FONT_BOLD,
                fontWeight: 900,
                fontSize: 40,
                padding: "16px 34px",
                borderRadius: 999,
                scale: String(pop(frame, fps, 10 + i * 5)),
              }}
            >
              {n}
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 700,
            fontSize: 34,
            color: Y.gray,
            opacity: interpolate(frame, [creditAt, creditAt + 14], [0, 1], clamp),
          }}
        >
          Nguồn: AI Plus · aiplus.nguyentatkiem.com
        </div>
      </Col>
    </DarkYtBG>
  );
};
