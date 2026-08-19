import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Music } from "../lib/audio";
import { FONT_BOLD } from "../palette";
import {
  ChapterTitle,
  ChipRow,
  CornerMeta,
  HanoiMap,
  Kicker,
  MD,
  NavyBG,
  PhotoMini,
  StatBig,
  SubLine,
  Subtitles,
  YearBig,
} from "./MapDocKit";

const X = ({ t, hot }: { t: string; hot?: boolean }) => ({ t, hot });

// phụ đề câu đầy đủ — từ khóa vàng, mốc từ whisper
const SUBS: SubLine[] = [
  { a: 0.1, b: 6.9, parts: [X({ t: "Đây là " }), X({ t: "Hà Nội", hot: true }), X({ t: " hôm nay — nhưng " }), X({ t: "50 năm", hot: true }), X({ t: " trước, thành phố mang một dáng vóc rất khác." })] },
  { a: 6.95, b: 16.6, parts: [X({ t: "Sau ngày thống nhất, Hà Nội bước vào thời kỳ " }), X({ t: "tái thiết", hot: true }), X({ t: " — ổn định đời sống, khôi phục sản xuất." })] },
  { a: 17.1, b: 26.9, parts: [X({ t: "Năm " }), X({ t: "1986", hot: true }), X({ t: ", công cuộc " }), X({ t: "Đổi mới", hot: true }), X({ t: " thổi nhịp sống mới vào từng con phố." })] },
  { a: 28.0, b: 36.6, parts: [X({ t: "Năm " }), X({ t: "1999", hot: true }), X({ t: ", UNESCO trao danh hiệu " }), X({ t: "Thành phố vì hòa bình", hot: true }), X({ t: "." })] },
  { a: 36.7, b: 46.9, parts: [X({ t: "Ngày " }), X({ t: "1/8/2008", hot: true }), X({ t: ", toàn bộ " }), X({ t: "Hà Tây", hot: true }), X({ t: ", huyện Mê Linh và 4 xã Hòa Bình nhập về thủ đô." })] },
  { a: 46.95, b: 55.0, parts: [X({ t: "Diện tích tăng " }), X({ t: "gấp hơn 3 lần", hot: true }), X({ t: " — hơn " }), X({ t: "3.300 km²", hot: true }), X({ t: ", một trong những thủ đô rộng nhất thế giới." })] },
  { a: 55.4, b: 62.5, parts: [X({ t: "Hạ tầng bứt tốc: " }), X({ t: "cầu Nhật Tân", hot: true }), X({ t: ", " }), X({ t: "đại lộ Thăng Long", hot: true }), X({ t: " vươn về phía Tây." })] },
  { a: 62.55, b: 73.6, parts: [X({ t: "Năm " }), X({ t: "2021", hot: true }), X({ t: ", tuyến metro đầu tiên cả nước " }), X({ t: "Cát Linh – Hà Đông", hot: true }), X({ t: " lăn bánh; năm " }), X({ t: "2024", hot: true }), X({ t: ", thêm " }), X({ t: "Nhổn – ga Hà Nội", hot: true }), X({ t: "." })] },
  { a: 73.65, b: 79.3, parts: [X({ t: "Năm " }), X({ t: "2019", hot: true }), X({ t: ", Hà Nội gia nhập mạng lưới " }), X({ t: "Thành phố sáng tạo", hot: true }), X({ t: " của UNESCO." })] },
  { a: 79.6, b: 88.9, parts: [X({ t: "Hôm nay: nhà của " }), X({ t: "hơn 8 triệu người", hot: true }), X({ t: ", đóng góp khoảng " }), X({ t: "1/8", hot: true }), X({ t: " kinh tế cả nước." })] },
  { a: 89.0, b: 96.9, parts: [X({ t: "50 năm", hot: true }), X({ t: " — từ tái thiết sau chiến tranh đến " }), X({ t: "đô thị sáng tạo", hot: true }), X({ t: ". Hành trình vẫn tiếp tục." })] },
];

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 14, len - 16, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {children}
    </AbsoluteFill>
  );
};

const Left: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 150 }) => (
  <div style={{ position: "absolute", left: 100, top, display: "flex", flexDirection: "column", gap: 30 }}>{children}</div>
);

export const HnMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const gframe = useCurrentFrame();
  // vùng Hà Tây sáng dần đúng lúc voice nói "nhập về thủ đô" (~44.1-47.1s toàn cục)
  const expReveal = interpolate(gframe, [Math.round(44.1 * fps), Math.round(47.1 * fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <Fade len={f(b) - f(a)}>{children}</Fade>
    </Sequence>
  );
  const meta = <CornerMeta tl="30 · 04 · 2025" tr="50 NĂM · 1975 — 2025" br="Dữ liệu: GADM 4.1 · OSM" />;

  return (
    <AbsoluteFill style={{ background: MD.bg }}>
      {/* C1 — intro */}
      <Sc a={0} b={6.9}>
        <NavyBG>
          <HanoiMap cam={{ cx: 520, cy: 470, s: 0.95 }} camTo={{ cx: 560, cy: 450, s: 1.15 }} camDur={200} expLit={1} />
          {meta}
          <Left top={180}>
            <Kicker>ĐÂY LÀ</Kicker>
            <ChapterTitle size={84}>
              HÀ NỘI
              <br />
              HÔM NAY
            </ChapterTitle>
            <PhotoMini src="hn_skyline.jpg" name="Thủ đô bên sông Hồng" desc="trung tâm mới phía Tây" at={26} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C2 — 1975-76 tái thiết */}
      <Sc a={6.9} b={17.2}>
        <NavyBG>
          <HanoiMap cam={{ cx: 610, cy: 430, s: 2.1 }} dimExp pins={[{ at: f(3.0), lm: "hoGuom", label: "HOÀN KIẾM", dy: -50 }]} />
          {meta}
          <Left>
            <Kicker>1975 → 1986</Kicker>
            <ChapterTitle>
              BƯỚC VÀO THỜI KỲ
              <br />
              TÁI THIẾT
            </ChapterTitle>
            <PhotoMini src="hn_phoco.jpg" name="Phố cổ Hà Nội" tag="Bối cảnh" desc="ổn định đời sống · khôi phục sản xuất" at={f(3.2)} bw />
            <ChipRow items={["ỔN ĐỊNH ĐỜI SỐNG", "KHÔI PHỤC SẢN XUẤT"]} at={f(6.0)} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C3 — 1986 Đổi mới */}
      <Sc a={17.2} b={27.5}>
        <NavyBG>
          <HanoiMap cam={{ cx: 600, cy: 440, s: 1.9 }} camTo={{ cx: 580, cy: 430, s: 2.2 }} camDur={280} dimExp />
          {meta}
          <Left>
            <Kicker>CÔNG CUỘC ĐỔI MỚI</Kicker>
            <YearBig at={f(0.9)} note="kinh tế thị trường — những khu công nghiệp, khu đô thị đầu tiên hình thành">
              1986
            </YearBig>
            <ChipRow items={["KHU CÔNG NGHIỆP", "KHU ĐÔ THỊ MỚI"]} at={f(6.4)} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C4 — 1999 UNESCO hòa bình */}
      <Sc a={27.5} b={37.1}>
        <NavyBG>
          <HanoiMap cam={{ cx: 620, cy: 435, s: 2.3 }} dimExp pins={[{ at: f(1.6), lm: "hoGuom", label: "HỒ GƯƠM", dy: -55, color: MD.gold }]} />
          {meta}
          <Left>
            <Kicker>1999 · UNESCO</Kicker>
            <ChapterTitle>
              "THÀNH PHỐ
              <br />
              VÌ HÒA BÌNH"
            </ChapterTitle>
            <PhotoMini src="hn_hoguom.jpg" name="Tháp Rùa — Hồ Gươm" desc="đô thị duy nhất châu Á – TBD năm đó" at={f(3.4)} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C5 — 2008 mở rộng (map là nhân vật chính) */}
      <Sc a={37.1} b={55.4}>
        <NavyBG>
          <HanoiMap
            cam={{ cx: 600, cy: 440, s: 2.0 }}
            camTo={{ cx: 490, cy: 480, s: 1.05 }}
            camDur={f(8)}
            expLit={expReveal}
            pins={[
              { at: f(7.8), lm: "sonTay", label: "SƠN TÂY", dy: -50 },
              { at: f(8.6), lm: "haDong", label: "HÀ ĐÔNG", dy: 55 },
              { at: f(9.4), lm: [575, 250], label: "MÊ LINH", dy: -50 },
            ]}
          />
          {meta}
          <Left>
            <Kicker>BƯỚC NGOẶT · 01 · 08 · 2008</Kicker>
            <ChapterTitle>
              MỞ RỘNG
              <br />
              ĐỊA GIỚI THỦ ĐÔ
            </ChapterTitle>
            <StatBig value="×3,6" unit="DIỆN TÍCH" at={f(10.4)} />
            <StatBig value="3.300+" unit="KM²" at={f(12.2)} />
            <ChipRow items={["HÀ TÂY", "MÊ LINH", "4 XÃ HÒA BÌNH"]} at={f(6.2)} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C6 — hạ tầng bứt tốc */}
      <Sc a={55.4} b={74.4}>
        <NavyBG>
          <HanoiMap
            cam={{ cx: 545, cy: 420, s: 1.5 }}
            camTo={{ cx: 545, cy: 430, s: 1.75 }}
            camDur={f(17)}
            expLit={1}
            pins={[
              { at: f(57.7 - 55.4), lm: "nhatTan", label: "CẦU NHẬT TÂN · 2015", dy: -55 },
              { at: f(60.2 - 55.4), lm: [420, 470], label: "ĐẠI LỘ THĂNG LONG", dy: 60 },
              { at: f(65.6 - 55.4), lm: "catLinh", label: "CÁT LINH – HÀ ĐÔNG · 2021", dy: 62, color: MD.gold },
              { at: f(71.2 - 55.4), lm: "nhon", label: "NHỔN – GA HÀ NỘI · 2024", dy: -58 },
            ]}
          />
          {meta}
          <Left>
            <Kicker>2008 → 2024</Kicker>
            <ChapterTitle>
              HẠ TẦNG
              <br />
              BỨT TỐC
            </ChapterTitle>
            <Sequence from={f(0)} durationInFrames={f(64.4 - 55.4)} layout="none">
              <PhotoMini src="hn_nhattan.jpg" name="Cầu Nhật Tân" desc="cửa ngõ Nội Bài — trung tâm" at={f(1.8)} />
            </Sequence>
            <Sequence from={f(64.4 - 55.4)} layout="none">
              <PhotoMini src="hn_metro.jpg" name="Metro Cát Linh – Hà Đông" desc="tuyến đường sắt đô thị đầu tiên cả nước" at={4} />
            </Sequence>
          </Left>
        </NavyBG>
      </Sc>

      {/* C7 — 2019 sáng tạo + hôm nay */}
      <Sc a={74.4} b={89.3}>
        <NavyBG>
          <HanoiMap cam={{ cx: 520, cy: 470, s: 1.1 }} expLit={1} pins={[{ at: f(1.2), lm: "hoGuom", label: "HÀ NỘI · SÁNG TẠO", dy: -55, color: MD.gold }]} />
          {meta}
          <Left>
            <Kicker>2019 · THÀNH PHỐ SÁNG TẠO UNESCO</Kicker>
            <ChapterTitle>
              MỘT KHÔNG GIAN
              <br />
              SÁNG TẠO LỚN HƠN
            </ChapterTitle>
            <StatBig value="8+" unit="TRIỆU NGƯỜI" at={f(79.9 - 74.4)} />
            <StatBig value="~1/8" unit="KINH TẾ CẢ NƯỚC" at={f(83.6 - 74.4)} />
            <ChipRow items={["THIẾT KẾ", "DI SẢN", "CÔNG NGHỆ"]} at={f(77.0 - 74.4)} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C8 — kết */}
      <Sc a={89.3} b={97.5}>
        <NavyBG>
          <HanoiMap cam={{ cx: 520, cy: 470, s: 1.0 }} camTo={{ cx: 540, cy: 455, s: 1.12 }} camDur={f(8)} expLit={1} />
          {meta}
          <Left top={300}>
            <Kicker>1975 — 2025</Kicker>
            <ChapterTitle size={76}>
              50 NĂM,
              <br />
              HÀNH TRÌNH
              <br />
              VẪN TIẾP TỤC
            </ChapterTitle>
          </Left>
        </NavyBG>
      </Sc>

      {/* C9 — credits */}
      <Sc a={97.5} b={113}>
        <NavyBG>
          <HanoiMap cam={{ cx: 520, cy: 470, s: 0.9 }} expLit={1} x={1150} w={800} />
          <Left top={190}>
            <Kicker>ĐÂY LÀ VIDEO VỀ HÀ NỘI</Kicker>
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 24, color: MD.gray, lineHeight: 1.5, maxWidth: 820 }}>
              Một hành trình 50 năm phát triển của thủ đô — kinh tế, đô thị và con người.
            </div>
            {[
              ["DỮ LIỆU BẢN ĐỒ", "GADM 4.1 · OpenStreetMap contributors"],
              ["TƯ LIỆU HÌNH ẢNH", "Wikimedia Commons (CC BY-SA)"],
              ["QUY TRÌNH CÔNG NGHỆ", "Remotion · FFmpeg · Whisper · Vbee AI"],
              ["NỘI DUNG", "tổng hợp từ nguồn báo chí công khai"],
            ].map(([k, v], i) => (
              <div key={k} style={{ opacity: 1 }}>
                <div style={{ fontFamily: FONT_BOLD, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: MD.gold }}>{k}</div>
                <div style={{ fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 22, color: MD.gray, marginTop: 4 }}>{v}</div>
              </div>
            ))}
            <div style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 34, color: MD.white, marginTop: 10 }}>
              CẢM ƠN BẠN ĐÃ THEO DÕI
            </div>
          </Left>
        </NavyBG>
      </Sc>

      <Subtitles lines={SUBS} />

      <Audio src={staticFile("hn_voice.mp3")} />
      <Music mood="trang-nghiem" volume={0.12} />
    </AbsoluteFill>
  );
};

