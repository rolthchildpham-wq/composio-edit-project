import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import {
  Fade,
  H,
  Hue500,
  HueBunker,
  HueDepth,
  HueEnding,
  HueHook,
  HueLetter,
  HueMapPins,
  HueMauThan,
  HueNotFound,
  HueRemember,
  HueSurvey,
  HueUnit80,
  HueYearPlace,
} from "./HueGraphics";
import { HueCaptions } from "./HueCaptions";

export const HueMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <Fade len={f(b) - f(a)}>{children}</Fade>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: H.ink }}>
      <Sc a={0} b={4.6}>
        <HueHook />
      </Sc>
      <Sc a={4.6} b={9.2}>
        <HueYearPlace />
      </Sc>
      <Sc a={9.2} b={15.2}>
        <HueUnit80 />
      </Sc>
      <Sc a={15.2} b={19.5}>
        <HueBunker />
      </Sc>
      <Sc a={19.5} b={23.2}>
        <HueBunker collapse />
      </Sc>
      <Sc a={23.2} b={27.5}>
        <HueNotFound />
      </Sc>
      <Sc a={27.5} b={38.2}>
        <HueLetter />
      </Sc>
      {/* pins drop as each place name is spoken: ~45.4 / 46.8 / 48.2 global */}
      <Sc a={38.2} b={50.5}>
        <HueMapPins pinAt={[f(45.4 - 38.2), f(46.8 - 38.2), f(48.2 - 38.2)]} />
      </Sc>
      <Sc a={50.5} b={54.7}>
        <HueSurvey />
      </Sc>
      <Sc a={54.7} b={62.1}>
        <Hue500 />
      </Sc>
      <Sc a={62.1} b={67.2}>
        <HueMauThan />
      </Sc>
      <Sc a={67.2} b={76.0}>
        <HueDepth artifactAt={f(72.1 - 67.2)} />
      </Sc>
      {/* typographic lines, timed to the voice */}
      <Sc a={76.0} b={85.3}>
        <HueRemember lineAt={[f(0.2), f(78.5 - 76.0), f(80.6 - 76.0), f(82.6 - 76.0)]} />
      </Sc>
      <Sc a={85.3} b={97.0}>
        <HueEnding creditAt={f(90.0 - 85.3)} />
      </Sc>

      <HueCaptions />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      />

      <Audio src={staticFile("hue_voice.mp3")} />
      <Audio src={staticFile("hue_ambience.m4a")} />
    </AbsoluteFill>
  );
};
