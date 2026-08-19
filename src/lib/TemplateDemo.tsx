import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { lightLeak } from "@remotion/effects";
import {
  PALETTES,
  TplBeat,
  TplBG,
  TplEnd,
  TplGauge,
  TplHook,
  TplPhoto,
  TplStat,
  TplVs,
} from "./templates";

// Trình diễn kho template: cùng components, 5 palette — mỗi cảnh 2.5s
export const TemplateDemo: React.FC = () => {
  const L = 75; // 2.5s @30fps
  const scenes: React.ReactNode[] = [
    <TplHook
      key="hook"
      p={PALETTES.ytDark}
      tag="TEMPLATE · HOOK"
      title={
        <>
          CÙNG LAYOUT
          <br />
          <span style={{ color: PALETTES.ytDark.accentSoft }}>5 BỘ MÀU</span>
        </>
      }
      img="rw_cover.jpg"
    />,
    <TplStat
      key="stat"
      p={PALETTES.news24h}
      kicker="TEMPLATE · COUNTER"
      to={1735}
      suffix="ĐIỂM"
      note="số đếm chạy theo voice"
    />,
    <TplGauge
      key="gauge"
      p={PALETTES.goldDark}
      tag="TEMPLATE · GAUGE"
      percent={80}
      label="XÁC SUẤT / TIẾN ĐỘ"
      badge="badge bung theo mốc"
    />,
    <TplVs
      key="vs"
      p={PALETTES.memorial}
      tag="TEMPLATE · VERSUS"
      winner={{ name: "PHƯƠNG ÁN A", note: "NỔI BẬT" }}
      rivals={[{ name: "PHƯƠNG ÁN B", note: "SO SÁNH", at: 18 }]}
    />,
    <TplBG key="fx" p={PALETTES.agriAd}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30, flexDirection: "column" }}>
        <TplPhoto
          src="ck_1.jpg"
          h={620}
          caption="hiệu ứng lightLeak từ @remotion/effects"
          effects={[lightLeak({ seed: 7, hueShift: 200, progress: 0.12 })]}
        />
      </AbsoluteFill>
    </TplBG>,
    <TplBeat key="beat" p={PALETTES.agriAd}>
      BEAT
      <br />
      CHUYỂN CHƯƠNG
    </TplBeat>,
    <TplEnd
      key="end"
      p={PALETTES.goldDark}
      title={
        <>
          9 SCENE · 5 PALETTE
          <br />
          <span style={{ color: PALETTES.goldDark.accent }}>1 KHO TEMPLATE</span>
        </>
      }
      chips={[
        { label: "HOOK", at: 10 },
        { label: "CHIP LIST", at: 14 },
        { label: "COUNTER", at: 18 },
        { label: "GAUGE", at: 22 },
        { label: "VS", at: 26 },
        { label: "BEAT", at: 30 },
      ]}
      credit="src/lib/templates.tsx"
      creditAt={34}
    />,
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={i * L} durationInFrames={L} layout="none">
          <AbsoluteFill>{s}</AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
