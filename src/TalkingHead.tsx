import React from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";

const SRC_W = 1080;
const SRC_H = 1920;
// Baked-in subtitles of the source can reach up to ~y1050 (multi-line pops) —
// only the region above y990 is ever shown.
const SAFE_H = 990;

// Bottom panel of split layout (1080x1090): scales the video so exactly the top
// 990px fill the panel, cropping the baked subtitles away.
export const HeadPanel: React.FC<{ trimBefore: number }> = ({ trimBefore }) => {
  const panelH = 1090;
  const zoom = panelH / SAFE_H; // ≈1.10
  const w = SRC_W * zoom;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      <Video
        muted
        trimBefore={trimBefore}
        src={staticFile("source.mp4")}
        style={{
          position: "absolute",
          left: (1080 - w) / 2,
          top: 0,
          width: w,
          height: SRC_H * zoom,
        }}
      />
    </div>
  );
};

// Full-frame close-up: zooms into the top region so the baked subtitles stay out of frame.
export const HeadFull: React.FC<{
  trimBefore: number;
  punchInAt?: number; // local frame at which an extra punch-in happens
  drift?: number; // slow ken-burns factor per frame
}> = ({ trimBefore, punchInAt, drift = 0.00025 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = SRC_H / SAFE_H; // ≈1.68 — fills 1920 with the top 1140px
  let zoom = base * (1 + frame * drift);
  if (punchInAt !== undefined && frame >= punchInAt) {
    zoom *= 1 + Math.min(0.05, (frame - punchInAt) / (0.2 * fps) * 0.05);
  }
  const w = SRC_W * zoom;
  const h = SRC_H * zoom;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      <Video
        muted
        trimBefore={trimBefore}
        src={staticFile("source.mp4")}
        style={{
          position: "absolute",
          left: (1080 - w) / 2,
          top: 0,
          width: w,
          height: h,
        }}
      />
    </div>
  );
};

// Small round PIP (screen-recording mode) — face crop, bottom right.
export const HeadPip: React.FC<{ trimBefore: number }> = ({ trimBefore }) => {
  const size = 300;
  // Face region of the source ≈ (250..830, 60..700) → center (540, 380)
  const scale = size / 640;
  return (
    <div
      style={{
        position: "absolute",
        right: 44,
        bottom: 70,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        border: `8px solid ${C_ORANGE}`,
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        background: "#0a0a0a",
      }}
    >
      <Video
        muted
        trimBefore={trimBefore}
        src={staticFile("source.mp4")}
        style={{
          position: "absolute",
          width: SRC_W * scale,
          height: SRC_H * scale,
          left: size / 2 - 540 * scale,
          top: size / 2 - 380 * scale,
        }}
      />
    </div>
  );
};

const C_ORANGE = "#FF8C1A";
