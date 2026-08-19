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
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";

const roboto = loadRoboto("normal", { weights: ["700", "900"], subsets: ["vietnamese", "latin"] });
export const FONT = roboto.fontFamily;

// 24h.com.vn brand palette (sampled from site CSS + current logo)
export const P = {
  green: "#78B43D",
  greenBright: "#8CC63F",
  greenDark: "#51AE5A",
  red: "#E60000",
  dark: "#252525",
  gray: "#EBEBEB",
  light: "#F5F5F5",
  white: "#FFFFFF",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });

export const outline = (px: number) => {
  const s: string[] = [];
  for (let dx = -px; dx <= px; dx += px / 2) {
    for (let dy = -px; dy <= px; dy += px / 2) {
      if (dx === 0 && dy === 0) continue;
      s.push(`${dx}px ${dy}px 0 ${P.dark}`);
    }
  }
  s.push(`0px ${px + 3}px 8px rgba(0,0,0,0.4)`);
  return s.join(", ");
};

// site-like light background with header stripe
export const SiteBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: P.light }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 16, background: P.green }} />
    {children}
  </AbsoluteFill>
);

export const Tag: React.FC<{ children: React.ReactNode; at?: number; color?: string }> = ({
  children,
  at = 0,
  color = P.red,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: color,
        color: P.white,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 40,
        letterSpacing: 3,
        padding: "16px 34px",
        borderRadius: 10,
        scale: String(pop(frame, fps, at)),
        boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// article image in a rounded card with slow ken-burns
export const PhotoCard: React.FC<{
  src: string;
  caption?: string;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  fit?: "cover" | "contain";
}> = ({ src, caption, zoomFrom = 1.02, zoomTo = 1.14, panX = 0, fit = "cover" }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 240], [zoomFrom, zoomTo], clamp);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 36,
        overflow: "hidden",
        boxShadow: "0 24px 56px rgba(0,0,0,0.3)",
        background: fit === "contain" ? P.white : P.dark,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: fit,
          scale: String(z),
          translate: `${interpolate(frame, [0, 240], [0, panX], clamp)}px 0px`,
        }}
      />
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 24,
            background: "rgba(37,37,37,0.82)",
            color: P.white,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 30,
            padding: "10px 22px",
            borderRadius: 10,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

const Col: React.FC<{ children: React.ReactNode; gap?: number; pad?: number }> = ({
  children,
  gap = 40,
  pad = 70,
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap,
      padding: `0 ${pad}px`,
    }}
  >
    {children}
  </AbsoluteFill>
);

// S1 — hook: full-bleed photo + tag + title
export const Op16Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.dark }}>
      <Img
        src={staticFile("op16_1.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(interpolate(frame, [0, 160], [1.08, 1.18], clamp)),
        }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(rgba(0,0,0,0.4) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.85) 100%)" }}
      />
      <div style={{ position: "absolute", top: 130, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
        <Tag at={4}>TIN ĐỒN CÔNG NGHỆ</Tag>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 560,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 88,
          lineHeight: 1.14,
          color: P.white,
          textShadow: outline(4),
          padding: "0 60px",
          opacity: interpolate(frame, [8, 22], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [8, 22], [40, 0], { ...clamp, easing: ease })}px`,
        }}
      >
        ONEPLUS 16{" "}
        <span style={{ color: P.greenBright }}>"ĐÈ BẸP"</span>
        <br />
        IPHONE & GALAXY?
      </div>
    </AbsoluteFill>
  );
};

// S2 — camera spec 50MP → 200MP
export const Op16Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mp = Math.round(interpolate(frame, [30, 90], [50, 200], { ...clamp, easing: ease }));
  return (
    <SiteBG>
      <Col gap={44}>
        <div style={{ width: 940, height: 540, marginTop: -120 }}>
          <PhotoCard src="op16_1.jpg" caption="Ảnh minh họa (24h.com.vn)" panX={-40} />
        </div>
        <Tag at={6} color={P.green}>
          RÒ RỈ TỪ ONEPLUSCLUB
        </Tag>
        <div
          style={{
            background: P.white,
            borderRadius: 28,
            padding: "30px 64px",
            boxShadow: "0 18px 44px rgba(0,0,0,0.12)",
            textAlign: "center",
            scale: String(pop(frame, fps, 14)),
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: P.dark, opacity: 0.7 }}>
            CẢM BIẾN CHÍNH
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: P.green, lineHeight: 1.05 }}>
            {mp}MP
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: P.dark }}>
            nhảy vọt từ <span style={{ color: P.red, textDecoration: "line-through" }}>50MP</span> — lần đầu
            tiên của OnePlus
          </div>
        </div>
      </Col>
    </SiteBG>
  );
};

// S3 — tele periscope card
export const Op16Tele: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SiteBG>
      <Col gap={50}>
        <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ scale: String(pop(frame, fps)) }}>
          <circle r={220} fill={P.dark} />
          <circle r={150} fill="#3a3a3a" />
          <circle r={100} fill={P.dark} stroke={P.green} strokeWidth={14} />
          <circle r={54} fill="#111" />
          <circle cx={-26} cy={-30} r={20} fill="rgba(255,255,255,0.35)" />
          <g transform={`rotate(${frame * 0.8})`}>
            <circle r={240} fill="none" stroke={P.green} strokeWidth={6} strokeDasharray="30 22" />
          </g>
        </svg>
        <div
          style={{
            background: P.dark,
            color: P.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 56,
            padding: "34px 60px",
            borderRadius: 22,
            textAlign: "center",
            lineHeight: 1.35,
            scale: String(pop(frame, fps, 10)),
          }}
        >
          TELE TIỀM VỌNG
          <br />
          <span style={{ color: P.greenBright, fontSize: 76 }}>CŨNG 200MP</span>
        </div>
      </Col>
    </SiteBG>
  );
};

// S4 — beat "CHƯA HẾT."
export const Op16Beat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: P.red, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 200,
          color: P.white,
          scale: String(pop(frame, fps)),
          textShadow: "0 14px 0 rgba(0,0,0,0.2)",
        }}
      >
        CHƯA HẾT.
      </div>
    </AbsoluteFill>
  );
};

// S5 — leak screenshot + battery math
export const Op16Leak: React.FC<{ mathAt: number[] }> = ({ mathAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["2 VIÊN 4.390 mAh", "TỔNG 8.780 mAh", "≈ 9.000 mAh"];
  return (
    <SiteBG>
      <Col gap={32}>
        <div style={{ marginTop: -110 }}>
          <Tag color={P.red} at={2}>
            RÒ RỈ · DIGITAL CHAT STATION
          </Tag>
        </div>
        <div style={{ width: 960, height: 370 }}>
          <PhotoCard
            src="op16_3.jpg"
            caption="Tin đồn về OnePlus 16 (24h.com.vn)"
            zoomFrom={1.0}
            zoomTo={1.06}
            fit="contain"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          {items.map((label, i) => (
            <div
              key={label}
              style={{
                background: i === 2 ? P.green : P.white,
                color: i === 2 ? P.white : P.dark,
                border: `4px solid ${i === 2 ? P.green : P.gray}`,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: i === 2 ? 58 : 46,
                padding: "16px 48px",
                borderRadius: 999,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                scale: String(pop(frame, fps, mathAt[i])),
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </Col>
    </SiteBG>
  );
};

// S6 — biggest battery
export const Op16Battery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(frame, [8, 70], [0.1, 1], { ...clamp, easing: ease });
  return (
    <SiteBG>
      <Col gap={46}>
        <svg width={460} height={760} viewBox="0 0 460 760" style={{ scale: String(pop(frame, fps)) }}>
          <rect x={160} y={20} width={140} height={44} rx={14} fill={P.dark} />
          <rect x={40} y={64} width={380} height={670} rx={48} fill={P.white} stroke={P.dark} strokeWidth={14} />
          <rect
            x={66}
            y={90 + 618 * (1 - fill)}
            width={328}
            height={618 * fill}
            rx={30}
            fill={P.green}
          />
          <text
            x={230}
            y={420}
            textAnchor="middle"
            fontFamily={FONT}
            fontWeight={900}
            fontSize={92}
            fill={fill > 0.55 ? P.white : P.dark}
          >
            9.000
          </text>
          <text
            x={230}
            y={490}
            textAnchor="middle"
            fontFamily={FONT}
            fontWeight={700}
            fontSize={44}
            fill={fill > 0.45 ? P.white : P.dark}
          >
            mAh
          </text>
        </svg>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 54,
            color: P.dark,
            textAlign: "center",
            scale: String(pop(frame, fps, 16)),
          }}
        >
          PIN LỚN NHẤT TỪNG CÓ
          <br />
          <span style={{ color: P.green }}>TRÊN FLAGSHIP ONEPLUS</span>
        </div>
      </Col>
    </SiteBG>
  );
};

// S7 — charging over the red-cable photo
export const Op16Charge: React.FC<{ badgeAt: number[] }> = ({ badgeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: P.dark }}>
      <Img
        src={staticFile("op16_2.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(interpolate(frame, [0, 150], [1.05, 1.16], clamp)),
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.75) 78%)" }} />
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 130,
          background: "rgba(37,37,37,0.82)",
          color: P.white,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 30,
          padding: "10px 22px",
          borderRadius: 10,
        }}
      >
        OnePlus 15 (24h.com.vn)
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 480,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 34,
        }}
      >
        {[
          { label: "⚡ 100W CÓ DÂY", at: badgeAt[0] },
          { label: "🔋 50W KHÔNG DÂY", at: badgeAt[1] },
        ].map((b) => (
          <div
            key={b.label}
            style={{
              background: P.green,
              color: P.white,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 50,
              padding: "24px 42px",
              borderRadius: 999,
              boxShadow: "0 14px 34px rgba(0,0,0,0.4)",
              scale: String(pop(frame, fps, b.at)),
              whiteSpace: "nowrap",
            }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// S8 — versus card
export const Op16Versus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rival = (label: string, at: number) => (
    <div
      style={{
        background: P.white,
        border: `4px solid ${P.gray}`,
        color: P.dark,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 46,
        padding: "26px 44px",
        borderRadius: 20,
        scale: String(pop(frame, fps, at)),
        opacity: 0.85,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
  return (
    <SiteBG>
      <Col gap={40}>
        <div
          style={{
            background: P.green,
            color: P.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 82,
            padding: "40px 80px",
            borderRadius: 26,
            boxShadow: "0 20px 50px rgba(120,180,61,0.45)",
            scale: String(pop(frame, fps, 4)),
          }}
        >
          ONEPLUS 16
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 90,
            color: P.red,
            scale: String(pop(frame, fps, 14)),
          }}
        >
          ÁP ĐẢO
        </div>
        {rival("iPHONE PRO MAX", 22)}
        {rival("GALAXY S ULTRA", 30)}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: P.dark, opacity: 0.65 }}>
          — về dung lượng pin —
        </div>
      </Col>
    </SiteBG>
  );
};

// S9 — production timeline
export const Op16Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { label: "SẢN XUẤT THỬ NGHIỆM", note: "ĐÃ BẮT ĐẦU", at: 8, done: true },
    { label: "RA MẮT DỰ KIẾN", note: "CUỐI NĂM NAY", at: 34, done: false },
  ];
  return (
    <SiteBG>
      <Col gap={56}>
        {steps.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 34,
              scale: String(pop(frame, fps, s.at)),
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 999,
                background: s.done ? P.green : P.white,
                border: `6px solid ${P.green}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 44,
                color: P.white,
                fontFamily: FONT,
                fontWeight: 900,
              }}
            >
              {s.done ? "✓" : ""}
            </div>
            <div
              style={{
                background: P.white,
                borderRadius: 22,
                padding: "28px 46px",
                boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
                minWidth: 620,
              }}
            >
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: P.dark, opacity: 0.65 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: s.done ? P.green : P.red }}>
                {s.note}
              </div>
            </div>
          </div>
        ))}
      </Col>
    </SiteBG>
  );
};

// S10 — ending recap + question + credit
export const Op16End: React.FC<{ questionAt: number }> = ({ questionAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: P.dark }}>
      <Img
        src={staticFile("op16_1.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.28,
          scale: String(interpolate(frame, [0, 220], [1.1, 1.2], clamp)),
        }}
      />
      <Col gap={40}>
        <div style={{ display: "flex", gap: 30 }}>
          {["📷 200MP", "🔋 9.000 mAh"].map((b, i) => (
            <div
              key={b}
              style={{
                background: P.green,
                color: P.white,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 56,
                padding: "26px 46px",
                borderRadius: 999,
                scale: String(pop(frame, fps, 6 + i * 10)),
                whiteSpace: "nowrap",
              }}
            >
              {b}
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 96,
            color: P.white,
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: outline(4),
            scale: String(pop(frame, fps, questionAt)),
          }}
        >
          ĐỦ ĐỂ
          <br />
          <span style={{ color: P.greenBright }}>ĐỔI MÁY CHƯA?</span>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 34,
            color: P.white,
            opacity: interpolate(frame, [questionAt + 20, questionAt + 34], [0, 0.8], clamp),
          }}
        >
          Nguồn: 24h.com.vn · Thời trang Hi-tech
        </div>
      </Col>
    </AbsoluteFill>
  );
};
