import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BOLD } from "./palette";

export type StickerDef = {
  label: string;
  color: string;
  rot: number;
  at: number; // local frame at which it pops
  x: number; // percent
  y: number; // px within the panel
};

// Rotated label stickers with thick black border, popping in sequentially.
export const Stickers: React.FC<{ items: StickerDef[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {items.map((s) => (
        <div
          key={s.label}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: s.y,
            translate: "-50% 0",
            rotate: `${s.rot}deg`,
            scale: String(
              spring({ frame: frame - s.at, fps, config: { damping: 10, stiffness: 160 } }),
            ),
            background: s.color,
            border: `8px solid ${C.black}`,
            borderRadius: 24,
            padding: "20px 44px",
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 60,
            color: C.black,
            boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
            whiteSpace: "nowrap",
          }}
        >
          {s.label}
        </div>
      ))}
    </>
  );
};

// Orange pill badges stacked vertically, appearing as the voice lists them.
export const Badges: React.FC<{
  items: { label: string; at: number }[];
  top?: number;
}> = ({ items, top = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      {items.map((b) => (
        <div
          key={b.label}
          style={{
            background: C.orange,
            color: C.white,
            fontFamily: FONT_BOLD,
            fontWeight: 900,
            fontSize: 56,
            padding: "26px 58px",
            borderRadius: 999,
            boxShadow: "0 16px 40px rgba(240,128,80,0.45)",
            scale: String(
              spring({ frame: frame - b.at, fps, config: { damping: 11, stiffness: 150 } }),
            ),
            whiteSpace: "nowrap",
          }}
        >
          {b.label}
        </div>
      ))}
    </div>
  );
};
