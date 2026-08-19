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

// black + gold theme (nguyentatkiem.com brand, sampled from the article cover)
export const G = {
  bg: "#0B0A08",
  card: "#1A160E",
  line: "#3A3020",
  gold: "#F5C542",
  goldSoft: "#FFDE8A",
  white: "#FFF7E8",
  gray: "#9A9080",
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

export const GoldBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 95% 55% at 50% 34%, rgba(245,197,66,0.10) 0%, transparent 62%), ${G.bg}`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
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

const GoldTag: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${G.goldSoft}, ${G.gold})`,
        color: "#241C05",
        fontFamily: FONT_BOLD,
        fontWeight: 900,
        fontSize: 42,
        letterSpacing: 3,
        padding: "16px 40px",
        borderRadius: 999,
        boxShadow: "0 12px 34px rgba(245,197,66,0.3)",
        scale: String(pop(frame, fps, at)),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode; at?: number; style?: React.CSSProperties }> = ({
  children,
  at = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: G.card,
        border: `3px solid ${G.line}`,
        borderRadius: 24,
        padding: "28px 48px",
        scale: String(pop(frame, fps, at)),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// S1 — hook with the article cover
export const RwHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <GoldBG>
      <Col gap={40}>
        <GoldTag>REVIEW CÔNG CỤ AI</GoldTag>
        <div
          style={{
            width: 960,
            height: 540,
            borderRadius: 26,
            overflow: "hidden",
            border: `3px solid ${G.line}`,
            boxShadow: "0 34px 80px rgba(0,0,0,0.7)",
            position: "relative",
            scale: String(pop(frame, fps, 6)),
          }}
        >
          <Img
            src={staticFile("rw_cover.jpg")}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(interpolate(frame, [0, 240], [1.0, 1.08], clamp)),
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 92,
            color: G.white,
            textAlign: "center",
            lineHeight: 1.15,
            opacity: interpolate(frame, [10, 24], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [10, 24], [40, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          RUNWAY AI —
          <br />
          <span style={{ color: G.gold }}>CHUẨN MỰC 2026?</span>
        </div>
      </Col>
    </GoldBG>
  );
};

// S2 — text→video / image→video
export const RwHowItWorks: React.FC<{ rowAt: number[] }> = ({ rowAt }) => {
  const row = (from: string, at: number) => (
    <Card at={at} style={{ minWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 58, color: G.white }}>{from}</div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 64, color: G.gold }}>→</div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 58, color: G.goldSoft }}>🎬 VIDEO</div>
      </div>
    </Card>
  );
  return (
    <GoldBG>
      <Col gap={44}>
        <GoldTag>RUNWAY LÀM ĐƯỢC GÌ?</GoldTag>
        {row("⌨️ GÕ MÔ TẢ", rowAt[0])}
        {row("🖼️ MỘT TẤM ẢNH", rowAt[1])}
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 38, color: G.gray }}>
          tạo + chỉnh sửa video bằng AI
        </div>
      </Col>
    </GoldBG>
  );
};

// S3 — character consistency
export const RwConsistency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <GoldBG>
      <Col gap={44}>
        <GoldTag>ĐIỂM ĂN TIỀN NHẤT</GoldTag>
        <div style={{ display: "flex", gap: 26 }}>
          {["CẢNH 1", "CẢNH 2", "CẢNH 3"].map((label, i) => (
            <div
              key={label}
              style={{
                width: 290,
                height: 360,
                borderRadius: 22,
                background: G.card,
                border: `3px solid ${i === 1 ? G.gold : G.line}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 18,
                scale: String(pop(frame, fps, 6 + i * 8)),
              }}
            >
              <svg width={150} height={150} viewBox="-75 -75 150 150">
                <circle r={70} fill="#2A2416" />
                <circle cy={-14} r={26} fill={G.gold} />
                <path d="M -44 58 Q 0 6 44 58 Z" fill={G.gold} />
              </svg>
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 32, color: G.gray }}>{label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 54,
            color: G.white,
            textAlign: "center",
            lineHeight: 1.3,
            scale: String(pop(frame, fps, 30)),
          }}
        >
          NHÂN VẬT <span style={{ color: G.gold }}>KHÔNG BIẾN DẠNG</span>
          <br />
          QUA NHIỀU CẢNH
        </div>
      </Col>
    </GoldBG>
  );
};

// S4 — backers + valuation counter
export const RwBackers: React.FC<{ valAt: number; lionAt: number }> = ({ valAt, lionAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const val = interpolate(frame, [valAt, valAt + 30], [0, 1.5], { ...clamp, easing: ease });
  return (
    <GoldBG>
      <Col gap={38}>
        <GoldTag>AI CHỐNG LƯNG?</GoldTag>
        <div style={{ display: "flex", gap: 24 }}>
          {["Google", "NVIDIA", "Salesforce"].map((n, i) => (
            <Card key={n} at={6 + i * 6} style={{ padding: "22px 40px" }}>
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 44, color: G.white }}>{n}</div>
            </Card>
          ))}
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 170, color: G.gold, lineHeight: 1, scale: String(pop(frame, fps, valAt)) }}>
          {val.toFixed(1).replace(".", ",")} TỶ $
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 38, color: G.gray }}>định giá (2024)</div>
        <Card at={lionAt} style={{ borderColor: G.gold }}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 42, color: G.white, textAlign: "center" }}>
            🎬 Lionsgate dùng cho <span style={{ color: G.goldSoft }}>tiền kỳ & kỹ xảo</span>
          </div>
        </Card>
      </Col>
    </GoldBG>
  );
};

// S5 — three models
export const RwModels: React.FC<{ at: number[] }> = ({ at }) => {
  const models = [
    { name: "GEN-4.5", note: "MẠNH NHẤT", hot: true },
    { name: "GEN-4", note: "CÂN BẰNG", hot: false },
    { name: "GEN-4 TURBO", note: "RẺ · TẠO NHANH", hot: false },
  ];
  return (
    <GoldBG>
      <Col gap={36}>
        <GoldTag>3 MODEL TẠO VIDEO</GoldTag>
        {models.map((m, i) => (
          <Card key={m.name} at={at[i]} style={{ minWidth: 760, borderColor: m.hot ? G.gold : G.line }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40 }}>
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 66, color: m.hot ? G.gold : G.white }}>
                {m.name}
              </div>
              <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 36, color: G.gray }}>{m.note}</div>
            </div>
          </Card>
        ))}
      </Col>
    </GoldBG>
  );
};

// S6 — the tool set
export const RwTools: React.FC<{ at: number[] }> = ({ at }) => {
  const tools = [
    { name: "ACT-ONE", note: "bắt diễn xuất từ mặt bạn → nhân vật AI" },
    { name: "MOTION BRUSH", note: "tô vùng nào cần chuyển động" },
    { name: "ALEPH", note: "đổi ánh sáng · xóa vật thể" },
    { name: "LIP SYNC + 4K", note: "khớp khẩu hình · nâng phân giải" },
  ];
  return (
    <GoldBG>
      <Col gap={30}>
        <GoldTag>DÀN CÔNG CỤ ĐÁNG TIỀN</GoldTag>
        {tools.map((tl, i) => (
          <Card key={tl.name} at={at[i]} style={{ minWidth: 860 }}>
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 56, color: G.gold }}>{tl.name}</div>
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 36, color: G.white, marginTop: 6 }}>
              {tl.note}
            </div>
          </Card>
        ))}
      </Col>
    </GoldBG>
  );
};

// S7 — 5-layer prompt formula
export const RwPrompt: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layers = ["CHỦ THỂ", "HÀNH ĐỘNG", "BỐI CẢNH", "GÓC MÁY + ÁNH SÁNG", "PHONG CÁCH"];
  return (
    <GoldBG>
      <Col gap={26}>
        <GoldTag>CÔNG THỨC PROMPT 5 LỚP</GoldTag>
        {layers.map((l, i) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              scale: String(pop(frame, fps, at[i])),
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                background: `linear-gradient(180deg, ${G.goldSoft}, ${G.gold})`,
                color: "#241C05",
                fontFamily: FONT_BOLD,
                fontWeight: 900,
                fontSize: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                background: G.card,
                border: `3px solid ${G.line}`,
                borderRadius: 999,
                padding: "20px 46px",
                fontFamily: FONT_BOLD,
                fontWeight: 900,
                fontSize: 46,
                color: G.white,
                minWidth: 640,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </Col>
    </GoldBG>
  );
};

// S8 — limitations
export const RwLimits: React.FC<{ at: number[] }> = ({ at }) => {
  const items = [
    { big: "5–10 GIÂY / CLIP", note: "muốn dài phải ghép nhiều clip" },
    { big: "KHÔNG ÂM THANH GỐC", note: "tự thêm nhạc + tiếng ở hậu kỳ" },
    { big: "25 CREDITS / GIÂY", note: "Gen-4.5 · làm nhiều là đau ví" },
  ];
  return (
    <GoldBG>
      <Col gap={34}>
        <GoldTag>⚠ 3 GIỚI HẠN CẦN BIẾT</GoldTag>
        {items.map((it, i) => (
          <Card key={it.big} at={at[i]} style={{ minWidth: 840, borderColor: "#7A5A1A" }}>
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 58, color: G.goldSoft }}>{it.big}</div>
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 36, color: G.gray, marginTop: 6 }}>
              {it.note}
            </div>
          </Card>
        ))}
      </Col>
    </GoldBG>
  );
};

// S9 — free plan
export const RwFree: React.FC<{ chipAt: number[]; verdictAt: number }> = ({ chipAt, verdictAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <GoldBG>
      <Col gap={36}>
        <GoldTag>BẢN FREE ĐƯỢC GÌ?</GoldTag>
        <Card at={4} style={{ borderColor: G.gold, padding: "44px 70px" }}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 110, color: G.gold, textAlign: "center", lineHeight: 1.1 }}>
            125 CREDITS
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 52, color: G.white, textAlign: "center", marginTop: 8 }}>
            ≈ 25 giây video Gen-4
          </div>
        </Card>
        <div style={{ display: "flex", gap: 26 }}>
          {["💧 WATERMARK", "📺 720P"].map((c, i) => (
            <div
              key={c}
              style={{
                background: G.card,
                border: `3px solid ${G.line}`,
                borderRadius: 999,
                padding: "18px 40px",
                fontFamily: FONT_BOLD,
                fontWeight: 900,
                fontSize: 42,
                color: G.gray,
                scale: String(pop(frame, fps, chipAt[i])),
              }}
            >
              {c}
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 52,
            color: G.white,
            textAlign: "center",
            scale: String(pop(frame, fps, verdictAt)),
          }}
        >
          ĐỦ ĐỂ <span style={{ color: G.goldSoft }}>THỬ</span> — KHÔNG ĐỦ <span style={{ color: G.gold }}>LÀM THẬT</span>
        </div>
      </Col>
    </GoldBG>
  );
};

// S10 — verdict Runway vs Veo
export const RwVerdict: React.FC<{ veoAt: number }> = ({ veoAt }) => {
  return (
    <GoldBG>
      <Col gap={40}>
        <GoldTag>CHỐT NHANH</GoldTag>
        <Card at={6} style={{ borderColor: G.gold, minWidth: 860 }}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 38, color: G.gray }}>
            MẠCH TRUYỆN NHIỀU CẢNH
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 84, color: G.gold }}>→ RUNWAY</div>
        </Card>
        <Card at={veoAt} style={{ minWidth: 860 }}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 38, color: G.gray }}>
            MỘT CLIP ĐƠN THẬT MƯỢT
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 84, color: G.white }}>→ VEO</div>
        </Card>
      </Col>
    </GoldBG>
  );
};

// S11 — ending
export const RwEnd: React.FC<{ creditAt: number }> = ({ creditAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <GoldBG>
      <Col gap={40}>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 88,
            color: G.white,
            textAlign: "center",
            lineHeight: 1.2,
            scale: String(pop(frame, fps, 4)),
          }}
        >
          HƯỚNG DẪN <span style={{ color: G.gold }}>ĐẦY ĐỦ</span>
          <br />
          TRONG BÀI VIẾT
        </div>
        <GoldTag at={14}>NGUYENTATKIEM.COM</GoldTag>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 700,
            fontSize: 34,
            color: G.gray,
            opacity: interpolate(frame, [creditAt, creditAt + 14], [0, 1], clamp),
          }}
        >
          Nguồn: Mentor Nguyễn Tất Kiểm · Scale Mentor
        </div>
      </Col>
    </GoldBG>
  );
};
