import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { C, PANEL_Y } from "./palette";
import { HeadFull, HeadPanel, HeadPip } from "./TalkingHead";
import { Captions } from "./Captions";
import { Stickers, Badges } from "./overlays";
import {
  AsteriskBurst,
  AsteriskProduct,
  BalanceScale,
  CardCrossed,
  ChartDown,
  CreamBG,
  DashAds,
  DashRetention,
  Discount50,
  EndCard,
  FlashOrange,
  FormulaBadges,
  FormulaCard,
  GlitterTrash,
  LoyaltyLoop,
  Magnifier,
  MarketerCard,
  Megaphone,
  ProductShine,
  QuestionMark,
  Sandcastle,
  SlideCard,
  TitleCard,
  TrashMegaphone,
  TwoCards,
} from "./graphics";

// Split layout: rounded floating card on top, talking head below (source subtitles cropped away).
const Split: React.FC<{
  start: number;
  top: React.ReactNode;
  extras?: React.ReactNode;
}> = ({ start, top, extras }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: PANEL_Y,
          width: 1080,
          height: 1920 - PANEL_Y,
          overflow: "hidden",
        }}
      >
        <HeadPanel trimBefore={Math.round(start * fps)} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 70,
          width: 1080 - 88,
          height: PANEL_Y - 114,
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 28px 64px rgba(0,0,0,0.32)",
        }}
      >
        {top}
      </div>
      {extras}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {/* color grade: warm, saturated, no grain */}
      <AbsoluteFill style={{ filter: "saturate(1.12) contrast(1.06)" }}>
        {/* ------- HOOK ------- */}
        <Sc a={0} b={2.6}>
          <Split start={0} top={<TitleCard />} />
        </Sc>
        <Sc a={2.6} b={4.7}>
          <HeadFull trimBefore={f(2.6)} drift={0.0009} />
        </Sc>

        {/* ------- SETUP ------- */}
        <Sc a={4.7} b={8.0}>
          <Megaphone />
        </Sc>
        <Sc a={8.0} b={11.1}>
          <Split start={8.0} top={<CardCrossed crossAt={f(10.3 - 8.0)} />} />
        </Sc>
        <Sc a={11.1} b={14.3}>
          <ChartDown />
        </Sc>
        <Sc a={14.3} b={16.3}>
          <HeadFull trimBefore={f(14.3)} />
        </Sc>
        <Sc a={16.3} b={20.9}>
          <Split
            start={16.3}
            top={
              <CreamBG>
                <Stickers
                  items={[
                    { label: "VIRAL", color: C.pink, rot: -3, at: f(17.3 - 16.3), x: 32, y: 120 },
                    { label: "CHẠY ADS", color: C.mint, rot: 2, at: f(19.2 - 16.3), x: 62, y: 300 },
                    { label: "THẮNG?", color: C.pink, rot: -2, at: f(20.2 - 16.3), x: 40, y: 480 },
                  ]}
                />
              </CreamBG>
            }
          />
        </Sc>

        {/* ------- THÂN 1 ------- */}
        <Sc a={20.9} b={24.1}>
          <DashAds />
          <HeadPip trimBefore={f(20.9)} />
        </Sc>
        <Sc a={24.1} b={26.0}>
          <AsteriskBurst />
        </Sc>
        <Sc a={26.0} b={29.4}>
          <Split start={26.0} top={<TrashMegaphone />} />
        </Sc>
        <Sc a={29.4} b={31.1}>
          <HeadFull trimBefore={f(29.4)} />
        </Sc>
        {/* flash cut ×3 — nhấn "ĐANG BÁN RÁC" */}
        <Sc a={31.1} b={31.25}>
          <FlashOrange text="RÁC" />
        </Sc>
        <Sc a={31.25} b={31.4}>
          <HeadFull trimBefore={f(31.25)} />
        </Sc>
        <Sc a={31.4} b={32.05}>
          <TrashMegaphone />
        </Sc>
        <Sc a={32.05} b={36.2}>
          <Magnifier />
        </Sc>
        <Sc a={36.2} b={39.4}>
          <Split start={36.2} top={<Sandcastle />} />
        </Sc>
        <Sc a={39.4} b={43.8}>
          <Split start={39.4} top={<MarketerCard stampAt={f(41.5 - 39.4)} />} />
        </Sc>
        {/* flash — chuyển chương "Công thức" */}
        <Sc a={43.8} b={44.0}>
          <FlashOrange />
        </Sc>
        <Sc a={44.0} b={48.25}>
          <FormulaBadges at={[f(0.7), f(2.0), f(3.0)]} />
        </Sc>
        <Sc a={48.25} b={51.0}>
          <Split start={48.25} top={<ProductShine />} />
        </Sc>
        <Sc a={51.0} b={55.05}>
          <HeadFull trimBefore={f(51.0)} punchInAt={f(53.0 - 51.0)} />
        </Sc>

        {/* ------- THÂN 2 ------- */}
        <Sc a={55.05} b={58.2}>
          <TwoCards secondAt={f(57.0 - 55.05)} />
        </Sc>
        <Sc a={58.2} b={61.4}>
          <Split
            start={58.2}
            top={
              <CreamBG circles>
                <Badges
                  items={[
                    { label: "MUA LẦN 2", at: f(58.5 - 58.2) },
                    { label: "GIỚI THIỆU 10 NGƯỜI", at: f(59.7 - 58.2) },
                  ]}
                  top={200}
                />
              </CreamBG>
            }
          />
        </Sc>
        <Sc a={61.4} b={64.9}>
          <DashRetention circleAt={f(63.5 - 61.4)} />
          <HeadPip trimBefore={f(61.4)} />
        </Sc>
        <Sc a={64.9} b={68.55}>
          <HeadFull trimBefore={f(64.9)} />
        </Sc>
        <Sc a={68.55} b={72.3}>
          <Split start={68.55} top={<BalanceScale tiltAt={f(71.1 - 68.55)} />} />
        </Sc>
        <Sc a={72.3} b={77.05}>
          <Split
            start={72.3}
            top={
              <CreamBG>
                <Stickers
                  items={[
                    { label: "SẢN PHẨM", color: C.pink, rot: -3, at: f(75.0 - 72.3), x: 32, y: 120 },
                    { label: "DỊCH VỤ", color: C.mint, rot: 2, at: f(75.7 - 72.3), x: 64, y: 300 },
                    { label: "TRẢI NGHIỆM", color: C.pink, rot: -2, at: f(76.2 - 72.3), x: 42, y: 480 },
                  ]}
                />
              </CreamBG>
            }
          />
        </Sc>
        {/* flash ×2 — nhấn "−50%" */}
        <Sc a={77.05} b={77.18}>
          <FlashOrange />
        </Sc>
        <Sc a={77.18} b={77.32}>
          <FlashOrange text="−50%" />
        </Sc>
        <Sc a={77.32} b={80.45}>
          <Discount50 />
        </Sc>
        <Sc a={80.45} b={83.35}>
          <Split start={80.45} top={<LoyaltyLoop />} />
        </Sc>
        <Sc a={83.35} b={86.92}>
          <FormulaCard />
        </Sc>
        <Sc a={86.92} b={89.55}>
          <Split start={86.92} top={<FormulaCard bad />} />
        </Sc>
        <Sc a={89.55} b={91.8}>
          <QuestionMark />
        </Sc>
        <Sc a={91.8} b={94.55}>
          <HeadFull trimBefore={f(91.8)} />
        </Sc>

        {/* ------- KẾT ------- */}
        <Sc a={94.55} b={98.85}>
          <HeadFull trimBefore={f(94.55)} />
          <SlideCard at={f(96.0 - 94.55)} />
        </Sc>
        {/* flash ×2 — "đánh bóng rác" */}
        <Sc a={98.85} b={99.0}>
          <GlitterTrash />
        </Sc>
        <Sc a={99.0} b={99.12}>
          <HeadFull trimBefore={f(99.0)} />
        </Sc>
        <Sc a={99.12} b={101.7}>
          <GlitterTrash />
        </Sc>
        <Sc a={101.7} b={104.25}>
          <Split start={101.7} top={<AsteriskProduct />} />
        </Sc>
        <Sc a={104.25} b={108.6}>
          <HeadFull trimBefore={f(104.25)} drift={0.0004} />
        </Sc>
        <Sc a={108.6} b={109.16}>
          <EndCard />
        </Sc>

        {/* karaoke captions on top of everything */}
        <Captions />
      </AbsoluteFill>

      {/* vignette ~10% */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.14) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* original audio track (voice + music, already mixed & mastered) */}
      <Audio src={staticFile("source.mp4")} />
    </AbsoluteFill>
  );
};
