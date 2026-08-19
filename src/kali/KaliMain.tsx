import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { FONT_BOLD } from "../palette";
import { kaliChunks } from "./kaliChunks";
import { Music, Sfx } from "../lib/audio";

// agri-sales palette (sampled from the product photo: green shirt, blue/red bag)
const K = {
  greenDark: "#0E5A2F",
  green: "#17813F",
  cream: "#FFF9EC",
  yellow: "#FFD34D",
  red: "#E53935",
  blue: "#1D4ED8",
  white: "#FFFFFF",
  ink: "#123319",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 160 } });

const outline = (px: number) => {
  const s: string[] = [];
  for (let dx = -px; dx <= px; dx += px / 2)
    for (let dy = -px; dy <= px; dy += px / 2)
      if (dx || dy) s.push(`${dx}px ${dy}px 0 ${K.ink}`);
  s.push(`0px ${px + 3}px 8px rgba(0,0,0,0.45)`);
  return s.join(", ");
};

const GreenBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 100% 60% at 50% 30%, rgba(255,211,77,0.14) 0%, transparent 60%),
        linear-gradient(170deg, ${K.green} 0%, ${K.greenDark} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 34 }) => (
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

const Chip: React.FC<{ children: React.ReactNode; at: number; color?: string; fg?: string; size?: number }> = ({
  children,
  at,
  color = K.cream,
  fg = K.ink,
  size = 52,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: color,
        color: fg,
        fontFamily: FONT_BOLD,
        fontWeight: 900,
        fontSize: size,
        padding: "22px 48px",
        borderRadius: 999,
        boxShadow: "0 14px 34px rgba(0,0,0,0.3)",
        scale: String(pop(frame, fps, at)),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

const Product: React.FC<{ h: number; delay?: number }> = ({ h, delay = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        height: h,
        aspectRatio: "606/1069",
        borderRadius: 28,
        overflow: "hidden",
        border: `6px solid ${K.yellow}`,
        boxShadow: "0 34px 80px rgba(0,0,0,0.5)",
        scale: String(pop(frame, fps, delay)),
        position: "relative",
      }}
    >
      <Img
        src={staticFile("kali_product.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(interpolate(frame, [0, 200], [1.0, 1.08], clamp)),
        }}
      />
    </div>
  );
};

// S1 — hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GreenBG>
      <Col gap={30}>
        <Chip at={2} color={K.yellow}>
          VIỆT TRANH ĐỀ
        </Chip>
        <Product h={900} />
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 88,
            color: K.white,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow: outline(4),
            opacity: interpolate(frame, [8, 20], [0, 1], clamp),
          }}
        >
          KALI SULPHATE <span style={{ color: K.yellow }}>ÁO</span>
        </div>
      </Col>
    </GreenBG>
  );
};

// S2 — specs + dual benefit
const Dual: React.FC<{ specAt: number[]; at: number[] }> = ({ specAt, at }) => (
  <GreenBG>
    <Col gap={30}>
      <div style={{ display: "flex", gap: 24 }}>
        <Chip at={specAt[0]} color={K.blue} fg={K.white} size={56}>
          52% K₂O
        </Chip>
        <Chip at={specAt[1]} color={K.blue} fg={K.white} size={56}>
          45% SO₃
        </Chip>
      </div>
      <Chip at={at[0]} size={58}>
        🍈 NUÔI TRÁI
      </Chip>
      <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 60, color: K.yellow, textShadow: outline(4) }}>
        +
      </div>
      <Chip at={at[1]} size={58}>
        🧪 BỔ SUNG LƯU HUỲNH
      </Chip>
      <Chip at={at[2]} color={K.red} fg={K.white} size={54}>
        TRONG 1 LẦN BÓN
      </Chip>
    </Col>
  </GreenBG>
);

// S3 — 100% soluble
const Soluble: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GreenBG>
      <Col gap={30}>
        <div style={{ position: "relative", width: 420, height: 460 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 210 - 90,
                top: 240 - 90,
                width: 180,
                height: 180,
                borderRadius: 999,
                border: `8px solid ${K.white}`,
                opacity: interpolate(((frame - i * 10) % 32) / 32, [0, 0.7, 1], [0.7, 0.1, 0]),
                scale: String(1 + (((frame - i * 10) % 32) / 32) * 1.6),
              }}
            />
          ))}
          <svg width={420} height={460} viewBox="0 0 420 460">
            <path d="M 210 40 C 130 160 90 220 90 300 A 120 120 0 0 0 330 300 C 330 220 290 160 210 40 Z" fill={K.blue} opacity={0.9} />
            <text x={210} y={330} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={80} fill={K.white}>
              100%
            </text>
          </svg>
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 80, color: K.white, textShadow: outline(4) }}>
          TAN TRONG NƯỚC
        </div>
        <Chip at={48} color={K.cream}>
          ✅ KHÔNG TẮC BÉC TƯỚI
        </Chip>
      </Col>
    </GreenBG>
  );
};

// S4 — no chlorine + crops
const Crops: React.FC<{ noAt: number[]; cropAt: number[] }> = ({ noAt, cropAt }) => {
  const crops = ["🍈 SẦU RIÊNG", "🍊 BƯỞI", "🥭 XOÀI", "🐉 THANH LONG"];
  return (
    <GreenBG>
      <Col gap={28}>
        <div style={{ display: "flex", gap: 26 }}>
          <Chip at={noAt[0]} color={K.red} fg={K.white} size={46}>
            ✕ KHÔNG CLO
          </Chip>
          <Chip at={noAt[1]} color={K.red} fg={K.white} size={46}>
            ✕ KHÔNG CHUA ĐẤT
          </Chip>
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 54, color: K.yellow, textShadow: outline(3), margin: "10px 0" }}>
          YÊN TÂM DÙNG CHO
        </div>
        {crops.map((c, i) => (
          <Chip key={c} at={cropAt[i]} size={56}>
            {c}
          </Chip>
        ))}
      </Col>
    </GreenBG>
  );
};

// S5 — fruit benefits
const Benefits: React.FC<{ at: number[] }> = ({ at }) => (
  <GreenBG>
    <Col gap={30}>
      <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 60, color: K.white, textShadow: outline(4) }}>
        BÓN ĐÚNG GIAI ĐOẠN NUÔI TRÁI
      </div>
      {["🎨 TRÁI LÊN MÀU ĐẸP", "💪 CƠM CHẮC", "🍯 NGỌT HƠN"].map((b, i) => (
        <Chip key={b} at={at[i]} size={58}>
          {b}
        </Chip>
      ))}
      <Chip at={at[3]} color={K.yellow} size={64}>
        💰 BÁN GIÁ CAO HƠN
      </Chip>
    </Col>
  </GreenBG>
);

// S6 — promo
const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${K.red} 0%, #A81F1C 100%)` }}>
      <Col gap={30}>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 150,
            color: K.white,
            textAlign: "center",
            lineHeight: 1.05,
            scale: String(pop(frame, fps, 2)),
            textShadow: "0 14px 0 rgba(0,0,0,0.25)",
          }}
        >
          MUA 2<br />
          <span style={{ color: K.yellow }}>TẶNG 1</span>
        </div>
        <Chip at={14} color={K.cream} size={50}>
          🎁 1 chai phân hữu cơ lỏng Mỹ
        </Chip>
      </Col>
    </AbsoluteFill>
  );
};

// S7 — CTA
const Cta: React.FC<{ at: number[] }> = ({ at }) => (
  <GreenBG>
    <Col gap={32}>
      <Product h={720} delay={2} />
      <Chip at={at[0]} size={46}>
        🚚 GIAO TẬN NƠI
      </Chip>
      <Chip at={at[1]} size={46}>
        💵 NHẬN HÀNG MỚI TRẢ TIỀN
      </Chip>
      <Chip at={at[2]} color={K.yellow} size={58}>
        ĐẶT NGAY HÔM NAY!
      </Chip>
    </Col>
  </GreenBG>
);

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // hook headline already shows these words
  if (t < 3.5) return null;
  const chunk = kaliChunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const n = chunk.words.length;
  const hi = Math.min(n - 1, Math.floor(((t - chunk.start) / (chunk.end - chunk.start)) * n));
  const localF = (t - chunk.start) * fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "80%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 22,
        scale: String(0.9 + 0.1 * Math.min(1, localF / 3)),
        pointerEvents: "none",
      }}
    >
      {chunk.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 64,
            color: i === hi ? K.yellow : K.white,
            textShadow: outline(5),
            whiteSpace: "nowrap",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

export const KaliMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: K.greenDark }}>
      <Sc a={0} b={3.5}>
        <Hook />
      </Sc>
      {/* 52% K2O ~4.6, 45% SO3 ~5.9; nuôi trái ~6.6, lưu huỳnh ~8.2, 1 lần bón ~9.3 */}
      <Sc a={3.5} b={10.3}>
        <Dual
          specAt={[f(4.5 - 3.5), f(5.8 - 3.5)]}
          at={[f(6.5 - 3.5), f(8.1 - 3.5), f(9.2 - 3.5)]}
        />
      </Sc>
      {/* "không tắc béc" ~11.9 */}
      <Sc a={10.3} b={13.5}>
        <Soluble />
      </Sc>
      {/* clo ~14.1, chua đất ~15.2; crops 17.5 / 18.3 / 18.9 / 19.3 */}
      <Sc a={13.5} b={20.0}>
        <Crops
          noAt={[f(14.0 - 13.5), f(15.1 - 13.5)]}
          cropAt={[f(17.4 - 13.5), f(18.2 - 13.5), f(18.8 - 13.5), f(19.2 - 13.5)]}
        />
      </Sc>
      {/* màu đẹp ~22.5, cơm chắc ~23.2, ngọt ~23.8, giá cao ~24.8 */}
      <Sc a={20.0} b={25.6}>
        <Benefits at={[f(22.4 - 20.0), f(23.1 - 20.0), f(23.7 - 20.0), f(24.7 - 20.0)]} />
      </Sc>
      <Sc a={25.6} b={28.6}>
        <Promo />
      </Sc>
      {/* giao ~29.2, thanh toán ~30.0 */}
      <Sc a={28.6} b={34.8}>
        <Cta at={[f(29.1 - 28.6), f(29.9 - 28.6), f(31.4 - 28.6)]} />
      </Sc>

      <Captions />

      <Audio src={staticFile("kali_voice.mp3")} />
      {/* nhạc nền tự bật khi có file trong public/music/quang-cao/ (npm run scan-music) */}
      <Music mood="quang-cao" volume={0.09} />
      {/* SFX tiết chế: vào promo → chuông quà tặng → vụt CTA */}
      <Sfx name="whoosh" at={25.55} volume={0.45} />
      <Sfx name="ding" at={26.0} volume={0.5} />
      <Sfx name="whip" at={31.35} volume={0.4} />
    </AbsoluteFill>
  );
};
