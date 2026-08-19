import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { FONT_BOLD } from "../palette";
import { ytChunks } from "./ytChunks";
import {
  outlineDark,
  Y,
  YtChannelStat,
  YtEnd,
  YtFormula,
  YtHook,
  YtMonetize,
  YtNiche,
} from "./YtGraphics";

const YtCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = ytChunks.find((c) => t >= c.start && t < c.end);
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
            fontSize: 66,
            color: i === hi ? Y.redSoft : Y.white,
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

export const YtMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: Y.bg }}>
      <Sc a={0} b={6.0}>
        <YtHook />
      </Sc>
      {/* "2,3 triệu" spoken ~11.3 */}
      <Sc a={6.0} b={13.1}>
        <YtNiche
          index={1}
          title="TÁI HIỆN LỊCH SỬ"
          img="yt_2.png"
          statAt={f(11.0 - 6.0)}
          statTo={2.3}
          statSuffix="TRIỆU VIEW"
          statNote="video tái hiện London xưa"
        />
      </Sc>
      {/* badge "doanh thu" ~15.4 */}
      <Sc a={13.1} b={17.4}>
        <YtChannelStat badgeAt={f(15.4 - 13.1)} />
      </Sc>
      {/* "38 triệu" ~24.0 */}
      <Sc a={17.4} b={26.9}>
        <YtNiche
          index={2}
          title="ASMR KHÔNG THỂ LÀM THẬT"
          img="yt_5.png"
          statAt={f(23.8 - 17.4)}
          statTo={38}
          statDecimals={0}
          statSuffix="TRIỆU VIEW"
          statNote="chỉ trong 3 tháng"
        />
      </Sc>
      {/* "2,3 triệu" ~32.6 */}
      <Sc a={26.9} b={35.4}>
        <YtNiche
          index={3}
          title="ANIME 3D THƯ GIÃN"
          icon="🌸"
          statAt={f(32.4 - 26.9)}
          statTo={2.3}
          statSuffix="TRIỆU VIEW"
          statNote="trong 3 tháng · phong cách cinematic"
        />
      </Sc>
      {/* "3,6 triệu" ~40.5 */}
      <Sc a={35.4} b={43.4}>
        <YtNiche
          index={4}
          title="ÂM NHẠC AI"
          icon="🎵"
          statAt={f(40.3 - 35.4)}
          statTo={3.6}
          statSuffix="TRIỆU VIEW"
          statNote="trong 7 tháng · video dài hơn 1 tiếng"
        />
      </Sc>
      {/* "3,9 triệu" ~48.3 */}
      <Sc a={43.4} b={50.4}>
        <YtNiche
          index={5}
          title="CÂU CHUYỆN ĐỘNG LỰC"
          icon="🔥"
          statAt={f(48.0 - 43.4)}
          statTo={3.9}
          statSuffix="TRIỆU VIEW"
          statNote="chỉ ảnh AI + giọng đọc AI"
        />
      </Sc>
      {/* "Join" ~53.3, "Thanks" ~54.0, note ~56.0 */}
      <Sc a={50.4} b={59.4}>
        <YtMonetize btnAt={[f(53.1 - 50.4), f(53.9 - 50.4)]} noteAt={f(55.6 - 50.4)} />
      </Sc>
      {/* steps ~61.4 (Nano) / 63.6 (Kling) / 65.8 (Suno) */}
      <Sc a={59.4} b={67.9}>
        <YtFormula stepAt={[f(61.2 - 59.4), f(63.4 - 59.4), f(65.6 - 59.4)]} />
      </Sc>
      {/* credit ~70.5 */}
      <Sc a={67.9} b={76.0}>
        <YtEnd creditAt={f(70.4 - 67.9)} />
      </Sc>

      <YtCaptions />

      <Audio src={staticFile("yt_voice.mp3")} />
    </AbsoluteFill>
  );
};
