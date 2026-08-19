import "./index.css";
import { Composition } from "remotion";
import { Main } from "./Main";
import { HueMain } from "./hue/HueMain";
import { Op16Main } from "./op16/Op16Main";
import { CkMain } from "./ck/CkMain";
import { Ls13Main } from "./ls13/Ls13Main";
import { YtMain } from "./yt/YtMain";
import { RwMain } from "./rw/RwMain";
import { KaliMain } from "./kali/KaliMain";
import { TemplateDemo } from "./lib/TemplateDemo";
import { CcMain } from "./cc/CcMain";
import { PdMain } from "./vintage/PdMain";
import { HnMain } from "./mapdoc/HnMain";
import { TakiMain } from "./taki/TakiMain";
import { TakiCine } from "./taki/TakiCine";
import { RtMain } from "./rt/RtMain";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ComposioEdit"
        component={Main}
        durationInFrames={3275}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HueMemorial"
        component={HueMain}
        durationInFrames={2910}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OnePlus16"
        component={Op16Main}
        durationInFrames={1605}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChungKhoan"
        component={CkMain}
        durationInFrames={2160}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LietSi13"
        component={Ls13Main}
        durationInFrames={1995}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="YtNiches"
        component={YtMain}
        durationInFrames={2280}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RunwayAI"
        component={RwMain}
        durationInFrames={3045}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KaliSulphate"
        component={KaliMain}
        durationInFrames={1044}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeCodeLeak"
        component={CcMain}
        durationInFrames={2385}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Piltdown"
        component={PdMain}
        durationInFrames={3240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HanoiMapDoc"
        component={HnMain}
        durationInFrames={3390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TakiGroup"
        component={TakiMain}
        durationInFrames={3450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TakiCinematic"
        component={TakiCine}
        durationInFrames={3450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ReviewTool"
        component={RtMain}
        durationInFrames={1236}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TemplateDemo"
        component={TemplateDemo}
        durationInFrames={525}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
