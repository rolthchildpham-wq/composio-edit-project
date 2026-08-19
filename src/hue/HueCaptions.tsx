import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { hueChunks } from "./hueChunks";
import { FONT_BOLD } from "../palette";
import { H } from "./HueGraphics";

// Solemn captions: cream text, gold sweeping highlight, soft shadow (no thick outline).
// Hidden during the typographic "remember" scene where the lines ARE the visual.
const HIDDEN = [
  { from: 0, to: 4.6 }, // hook — the serif headline already shows these words
  { from: 75.8, to: 85.3 }, // "remember" typographic scene
];

export const HueCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (HIDDEN.some((h) => t >= h.from && t < h.to)) return null;
  const chunk = hueChunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;

  const n = chunk.words.length;
  const progress = (t - chunk.start) / (chunk.end - chunk.start);
  const hi = Math.min(n - 1, Math.floor(progress * n));
  const localF = (t - chunk.start) * fps;
  const fade = Math.min(1, localF / 4);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "78%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 22,
        opacity: fade,
        pointerEvents: "none",
      }}
    >
      {chunk.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 800,
            fontSize: 58,
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
