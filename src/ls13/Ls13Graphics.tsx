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
import { DarkBG, GoldStar, H } from "../hue/HueGraphics";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 110 } });

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 44 }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap,
      padding: "0 70px",
    }}
  >
    {children}
  </AbsoluteFill>
);

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: FONT_BOLD,
      fontWeight: 800,
      fontSize: 38,
      letterSpacing: 8,
      color: H.dim,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const Rise: React.FC<{ at?: number; children: React.ReactNode }> = ({ at = 0, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 20], [0, 1], { ...clamp, easing: ease }),
        translate: `0px ${interpolate(frame, [at, at + 20], [36, 0], { ...clamp, easing: ease })}px`,
      }}
    >
      {children}
    </div>
  );
};

// photo card on dark background with thin gold border + slow ken-burns
const PhotoDark: React.FC<{ src: string; caption: string; h?: number }> = ({ src, caption, h = 620 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "relative",
        width: 940,
        height: h,
        borderRadius: 26,
        overflow: "hidden",
        border: `3px solid rgba(201,162,39,0.55)`,
        boxShadow: "0 34px 80px rgba(0,0,0,0.65)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(interpolate(frame, [0, 260], [1.04, 1.14], clamp)),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "40px 26px 18px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
          fontFamily: FONT_BOLD,
          fontWeight: 700,
          fontSize: 27,
          color: H.cream,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// S1 — hook
export const Ls13Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <DarkBG>
      <Col gap={50}>
        <Rise at={4}>
          <GoldStar size={120} style={{ scale: String(pop(frame, fps, 4)) }} />
        </Rise>
        <Rise at={10}>
          <Kicker>QUẢNG TRỊ · KHU VỰC CÂU NHI</Kicker>
        </Rise>
        <Rise at={16}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: 92,
              color: H.cream,
              textAlign: "center",
              lineHeight: 1.24,
            }}
          >
            Đất vừa trả về
            <br />
            <span style={{ color: H.goldSoft }}>13 người lính</span>
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

// S2 — discovery photo + numbers
export const Ls13Found: React.FC<{ depthAt: number }> = ({ depthAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <DarkBG glow={0.06}>
      <Col gap={38}>
        <Rise at={2}>
          <PhotoDark src="ls13_3.jpg" caption="Mở rộng tìm kiếm tại Câu Nhi, xã Nam Hải Lăng · Ảnh: Xuân Diện" h={560} />
        </Rise>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: 190,
              color: H.goldSoft,
              lineHeight: 1,
              textShadow: "0 0 70px rgba(201,162,39,0.35)",
              scale: String(pop(frame, fps, 10)),
            }}
          >
            13
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 44, color: H.cream, lineHeight: 1.5 }}>
            BỘ HÀI CỐT
            <br />
            LIỆT SĨ
          </div>
        </div>
        <Rise at={depthAt}>
          <div
            style={{
              border: `2px solid ${H.line}`,
              background: H.panel,
              borderRadius: 18,
              padding: "20px 44px",
              fontFamily: FONT_BOLD,
              fontWeight: 800,
              fontSize: 40,
              color: H.cream,
            }}
          >
            chỉ <span style={{ color: H.goldSoft }}>20–50 cm</span> dưới mặt đất
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

// S3 — the 1972 battle
export const Ls13Battle: React.FC<{ unitAt: number }> = ({ unitAt }) => {
  return (
    <DarkBG>
      <Col gap={36}>
        <Rise at={2}>
          <Kicker>TRẬN ĐÁNH ÁC LIỆT</Kicker>
        </Rise>
        <Rise at={8}>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 180, color: H.goldSoft, lineHeight: 1 }}>
            1972
          </div>
        </Rise>
        <Rise at={14}>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 60, color: H.cream }}>Tháng 5</div>
        </Rise>
        <Rise at={unitAt}>
          <div
            style={{
              border: `2px solid ${H.line}`,
              background: H.panel,
              borderRadius: 20,
              padding: "28px 48px",
              fontFamily: FONT_BOLD,
              fontWeight: 800,
              fontSize: 42,
              color: H.cream,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Tiểu đoàn 6 · Trung đoàn 88
            <br />
            Sư đoàn 308
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

// S4 — relics grid appearing as each is named
export const Ls13Relics: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    "Tấm tăng",
    "Đế giày",
    "Thắt lưng",
    "Cúc áo",
    "Lọ thuốc",
    "Dây súng",
    "Lựu đạn chày",
    "Hộp tiếp đạn AK",
    "Xẻng bộ binh",
  ];
  return (
    <DarkBG glow={0.07}>
      <Col gap={44}>
        <Rise at={2}>
          <Kicker>NHỮNG DI VẬT CÒN LẠI BÊN CÁC ANH</Kicker>
        </Rise>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 28,
            maxWidth: 900,
          }}
        >
          {items.map((label, i) => (
            <div
              key={label}
              style={{
                border: `2px solid rgba(201,162,39,0.6)`,
                background: H.panel,
                borderRadius: 16,
                padding: "22px 38px",
                fontFamily: FONT_SERIF,
                fontWeight: 600,
                fontSize: 44,
                color: H.cream,
                scale: String(pop(frame, fps, at[i])),
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </Col>
    </DarkBG>
  );
};

// S5 — no names yet
export const Ls13NoName: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DarkBG glow={0.05}>
      <Col gap={48}>
        <svg width={520} height={220} viewBox="0 0 520 220">
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={60}
              y1={60 + i * 60}
              x2={460}
              y2={60 + i * 60}
              stroke={H.dim}
              strokeWidth={6}
              strokeDasharray="30 22"
              opacity={interpolate(frame, [i * 8, i * 8 + 16], [0, 0.7], clamp)}
            />
          ))}
        </svg>
        <Rise at={16}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: 76,
              color: H.cream,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Hơn 50 năm —
            <br />
            <span style={{ color: H.goldSoft }}>chưa ai biết tên các anh</span>
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

// S6 — DNA identification
export const Ls13DNA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <DarkBG glow={0.08}>
      <Col gap={46}>
        <svg width={340} height={460} viewBox="0 0 340 460" style={{ scale: String(pop(frame, fps, 2)) }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const y = 40 + i * 48;
            const phase = frame / 22 + i * 0.7;
            const x1 = 170 + Math.sin(phase) * 110;
            const x2 = 170 - Math.sin(phase) * 110;
            return (
              <g key={i}>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke={H.line} strokeWidth={6} />
                <circle cx={x1} cy={y} r={16} fill={H.gold} />
                <circle cx={x2} cy={y} r={16} fill={H.cream} />
              </g>
            );
          })}
        </svg>
        <Rise at={12}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: 68,
              color: H.cream,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Giám định ADN —
            <br />
            <span style={{ color: H.goldSoft }}>trả lại tên cho từng người</span>
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

// S7 — officials at the site, search expanding
export const Ls13Search: React.FC<{ noteAt: number }> = ({ noteAt }) => {
  return (
    <DarkBG glow={0.06}>
      <Col gap={40}>
        <Rise at={2}>
          <PhotoDark
            src="ls13_1.jpg"
            caption="Chủ tịch UBND tỉnh Quảng Trị Lê Hồng Vinh kiểm tra hiện trường · Ảnh: Xuân Diện"
            h={620}
          />
        </Rise>
        <Rise at={noteAt}>
          <div
            style={{
              border: `2px solid rgba(201,162,39,0.6)`,
              background: H.panel,
              borderRadius: 18,
              padding: "24px 50px",
              fontFamily: FONT_BOLD,
              fontWeight: 800,
              fontSize: 44,
              color: H.goldSoft,
            }}
          >
            CUỘC TÌM KIẾM ĐANG MỞ RỘNG
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

// S8 — ending
export const Ls13End: React.FC<{ line2At: number; creditAt: number }> = ({ line2At, creditAt }) => {
  const frame = useCurrentFrame();
  return (
    <DarkBG glow={0.13}>
      <Col gap={48}>
        <Rise at={4}>
          <GoldStar size={160} style={{ scale: String(1 + Math.sin(frame / 26) * 0.02) }} />
        </Rise>
        <Rise at={12}>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 84, color: H.cream, textAlign: "center" }}>
            13 người lính
            <br />
            <span style={{ color: H.goldSoft }}>đã trở về</span>
          </div>
        </Rise>
        <Rise at={line2At}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 600,
              fontSize: 52,
              color: H.dim,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Và đâu đó dưới đất Quảng Trị,
            <br />
            vẫn còn những người đang đợi.
          </div>
        </Rise>
        <Rise at={creditAt}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 30, color: H.dim, letterSpacing: 3 }}>
            Nguồn: 24h.com.vn · Ảnh: Xuân Diện · 4/8/2026
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};
