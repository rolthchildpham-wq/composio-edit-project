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
import { FONT, P, SiteBG, Tag, outline } from "../op16/Op16Graphics";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 40 }) => (
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

const StatCard: React.FC<{
  label: string;
  value: string;
  color: string;
  at: number;
}> = ({ label, value, color, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: P.white,
        borderRadius: 24,
        padding: "26px 50px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
        textAlign: "center",
        scale: String(pop(frame, fps, at)),
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: P.dark, opacity: 0.65 }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color }}>{value}</div>
    </div>
  );
};

// S1 — hook over the stock-board photo
export const CkHook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.dark }}>
      <Img
        src={staticFile("ck_1.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(interpolate(frame, [0, 160], [1.06, 1.18], clamp)),
        }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(rgba(0,0,0,0.45) 0%, transparent 32%, transparent 52%, rgba(0,0,0,0.88) 100%)" }}
      />
      <div style={{ position: "absolute", top: 130, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
        <Tag at={4}>CHỨNG KHOÁN</Tag>
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
          fontSize: 82,
          lineHeight: 1.16,
          color: P.white,
          textShadow: outline(4),
          padding: "0 50px",
          opacity: interpolate(frame, [8, 22], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [8, 22], [40, 0], { ...clamp, easing: ease })}px`,
        }}
      >
        SAU <span style={{ color: "#FF5A5A" }}>CÚ RƠI</span> MẠNH NHẤT NĂM
        <br />
        THÁNG 8 CÓ <span style={{ color: P.greenBright }}>"DỄ THỞ"?</span>
      </div>
    </AbsoluteFill>
  );
};

// animated index line; dir "down" (red) or "up" (green)
const IndexLine: React.FC<{ dir: "down" | "up" }> = ({ dir }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [6, 70], [0, 1], { ...clamp, easing: ease });
  const color = dir === "down" ? P.red : P.green;
  const d =
    dir === "down"
      ? "M 30 90 L 170 150 L 300 120 L 470 260 L 620 250 L 830 420"
      : "M 30 420 L 200 400 L 360 430 L 540 300 L 700 320 L 830 130";
  return (
    <svg width={880} height={480} viewBox="0 0 880 480">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={0} y1={60 + i * 90} x2={880} y2={60 + i * 90} stroke="rgba(37,37,37,0.08)" strokeWidth={2} />
      ))}
      <path
        d={d}
        stroke={color}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1000}
        strokeDasharray={1000}
        strokeDashoffset={1000 - 1000 * draw}
      />
      <path
        d={`${d} L 830 480 L 30 480 Z`}
        fill={color}
        opacity={0.12 * draw}
      />
      {draw > 0.98 ? (
        <polygon
          points={dir === "down" ? "830,420 796,384 864,384" : "830,130 796,166 864,166"}
          fill={color}
        />
      ) : null}
    </svg>
  );
};

// S2 — the July drop
export const CkDrop: React.FC<{ cardAt: number[] }> = ({ cardAt }) => {
  return (
    <SiteBG>
      <Col gap={36}>
        <Tag at={2}>THÁNG 7 · SÂU NHẤT TỪ ĐẦU NĂM</Tag>
        <div style={{ background: P.white, borderRadius: 28, padding: 30, boxShadow: "0 18px 44px rgba(0,0,0,0.1)" }}>
          <IndexLine dir="down" />
        </div>
        <div style={{ display: "flex", gap: 34 }}>
          <StatCard label="SO VỚI VÙNG ĐỈNH" value="−250 điểm" color={P.red} at={cardAt[0]} />
          <StatCard label="SO VỚI THÁNG 6" value="−6%" color={P.red} at={cardAt[1]} />
        </div>
      </Col>
    </SiteBG>
  );
};

// S3 — the recovery
export const CkRecover: React.FC<{ cardAt: number[] }> = ({ cardAt }) => {
  const frame = useCurrentFrame();
  const idx = Math.round(interpolate(frame, [cardAt[1], cardAt[1] + 40], [1485, 1735], { ...clamp, easing: ease }));
  return (
    <SiteBG>
      <Col gap={36}>
        <Tag at={2} color={P.green}>
          TUẦN CUỐI THÁNG 7 · BẬT LẠI
        </Tag>
        <div style={{ background: P.white, borderRadius: 28, padding: 30, boxShadow: "0 18px 44px rgba(0,0,0,0.1)" }}>
          <IndexLine dir="up" />
        </div>
        <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
          <StatCard label="VN-INDEX TĂNG" value="+2,95%" color={P.green} at={cardAt[0]} />
          <StatCard label="LẤY LẠI MỐC" value={`${idx.toLocaleString("vi-VN")} điểm`} color={P.green} at={cardAt[1]} />
        </div>
      </Col>
    </SiteBG>
  );
};

// S4 — green sectors
export const CkSectors: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["NGÂN HÀNG", "CÔNG NGHỆ", "THÉP", "BÁN LẺ", "BẤT ĐỘNG SẢN"];
  return (
    <SiteBG>
      <Col gap={30}>
        <Tag at={2} color={P.green}>
          SẮC XANH TRỞ LẠI
        </Tag>
        {items.map((label, i) => (
          <div
            key={label}
            style={{
              background: P.green,
              color: P.white,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 56,
              padding: "24px 60px",
              borderRadius: 999,
              boxShadow: "0 14px 34px rgba(120,180,61,0.35)",
              scale: String(pop(frame, fps, at[i])),
              rotate: `${(i % 2 ? 1 : -1) * 1.5}deg`,
              whiteSpace: "nowrap",
            }}
          >
            ▲ {label}
          </div>
        ))}
      </Col>
    </SiteBG>
  );
};

// S5 — foreign net selling
export const CkForeign: React.FC<{ slowAt: number }> = ({ slowAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = [92, 100, 74, 55, 34];
  return (
    <SiteBG>
      <Col gap={40}>
        <Tag at={2}>KHỐI NGOẠI</Tag>
        <StatCard label="BÁN RÒNG TRÊN HOSE" value="−2.400 tỷ" color={P.red} at={8} />
        <div style={{ background: P.white, borderRadius: 28, padding: "40px 50px", boxShadow: "0 18px 44px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 260 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 90,
                  height: (h / 100) * 260 * Math.min(1, Math.max(0, (frame - 14 - i * 5) / 12)),
                  background: i >= 3 ? "#F5A6A6" : P.red,
                  borderRadius: 12,
                }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 44,
              color: P.green,
              textAlign: "center",
              scale: String(pop(frame, fps, slowAt)),
            }}
          >
            NHƯNG CƯỜNG ĐỘ ĐANG CHẬM LẠI ↘
          </div>
        </div>
      </Col>
    </SiteBG>
  );
};

// S6 — beat
export const CkBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: P.green, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 120,
          color: P.white,
          textAlign: "center",
          lineHeight: 1.2,
          scale: String(pop(frame, fps)),
          textShadow: "0 12px 0 rgba(0,0,0,0.15)",
        }}
      >
        THÁNG 8
        <br />
        CHUYÊN GIA NÓI GÌ?
      </div>
    </AbsoluteFill>
  );
};

// forecast card with range bar
export const CkForecast: React.FC<{
  org: string;
  low: number;
  high: number;
  note?: string;
}> = ({ org, low, high, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = interpolate(frame, [12, 50], [0, 1], { ...clamp, easing: ease });
  const MIN = 1650;
  const MAX = 1830;
  const x = (v: number) => ((v - MIN) / (MAX - MIN)) * 820;
  return (
    <SiteBG>
      <Col gap={44}>
        <Tag at={2} color={P.green}>
          DỰ BÁO · {org}
        </Tag>
        <div
          style={{
            background: P.white,
            borderRadius: 28,
            padding: "50px 60px",
            boxShadow: "0 18px 44px rgba(0,0,0,0.12)",
            scale: String(pop(frame, fps, 6)),
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: P.green, textAlign: "center" }}>
            {low.toLocaleString("vi-VN")} – {high.toLocaleString("vi-VN")}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: P.dark, opacity: 0.65, textAlign: "center" }}>
            ĐIỂM · VN-INDEX
          </div>
          <svg width={820} height={110} viewBox="0 0 820 110" style={{ marginTop: 30 }}>
            <line x1={0} y1={60} x2={820} y2={60} stroke={P.gray} strokeWidth={12} strokeLinecap="round" />
            <line
              x1={x(low)}
              y1={60}
              x2={x(low) + (x(high) - x(low)) * grow}
              y2={60}
              stroke={P.green}
              strokeWidth={22}
              strokeLinecap="round"
            />
            <text x={x(low)} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={P.dark}>
              {low.toLocaleString("vi-VN")}
            </text>
            <text x={x(high)} y={105} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={P.dark}>
              {high.toLocaleString("vi-VN")}
            </text>
          </svg>
        </div>
        {note ? (
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 38,
              color: P.dark,
              opacity: 0.7,
              scale: String(pop(frame, fps, 24)),
            }}
          >
            {note}
          </div>
        ) : null}
      </Col>
    </SiteBG>
  );
};

// MBS probability gauge
export const CkGauge: React.FC<{ badgeAt: number }> = ({ badgeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [10, 70], [0, 0.8], { ...clamp, easing: ease });
  const R = 220;
  const circ = Math.PI * R;
  return (
    <SiteBG>
      <Col gap={40}>
        <Tag at={2} color={P.green}>
          MBS · THỐNG KÊ 6 NĂM
        </Tag>
        <div
          style={{
            background: P.white,
            borderRadius: 28,
            padding: "56px 70px 40px",
            boxShadow: "0 18px 44px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}
        >
          <svg width={560} height={310} viewBox="0 0 560 310">
            <path
              d={`M 60 280 A ${R} ${R} 0 0 1 500 280`}
              stroke={P.gray}
              strokeWidth={44}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M 60 280 A ${R} ${R} 0 0 1 500 280`}
              stroke={P.green}
              strokeWidth={44}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - p)}
            />
            <text x={280} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={P.green}>
              {Math.round(p * 100)}%
            </text>
            <text x={280} y={292} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={P.dark} opacity={0.65}>
              XÁC SUẤT TĂNG ĐIỂM THÁNG 8
            </text>
          </svg>
        </div>
        <div
          style={{
            background: P.green,
            color: P.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 48,
            padding: "22px 48px",
            borderRadius: 999,
            scale: String(pop(frame, fps, badgeAt)),
          }}
        >
          BIÊN ĐỘ BÌNH QUÂN +3,9%
        </div>
      </Col>
    </SiteBG>
  );
};

// S10 — support factors
export const CkSupport: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { big: "P/E ≈ 11,8 lần", small: "ĐỊNH GIÁ HẤP DẪN" },
    { big: "BÁO CÁO QUÝ 2", small: "MÙA CÔNG BỐ KQKD" },
    { big: "BÁN RÒNG HẠ NHIỆT", small: "ÁP LỰC KHỐI NGOẠI GIẢM" },
  ];
  return (
    <SiteBG>
      <Col gap={40}>
        <Tag at={2} color={P.green}>
          ĐIỂM TỰA THÁNG 8
        </Tag>
        {items.map((it, i) => (
          <div
            key={it.big}
            style={{
              background: P.white,
              borderRadius: 24,
              padding: "28px 56px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
              textAlign: "center",
              scale: String(pop(frame, fps, at[i])),
              minWidth: 700,
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: P.dark, opacity: 0.6 }}>
              {it.small}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: P.green }}>{it.big}</div>
          </div>
        ))}
      </Col>
    </SiteBG>
  );
};

// S11 — ending question
export const CkEnd: React.FC<{ questionAt: number }> = ({ questionAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: P.dark }}>
      <Img
        src={staticFile("ck_1.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.3,
          scale: String(interpolate(frame, [0, 220], [1.1, 1.2], clamp)),
        }}
      />
      <Col gap={44}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 88,
            color: P.white,
            textAlign: "center",
            lineHeight: 1.22,
            textShadow: outline(4),
            scale: String(pop(frame, fps, 4)),
            padding: "0 40px",
          }}
        >
          <span style={{ color: P.greenBright }}>HỒI PHỤC</span> —
          <br />
          HAY NHỊP NGHỈ
          <br />
          TRƯỚC <span style={{ color: "#FF5A5A" }}>SÓNG GIÓ?</span>
        </div>
        <div
          style={{
            background: P.green,
            color: P.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 52,
            padding: "24px 54px",
            borderRadius: 999,
            scale: String(pop(frame, fps, questionAt)),
          }}
        >
          BẠN NGHĨ SAO? 💬
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 32,
            color: P.white,
            opacity: interpolate(frame, [questionAt + 16, questionAt + 30], [0, 0.8], clamp),
          }}
        >
          Nguồn: 24h.com.vn · Kinh doanh · 3/8/2026
        </div>
      </Col>
    </AbsoluteFill>
  );
};
