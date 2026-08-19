import React from "react";
import {
  AbsoluteFill,
  Easing,
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
import { FONT_SERIF } from "../palette";
import { Music, Sfx } from "../lib/audio";

const mont = loadMontserrat("normal", { weights: ["700", "800", "900"], subsets: ["vietnamese", "latin"] });
const MONT = mont.fontFamily;

// cinematic DOTAKA: navy điện ảnh + cam hành động
const TC = {
  bg: "#070D1F",
  panel: "#101A36",
  line: "#22305A",
  orange: "#F97316",
  orangeSoft: "#FB923C",
  white: "#F4F7FF",
  gray: "#8E9BC0",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 130 } });
const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: ease }),
  translate: `0px ${interpolate(frame, [at, at + 16], [26, 0], { ...clamp, easing: ease })}px`,
});

const NavyBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const dots = React.useMemo(() => {
    let s = 7;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 60 }, () => ({ x: rnd() * 100, y: rnd() * 100, o: 0.06 + rnd() * 0.16, r: 1 + rnd() * 1.6 }));
  }, []);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 55% 38%, #0D1734 0%, ${TC.bg} 65%)` }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {dots.map((d, i) => (
          <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="#AEBDE8" opacity={d.o} />
        ))}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 2 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 27, letterSpacing: 6, color: TC.orangeSoft, ...rise(frame, at) }}>
      {children}
    </div>
  );
};

const Title: React.FC<{ children: React.ReactNode; at?: number; size?: number }> = ({ children, at = 8, size = 64 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: size, lineHeight: 1.14, color: TC.white, maxWidth: 800, ...rise(frame, at) }}>
      {children}
    </div>
  );
};

const Stat: React.FC<{ v: string; u: string; at: number }> = ({ v, u, at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={rise(frame, at)}>
      <span style={{ fontFamily: MONT, fontWeight: 900, fontSize: 92, color: TC.orange }}>{v}</span>
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 30, color: TC.gray, marginLeft: 16, letterSpacing: 3 }}>{u}</span>
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; at: number; hot?: boolean; size?: number }> = ({ children, at, hot, size = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "inline-flex",
        border: `2px solid ${hot ? TC.orange : TC.line}`,
        background: hot ? TC.orange : "rgba(16,26,54,0.85)",
        color: hot ? "#FFF7EC" : TC.white,
        borderRadius: 12,
        padding: "16px 30px",
        fontFamily: MONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 1,
        scale: String(pop(frame, fps, at)),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// panel ảnh bên phải, ken-burns chậm
const PhotoPanel: React.FC<{ src: string; pos?: string; at?: number; w?: number; h?: number; x?: number }> = ({
  src,
  pos = "center",
  at = 6,
  w = 860,
  h = 760,
  x = 980,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: (1080 - h) / 2 - 40,
        width: w,
        height: h,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${TC.line}`,
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        scale: String(pop(frame, fps, at)),
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          scale: String(interpolate(frame, [0, 320], [1.03, 1.14], clamp)),
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg, transparent 60%, rgba(7,13,31,0.55))" }} />
    </div>
  );
};

const Left: React.FC<{ children: React.ReactNode; top?: number; gap?: number }> = ({ children, top = 200, gap = 30 }) => (
  <div style={{ position: "absolute", left: 110, top, display: "flex", flexDirection: "column", alignItems: "flex-start", gap }}>{children}</div>
);

const CornerMeta: React.FC = () => {
  const s: React.CSSProperties = { position: "absolute", fontFamily: MONT, fontWeight: 700, fontSize: 19, letterSpacing: 3, color: TC.gray, opacity: 0.85 };
  return (
    <>
      <div style={{ ...s, left: 90, top: 48 }}>TAKI GROUP · EST. 2016</div>
      <div style={{ ...s, right: 90, top: 48 }}>HỆ SINH THÁI ĐÀO TẠO & CÔNG NGHỆ</div>
      <div style={{ ...s, right: 90, bottom: 36, fontSize: 16 }}>taki.vn</div>
    </>
  );
};

// phụ đề câu đầy đủ, từ khóa cam
type Part = { t: string; hot?: boolean };
const SUBS: { a: number; b: number; parts: Part[] }[] = [
  { a: 1.92, b: 6.9, parts: [{ t: "Chúng tôi bắt đầu năm " }, { t: "2016", hot: true }, { t: ": học là để " }, { t: "làm được", hot: true }, { t: ", không phải để biết." }] },
  { a: 7.44, b: 16.6, parts: [{ t: "Hơn " }, { t: "300.000 học viên", hot: true }, { t: ", " }, { t: "350+ sự kiện", hot: true }, { t: ", mỗi tháng chạm tới " }, { t: "100 triệu lượt tiếp cận", hot: true }, { t: "." }] },
  { a: 17.12, b: 26.8, parts: [{ t: "Lõi của TAKI là " }, { t: "TAKI Academy", hot: true }, { t: ": dạy kinh doanh và ứng dụng " }, { t: "AI thực chiến", hot: true }, { t: "." }] },
  { a: 27.28, b: 34.4, parts: [{ t: "Học xong, anh chị có công cụ " }, { t: "chạy được ngay", hot: true }, { t: ": workflow, skill AI, hệ thống bán hàng." }] },
  { a: 34.4, b: 41.2, parts: [{ t: "Lộ trình rõ ràng: từ " }, { t: "nhập môn", hot: true }, { t: " đến " }, { t: "coaching 1 kèm 1", hot: true }, { t: ", đồng hành đến khi ra kết quả." }] },
  { a: 41.68, b: 51.9, parts: [{ t: "Người sáng lập " }, { t: "Nguyễn Tất Kiểm", hot: true }, { t: ": 15+ năm nghề, cố vấn " }, { t: "Top 50 thương hiệu", hot: true }, { t: ", sứ mệnh " }, { t: "thắp lửa hoài bão", hot: true }, { t: "." }] },
  { a: 52.34, b: 60.9, parts: [{ t: "Hệ sinh thái công nghệ: " }, { t: "MiniGo.AI", hot: true }, { t: ", " }, { t: "BOOKA.AI", hot: true }, { t: ", nền tảng tạo video AI, bán lẻ và sức khỏe." }] },
  { a: 61.24, b: 67.0, parts: [{ t: "Hợp tác đào tạo cùng " }, { t: "5 trường đại học lớn", hot: true }, { t: "." }] },
  { a: 67.28, b: 72.3, parts: [{ t: "Một cộng đồng " }, { t: "làm ăn thật", hot: true }, { t: ": học, làm, giới thiệu khách cho nhau." }] },
  { a: 72.66, b: 81.4, parts: [{ t: "Văn hóa ba từ: " }, { t: "DAY 1", hot: true }, { t: " · " }, { t: "KAIZEN", hot: true }, { t: " · " }, { t: "CHAMPION", hot: true }, { t: "." }] },
  { a: 81.6, b: 86.9, parts: [{ t: "Triết lý xuyên suốt: " }, { t: "Tỉnh trước. Tiền sau.", hot: true }, { t: " Tiền là hệ quả của sự rõ ràng." }] },
  { a: 87.3, b: 91.9, parts: [{ t: "Ba năm tới: " }, { t: "tập đoàn hàng đầu Đông Nam Á", hot: true }, { t: " về công nghệ và tri thức số." }] },
  { a: 92.12, b: 96.9, parts: [{ t: "TAKI Group. " }, { t: "Học AI thực chiến. Ra kết quả thật.", hot: true }, { t: " · taki.vn" }] },
];

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = SUBS.find((l) => t >= l.a && t < l.b);
  if (!line) return null;
  const localF = (t - line.a) * fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        padding: "70px 140px 42px",
        background: "linear-gradient(transparent, rgba(4,8,20,0.9) 55%)",
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(localF, [0, 8], [0, 1], clamp),
      }}
    >
      <div style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 35, color: TC.white, textAlign: "center", lineHeight: 1.45, maxWidth: 1520 }}>
        {line.parts.map((p, i) => (
          <span key={i} style={{ color: p.hot ? TC.orangeSoft : TC.white, fontWeight: p.hot ? 700 : 600 }}>
            {p.t}
          </span>
        ))}
      </div>
    </div>
  );
};

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 14, len - 16, len], [0, 1, 1, 0], clamp) }}>{children}</AbsoluteFill>
  );
};

export const TakiCine: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <Fade len={f(b) - f(a)}>{children}</Fade>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: TC.bg }}>
      {/* C1 — logo mở màn trên nền sự kiện */}
      <Sc a={0} b={1.9}>
        <AbsoluteFill>
          <Img src={staticFile("tke_1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
          <AbsoluteFill style={{ background: "linear-gradient(rgba(7,13,31,0.55), rgba(7,13,31,0.85))", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 150, color: TC.white, letterSpacing: 6 }}>TAKI</div>
            <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 52, color: TC.orangeSoft, letterSpacing: 26, marginTop: 2 }}>GROUP</div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sc>

      {/* C2 — niềm tin */}
      <Sc a={1.9} b={7.4}>
        <NavyBG>
          <CornerMeta />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
            <Kicker at={4}>NIỀM TIN TỪ NGÀY ĐẦU</Kicker>
            <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: TC.gray, ...rise(useCurrentFrameSafe(), 10) }}>Học là để</div>
            <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 170, color: TC.orange, lineHeight: 1 }}>LÀM ĐƯỢC</div>
            <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: TC.white }}>không phải để biết</div>
          </AbsoluteFill>
        </NavyBG>
      </Sc>

      {/* C3 — stats + ảnh sự kiện */}
      <Sc a={7.4} b={17.1}>
        <NavyBG>
          <PhotoPanel src="tke_1.jpg" pos="72% 40%" />
          <CornerMeta />
          <Left top={230} gap={44}>
            <Kicker>HỆ SINH THÁI ĐÀO TẠO & CÔNG NGHỆ</Kicker>
            <Stat v="300.000+" u="HỌC VIÊN" at={f(9.4 - 7.4)} />
            <Stat v="350+" u="SỰ KIỆN ĐÃ TỔ CHỨC" at={f(11.2 - 7.4)} />
            <Stat v="100 TRIỆU+" u="TIẾP CẬN / THÁNG" at={f(14.4 - 7.4)} />
          </Left>
        </NavyBG>
      </Sc>

      {/* C4 — Academy */}
      <Sc a={17.1} b={27.3}>
        <NavyBG>
          <PhotoPanel src="tke_1.jpg" pos="85% 30%" at={4} />
          <CornerMeta />
          <Left top={250} gap={26}>
            <Kicker>LÕI CỦA TAKI</Kicker>
            <Title size={80}>
              TAKI
              <br />
              ACADEMY
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Chip at={f(22.1 - 17.1)}>🏢 CHỦ DOANH NGHIỆP</Chip>
              <Chip at={f(23.1 - 17.1)}>🛒 NGƯỜI BÁN HÀNG</Chip>
              <Chip at={f(24.6 - 17.1)} hot>
                ⚡ RA ĐƠN THẬT · VẬN HÀNH NHẸ
              </Chip>
            </div>
          </Left>
        </NavyBG>
      </Sc>

      {/* C5 — công cụ + lộ trình */}
      <Sc a={27.3} b={41.7}>
        <NavyBG>
          <CornerMeta />
          <Left top={200} gap={22}>
            <Kicker>KHÔNG LÝ THUYẾT SUÔNG</Kicker>
            <Title size={56}>CÔNG CỤ CHẠY ĐƯỢC NGAY</Title>
            <Chip at={f(30.2 - 27.3)}>🤖 WORKFLOW TỰ ĐỘNG</Chip>
            <Chip at={f(31.3 - 27.3)}>🧰 THƯ VIỆN SKILL AI</Chip>
            <Chip at={f(32.2 - 27.3)}>🛍️ HỆ THỐNG BÁN HÀNG</Chip>
          </Left>
          <div style={{ position: "absolute", left: 1020, top: 260, display: "flex", flexDirection: "column", gap: 26 }}>
            <Kicker at={f(34.2 - 27.3)}>LỘ TRÌNH</Kicker>
            {[
              ["1", "KHÓA NHẬP MÔN", "traffic · nhân hiệu", f(35.2 - 27.3), false],
              ["2", "HỆ THỐNG KINH DOANH AI", "xương sống tăng trưởng", f(37.5 - 27.3), false],
              ["3", "COACHING 1 KÈM 1", "đồng hành đến khi ra kết quả", f(38.8 - 27.3), true],
            ].map(([n, k, v, at, hot]) => (
              <StepRow key={k as string} n={n as string} k={k as string} v={v as string} at={at as number} hot={hot as boolean} />
            ))}
          </div>
        </NavyBG>
      </Sc>

      {/* C6 — founder */}
      <Sc a={41.7} b={52.3}>
        <NavyBG>
          <PhotoPanel src="taki_founder.png" at={4} w={700} h={700} x={1080} />
          <CornerMeta />
          <Left top={250} gap={24}>
            <Kicker>NGƯỜI SÁNG LẬP</Kicker>
            <Title size={72}>
              NGUYỄN
              <br />
              TẤT KIỂM
            </Title>
            <Chip at={f(43.8 - 41.7)}>15+ NĂM MARKETING & ĐÀO TẠO</Chip>
            <Chip at={f(45.5 - 41.7)}>CỐ VẤN TOP 50 THƯƠNG HIỆU</Chip>
            <Chip at={f(50.1 - 41.7)} hot>
              🔥 THẮP LỬA HOÀI BÃO
            </Chip>
          </Left>
        </NavyBG>
      </Sc>

      {/* C7 — hệ sinh thái */}
      <Sc a={52.3} b={61.2}>
        <NavyBG>
          <CornerMeta />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
            <Kicker>QUANH ACADEMY LÀ CÁC MẢNG CÔNG NGHỆ</Kicker>
            <div style={{ display: "flex", gap: 26 }}>
              <Chip at={f(54.0 - 52.3)} size={38}>
                💼 MINIGO.AI
              </Chip>
              <Chip at={f(56.4 - 52.3)} size={38}>
                📚 BOOKA.AI
              </Chip>
            </div>
            <div style={{ display: "flex", gap: 26 }}>
              <Chip at={f(57.4 - 52.3)} size={38}>
                🎬 TẠO VIDEO AI HÀNG LOẠT
              </Chip>
              <Chip at={f(59.2 - 52.3)} size={38}>
                🛍️ BÁN LẺ · SỨC KHỎE
              </Chip>
            </div>
          </AbsoluteFill>
        </NavyBG>
      </Sc>

      {/* C8 — 5 ĐH */}
      <Sc a={61.2} b={67.3}>
        <NavyBG>
          <CornerMeta />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}>
            <Kicker>HỢP TÁC ĐÀO TẠO</Kicker>
            <Title at={8} size={62}>
              5 TRƯỜNG ĐẠI HỌC LỚN
            </Title>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1400 }}>
              <Chip at={f(63.3 - 61.2)}>NGOẠI THƯƠNG</Chip>
              <Chip at={f(64.1 - 61.2)}>KINH TẾ QUỐC DÂN</Chip>
              <Chip at={f(64.9 - 61.2)}>FPT</Chip>
              <Chip at={f(65.4 - 61.2)}>THƯƠNG MẠI</Chip>
              <Chip at={f(66.0 - 61.2)}>ĐẠI NAM</Chip>
            </div>
          </AbsoluteFill>
        </NavyBG>
      </Sc>

      {/* C9 — cộng đồng trên nền sự kiện */}
      <Sc a={67.3} b={72.6}>
        <AbsoluteFill>
          <Img src={staticFile("tke_1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
          <AbsoluteFill style={{ background: "linear-gradient(rgba(7,13,31,0.5), rgba(7,13,31,0.82))" }} />
          <CornerMeta />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
            <Kicker>PHÍA SAU TẤT CẢ</Kicker>
            <Title at={8} size={70}>
              CỘNG ĐỒNG LÀM ĂN THẬT
            </Title>
            <div style={{ display: "flex", gap: 22 }}>
              <Chip at={f(69.2 - 67.3)}>📖 HỌC CÙNG NHAU</Chip>
              <Chip at={f(70.1 - 67.3)}>🤝 LÀM CÙNG NHAU</Chip>
              <Chip at={f(70.9 - 67.3)} hot>
                🎯 GIỚI THIỆU KHÁCH CHO NHAU
              </Chip>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sc>

      {/* C10 — văn hóa */}
      <Sc a={72.6} b={81.6}>
        <NavyBG>
          <CornerMeta />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 44 }}>
            <Kicker>VĂN HÓA TAKI</Kicker>
            <div style={{ display: "flex", gap: 30 }}>
              {[
                ["DAY 1", "mãi mãi ngày đầu tiên", f(74.1 - 72.6)],
                ["KAIZEN", "phục vụ vượt mong đợi", f(76.2 - 72.6)],
                ["CHAMPION", "cá nhân & đội nhóm vô địch", f(78.0 - 72.6)],
              ].map(([k, v, at]) => (
                <CultureCard key={k as string} k={k as string} v={v as string} at={at as number} />
              ))}
            </div>
          </AbsoluteFill>
        </NavyBG>
      </Sc>

      {/* C11 — beat triết lý */}
      <Sc a={81.6} b={87.3}>
        <AbsoluteFill style={{ background: `linear-gradient(160deg, ${TC.orange} 0%, #C2410C 100%)`, justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 150, color: "#FFF7EC", textAlign: "center", lineHeight: 1.15, textShadow: "0 14px 0 rgba(0,0,0,0.15)" }}>
            TỈNH TRƯỚC.
            <br />
            TIỀN SAU.
          </div>
        </AbsoluteFill>
      </Sc>

      {/* C12 — tầm nhìn */}
      <Sc a={87.3} b={92.1}>
        <NavyBG>
          <CornerMeta />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26 }}>
            <Kicker>3 NĂM TỚI</Kicker>
            <Title at={8} size={86}>
              TẬP ĐOÀN HÀNG ĐẦU
              <br />
              <span style={{ color: TC.orangeSoft }}>ĐÔNG NAM Á</span>
            </Title>
            <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 32, color: TC.gray }}>về công nghệ và tri thức số</div>
          </AbsoluteFill>
        </NavyBG>
      </Sc>

      {/* C13 — outro credits */}
      <Sc a={92.1} b={115}>
        <NavyBG>
          <Left top={210} gap={26}>
            <Kicker>TAKI GROUP</Kicker>
            <Title size={64}>
              HỌC AI <span style={{ color: TC.orangeSoft }}>THỰC CHIẾN.</span>
              <br />
              RA KẾT QUẢ <span style={{ color: TC.orangeSoft }}>THẬT.</span>
            </Title>
            {[
              ["LIÊN HỆ", "taki.vn · 0989.493.588 · Hotro@takigroup.vn"],
              ["TRỤ SỞ", "Tầng 4, MAC Plaza, 10 Trần Phú, Hà Đông, Hà Nội"],
              ["QUY TRÌNH CÔNG NGHỆ", "Remotion · FFmpeg · Whisper · Vbee AI (giọng đọc: voice clone founder)"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: TC.orangeSoft }}>{k}</div>
                <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 24, color: TC.gray, marginTop: 4 }}>{v}</div>
              </div>
            ))}
            <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 36, color: TC.white, marginTop: 8 }}>CẢM ƠN BẠN ĐÃ THEO DÕI</div>
          </Left>
          <PhotoPanel src="tke_1.jpg" pos="80% 35%" at={10} w={760} h={640} x={1070} />
        </NavyBG>
      </Sc>

      <Subtitles />

      <Audio src={staticFile("taki_voice.mp3")} />
      <Music mood="corporate" index={1} volume={0.08} />
      <Sfx name="whoosh" at={81.55} volume={0.45} />
    </AbsoluteFill>
  );
};

// hooks helpers cho các cảnh viết gọn
function useCurrentFrameSafe() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCurrentFrame();
}

const StepRow: React.FC<{ n: string; k: string; v: string; at: number; hot: boolean }> = ({ n, k, v, at, hot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, scale: String(pop(frame, fps, at)) }}>
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 999,
          background: hot ? TC.orange : TC.panel,
          border: `2px solid ${hot ? TC.orange : TC.line}`,
          color: TC.white,
          fontFamily: MONT,
          fontWeight: 900,
          fontSize: 32,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 36, color: hot ? TC.orangeSoft : TC.white }}>{k}</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 22, color: TC.gray }}>{v}</div>
      </div>
    </div>
  );
};

const CultureCard: React.FC<{ k: string; v: string; at: number }> = ({ k, v, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: TC.panel,
        border: `2px solid ${TC.line}`,
        borderRadius: 24,
        padding: "44px 54px",
        textAlign: "center",
        minWidth: 420,
        scale: String(pop(frame, fps, at)),
      }}
    >
      <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 60, color: TC.orange }}>{k}</div>
      <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 26, color: TC.gray, marginTop: 8 }}>{v}</div>
    </div>
  );
};
