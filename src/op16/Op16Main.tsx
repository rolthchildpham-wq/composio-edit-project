import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { useCurrentFrame } from "remotion";
import {
  FONT,
  Op16Battery,
  Op16Beat,
  Op16Camera,
  Op16Charge,
  Op16End,
  Op16Hook,
  Op16Leak,
  Op16Tele,
  Op16Timeline,
  Op16Versus,
  P,
  outline,
} from "./Op16Graphics";
import { op16Chunks } from "./op16Chunks";

// energetic karaoke captions in 24h colors: white + bright green highlight
const Op16Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = op16Chunks.find((c) => t >= c.start && t < c.end);
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
        gap: 24,
        scale: String(0.9 + 0.1 * Math.min(1, localF / 3)),
        pointerEvents: "none",
      }}
    >
      {chunk.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 72,
            color: i === hi ? P.greenBright : P.white,
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

export const Op16Main: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: P.light }}>
      <Sc a={0} b={4.74}>
        <Op16Hook />
      </Sc>
      <Sc a={4.74} b={13.2}>
        <Op16Camera />
      </Sc>
      <Sc a={13.2} b={17.4}>
        <Op16Tele />
      </Sc>
      <Sc a={17.4} b={19.9}>
        <Op16Beat />
      </Sc>
      {/* badges pop as the numbers are spoken: 4390 @ ~23.4, 8780 @ ~25.4, 9000 @ ~27.0 */}
      <Sc a={19.9} b={27.62}>
        <Op16Leak mathAt={[f(23.4 - 19.9), f(25.4 - 19.9), f(27.0 - 19.9)]} />
      </Sc>
      <Sc a={27.62} b={31.6}>
        <Op16Battery />
      </Sc>
      {/* 100W spoken ~32.9, 50W spoken ~35.1 */}
      <Sc a={31.6} b={36.0}>
        <Op16Charge badgeAt={[f(32.9 - 31.6), f(35.1 - 31.6)]} />
      </Sc>
      <Sc a={36.0} b={41.4}>
        <Op16Versus />
      </Sc>
      <Sc a={41.4} b={46.2}>
        <Op16Timeline />
      </Sc>
      <Sc a={46.2} b={53.5}>
        <Op16End questionAt={f(49.9 - 46.2)} />
      </Sc>

      <Op16Captions />

      <Audio src={staticFile("op16_voice.mp3")} />
    </AbsoluteFill>
  );
};
