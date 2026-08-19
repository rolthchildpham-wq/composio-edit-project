import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { Music, Sfx } from "../lib/audio";
import { takiChunks } from "./takiChunks";
import {
  Palette,
  TplBeat,
  TplCaptions,
  TplChip,
  TplChipList,
  TplEnd,
  TplTag,
  TplBG,
} from "../lib/templates";

const mont = loadMontserrat("normal", { weights: ["700", "800", "900"], subsets: ["vietnamese", "latin"] });
const MONT = mont.fontFamily;

// palette DOTAKA (brand TAKI): nền sáng sạch, navy tin cậy, cam hành động
export const DK: Palette = {
  bg: "#F5F7FC",
  card: "#FFFFFF",
  line: "#E2E8F4",
  accent: "#F97316",
  accentSoft: "#FB923C",
  onAccent: "#FFFFFF",
  text: "#1E40AF",
  sub: "#64748B",
  glowRGBA: "249,115,22",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });

const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 34 }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, padding: "0 60px" }}>
    {children}
  </AbsoluteFill>
);

// hook navy đậm với chữ TAKI GROUP
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #1E40AF 0%, #172C7C 100%)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 130, color: "#FFFFFF", letterSpacing: 2, scale: String(pop(frame, fps, 2)) }}>
        TAKI
      </div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 56, color: DK.accentSoft, letterSpacing: 16, marginTop: 4, scale: String(pop(frame, fps, 6)) }}>
        GROUP
      </div>
    </AbsoluteFill>
  );
};

// niềm tin 2016
const Belief: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <TplBG p={DK}>
      <Col gap={36}>
        <TplTag p={DK} at={2}>
          TỪ NĂM 2016
        </TplTag>
        <div
          style={{
            background: DK.card,
            borderRadius: 32,
            padding: "56px 64px",
            boxShadow: "0 24px 60px rgba(30,64,175,0.12)",
            textAlign: "center",
            scale: String(pop(frame, fps, 10)),
            maxWidth: 900,
          }}
        >
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, color: DK.sub }}>Học là để</div>
          <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 110, color: DK.accent, lineHeight: 1.1 }}>LÀM ĐƯỢC</div>
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, color: DK.text, marginTop: 8 }}>không phải để biết</div>
        </div>
      </Col>
    </TplBG>
  );
};

// founder card
const Founder: React.FC<{ chipAt: number[] }> = ({ chipAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <TplBG p={DK}>
      <Col gap={30}>
        <TplTag p={DK} at={2}>
          NGƯỜI SÁNG LẬP
        </TplTag>
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: 999,
            overflow: "hidden",
            border: `10px solid ${DK.accent}`,
            boxShadow: "0 30px 70px rgba(30,64,175,0.25)",
            background: "#1E40AF",
            scale: String(pop(frame, fps, 6)),
          }}
        >
          <Img src={staticFile("taki_founder.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 68, color: DK.text, scale: String(pop(frame, fps, 10)) }}>
          NGUYỄN TẤT KIỂM
        </div>
        <TplChip p={DK} at={chipAt[0]} size={44}>
          15+ năm marketing & đào tạo
        </TplChip>
        <TplChip p={DK} at={chipAt[1]} size={44}>
          Cố vấn Top 50 thương hiệu
        </TplChip>
        <TplChip p={DK} at={chipAt[2]} hot size={46}>
          🔥 Thắp lửa hoài bão
        </TplChip>
      </Col>
    </TplBG>
  );
};

// văn hóa 3 giá trị
const Culture: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { k: "DAY 1", v: "mãi mãi ngày đầu tiên" },
    { k: "KAIZEN", v: "phục vụ vượt mong đợi" },
    { k: "CHAMPION", v: "cá nhân vô địch, đội nhóm vô địch" },
  ];
  return (
    <TplBG p={DK}>
      <Col gap={32}>
        <TplTag p={DK} at={2}>
          VĂN HÓA TAKI
        </TplTag>
        {items.map((it, i) => (
          <div
            key={it.k}
            style={{
              background: DK.card,
              borderRadius: 26,
              padding: "30px 56px",
              boxShadow: "0 18px 44px rgba(30,64,175,0.12)",
              textAlign: "center",
              minWidth: 760,
              scale: String(pop(frame, fps, at[i])),
            }}
          >
            <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 66, color: DK.accent }}>{it.k}</div>
            <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 34, color: DK.sub, marginTop: 4 }}>{it.v}</div>
          </div>
        ))}
      </Col>
    </TplBG>
  );
};

export const TakiMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: DK.bg, fontFamily: MONT }}>
      <Sc a={0} b={1.9}>
        <Hook />
      </Sc>
      <Sc a={1.9} b={7.4}>
        <Belief />
      </Sc>
      {/* 300K ~9.6, 350 ~11.4, 100tr ~14.6 */}
      <Sc a={7.4} b={17.1}>
        <TplBG p={DK}>
          <Col gap={26}>
            <TplTag p={DK} at={2}>
              HỆ SINH THÁI ĐÀO TẠO & CÔNG NGHỆ
            </TplTag>
            <TplStatInner />
          </Col>
        </TplBG>
      </Sc>
      {/* Academy 17.1-27.3 */}
      <Sc a={17.1} b={27.3}>
        <TplChipList
          p={DK}
          tag="TAKI ACADEMY · AI THỰC CHIẾN"
          items={[
            { label: "🏢 CHỦ DOANH NGHIỆP", at: f(22.2 - 17.1) },
            { label: "🛒 NGƯỜI BÁN HÀNG", at: f(23.2 - 17.1) },
            { label: "⚡ RA ĐƠN THẬT", at: f(24.7 - 17.1), hot: true },
            { label: "🍃 VẬN HÀNH NHẸ HƠN", at: f(25.6 - 17.1) },
          ]}
        />
      </Sc>
      {/* công cụ + lộ trình 27.3-41.7 */}
      <Sc a={27.3} b={41.7}>
        <TplChipList
          p={DK}
          tag="KHÔNG LÝ THUYẾT SUÔNG"
          items={[
            { label: "🤖 WORKFLOW TỰ ĐỘNG", at: f(30.2 - 27.3) },
            { label: "🧰 THƯ VIỆN SKILL AI", at: f(31.3 - 27.3) },
            { label: "🛍️ HỆ THỐNG BÁN HÀNG", at: f(32.2 - 27.3) },
            { label: "1️⃣ KHÓA NHẬP MÔN", at: f(35.2 - 27.3) },
            { label: "2️⃣ HỆ THỐNG KINH DOANH AI", at: f(37.6 - 27.3) },
            { label: "3️⃣ COACHING 1 KÈM 1", at: f(38.8 - 27.3), hot: true },
          ]}
        />
      </Sc>
      {/* founder 41.7-52.3: 15 năm ~43.9, top50 ~45.6, thắp lửa ~50.3 */}
      <Sc a={41.7} b={52.3}>
        <Founder chipAt={[f(43.8 - 41.7), f(45.5 - 41.7), f(50.1 - 41.7)]} />
      </Sc>
      {/* hệ sinh thái 52.3-61.2 */}
      <Sc a={52.3} b={61.2}>
        <TplChipList
          p={DK}
          tag="HỆ SINH THÁI CÔNG NGHỆ"
          items={[
            { label: "💼 MINIGO.AI · workspace AI Việt", at: f(54.0 - 52.3) },
            { label: "📚 BOOKA.AI", at: f(56.4 - 52.3) },
            { label: "🎬 TAOVIDEOAI.COM", at: f(57.4 - 52.3) },
            { label: "🛍️ BÁN LẺ · SỨC KHỎE", at: f(59.2 - 52.3) },
          ]}
        />
      </Sc>
      {/* 5 ĐH 61.2-67.3 */}
      <Sc a={61.2} b={67.3}>
        <TplChipList
          p={DK}
          tag="HỢP TÁC 5 ĐẠI HỌC LỚN"
          items={[
            { label: "NGOẠI THƯƠNG", at: f(63.3 - 61.2) },
            { label: "KINH TẾ QUỐC DÂN", at: f(64.1 - 61.2) },
            { label: "FPT · THƯƠNG MẠI", at: f(65.0 - 61.2) },
            { label: "ĐẠI NAM", at: f(66.0 - 61.2) },
          ]}
        />
      </Sc>
      {/* cộng đồng 67.3-72.6 */}
      <Sc a={67.3} b={72.6}>
        <TplChipList
          p={DK}
          tag="CỘNG ĐỒNG LÀM ĂN THẬT"
          items={[
            { label: "📖 HỌC CÙNG NHAU", at: f(69.3 - 67.3) },
            { label: "🤝 LÀM CÙNG NHAU", at: f(70.2 - 67.3) },
            { label: "🎯 GIỚI THIỆU KHÁCH CHO NHAU", at: f(71.0 - 67.3), hot: true },
          ]}
        />
      </Sc>
      {/* văn hóa 72.6-81.6: DAY1 ~74.2, KAIZEN ~76.3, CHAMPION ~78.1 */}
      <Sc a={72.6} b={81.6}>
        <Culture at={[f(74.1 - 72.6), f(76.2 - 72.6), f(78.0 - 72.6)]} />
      </Sc>
      {/* triết lý 81.6-87.3 */}
      <Sc a={81.6} b={87.3}>
        <TplBeat p={DK}>
          TỈNH TRƯỚC.
          <br />
          TIỀN SAU.
        </TplBeat>
      </Sc>
      {/* tầm nhìn 87.3-92.1 */}
      <Sc a={87.3} b={92.1}>
        <AbsoluteFill style={{ background: "linear-gradient(160deg, #1E40AF 0%, #172C7C 100%)" }}>
          <Col gap={30}>
            <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 34, color: DK.accentSoft, letterSpacing: 6 }}>3 NĂM TỚI</div>
            <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 82, color: "#FFFFFF", textAlign: "center", lineHeight: 1.2 }}>
              TẬP ĐOÀN HÀNG ĐẦU
              <br />
              <span style={{ color: DK.accentSoft }}>ĐÔNG NAM Á</span>
            </div>
            <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 34, color: "#B8C6F5" }}>về công nghệ và tri thức số</div>
          </Col>
        </AbsoluteFill>
      </Sc>
      {/* outro 92.1-115 */}
      <Sc a={92.1} b={115}>
        <TplEnd
          p={DK}
          title={
            <>
              HỌC AI <span style={{ color: DK.accent }}>THỰC CHIẾN.</span>
              <br />
              RA KẾT QUẢ <span style={{ color: DK.accent }}>THẬT.</span>
            </>
          }
          chips={[
            { label: "🌐 TAKI.VN", at: f(95.4 - 92.1) },
            { label: "📞 0989.493.588", at: f(96.6 - 92.1) },
            { label: "📍 MAC Plaza, Hà Đông, Hà Nội", at: f(97.6 - 92.1) },
          ]}
          credit="TAKI Group · Công ty TNHH Công nghệ và Giáo dục TAKI"
          creditAt={f(99.0 - 92.1)}
        />
      </Sc>

      <TplCaptions p={DK} chunks={takiChunks} hidden={[{ from: 0, to: 1.9 }]} fontSize={60} />

      <Audio src={staticFile("taki_voice.mp3")} />
      <Music mood="corporate" index={1} volume={0.08} />
      <Sfx name="thong-bao" at={9.5} volume={0.4} />
      <Sfx name="whoosh" at={81.55} volume={0.45} />
    </AbsoluteFill>
  );
};

// stats với counter — tách component để dùng hook cục bộ trong Sequence
const TplStatInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n1 = Math.round(interpolate(frame, [f2(9.4), f2(9.4) + 30], [0, 300], clamp));
  const stats: [string, string, number][] = [
    [`${n1}.000+`, "HỌC VIÊN", f2(9.4)],
    ["350+", "SỰ KIỆN ĐÃ TỔ CHỨC", f2(11.2)],
    ["100 TRIỆU+", "LƯỢT TIẾP CẬN MỖI THÁNG", f2(14.4)],
  ];
  return (
    <>
      {stats.map(([v, u, at]) => (
        <div key={u} style={{ textAlign: "center", scale: String(pop(frame, fps, at)) }}>
          <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 100, color: DK.accent, lineHeight: 1.05 }}>{v}</div>
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 30, color: DK.sub, letterSpacing: 4 }}>{u}</div>
        </div>
      ))}
    </>
  );
};
const f2 = (sec: number) => Math.round((sec - 7.4) * 30);
