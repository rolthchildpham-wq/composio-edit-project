import React from "react";
import {
  AbsoluteFill,

  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { FONT_BOLD } from "../palette";
import { rtChunks } from "./rtChunks";
import { Music, Sfx } from "../lib/audio";

// style "review-tool": talking head + nền lưới caro + mockup iPhone + emoji
const RT = {
  paper: "#F4F4F2",
  grid: "rgba(30,30,30,0.10)",
  ink: "#1A1A1A",
  orange: "#FF8C1A",
  yellow: "#FFD34D",
  white: "#FFFFFF",
  phone: "#F97316",
};

const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 160 } });

const outline = (px: number) => {
  const s: string[] = [];
  for (let dx = -px; dx <= px; dx += px / 2)
    for (let dy = -px; dy <= px; dy += px / 2)
      if (dx || dy) s.push(`${dx}px ${dy}px 0 #000`);
  s.push(`0px ${px + 3}px 8px rgba(0,0,0,0.4)`);
  return s.join(", ");
};

// nền giấy kẻ ô caro (đúng nền của video kết quả)
const GridBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: RT.paper,
      backgroundImage: `linear-gradient(${RT.grid} 2px, transparent 2px), linear-gradient(90deg, ${RT.grid} 2px, transparent 2px)`,
      backgroundSize: "108px 108px",
    }}
  >
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.10) 100%)" }} />
    {children}
  </AbsoluteFill>
);

// talking head: full hoặc khung tròn nhỏ (thay cho cutout)
const Head: React.FC<{ mode: "full" | "bubble"; trimBefore: number; x?: number; y?: number; size?: number }> = ({
  mode,
  trimBefore,
  x = 60,
  y = 1180,
  size = 420,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (mode === "full") {
    return (
      <AbsoluteFill style={{ background: "#111" }}>
        <Video muted trimBefore={trimBefore} src={staticFile("rt_src.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 36,
        overflow: "hidden",
        border: `8px solid ${RT.ink}`,
        boxShadow: "0 20px 46px rgba(0,0,0,0.35)",
        scale: String(pop(frame, fps, 4)),
        background: "#111",
      }}
    >
      <Video
        muted
        trimBefore={trimBefore}
        src={staticFile("rt_src.mp4")}
        style={{ position: "absolute", width: size * 2.2, height: (size * 2.2 * 16) / 9, left: -size * 0.6, top: -size * 0.88 }}
      />
    </div>
  );
};

// mockup iPhone với UI bên trong
const Phone: React.FC<{ children: React.ReactNode; x: number; y?: number; w?: number; at?: number; rot?: number }> = ({
  children,
  x,
  y = 200,
  w = 560,
  at = 4,
  rot = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = (w * 19.5) / 9;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: w * 0.16,
        background: "#0B0B0D",
        border: `10px solid ${RT.phone}`,
        boxShadow: "0 34px 80px rgba(0,0,0,0.45)",
        overflow: "hidden",
        scale: String(pop(frame, fps, at)),
        rotate: `${rot}deg`,
      }}
    >
      {/* tai thỏ */}
      <div style={{ position: "absolute", top: 14, left: "50%", translate: "-50% 0", width: w * 0.35, height: 26, borderRadius: 14, background: "#000", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: 0, padding: `${w * 0.12}px ${w * 0.05}px ${w * 0.05}px` }}>{children}</div>
    </div>
  );
};

// emoji lớn trên nền lưới
const BigEmoji: React.FC<{ e: string; x: number; y: number; at?: number; size?: number }> = ({ e, x, y, at = 6, size = 260 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: x, top: y, fontSize: size, scale: String(pop(frame, fps, at)), rotate: `${Math.sin(frame / 16) * 4}deg` }}>
      {e}
    </div>
  );
};

const ChipRt: React.FC<{ children: React.ReactNode; at: number; x: number; y: number; rot?: number; hot?: boolean }> = ({
  children,
  at,
  x,
  y,
  rot = 0,
  hot,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        background: hot ? RT.orange : RT.white,
        color: hot ? "#fff" : RT.ink,
        border: `6px solid ${RT.ink}`,
        borderRadius: 20,
        padding: "18px 36px",
        fontFamily: FONT_BOLD,
        fontWeight: 900,
        fontSize: 44,
        rotate: `${rot}deg`,
        boxShadow: "0 12px 26px rgba(0,0,0,0.25)",
        scale: String(pop(frame, fps, at)),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// phụ đề karaoke: trắng + highlight vàng-cam (đúng video kết quả)
const RtCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = rtChunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const n = chunk.words.length;
  const hi = Math.min(n - 1, Math.floor(((t - chunk.start) / (chunk.end - chunk.start)) * n));
  const localF = (t - chunk.start) * fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "76%",
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
            fontSize: 68,
            color: i === hi ? RT.yellow : RT.white,
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

const WaveBar: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 14, borderRadius: 6, background: RT.orange, height: 16 + Math.abs(Math.sin(frame / 4 + i * 0.6)) * 70, border: `3px solid ${RT.ink}` }} />
  );
};

export const RtMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: RT.paper }}>
      {/* S1: hook — talking head full + title overlay */}
      <Sc a={0} b={6.9}>
        <Head mode="full" trimBefore={0} />
        <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 66, lineHeight: 1.2, textShadow: outline(5) }}>
            <span style={{ color: RT.orange, background: "#fff", padding: "4px 18px", borderRadius: 12, textShadow: "none" }}>TOP</span>{" "}
            <span style={{ color: "#fff" }}>NHỮNG CÔNG CỤ AI</span>
            <br />
            <span style={{ color: RT.yellow }}>BẠN NÊN BIẾT SỚM HƠN</span>
          </div>
        </div>
      </Sc>

      {/* S2: nền lưới + emoji + head bubble — "thử biến thành bài hát quảng cáo" */}
      <Sc a={6.9} b={11.1}>
        <GridBG>
          <BigEmoji e="🤔" x={380} y={330} at={4} size={300} />
          <BigEmoji e="🎵" x={640} y={700} at={f(8.6 - 6.9)} size={200} />
          <ChipRt at={f(8.2 - 6.9)} x={190} y={1000} rot={-2} hot>
            BÀI HÁT QUẢNG CÁO?
          </ChipRt>
          <Head mode="bubble" trimBefore={f(6.9)} x={600} y={1180} />
        </GridBG>
      </Sc>

      {/* S3: screen recording desktop Suno THẬT trong khung browser */}
      <Sc a={11.1} b={15.5}>
        <GridBG>
          <div style={{ position: "absolute", left: 40, top: 420, width: 1000, borderRadius: 22, overflow: "hidden", border: `8px solid ${RT.ink}`, boxShadow: "0 24px 56px rgba(0,0,0,0.35)", background: "#111" }}>
            <div style={{ background: "#1E1E24", padding: "12px 18px", display: "flex", gap: 9 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c }} />
              ))}
            </div>
            <Video muted trimBefore={f(2)} src={staticFile("rt_desktop.mp4")} style={{ width: "100%", display: "block" }} />
          </div>
          <ChipRt at={f(14.3 - 11.1)} x={130} y={330} rot={-4} hot>
            SUNO
          </ChipRt>
          <Head mode="bubble" trimBefore={f(11.1)} x={620} y={1260} size={380} />
        </GridBG>
      </Sc>

      {/* S4: 2 phone library — "dùng làm nhạc video affiliate/livestream/ads" */}
      <Sc a={15.5} b={20.5}>
        <GridBG>
          <Phone x={110} y={210} w={470} at={2} rot={-3}>
            <Video muted trimBefore={f(6)} src={staticFile("rt_phone1.mp4")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </Phone>
          <Phone x={560} y={330} w={470} at={10} rot={3}>
            <Video muted trimBefore={f(2)} src={staticFile("rt_phone2.mp4")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </Phone>
          <ChipRt at={f(17.5 - 15.5)} x={120} y={1240} rot={-2}>
            🎬 VIDEO AFFILIATE
          </ChipRt>
          <ChipRt at={f(18.6 - 15.5)} x={520} y={1330} rot={2}>
            🔴 LIVESTREAM
          </ChipRt>
          <ChipRt at={f(19.4 - 15.5)} x={260} y={1425} rot={-1} hot>
            📣 QUẢNG CÁO
          </ChipRt>
        </GridBG>
      </Sc>

      {/* S5: head full — "nghe xong là nhớ ngay" */}
      <Sc a={20.5} b={23.0}>
        <Head mode="full" trimBefore={f(20.5)} />
      </Sc>

      {/* S6: ĐOẠN NHẠC DEMO SUNO — bằng chứng sống */}
      <Sc a={23.0} b={33.0}>
        <AbsoluteFill style={{ background: RT.paper }}>
          <Video muted loop src={staticFile("rt_grid.mp4")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
          <Phone x={300} y={230} w={480} at={4}>
            <Video muted trimBefore={f(20)} src={staticFile("rt_phone1.mp4")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </Phone>
          <ChipRt at={8} x={230} y={150} rot={-2} hot>
            🎧 BÀI HÁT DEMO TẠO BỞI SUNO
          </ChipRt>
          <div style={{ position: "absolute", left: 0, bottom: 420, width: "100%", display: "flex", justifyContent: "center", gap: 6, alignItems: "flex-end", height: 90 }}>
            {Array.from({ length: 32 }).map((_, i) => (
              <WaveBar key={i} i={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Sc>

      {/* S7: CTA — head full + chips (voice gốc tiếp tục sau đoạn nhạc) */}
      <Sc a={33.0} b={41.2}>
        <Head mode="full" trimBefore={f(23.0)} />
        <ChipRt at={f(35.5 - 33.0)} x={110} y={260} rot={-2}>
          📤 GỬI CHO ĐỨA BẠN BÍ CONTENT
        </ChipRt>
        <ChipRt at={f(37.3 - 33.0)} x={180} y={390} rot={1.5} hot>
          💬 COMMENT TÊN SẢN PHẨM + 3 CÔNG DỤNG
        </ChipRt>
        <ChipRt at={f(39.0 - 33.0)} x={300} y={520} rot={-1}>
          🎁 TẶNG 1 BÀI BẤT KỲ
        </ChipRt>
      </Sc>

      <RtCaptions />

      {/* audio: voice gốc tách 2 khúc quanh đoạn nhạc demo */}
      <Sequence from={0} durationInFrames={f(23.0)} layout="none">
        <Audio src={staticFile("rt_src.mp4")} trimAfter={f(23.0)} />
      </Sequence>
      <Sequence from={f(33.0)} layout="none">
        <Audio src={staticFile("rt_src.mp4")} trimBefore={f(23.0)} />
      </Sequence>
      <Sequence from={f(22.6)} durationInFrames={f(11.0)} layout="none">
        <Audio
          src={staticFile("rt_song.mp3")}
          trimBefore={f(14)}
          volume={(fr) => Math.min(1, fr / 15) * (fr > f(9.6) ? Math.max(0, 1 - (fr - f(9.6)) / 24) : 1) * 0.9}
        />
      </Sequence>
      <Music mood="soi-dong" volume={0.05} />
      <Sfx name="pop" at={11.2} volume={0.4} />
      <Sfx name="thong-bao" at={15.6} volume={0.4} />
      <Sfx name="ding" at={27.35} volume={0.45} />
    </AbsoluteFill>
  );
};
