import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_SERIF } from "../palette";

// ============================================================================
// STYLE "HỒ SƠ VINTAGE" — bảng điều tra giấy cổ, trích từ reel mẫu 162s:
// giấy ố vàng + collage bản đồ/báo cũ, ảnh B&W ghim đinh đồng, dây đỏ nối
// manh mối, con dấu đỏ, nhãn serif. Nhịp chậm 6-8s/cảnh, KHÔNG phụ đề karaoke.
// ============================================================================

export const VC = {
  desk: "#241C13",
  paper: "#E8DFC8",
  paperDark: "#D9CCA8",
  label: "#F3ECD8",
  ink: "#3B3020",
  red: "#A32A22",
  brass: "#B08D42",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// hạt giấy + đốm ố — dùng chung 1 filter SVG
const GrainDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="vgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 0.35 0" />
        <feComposite operator="over" in2="SourceGraphic" />
      </filter>
      <filter id="vblotch">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="11" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45 0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0.5 0" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>
);

// mép giấy rách — polygon răng cưa ngẫu nhiên theo seed
const tornPath = (w: number, h: number, seed: number, rough = 9) => {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * 2 * rough;
  const pts: string[] = [];
  const step = 60;
  for (let x = 0; x <= w; x += step) pts.push(`${x + rnd()},${rnd()}`);
  for (let y = 0; y <= h; y += step) pts.push(`${w + rnd()},${y + rnd()}`);
  for (let x = w; x >= 0; x -= step) pts.push(`${x + rnd()},${h + rnd()}`);
  for (let y = h; y >= 0; y -= step) pts.push(`${rnd()},${y + rnd()}`);
  return pts.join(" ");
};

// mảnh giấy rách dùng làm nền/mảnh collage
export const TornPaper: React.FC<{
  w: number;
  h: number;
  color?: string;
  seed?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ w, h, color = VC.paper, seed = 1, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, ...style }}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.45))" }}>
      <polygon points={tornPath(w, h, seed)} fill={color} />
      <polygon points={tornPath(w, h, seed)} fill={color} filter="url(#vblotch)" opacity={0.35} />
    </svg>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

// mảnh bản đồ/ảnh cổ cắt mép rách — clip theo polygon răng cưa
export const MapFragment: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  seed?: number;
  pos?: string; // objectPosition để chọn vùng bản đồ
  opacity?: number;
}> = ({ src, x, y, w, h, rot = 0, seed = 1, pos = "center", opacity = 0.9 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      rotate: `${rot}deg`,
      filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.5))",
      opacity,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        clipPath: `polygon(${tornPath(w, h, seed, 8).split(" ").map((p) => p.split(",").map((v) => `${Math.round(+v)}px`).join(" ")).join(", ")})`,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "sepia(0.3) contrast(0.96) brightness(1.02)" }}
      />
    </div>
  </div>
);

// nền bàn điều tra: bàn gỗ tối + collage bản đồ cổ thật + tờ giấy lớn ở giữa
export const Board: React.FC<{ children?: React.ReactNode; pan?: number }> = ({ children, pan = 0 }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 400], [0, pan], clamp);
  const frag = (x: number, y: number, w: number, h: number, rot: number, c: string, seed: number) => (
    <TornPaper w={w} h={h} color={c} seed={seed} style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg`, opacity: 0.85 }} />
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #2E2418 0%, ${VC.desk} 70%)`, overflow: "hidden" }}>
      <GrainDefs />
      <div style={{ position: "absolute", inset: -60, translate: `${drift}px 0px`, scale: "1.04" }}>
        {/* collage viền: bản đồ Sussex cổ thật (Ordnance Survey, PD) xen mảnh giấy */}
        <MapFragment src="map_1.jpg" x={-120} y={-100} w={620} h={520} rot={-6} seed={3} pos="20% 30%" />
        <MapFragment src="map_2.jpg" x={1520} y={-110} w={600} h={540} rot={5} seed={5} pos="60% 40%" />
        <MapFragment src="map_1.jpg" x={-140} y={700} w={560} h={480} rot={4} seed={8} pos="70% 75%" />
        <MapFragment src="map_2.jpg" x={1560} y={680} w={560} h={500} rot={-5} seed={13} pos="25% 70%" />
        {frag(700, -120, 560, 260, 2, VC.paperDark, 17)}
        {frag(650, 950, 620, 240, -2, "#B9B2A2", 21)}
        {/* băng keo vàng */}
        {[[-20, 300, 30], [1770, 380, -25], [880, -30, 8]].map(([x, y, r], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 150, height: 44, background: "rgba(196,164,90,0.75)", rotate: `${r}deg` }} />
        ))}
        {/* giấy canvas trung tâm */}
        <TornPaper w={1560} h={880} seed={2} style={{ position: "absolute", left: 180, top: 100 }} />
        <div style={{ position: "absolute", left: 180, top: 100, width: 1560, height: 880 }}>{children}</div>
      </div>
      {/* grain + vignette toàn khung */}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(20,14,8,0.55) 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.5, mixBlendMode: "multiply" }}>
        <rect width="100%" height="100%" filter="url(#vgrain)" fill="transparent" />
      </svg>
    </AbsoluteFill>
  );
};

// đinh ghim đồng
export const Pin: React.FC<{ x: number; y: number; at?: number }> = ({ x, y, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 300 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 13,
        top: y - 13,
        width: 26,
        height: 26,
        borderRadius: 99,
        background: `radial-gradient(circle at 35% 30%, #E5C87B, ${VC.brass} 55%, #6E5320)`,
        boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
        scale: String(interpolate(s, [0, 1], [2.2, 1])),
        opacity: s > 0.02 ? 1 : 0,
      }}
    />
  );
};

// ảnh tư liệu: khung trắng cũ + ảnh ngả B&W, ghim đinh, rơi vào + xoay nhẹ
export const PinPhoto: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  rot?: number;
  at?: number;
  caption?: string;
  color?: boolean;
}> = ({ src, x, y, w, rot = -2, at = 0, caption, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 90 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        rotate: `${rot + interpolate(s, [0, 1], [rot > 0 ? 6 : -6, 0])}deg`,
        translate: `0px ${interpolate(s, [0, 1], [-60, 0])}px`,
        opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
        background: "#F5F1E4",
        padding: "14px 14px 18px",
        boxShadow: "0 16px 30px rgba(0,0,0,0.45)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          display: "block",
          filter: color ? "sepia(0.25) contrast(0.98)" : "grayscale(1) sepia(0.4) contrast(0.95) brightness(0.98)",
        }}
      />
      {caption ? (
        <div style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 24, color: VC.ink, textAlign: "center", paddingTop: 10 }}>
          {caption}
        </div>
      ) : null}
      <Pin x={w / 2} y={2} at={at + 4} />
    </div>
  );
};

// nhãn giấy chữ serif
export const Label: React.FC<{
  x: number;
  y: number;
  at?: number;
  rot?: number;
  size?: number;
  children: React.ReactNode;
}> = ({ x, y, at = 0, rot = -1.5, size = 40, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        rotate: `${rot}deg`,
        background: VC.label,
        border: "1px solid rgba(59,48,32,0.25)",
        padding: "14px 34px",
        fontFamily: FONT_SERIF,
        fontWeight: 700,
        fontSize: size,
        color: VC.ink,
        boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
        whiteSpace: "nowrap",
        scale: String(s),
      }}
    >
      {children}
    </div>
  );
};

// dây đỏ nối 2 điểm — vẽ dần, hơi võng
export const RedString: React.FC<{
  from: [number, number];
  to: [number, number];
  at?: number;
  sag?: number;
}> = ({ from, to, at = 0, sag = 60 }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 26], [0, 1], { ...clamp, easing: ease });
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2 + sag;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <path
        d={`M ${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`}
        stroke={VC.red}
        strokeWidth={5}
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.4))" }}
      />
    </svg>
  );
};

// con dấu tròn đỏ — đóng xuống
export const Stamp: React.FC<{
  x: number;
  y: number;
  size?: number;
  at?: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ x, y, size = 220, at = 0, rot = -14, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 240 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        rotate: `${rot}deg`,
        scale: String(interpolate(s, [0, 1], [2.6, 1])),
        opacity: s > 0.03 ? 0.88 : 0,
        mixBlendMode: "multiply",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          border: `6px solid ${VC.red}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 999,
            border: `2px solid ${VC.red}`,
          }}
        />
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 700,
            fontSize: size / 6.2,
            color: VC.red,
            textAlign: "center",
            lineHeight: 1.15,
            padding: 16,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// gạch X đỏ vẽ tay
export const HandX: React.FC<{ x: number; y: number; w?: number; at?: number }> = ({ x, y, w = 220, at = 0 }) => {
  const frame = useCurrentFrame();
  const d1 = interpolate(frame, [at, at + 10], [0, 1], clamp);
  const d2 = interpolate(frame, [at + 8, at + 18], [0, 1], clamp);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={w * 0.7}>
      {[
        [`M 6 8 Q ${w * 0.5} ${w * 0.3} ${w - 8} ${w * 0.62}`, d1],
        [`M ${w - 10} 4 Q ${w * 0.45} ${w * 0.32} 8 ${w * 0.66}`, d2],
      ].map(([d, p], i) => (
        <path
          key={i}
          d={d as string}
          stroke={VC.red}
          strokeWidth={16}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - (p as number)}
          opacity={0.85}
        />
      ))}
    </svg>
  );
};

// ghi chú viết tay (serif nghiêng, không nền)
export const Note: React.FC<{
  x: number;
  y: number;
  at?: number;
  size?: number;
  children: React.ReactNode;
}> = ({ x, y, at = 0, size = 34, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: FONT_SERIF,
        fontStyle: "italic",
        fontSize: size,
        color: VC.ink,
        opacity: interpolate(frame, [at, at + 14], [0, 0.92], clamp),
        maxWidth: 460,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
};
