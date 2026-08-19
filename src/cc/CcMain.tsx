import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { ccChunks } from "./ccChunks";
import { Music, Sfx } from "../lib/audio";
import {
  Palette,
  TplBeat,
  TplBG,
  TplCaptions,
  TplChip,
  TplChipList,
  TplEnd,
  TplHook,
  TplStat,
  TplTag,
  TplVs,
} from "../lib/templates";

// palette "AI": navy tối + neon cyan
export const AI: Palette = {
  bg: "#070B14",
  card: "#101828",
  line: "#1E2A44",
  accent: "#22D3EE",
  accentSoft: "#7DE9FF",
  onAccent: "#04121A",
  text: "#EAF6FF",
  sub: "#7E93B8",
  glowRGBA: "34,211,238",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// cảnh đặc thù duy nhất: cửa sổ terminal với file .map bị bỏ quên
const TerminalScene: React.FC<{ keyAt: number }> = ({ keyAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = [
    { text: "$ npm install -g claude-code", dim: true },
    { text: "├── cli.js            2.1 MB", dim: true },
    { text: "├── package.json      4 KB", dim: true },
    { text: "└── cli.js.map        ⚠ 41 MB", dim: false },
  ];
  return (
    <TplBG p={AI}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 36, padding: "0 60px" }}>
        <TplTag p={AI}>31/3/2026 · GÓI NPM</TplTag>
        <div
          style={{
            width: 920,
            borderRadius: 22,
            background: "#0A0F1E",
            border: `3px solid ${AI.line}`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
            overflow: "hidden",
            scale: String(spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 150 } })),
          }}
        >
          <div style={{ background: AI.card, padding: "18px 26px", display: "flex", gap: 12 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
            ))}
          </div>
          <div style={{ padding: "30px 40px", fontFamily: "monospace" }}>
            {lines.map((l, i) => {
              const at = 10 + i * 12;
              return (
                <div
                  key={l.text}
                  style={{
                    fontSize: 40,
                    lineHeight: 1.75,
                    color: l.dim ? AI.sub : "#FFB454",
                    fontWeight: l.dim ? 400 : 700,
                    opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
                  }}
                >
                  {l.text}
                </div>
              );
            })}
          </div>
        </div>
        <TplChip p={AI} at={keyAt} hot size={46}>
          🔑 khóa nhà — quên chìa ngay trên ổ
        </TplChip>
      </AbsoluteFill>
    </TplBG>
  );
};

export const CcMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: AI.bg }}>
      <Sc a={0} b={6.8}>
        <TplHook
          p={AI}
          tag="SỰ CỐ AI"
          img="cc_cover.jpg"
          title={
            <>
              LỘ <span style={{ color: AI.accentSoft }}>512.000 DÒNG CODE</span>
              <br />
              KHÔNG PHẢI HACKER
            </>
          }
        />
      </Sc>
      {/* "khóa nhà quên chìa" ~15.8 */}
      <Sc a={6.8} b={19.1}>
        <TerminalScene keyAt={f(15.6 - 6.8)} />
      </Sc>
      {/* 512.000 ~21.0, 1.900 file ~23.0 */}
      <Sc a={19.1} b={24.6}>
        <TplStat
          p={AI}
          kicker="CHỈ VÀI GIỜ SAU"
          to={512000}
          suffix="DÒNG"
          note="TypeScript · 1.900 file"
          noteAt={f(22.8 - 19.1)}
          startAt={f(20.6 - 19.1)}
        />
      </Sc>
      {/* 25.000 sao ~27.4, trending ~28.9 */}
      <Sc a={24.6} b={30.5}>
        <TplChipList
          p={AI}
          tag="TÁI TẠO & ĐĂNG LÊN GITHUB"
          items={[
            { label: "⭐ 25.000 SAO", at: f(27.2 - 24.6), hot: true },
            { label: "📈 TRENDING #1 TOÀN CẦU", at: f(28.7 - 24.6) },
          ]}
        />
      </Sc>
      <Sc a={30.5} b={34.2}>
        <TplBeat p={AI}>
          DEVELOPER
          <br />
          MỔ XẺ CODE 🔍
        </TplBeat>
      </Sc>
      {/* memory ~36.3, 187 verbs ~40.5, lọc 25 từ ~43.8, system prompt ~46.5 */}
      <Sc a={34.2} b={49.7}>
        <TplChipList
          p={AI}
          tag="PHÁT HIỆN TỪ 512K DÒNG CODE"
          items={[
            { label: "🧠 MEMORY = CHỈ MỤC 150 KÝ TỰ", at: f(36.1 - 34.2) },
            { label: "😜 187 SPINNER VERBS", at: f(40.3 - 34.2) },
            { label: "🚫 LỌC 25 TỪ THÔ CHO ID", at: f(43.6 - 34.2) },
            { label: "📄 SYSTEM PROMPT Ở MÁY BẠN", at: f(46.3 - 34.2), hot: true },
          ]}
        />
      </Sc>
      {/* nghịch lý ~54 */}
      <Sc a={49.7} b={59.2}>
        <TplVs
          p={AI}
          tag="NGHỊCH LÝ"
          winner={{ name: "1 FILE .MAP", note: "ĐÁNH BẠI" }}
          rivals={[{ name: "TRĂM TRIỆU $ BẢO MẬT", note: "CÔNG TY AI 'AN TOÀN NHẤT THẾ GIỚI'", at: f(53.8 - 49.7) }]}
        />
      </Sc>
      {/* lỗi con người ~60.8, gỡ trong ngày ~62.5, undo ~65.8 */}
      <Sc a={59.2} b={67.0}>
        <TplChipList
          p={AI}
          tag="ANTHROPIC PHẢN HỒI"
          items={[
            { label: "🙋 XÁC NHẬN: LỖI CON NGƯỜI", at: f(60.6 - 59.2) },
            { label: "🧹 GỠ FILE TRONG NGÀY", at: f(62.3 - 59.2) },
            { label: "❌ NHƯNG KHÔNG CÓ NÚT UNDO", at: f(65.4 - 59.2), hot: true },
          ]}
        />
      </Sc>
      <Sc a={67.0} b={73.1}>
        <TplBeat p={AI}>
          BẢO MẬT =<br />
          QUY TRÌNH ĐÚNG
        </TplBeat>
      </Sc>
      <Sc a={73.1} b={79.5}>
        <TplEnd
          p={AI}
          title={
            <>
              PHÂN TÍCH <span style={{ color: AI.accent }}>ĐẦY ĐỦ</span>
              <br />
              TRONG BÀI VIẾT
            </>
          }
          chips={[{ label: "NGUYENTATKIEM.COM", at: 16 }]}
          credit="Nguồn: Mentor Nguyễn Tất Kiểm · Scale Mentor"
          creditAt={30}
        />
      </Sc>

      <TplCaptions p={AI} chunks={ccChunks} fontSize={62} />

      <Audio src={staticFile("cc_voice.mp3")} />
      <Music mood="corporate" volume={0.08} />
      <Sfx name="thong-bao" at={20.4} volume={0.45} />
      <Sfx name="whoosh" at={30.45} volume={0.45} />
      <Sfx name="whip" at={66.95} volume={0.4} />
    </AbsoluteFill>
  );
};
