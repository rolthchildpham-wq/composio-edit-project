import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { FONT_BOLD } from "../palette";
import { rwChunks } from "./rwChunks";
import {
  G,
  outlineDark,
  RwBackers,
  RwConsistency,
  RwEnd,
  RwFree,
  RwHook,
  RwHowItWorks,
  RwLimits,
  RwModels,
  RwPrompt,
  RwTools,
  RwVerdict,
} from "./RwGraphics";

const RwCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = rwChunks.find((c) => t >= c.start && t < c.end);
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
            color: i === hi ? G.gold : G.white,
            textShadow: outlineDark(5),
            whiteSpace: "nowrap",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

export const RwMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: G.bg }}>
      <Sc a={0} b={8.4}>
        <RwHook />
      </Sc>
      {/* "gõ mô tả" ~12.4, "đưa vào một tấm ảnh" ~15.9 */}
      <Sc a={8.4} b={19.7}>
        <RwHowItWorks rowAt={[f(12.2 - 8.4), f(15.7 - 8.4)]} />
      </Sc>
      <Sc a={19.7} b={26.5}>
        <RwConsistency />
      </Sc>
      {/* "1,5 tỷ đô" ~30.8, Lionsgate ~33.0 */}
      <Sc a={26.5} b={36.9}>
        <RwBackers valAt={f(30.6 - 26.5)} lionAt={f(32.9 - 26.5)} />
      </Sc>
      {/* Gen4.5 ~38.4, Gen4 ~40.1, Turbo ~41.5 */}
      <Sc a={36.9} b={44.5}>
        <RwModels at={[f(38.3 - 36.9), f(40.0 - 36.9), f(41.4 - 36.9)]} />
      </Sc>
      {/* Act-One ~45.9, Motion Brush ~49.7, Aleph ~52.2, LipSync/4K ~55.4 */}
      <Sc a={44.5} b={58.3}>
        <RwTools at={[f(45.8 - 44.5), f(49.6 - 44.5), f(52.1 - 44.5), f(55.3 - 44.5)]} />
      </Sc>
      {/* layers ~61.5 / 62.4 / 63.2 / 64.0 / 65.4 */}
      <Sc a={58.3} b={67.1}>
        <RwPrompt at={[f(61.4 - 58.3), f(62.3 - 58.3), f(63.1 - 58.3), f(63.9 - 58.3), f(65.3 - 58.3)]} />
      </Sc>
      {/* limits ~68.6 / 71.0 / 73.6 */}
      <Sc a={67.1} b={78.3}>
        <RwLimits at={[f(68.5 - 67.1), f(70.9 - 67.1), f(73.5 - 67.1)]} />
      </Sc>
      {/* watermark ~82.6, 720p ~83.6, verdict ~84.8 */}
      <Sc a={78.3} b={88.2}>
        <RwFree chipAt={[f(82.5 - 78.3), f(83.5 - 78.3)]} verdictAt={f(84.8 - 78.3)} />
      </Sc>
      {/* Veo ~92.6 */}
      <Sc a={88.2} b={94.8}>
        <RwVerdict veoAt={f(91.5 - 88.2)} />
      </Sc>
      <Sc a={94.8} b={101.5}>
        <RwEnd creditAt={f(96.8 - 94.8)} />
      </Sc>

      <RwCaptions />

      <Audio src={staticFile("rw_voice.mp3")} />
    </AbsoluteFill>
  );
};
