import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { FONT, P, outline } from "../op16/Op16Graphics";
import { ckChunks } from "./ckChunks";
import {
  CkBeat,
  CkDrop,
  CkEnd,
  CkForecast,
  CkForeign,
  CkGauge,
  CkHook,
  CkRecover,
  CkSectors,
  CkSupport,
} from "./CkGraphics";

const CkCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = ckChunks.find((c) => t >= c.start && t < c.end);
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
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 68,
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

export const CkMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: P.light }}>
      <Sc a={0} b={5.0}>
        <CkHook />
      </Sc>
      {/* −250 điểm spoken ~8.6, −6% ~10.4 */}
      <Sc a={5.0} b={14.4}>
        <CkDrop cardAt={[f(8.6 - 5.0), f(10.4 - 5.0)]} />
      </Sc>
      {/* +2,95% ~19.6, mốc 1735 ~21.4 */}
      <Sc a={14.4} b={22.9}>
        <CkRecover cardAt={[f(19.6 - 14.4), f(21.4 - 14.4)]} />
      </Sc>
      {/* sector names spoken ~24.9 / 25.6 / 26.3 / 26.9 / 27.7 */}
      <Sc a={22.9} b={28.8}>
        <CkSectors at={[f(24.9 - 22.9), f(25.6 - 22.9), f(26.3 - 22.9), f(26.9 - 22.9), f(27.7 - 22.9)]} />
      </Sc>
      {/* "chậm lại" ~33.5 */}
      <Sc a={28.8} b={34.4}>
        <CkForeign slowAt={f(33.5 - 28.8)} />
      </Sc>
      <Sc a={34.4} b={38.5}>
        <CkBeat />
      </Sc>
      <Sc a={38.5} b={44.2}>
        <CkForecast org="SHS" low={1700} high={1770} note="dao động ngắn hạn" />
      </Sc>
      {/* 3,9% spoken ~50.6 */}
      <Sc a={44.2} b={52.0}>
        <CkGauge badgeAt={f(50.6 - 44.2)} />
      </Sc>
      <Sc a={52.0} b={57.2}>
        <CkForecast org="PINETREE" low={1720} high={1780} note="kịch bản cơ sở" />
      </Sc>
      {/* factors spoken ~58.5 / 61.6 / 62.8 */}
      <Sc a={57.2} b={64.6}>
        <CkSupport at={[f(58.5 - 57.2), f(61.6 - 57.2), f(62.8 - 57.2)]} />
      </Sc>
      {/* "bạn nghĩ sao" ~69.2 */}
      <Sc a={64.6} b={72.0}>
        <CkEnd questionAt={f(69.2 - 64.6)} />
      </Sc>

      <CkCaptions />

      <Audio src={staticFile("ck_voice.mp3")} />
    </AbsoluteFill>
  );
};
