import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { chunks } from "./chunks";
import { C, FONT_BOLD, strokeShadow } from "./palette";

// Karaoke captions: 2-3 uppercase words per chunk, the orange highlight
// sweeps left→right word by word, synced to the measured word rate.
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = chunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;

  const n = chunk.words.length;
  const progress = (t - chunk.start) / (chunk.end - chunk.start);
  const hi = Math.min(n - 1, Math.floor(progress * n));

  // small pop when the chunk appears
  const localF = (t - chunk.start) * fps;
  const pop = 0.88 + 0.12 * Math.min(1, localF / 3);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "71.5%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 26,
        scale: String(pop),
        pointerEvents: "none",
      }}
    >
      {chunk.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 78,
            letterSpacing: "-0.5px",
            color: i === hi ? C.orange : C.white,
            textShadow: strokeShadow(5),
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};
