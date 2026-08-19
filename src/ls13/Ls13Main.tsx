import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { FONT_BOLD } from "../palette";
import { Fade, H } from "../hue/HueGraphics";
import { ls13Chunks } from "./ls13Chunks";
import {
  Ls13Battle,
  Ls13DNA,
  Ls13End,
  Ls13Found,
  Ls13Hook,
  Ls13NoName,
  Ls13Relics,
  Ls13Search,
} from "./Ls13Graphics";

// solemn captions (cream/gold), hidden where on-screen text mirrors the voice
const HIDDEN = [
  { from: 0, to: 4.3 }, // hook headline
  { from: 57.0, to: 64.5 }, // ending lines
];

const Ls13Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (HIDDEN.some((h) => t >= h.from && t < h.to)) return null;
  const chunk = ls13Chunks.find((c) => t >= c.start && t < c.end);
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
        opacity: Math.min(1, localF / 4),
        pointerEvents: "none",
      }}
    >
      {chunk.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 800,
            fontSize: 56,
            letterSpacing: 1,
            color: i === hi ? H.goldSoft : H.cream,
            textShadow: "0 4px 18px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.9)",
            whiteSpace: "nowrap",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

export const Ls13Main: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <Fade len={f(b) - f(a)}>{children}</Fade>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: H.ink }}>
      <Sc a={0} b={4.3}>
        <Ls13Hook />
      </Sc>
      {/* "20 đến 50cm" spoken ~11.5 */}
      <Sc a={4.3} b={13.4}>
        <Ls13Found depthAt={f(11.3 - 4.3)} />
      </Sc>
      {/* units spoken from ~19.4 */}
      <Sc a={13.4} b={25.2}>
        <Ls13Battle unitAt={f(19.4 - 13.4)} />
      </Sc>
      {/* relic names spoken 28.3 / 29.4 / 30.2 / 31.0 / 31.7 / 32.7 / 33.6 / 34.7 / 36.3 */}
      <Sc a={25.2} b={38.0}>
        <Ls13Relics
          at={[
            f(28.3 - 25.2),
            f(29.4 - 25.2),
            f(30.2 - 25.2),
            f(31.0 - 25.2),
            f(31.7 - 25.2),
            f(32.7 - 25.2),
            f(33.6 - 25.2),
            f(34.7 - 25.2),
            f(36.3 - 25.2),
          ]}
        />
      </Sc>
      <Sc a={38.0} b={43.1}>
        <Ls13NoName />
      </Sc>
      <Sc a={43.1} b={49.6}>
        <Ls13DNA />
      </Sc>
      {/* "mở rộng" spoken ~55.3 */}
      <Sc a={49.6} b={56.7}>
        <Ls13Search noteAt={f(54.6 - 49.6)} />
      </Sc>
      {/* line 2 spoken ~60.1 */}
      <Sc a={56.7} b={66.5}>
        <Ls13End line2At={f(60.0 - 56.7)} creditAt={f(63.6 - 56.7)} />
      </Sc>

      <Ls13Captions />

      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      />

      <Audio src={staticFile("ls13_voice.mp3")} />
      <Audio src={staticFile("ls13_ambience.m4a")} />
    </AbsoluteFill>
  );
};
