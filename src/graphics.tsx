import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT_BOLD, FONT_SERIF } from "./palette";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const springIn = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });

// ---------- shared ----------

export const CreamBG: React.FC<{ children?: React.ReactNode; circles?: boolean }> = ({
  children,
  circles,
}) => (
  <AbsoluteFill
    style={{
      background: C.cream,
      backgroundImage: circles
        ? `radial-gradient(circle at 50% 45%, transparent 258px, rgba(42,64,52,0.08) 260px, transparent 262px),
           radial-gradient(circle at 50% 45%, transparent 388px, rgba(42,64,52,0.07) 390px, transparent 392px)`
        : `linear-gradient(rgba(42,64,52,0.05) 1px, transparent 1px),
           linear-gradient(90deg, rgba(42,64,52,0.05) 1px, transparent 1px)`,
      backgroundSize: circles ? "100% 100%" : "72px 72px",
      overflow: "hidden",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Asterisk: React.FC<{
  size: number;
  petals?: number;
  eye?: boolean;
  style?: React.CSSProperties;
}> = ({ size, petals = 10, eye, style }) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={style}>
    <defs>
      <linearGradient id="ag" x1="0" y1="-1" x2="0" y2="1">
        <stop offset="0" stopColor={C.orangeG2} />
        <stop offset="1" stopColor={C.orangeG1} />
      </linearGradient>
    </defs>
    {Array.from({ length: petals }).map((_, i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-55}
        rx={20}
        ry={48}
        fill="url(#ag)"
        transform={`rotate(${(360 / petals) * i})`}
      />
    ))}
    <circle r={26} fill={C.orange} />
    {eye ? (
      <>
        <circle r={16} fill={C.white} />
        <circle r={8} fill={C.black} />
      </>
    ) : null}
  </svg>
);

const GreenCard: React.FC<{
  children: React.ReactNode;
  w?: number | string;
  style?: React.CSSProperties;
}> = ({ children, w, style }) => (
  <div
    style={{
      background: C.green,
      color: C.white,
      borderRadius: 40,
      padding: "48px 64px",
      width: w,
      boxShadow: "0 26px 60px rgba(42,64,52,0.35)",
      fontFamily: FONT_BOLD,
      fontWeight: 900,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 40 }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ---------- scenes ----------

// 0:00 Title card (serif)
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={28}>
        <Asterisk
          size={140}
          eye
          style={{ rotate: `${frame * 0.6}deg`, scale: String(springIn(frame, fps, 2)) }}
        />
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 700,
            fontSize: 68,
            color: C.green,
            textAlign: "center",
            lineHeight: 1.18,
            padding: "0 56px",
            opacity: interpolate(frame, [0, 9], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [0, 9], [30, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
          }}
        >
          Marketing không cứu được
          <br />
          <span style={{ color: C.orange }}>sản phẩm tầm thường</span>
        </div>
      </Center>
    </CreamBG>
  );
};

// 0:04.7 Megaphone with sound waves
export const Megaphone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center>
        <svg
          width={620}
          height={480}
          viewBox="0 0 620 480"
          style={{ scale: String(springIn(frame, fps)), rotate: "-8deg" }}
        >
          <rect x={40} y={200} width={110} height={120} rx={24} fill={C.green} />
          <polygon points="150,190 400,90 400,430 150,330" fill={C.orange} />
          <ellipse cx={400} cy={260} rx={36} ry={170} fill={C.orangeG1} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${460 + i * 55} ${200 - i * 24} A ${90 + i * 55} ${90 + i * 55} 0 0 1 ${460 + i * 55} ${320 + i * 24}`}
              stroke={C.green}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
              opacity={interpolate((frame - i * 5) % 30, [0, 8, 22, 30], [0, 1, 1, 0])}
            />
          ))}
        </svg>
      </Center>
    </CreamBG>
  );
};

// 0:08 "LẦN 2" card crossed out (cross draws at `crossAt` local frames)
export const CardCrossed: React.FC<{ crossAt: number }> = ({ crossAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cross = springIn(frame, fps, crossAt);
  return (
    <CreamBG>
      <Center>
        <div style={{ position: "relative", scale: String(springIn(frame, fps)) }}>
          <GreenCard>
            <div style={{ fontSize: 96 }}>LẦN 2</div>
            <div style={{ fontSize: 40, color: C.mint, marginTop: 8 }}>KHÁCH CÓ QUAY LẠI?</div>
          </GreenCard>
          <svg
            width={520}
            height={330}
            viewBox="0 0 520 330"
            style={{ position: "absolute", left: -40, top: -40, scale: String(cross) }}
          >
            <line x1={40} y1={40} x2={480} y2={290} stroke={C.orange} strokeWidth={34} strokeLinecap="round" />
            <line x1={480} y1={40} x2={40} y2={290} stroke={C.orange} strokeWidth={34} strokeLinecap="round" />
          </svg>
        </div>
      </Center>
    </CreamBG>
  );
};

// 0:11.1 declining chart
export const ChartDown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [4, 40], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.4, 1) });
  return (
    <CreamBG>
      <Center gap={30}>
        <GreenCard style={{ scale: String(springIn(frame, fps)), padding: "40px 50px" }}>
          <svg width={560} height={340} viewBox="0 0 560 340">
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={0} y1={40 + i * 84} x2={560} y2={40 + i * 84} stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
            ))}
            <path
              d="M 20 60 L 150 120 L 260 100 L 380 220 L 540 310"
              stroke={C.orange}
              strokeWidth={16}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={900}
              strokeDashoffset={900 - 900 * draw}
            />
            <circle cx={540} cy={310} r={20} fill={C.orange} opacity={draw > 0.98 ? 1 : 0} />
          </svg>
          <div style={{ fontSize: 46, marginTop: 10 }}>DOANH NGHIỆP CHẾT</div>
        </GreenCard>
      </Center>
    </CreamBG>
  );
};

// 0:24.1 asterisk radiating (amplification)
export const AsteriskBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG circles>
      <Center gap={30}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: 999,
              border: `10px solid ${C.orange}`,
              opacity: interpolate((frame - i * 12) % 26, [0, 20, 26], [0.6, 0, 0]),
              scale: String(1 + (((frame - i * 12) % 26) / 26) * 2.6),
            }}
          />
        ))}
        <Asterisk size={430} eye style={{ rotate: `${frame * 1.2}deg`, scale: String(springIn(frame, fps)) }} />
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 66, color: C.green }}>
          KHUẾCH ĐẠI
        </div>
      </Center>
    </CreamBG>
  );
};

const TrashBin: React.FC<{ size?: number }> = ({ size = 300 }) => (
  <svg width={size} height={size * 1.13} viewBox="0 0 300 340">
    <rect x={60} y={90} width={180} height={230} rx={26} fill={C.green} />
    <rect x={40} y={58} width={220} height={36} rx={18} fill={C.green} />
    <rect x={115} y={30} width={70} height={30} rx={14} fill={C.green} />
    {[105, 150, 195].map((x) => (
      <line key={x} x1={x} y1={130} x2={x} y2={280} stroke={C.cream} strokeWidth={12} strokeLinecap="round" opacity={0.5} />
    ))}
  </svg>
);

// 0:26 trash + megaphone pointing at it
export const TrashMegaphone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={0}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, scale: String(springIn(frame, fps)) }}>
          <svg width={300} height={240} viewBox="0 0 620 480" style={{ rotate: "12deg" }}>
            <rect x={40} y={200} width={110} height={120} rx={24} fill={C.green} />
            <polygon points="150,190 400,90 400,430 150,330" fill={C.orange} />
            <ellipse cx={400} cy={260} rx={36} ry={170} fill={C.orangeG1} />
          </svg>
          <div style={{ rotate: `${Math.sin(frame / 6) * 2}deg` }}>
            <TrashBin />
          </div>
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 60, color: C.green, marginTop: 26 }}>
          QUẢNG CÁO CHO... RÁC?
        </div>
      </Center>
    </CreamBG>
  );
};

// 0:32 magnifier over "GIÁ TRỊ"
export const Magnifier: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = Math.sin(frame / 14) * 26;
  return (
    <CreamBG circles>
      <Center>
        <GreenCard style={{ scale: String(springIn(frame, fps)) }}>
          <div style={{ fontSize: 88 }}>GIÁ TRỊ</div>
          <div style={{ fontSize: 40, color: C.mint, marginTop: 6 }}>ĐÃ CÓ SẴN</div>
        </GreenCard>
        <svg
          width={420}
          height={420}
          viewBox="0 0 420 420"
          style={{ position: "absolute", translate: `${120 + drift}px -40px`, scale: String(springIn(frame, fps, 5)) }}
        >
          <circle cx={170} cy={170} r={130} fill="rgba(255,154,108,0.18)" stroke={C.orange} strokeWidth={26} />
          <line x1={266} y1={266} x2={385} y2={385} stroke={C.orange} strokeWidth={44} strokeLinecap="round" />
        </svg>
      </Center>
    </CreamBG>
  );
};

// 0:36.2 sandcastle sinking
export const Sandcastle: React.FC = () => {
  const frame = useCurrentFrame();
  const sink = interpolate(frame, [10, 85], [0, 55], { ...clamp, easing: Easing.bezier(0.4, 0, 0.6, 1) });
  return (
    <CreamBG>
      <Center gap={20}>
        <svg width={640} height={520} viewBox="0 0 640 520">
          <g transform={`translate(0 ${sink}) rotate(${sink / 12} 320 300)`}>
            <rect x={220} y={180} width={200} height={180} rx={12} fill={C.orangeG1} />
            <rect x={170} y={230} width={80} height={130} rx={10} fill={C.orangeG2} />
            <rect x={390} y={230} width={80} height={130} rx={10} fill={C.orangeG2} />
            {[240, 300, 360].map((x) => (
              <polygon key={x} points={`${x},180 ${x + 20},140 ${x + 40},180`} fill={C.green} />
            ))}
            <polygon points="330,140 330,96 386,116" fill={C.orange} />
            <line x1={330} y1={140} x2={330} y2={96} stroke={C.green} strokeWidth={8} />
          </g>
          <ellipse cx={320} cy={420} rx={300} ry={70} fill="#DCCFB4" />
          <path d="M 60 420 Q 320 470 580 420" stroke={C.green} strokeWidth={8} strokeDasharray="20 16" fill="none" opacity={0.5} />
        </svg>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 58, color: C.green }}>
          LÂU ĐÀI TRÊN NỀN ĐẤT YẾU
        </div>
      </Center>
    </CreamBG>
  );
};

// 0:39.4 "Best marketer" card gets stamped ✕
export const MarketerCard: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = springIn(frame, fps, stampAt);
  return (
    <CreamBG>
      <Center>
        <div style={{ position: "relative", scale: String(springIn(frame, fps)) }}>
          <GreenCard>
            <div style={{ fontSize: 56, lineHeight: 1.2 }}>
              MARKETER GIỎI NHẤT
              <br />
              THẾ GIỚI
            </div>
          </GreenCard>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              scale: String(interpolate(stamp, [0, 1], [3, 1])),
              opacity: stamp > 0.02 ? 1 : 0,
              rotate: "-12deg",
            }}
          >
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 230, color: C.orange, textShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
              ✕
            </div>
          </div>
        </div>
      </Center>
    </CreamBG>
  );
};

// 0:44 formula badges (3 orange pills, sequential)
export const FormulaBadges: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["SẢN PHẨM TỐT", "TRẢI NGHIỆM THẬT", "MARKETING KHUẾCH ĐẠI"];
  return (
    <CreamBG circles>
      <Center gap={36}>
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 64, color: C.green }}>
          Công thức thật sự
        </div>
        {items.map((label, i) => (
          <div
            key={label}
            style={{
              background: C.orange,
              color: C.white,
              fontFamily: FONT_BOLD,
              fontWeight: 900,
              fontSize: 58,
              padding: "30px 64px",
              borderRadius: 999,
              boxShadow: "0 18px 44px rgba(240,128,80,0.4)",
              scale: String(springIn(frame, fps, at[i])),
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        ))}
      </Center>
    </CreamBG>
  );
};

// 0:48.2 shining product box
export const ProductShine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={26}>
        <svg width={560} height={440} viewBox="0 0 560 440" style={{ scale: String(springIn(frame, fps)) }}>
          <g transform={`rotate(${frame * 0.5} 280 200)`} opacity={0.5}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1={280}
                y1={200}
                x2={280 + Math.cos((i / 12) * Math.PI * 2) * 260}
                y2={200 + Math.sin((i / 12) * Math.PI * 2) * 260}
                stroke={C.orangeG2}
                strokeWidth={10}
                strokeLinecap="round"
              />
            ))}
          </g>
          <rect x={160} y={120} width={240} height={200} rx={22} fill={C.green} />
          <rect x={160} y={120} width={240} height={54} rx={22} fill={C.orange} />
          <rect x={262} y={120} width={36} height={200} fill={C.orangeG2} />
        </svg>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 58, color: C.green }}>
          SẢN PHẨM TỐT TỰ SỐNG
        </div>
      </Center>
    </CreamBG>
  );
};

// 0:55 two cards — first purchase vs repeat purchase
export const TwoCards: React.FC<{ secondAt: number }> = ({ secondAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={44}>
        <GreenCard style={{ scale: String(springIn(frame, fps)), rotate: "-2deg" }}>
          <div style={{ fontSize: 46, color: C.mint }}>MUA LẦN ĐẦU</div>
          <div style={{ fontSize: 70, color: C.orange }}>= MARKETING</div>
        </GreenCard>
        <GreenCard style={{ scale: String(springIn(frame, fps, secondAt)), rotate: "2deg" }}>
          <div style={{ fontSize: 46, color: C.mint }}>MUA LẦN HAI</div>
          <div style={{ fontSize: 70, color: C.orange }}>= SẢN PHẨM</div>
        </GreenCard>
      </Center>
    </CreamBG>
  );
};

// 0:20.9 fake ads-manager dashboard (spend counting up)
export const DashAds: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spend = Math.floor(interpolate(frame, [5, 80], [12_000_000, 347_000_000], clamp) / 1_000_000);
  const rows = [
    ["CHIẾN DỊCH SALE 10.10", 62],
    ["VIDEO VIRAL #3", 84],
    ["RETARGETING T10", 47],
  ] as const;
  return (
    <AbsoluteFill style={{ background: C.cream, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 940,
          borderRadius: 36,
          background: C.green,
          padding: 54,
          boxShadow: "0 30px 70px rgba(42,64,52,0.4)",
          fontFamily: FONT_BOLD,
          color: C.white,
          scale: String(springIn(frame, fps)),
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.7 }}>TRÌNH QUẢN LÝ QUẢNG CÁO</div>
        <div style={{ fontSize: 54, marginTop: 14 }}>Số tiền đã chi tiêu</div>
        <div style={{ fontSize: 130, color: C.orange, fontWeight: 900, margin: "6px 0 30px" }}>
          {spend} triệu ₫
        </div>
        {rows.map(([label, pct], i) => (
          <div key={label} style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.85 }}>{label}</div>
            <div style={{ height: 30, borderRadius: 999, background: "rgba(255,255,255,0.15)" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: i === 1 ? C.orange : C.orangeG2,
                  width: `${pct * interpolate(frame, [10 + i * 6, 46 + i * 6], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 1:01.4 cost rising vs retention flat
export const DashRetention: React.FC<{ circleAt: number }> = ({ circleAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [6, 60], [0, 1], clamp);
  const ring = springIn(frame, fps, circleAt);
  return (
    <AbsoluteFill style={{ background: C.cream, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 940,
          borderRadius: 36,
          background: C.white,
          padding: 54,
          boxShadow: "0 30px 70px rgba(42,64,52,0.25)",
          fontFamily: FONT_BOLD,
          scale: String(springIn(frame, fps)),
        }}
      >
        <div style={{ fontSize: 44, color: C.green, fontWeight: 900 }}>CHI PHÍ ADS vs KHÁCH QUAY LẠI</div>
        <svg width={830} height={430} viewBox="0 0 830 430" style={{ marginTop: 20 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={0} y1={40 + i * 88} x2={830} y2={40 + i * 88} stroke="rgba(42,64,52,0.1)" strokeWidth={2} />
          ))}
          <path
            d="M 20 380 L 180 320 L 360 300 L 560 170 L 800 60"
            stroke={C.orange}
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={1000}
            strokeDashoffset={1000 - 1000 * draw}
          />
          <path
            d="M 20 400 L 250 396 L 480 402 L 800 398"
            stroke={C.green}
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={1000}
            strokeDashoffset={1000 - 1000 * draw}
          />
          <circle cx={740} cy={398} r={64} fill="none" stroke={C.orange} strokeWidth={14} opacity={ring} scale={1} />
          <text x={20} y={36} fontSize={34} fill={C.orange} fontWeight={900}>CHI PHÍ ↑</text>
          <text x={560} y={370} fontSize={34} fill={C.green} fontWeight={900}>QUAY LẠI = 0</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// 1:08.5 balance scale — "LÀM TỐT" wins
export const BalanceScale: React.FC<{ tiltAt: number }> = ({ tiltAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tilt = springIn(frame, fps, tiltAt) * 10;
  const pan = (label: string, hot: boolean) => (
    <div
      style={{
        background: hot ? C.orange : C.green,
        color: C.white,
        fontFamily: FONT_BOLD,
        fontWeight: 900,
        fontSize: 44,
        padding: "22px 38px",
        borderRadius: 26,
        boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
  return (
    <CreamBG>
      <Center gap={0}>
        <div style={{ position: "relative", width: 860, height: 560, scale: String(springIn(frame, fps)) }}>
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 150,
              height: 22,
              borderRadius: 999,
              background: C.green,
              rotate: `${-tilt}deg`,
            }}
          />
          <div style={{ position: "absolute", left: "50%", top: 140, translate: "-50% 0", width: 26, height: 300, background: C.green, borderRadius: 12 }} />
          <div style={{ position: "absolute", left: "50%", top: 430, translate: "-50% 0", width: 300, height: 30, background: C.green, borderRadius: 999 }} />
          <div style={{ position: "absolute", left: 40, top: 40, translate: `0px ${tilt * 6}px` }}>{pan("BÁN NHANH", false)}</div>
          <div style={{ position: "absolute", right: 40, top: 40, translate: `0px ${-tilt * 6}px` }}>{pan("LÀM TỐT", true)}</div>
        </div>
      </Center>
    </CreamBG>
  );
};

// 1:17.3 −50%
export const Discount50: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG circles>
      <Center gap={20}>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 320,
            color: C.orange,
            lineHeight: 1,
            scale: String(springIn(frame, fps)),
            textShadow: "0 24px 60px rgba(240,128,80,0.4)",
          }}
        >
          −50%
        </div>
        <GreenCard style={{ scale: String(springIn(frame, fps, 5)) }}>
          <div style={{ fontSize: 56 }}>CHI PHÍ MARKETING</div>
        </GreenCard>
      </Center>
    </CreamBG>
  );
};

// 1:20.5 loyalty loop
export const LoyaltyLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = 250;
  return (
    <CreamBG>
      <Center gap={30}>
        <div style={{ position: "relative", width: 640, height: 640, scale: String(springIn(frame, fps)) }}>
          <svg width={640} height={640} viewBox="0 0 640 640" style={{ position: "absolute" }}>
            <circle cx={320} cy={320} r={R} fill="none" stroke={C.green} strokeWidth={8} strokeDasharray="24 20" opacity={0.55} />
          </svg>
          <Asterisk size={240} eye style={{ position: "absolute", left: 200, top: 200, rotate: `${frame}deg` }} />
          {[0, 1, 2, 3].map((i) => {
            const a = (frame / 40) * Math.PI * 2 * 0.35 + (i * Math.PI) / 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 320 + Math.cos(a) * R - 34,
                  top: 320 + Math.sin(a) * R - 34,
                  width: 68,
                  height: 68,
                  borderRadius: 999,
                  background: i % 2 ? C.pink : C.mint,
                  border: `6px solid ${C.black}`,
                }}
              />
            );
          })}
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 56, color: C.green }}>
          KHÁCH TRUNG THÀNH = MARKETING RẺ NHẤT
        </div>
      </Center>
    </CreamBG>
  );
};

// 1:23.3 / 1:26.9 formula cards
export const FormulaCard: React.FC<{ bad?: boolean }> = ({ bad }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={30}>
        <GreenCard style={{ scale: String(springIn(frame, fps)), rotate: bad ? "2deg" : "-2deg" }}>
          <div style={{ fontSize: 70 }}>{bad ? "SẢN PHẨM TỆ" : "SẢN PHẨM TỐT"}</div>
          <div style={{ fontSize: 58, color: C.orange, marginTop: 14 }}>
            {bad ? "= MARKETING ĐỐT TIỀN" : "= MARKETING TỰ ĐỘNG"}
          </div>
        </GreenCard>
        {bad ? (
          <svg width={300} height={190} viewBox="0 0 300 190">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M ${80 + i * 70} 180 Q ${60 + i * 70} 110 ${90 + i * 70} ${70 + Math.sin((frame + i * 8) / 4) * 18} Q ${110 + i * 70} 120 ${100 + i * 70} 180 Z`}
                fill={i % 2 ? C.orange : C.orangeG2}
              />
            ))}
          </svg>
        ) : (
          <Asterisk size={170} style={{ rotate: `${frame * 0.8}deg` }} />
        )}
      </Center>
    </CreamBG>
  );
};

// 1:29.5 question mark
export const QuestionMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG circles>
      <Center>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 500,
            color: C.orange,
            scale: String(springIn(frame, fps)),
            rotate: `${Math.sin(frame / 9) * 4}deg`,
            textShadow: "0 30px 70px rgba(240,128,80,0.35)",
          }}
        >
          ?
        </div>
      </Center>
    </CreamBG>
  );
};

// 1:39.1 glitter trash — still trash
export const GlitterTrash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={26}>
        <div style={{ position: "relative", scale: String(springIn(frame, fps)) }}>
          <TrashBin size={340} />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const tw = interpolate(((frame + i * 4) % 24), [0, 12, 24], [0.2, 1, 0.2]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 170 + Math.cos(a) * 210,
                  top: 190 + Math.sin(a) * 200,
                  fontSize: 52,
                  opacity: tw,
                  scale: String(0.6 + tw * 0.6),
                }}
              >
                ✦
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 58, color: C.green }}>
          ĐÁNH BÓNG... VẪN LÀ RÁC
        </div>
      </Center>
    </CreamBG>
  );
};

// 1:41.7 asterisk embracing the product
export const AsteriskProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG circles>
      <Center gap={0}>
        <Asterisk size={560} style={{ position: "absolute", opacity: 0.9, rotate: `${frame * 0.7}deg` }} />
        <GreenCard style={{ scale: String(springIn(frame, fps, 4)) }}>
          <div style={{ fontSize: 76 }}>SẢN PHẨM</div>
          <div style={{ fontSize: 44, color: C.mint, marginTop: 6 }}>ĐÁNG ĐỂ KHUẾCH ĐẠI</div>
        </GreenCard>
      </Center>
    </CreamBG>
  );
};

// End card
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CreamBG>
      <Center gap={24}>
        <Asterisk size={300} eye style={{ scale: String(springIn(frame, fps)), rotate: `${frame * 2}deg` }} />
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 60, color: C.green }}>
          Sản phẩm tốt trước. Marketing sau.
        </div>
      </Center>
    </CreamBG>
  );
};

// flash frames
export const FlashOrange: React.FC<{ text?: string }> = ({ text }) => (
  <AbsoluteFill
    style={{
      background: C.orange,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {text ? (
      <div
        style={{
          fontFamily: FONT_BOLD,
          fontWeight: 900,
          fontSize: 260,
          color: C.white,
          textShadow: "0 14px 0 rgba(0,0,0,0.2)",
        }}
      >
        {text}
      </div>
    ) : null}
  </AbsoluteFill>
);

// "NỔI BẬT ≠ TỒN TẠI" slide-in card (over talking head)
export const SlideCard: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn(frame, fps, at);
  return (
    <div
      style={{
        position: "absolute",
        top: 180,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        translate: `0px ${interpolate(p, [0, 1], [-260, 0])}px`,
        opacity: p,
      }}
    >
      <GreenCard>
        <div style={{ fontSize: 62 }}>
          NỔI BẬT <span style={{ color: C.orange }}>≠</span> TỒN TẠI
        </div>
      </GreenCard>
    </div>
  );
};
