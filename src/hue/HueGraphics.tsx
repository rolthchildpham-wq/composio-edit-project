import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { FONT_BOLD, FONT_SERIF } from "../palette";

export const H = {
  ink: "#0F1114",
  panel: "#1A1E24",
  line: "#2A3038",
  cream: "#EAE3D2",
  dim: "#9A937F",
  gold: "#C9A227",
  goldSoft: "#E3C466",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// slow fade in (and out when total length is known)
export const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 14, len - 12, len], [0, 1, 1, 0], clamp),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const DarkBG: React.FC<{ children?: React.ReactNode; glow?: number }> = ({
  children,
  glow = 0.1,
}) => {
  const frame = useCurrentFrame();
  const flicker = 1 + Math.sin(frame / 17) * 0.08 + Math.sin(frame / 7.3) * 0.04;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% 42%, rgba(201,162,39,${glow * flicker}) 0%, transparent 60%), ${H.ink}`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const GoldStar: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="-110 -110 220 220" style={style}>
    <defs>
      <linearGradient id="gs" x1="0" y1="-1" x2="0" y2="1">
        <stop offset="0" stopColor={H.goldSoft} />
        <stop offset="1" stopColor={H.gold} />
      </linearGradient>
    </defs>
    <path
      d={Array.from({ length: 5 })
        .map((_, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          const b = a + Math.PI / 5;
          return `${i === 0 ? "M" : "L"} ${Math.cos(a) * 100} ${Math.sin(a) * 100} L ${Math.cos(b) * 40} ${Math.sin(b) * 40}`;
        })
        .join(" ") + " Z"}
      fill="url(#gs)"
    />
  </svg>
);

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: FONT_BOLD,
      fontWeight: 800,
      fontSize: 40,
      letterSpacing: 10,
      color: H.dim,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const Serif: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 88,
  color = H.cream,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_SERIF,
      fontWeight: 700,
      fontSize: size,
      color,
      textAlign: "center",
      lineHeight: 1.22,
      ...style,
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

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 44 }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap,
      padding: "0 80px",
    }}
  >
    {children}
  </AbsoluteFill>
);

// ---------- scenes ----------

export const HueHook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DarkBG>
      <Col gap={56}>
        <Rise at={4}>
          <GoldStar size={130} style={{ opacity: 0.95, scale: String(1 + Math.sin(frame / 30) * 0.02) }} />
        </Rise>
        <Rise at={10}>
          <Kicker>HƠN 50 NĂM SAU CHIẾN TRANH</Kicker>
        </Rise>
        <Rise at={18}>
          <Serif size={96}>
            Huế vẫn đang đi tìm
            <br />
            <span style={{ color: H.goldSoft }}>một căn hầm</span>
          </Serif>
        </Rise>
      </Col>
    </DarkBG>
  );
};

export const HueYearPlace: React.FC = () => (
  <DarkBG>
    <Col gap={40}>
      <Rise at={2}>
        <Kicker>SÔNG TRUỒI · XÃ LỘC AN</Kicker>
      </Rise>
      <Rise at={8}>
        <Serif size={200} color={H.goldSoft}>
          1974
        </Serif>
      </Rise>
      <Rise at={14}>
        <Serif size={64} color={H.cream}>
          Tháng 9
        </Serif>
      </Rise>
    </Col>
  </DarkBG>
);

export const HueUnit80: React.FC = () => (
  <DarkBG glow={0.14}>
    <Col gap={36}>
      <Rise at={2}>
        <Serif size={330} color={H.goldSoft} style={{ lineHeight: 1, textShadow: "0 0 90px rgba(201,162,39,0.35)" }}>
          80
        </Serif>
      </Rise>
      <Rise at={10}>
        <Kicker>CHIẾN SĨ BỊ THƯƠNG VÀ HY SINH</Kicker>
      </Rise>
      <Rise at={30}>
        <div
          style={{
            border: `2px solid ${H.line}`,
            borderRadius: 20,
            padding: "26px 46px",
            fontFamily: FONT_BOLD,
            fontWeight: 800,
            fontSize: 40,
            color: H.cream,
            background: H.panel,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Đại đội 5 · Tiểu đoàn 5
          <br />
          Trung đoàn 2 · Sư đoàn 324
        </div>
      </Rise>
    </Col>
  </DarkBG>
);

// bunker cross-section; `collapse` makes the earth cave in
export const HueBunker: React.FC<{ collapse?: boolean }> = ({ collapse }) => {
  const frame = useCurrentFrame();
  const c = collapse
    ? interpolate(frame, [10, 50], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.8, 1) })
    : 0;
  const shake = collapse && frame > 8 && frame < 46 ? Math.sin(frame * 2.7) * (1 - c) * 6 : 0;
  return (
    <DarkBG glow={0.06}>
      <Col gap={50}>
        <svg width={880} height={700} viewBox="0 0 880 700" style={{ translate: `${shake}px 0px` }}>
          {/* earth */}
          <rect x={0} y={200} width={880} height={500} fill={H.panel} />
          <line x1={0} y1={200} x2={880} y2={200} stroke={H.dim} strokeWidth={5} />
          {/* grass ticks */}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={30 + i * 48} y1={200} x2={38 + i * 48} y2={184} stroke={H.dim} strokeWidth={4} />
          ))}
          {/* cavity */}
          <g>
            <path
              d={`M 250 ${560 - 200 * (1 - c)} Q 440 ${360 + 160 * c} 630 ${560 - 200 * (1 - c)} L 630 560 L 250 560 Z`}
              fill={H.ink}
              stroke={H.gold}
              strokeWidth={6}
            />
            {/* figures inside — fade as it collapses */}
            {[330, 400, 470, 540].map((x, i) => (
              <g key={x} opacity={(1 - c) * 0.9}>
                <circle cx={x} cy={490} r={16} fill={H.dim} />
                <rect x={x - 12} y={508} width={24} height={40} rx={10} fill={H.dim} />
              </g>
            ))}
          </g>
          {/* falling debris when collapsing */}
          {collapse
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <rect
                  key={i}
                  x={300 + i * 55}
                  y={230 + c * (180 + i * 18)}
                  width={34 - (i % 3) * 8}
                  height={26}
                  rx={6}
                  fill={H.dim}
                  opacity={c > 0.05 ? 0.8 : 0}
                  transform={`rotate(${i * 23} ${300 + i * 55} ${230 + c * 180})`}
                />
              ))
            : null}
        </svg>
        <Rise at={collapse ? 4 : 12}>
          <Kicker>{collapse ? "BỊ HỎA LỰC ĐÁNH SẬP" : "HẦM TRÚ ẨN"}</Kicker>
        </Rise>
      </Col>
    </DarkBG>
  );
};

export const HueNotFound: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DarkBG glow={0.05}>
      <Col gap={54}>
        <svg width={560} height={560} viewBox="-280 -280 560 560">
          <circle
            r={210}
            fill="none"
            stroke={H.dim}
            strokeWidth={5}
            strokeDasharray="26 20"
            transform={`rotate(${frame * 0.4})`}
          />
          <text
            x={0}
            y={46}
            textAnchor="middle"
            fontFamily={FONT_SERIF}
            fontWeight={700}
            fontSize={230}
            fill={H.goldSoft}
          >
            ?
          </text>
        </svg>
        <Rise at={10}>
          <Serif size={66}>
            Vị trí căn hầm
            <br />
            <span style={{ color: H.goldSoft }}>vẫn chưa được tìm thấy</span>
          </Serif>
        </Rise>
      </Col>
    </DarkBG>
  );
};

export const HueLetter: React.FC = () => {
  return (
    <DarkBG glow={0.08}>
      <Col gap={44}>
        <Rise at={2}>
          <div
            style={{
              background: H.cream,
              borderRadius: 18,
              padding: "70px 74px",
              width: 800,
              boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 84, color: H.ink, textAlign: "center" }}>
              Thư ngỏ
            </div>
            <div
              style={{
                fontFamily: FONT_BOLD,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: 6,
                color: "#6A6455",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              BAN CHỈ ĐẠO TP HUẾ · 6/8
            </div>
            <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 24 }}>
              {["Cựu chiến binh", "Ban liên lạc các đơn vị", "Đồng đội chiến trường Trị Thiên"].map(
                (label, i) => (
                  <Rise key={label} at={30 + i * 26}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 22,
                        fontFamily: FONT_BOLD,
                        fontWeight: 800,
                        fontSize: 42,
                        color: H.ink,
                      }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: 99, background: H.gold }} />
                      {label}
                    </div>
                  </Rise>
                ),
              )}
            </div>
            <GoldStar size={110} style={{ position: "absolute", right: -30, top: -34, rotate: "12deg" }} />
          </div>
        </Rise>
        <Rise at={40}>
          <Kicker>XIN THÔNG TIN NƠI CHÔN CẤT CÁC ANH</Kicker>
        </Rise>
      </Col>
    </DarkBG>
  );
};

export const HueMapPins: React.FC<{ pinAt: number[] }> = ({ pinAt }) => {
  const frame = useCurrentFrame();
  const pins = [
    { x: 260, y: 300, label: "Đèo Phước Tượng" },
    { x: 620, y: 470, label: "Đèo Hải Vân" },
    { x: 400, y: 660, label: "Chân Mây · Lăng Cô" },
  ];
  return (
    <DarkBG glow={0.06}>
      <Col gap={40}>
        <Rise at={2}>
          <Kicker>1968 – 1970 · NHỮNG ĐỊA DANH ĐƯỢC NHẮC ĐẾN</Kicker>
        </Rise>
        <svg width={900} height={820} viewBox="0 0 900 820">
          {/* stylized coastline */}
          <path
            d="M 120 60 Q 260 180 220 340 Q 190 470 340 560 Q 480 640 460 780"
            stroke={H.line}
            strokeWidth={7}
            fill="none"
          />
          <path
            d="M 200 40 Q 360 200 320 380 Q 300 500 460 600 Q 600 690 580 800"
            stroke={H.dim}
            strokeWidth={4}
            strokeDasharray="18 16"
            fill="none"
            opacity={0.6}
          />
          {pins.map((p, i) => {
            const t = interpolate(frame, [pinAt[i], pinAt[i] + 16], [0, 1], { ...clamp, easing: ease });
            return (
              <g key={p.label} opacity={t}>
                <g transform={`translate(${p.x} ${p.y - (1 - t) * 60})`}>
                  <path d="M 0 0 C -30 -46 -30 -78 0 -92 C 30 -78 30 -46 0 0 Z" fill={H.gold} />
                  <circle cx={0} cy={-64} r={13} fill={H.ink} />
                </g>
                <text
                  x={p.x + 40}
                  y={p.y - 30}
                  fontFamily={FONT_BOLD}
                  fontWeight={800}
                  fontSize={40}
                  fill={H.cream}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </Col>
    </DarkBG>
  );
};

export const HueSurvey: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [6, 80], [0, 1], clamp);
  return (
    <DarkBG glow={0.05}>
      <Col gap={54}>
        <svg width={860} height={420} viewBox="0 0 860 420">
          <path
            d="M 60 340 Q 220 120 400 260 Q 560 380 800 120"
            stroke={H.dim}
            strokeWidth={7}
            strokeDasharray="24 20"
            fill="none"
            strokeDashoffset={1100 - 1100 * draw}
            pathLength={1100}
          />
          <circle
            cx={800}
            cy={120}
            r={30}
            fill="none"
            stroke={H.gold}
            strokeWidth={7}
            opacity={draw > 0.95 ? 1 : 0}
          />
        </svg>
        <Rise at={16}>
          <Serif size={64}>
            Nhiều cuộc khảo sát —
            <br />
            <span style={{ color: H.goldSoft }}>vẫn chưa tìm thấy</span>
          </Serif>
        </Rise>
      </Col>
    </DarkBG>
  );
};

export const Hue500: React.FC = () => (
  <DarkBG glow={0.1}>
    <Col gap={30}>
      <Rise at={2}>
        <Kicker>CHIẾN DỊCH</Kicker>
      </Rise>
      <Rise at={8}>
        <Serif size={240} color={H.goldSoft} style={{ lineHeight: 1 }}>
          500
        </Serif>
      </Rise>
      <Rise at={14}>
        <Serif size={80}>ngày đêm</Serif>
      </Rise>
      <Rise at={26}>
        <Kicker>TÌM KIẾM · QUY TẬP · XÁC ĐỊNH DANH TÍNH</Kicker>
      </Rise>
    </Col>
  </DarkBG>
);

export const HueMauThan: React.FC = () => (
  <DarkBG glow={0.08}>
    <Col gap={40}>
      <Rise at={2}>
        <Serif size={120} color={H.goldSoft}>
          Mậu Thân 1968
        </Serif>
      </Rise>
      <Rise at={14}>
        <div
          style={{
            border: `2px solid ${H.line}`,
            background: H.panel,
            borderRadius: 20,
            padding: "30px 52px",
            fontFamily: FONT_BOLD,
            fontWeight: 800,
            fontSize: 44,
            color: H.cream,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Trung đoàn 6 Phú Xuân
          <br />
          giữ thành phố <span style={{ color: H.goldSoft }}>26 ngày đêm</span>
        </div>
      </Rise>
    </Col>
  </DarkBG>
);

export const HueDepth: React.FC<{ artifactAt: number }> = ({ artifactAt }) => {
  const frame = useCurrentFrame();
  const dig = interpolate(frame, [8, 50], [0, 1], { ...clamp, easing: ease });
  return (
    <DarkBG glow={0.06}>
      <Col gap={44}>
        <Rise at={2}>
          <Kicker>GA HƯƠNG THỦY</Kicker>
        </Rise>
        <svg width={860} height={520} viewBox="0 0 860 520">
          <rect x={0} y={120} width={860} height={400} fill={H.panel} />
          <line x1={0} y1={120} x2={860} y2={120} stroke={H.dim} strokeWidth={5} />
          {/* depth ruler */}
          <line x1={150} y1={120} x2={150} y2={120 + 280 * dig} stroke={H.gold} strokeWidth={6} />
          <line x1={120} y1={120 + 280 * dig} x2={180} y2={120 + 280 * dig} stroke={H.gold} strokeWidth={6} />
          <text
            x={210}
            y={135 + 280 * dig}
            fontFamily={FONT_SERIF}
            fontWeight={700}
            fontSize={76}
            fill={H.goldSoft}
            opacity={dig > 0.9 ? 1 : 0.35}
          >
            50 cm
          </text>
          {/* remains marker */}
          <g opacity={dig > 0.95 ? 1 : 0}>
            <GoldStarSvg x={520} y={400} r={40} />
          </g>
        </svg>
        <Rise at={artifactAt}>
          <div
            style={{
              border: `2px solid ${H.line}`,
              background: H.panel,
              borderRadius: 18,
              padding: "24px 46px",
              fontFamily: FONT_BOLD,
              fontWeight: 800,
              fontSize: 42,
              color: H.cream,
            }}
          >
            Di vật: tấm tăng · ống thở <span style={{ color: H.goldSoft }}>22 cm</span>
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};

const GoldStarSvg: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <path
    transform={`translate(${x} ${y}) scale(${r / 100})`}
    d={
      Array.from({ length: 5 })
        .map((_, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          const b = a + Math.PI / 5;
          return `${i === 0 ? "M" : "L"} ${Math.cos(a) * 100} ${Math.sin(a) * 100} L ${Math.cos(b) * 40} ${Math.sin(b) * 40}`;
        })
        .join(" ") + " Z"
    }
    fill={H.gold}
  />
);

export const HueRemember: React.FC<{ lineAt: number[] }> = ({ lineAt }) => {
  const lines = ["Ai đó có thể còn nhớ.", "Một địa danh.", "Một trận đánh.", "Một căn hầm bên sông Truồi."];
  return (
    <DarkBG glow={0.07}>
      <Col gap={54}>
        {lines.map((l, i) => (
          <Rise key={l} at={lineAt[i]}>
            <Serif size={i === 3 ? 84 : 70} color={i === 3 ? H.goldSoft : H.cream}>
              {l}
            </Serif>
          </Rise>
        ))}
      </Col>
    </DarkBG>
  );
};

export const HueEnding: React.FC<{ creditAt: number }> = ({ creditAt }) => {
  const frame = useCurrentFrame();
  return (
    <DarkBG glow={0.14}>
      <Col gap={52}>
        <Rise at={4}>
          <GoldStar size={170} style={{ scale: String(1 + Math.sin(frame / 26) * 0.02) }} />
        </Rise>
        <Rise at={14}>
          <Serif size={82}>
            Để 80 người lính năm ấy
            <br />
            <span style={{ color: H.goldSoft }}>được trở về</span>
          </Serif>
        </Rise>
        <Rise at={30}>
          <Kicker>CÓ THÔNG TIN · XIN LIÊN HỆ CHÍNH QUYỀN TP HUẾ</Kicker>
        </Rise>
        <Rise at={creditAt}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 30, color: H.dim, letterSpacing: 3 }}>
            Nguồn: VnExpress · Võ Thạnh · 6/8/2026
          </div>
        </Rise>
      </Col>
    </DarkBG>
  );
};
