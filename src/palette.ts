import { loadFont as loadBold } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";

const bold = loadBold("normal", {
  weights: ["800", "900"],
  subsets: ["vietnamese", "latin"],
});

const serif = loadSerif("normal", {
  weights: ["600", "700"],
  subsets: ["vietnamese", "latin"],
});

export const FONT_BOLD = bold.fontFamily;
export const FONT_SERIF = serif.fontFamily;

export const C = {
  orange: "#FF8C1A",
  orangeG1: "#F08050",
  orangeG2: "#FF9A6C",
  green: "#2A4034",
  cream: "#EDEAE5",
  white: "#FFFFFF",
  black: "#000000",
  pink: "#FF6B9D",
  mint: "#A8E6CF",
};

// Y where the bottom (talking head) panel begins in split mode — ~43% of 1920
export const PANEL_Y = 830;

// Outline for karaoke captions (fake stroke via layered shadows)
export const strokeShadow = (px: number) => {
  const s: string[] = [];
  for (let dx = -px; dx <= px; dx += px / 2) {
    for (let dy = -px; dy <= px; dy += px / 2) {
      if (dx === 0 && dy === 0) continue;
      s.push(`${dx}px ${dy}px 0 ${C.black}`);
    }
  }
  s.push(`0px ${px + 4}px 10px rgba(0,0,0,0.45)`);
  return s.join(", ");
};
