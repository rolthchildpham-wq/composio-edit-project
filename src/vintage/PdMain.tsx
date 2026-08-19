import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Music } from "../lib/audio";
import { Board, HandX, Label, Note, PinPhoto, Pin, RedString, Stamp, VC } from "./VintageKit";
import { FONT_SERIF } from "../palette";

// fade mềm giữa các cảnh — style tài liệu, không cắt gắt
const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 12, len - 14, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {children}
    </AbsoluteFill>
  );
};

export const PdMain: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const Sc: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
    <Sequence from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
      <Fade len={f(b) - f(a)}>{children}</Fade>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: VC.desk }}>
      {/* S1 — tiêu đề hồ sơ */}
      <Sc a={0} b={8.3}>
        <Board pan={-24}>
          <div
            style={{
              position: "absolute",
              left: 160,
              top: 240,
              width: 900,
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 1.25,
              color: VC.ink,
            }}
          >
            Vụ lừa đảo khảo cổ
            <br />
            lớn nhất thế kỷ 20
          </div>
          <PinPhoto src="pd_skull.jpg" x={1080} y={140} w={360} rot={3} at={8} caption="hộp sọ Piltdown" />
          <Stamp x={210} y={560} at={26} size={230}>
            HỒ SƠ
            <br />
            MẬT
          </Stamp>
        </Board>
      </Sc>

      {/* S2 — 1907 Đức, Anh ấm ức */}
      <Sc a={8.3} b={19.4}>
        <Board pan={20}>
          <Label x={140} y={130} at={4} size={46}>
            1907 · nước Đức
          </Label>
          <PinPhoto src="pd_jaw.jpg" x={150} y={280} w={460} rot={-2} at={10} caption="xương hàm Heidelberg, 1907" />
          <Pin x={600} y={430} at={f(14.6 - 8.3)} />
          <RedString from={[600, 430]} to={[1140, 330]} at={f(15.0 - 8.3)} sag={90} />
          <Pin x={1140} y={330} at={f(15.6 - 8.3)} />
          <Label x={1010} y={200} at={f(15.8 - 8.3)} rot={2} size={46}>
            nước Anh — "ấm ức"
          </Label>
          <Note x={1020} y={330} at={f(17.0 - 8.3)} size={34}>
            tự hào đứng đầu khoa học,
            <br />
            chưa có "tổ tiên" của riêng mình
          </Note>
        </Board>
      </Sc>

      {/* S3 — 1908 Piltdown, Dawson */}
      <Sc a={19.4} b={30.5}>
        <Board pan={-18}>
          <Label x={140} y={120} at={4} size={44}>
            1908 · Piltdown, Sussex
          </Label>
          <PinPhoto src="pd_2.jpg" x={150} y={250} w={620} rot={-2} at={10} caption="Đao-xơn (ngồi) tại nơi 'phát hiện'" />
          <PinPhoto src="pd_dawson.jpg" x={890} y={230} w={300} rot={3} at={f(25.8 - 19.4)} caption="Sác-lơ Đao-xơn" />
          <RedString from={[770, 420]} to={[900, 380]} at={f(26.6 - 19.4)} sag={26} />
          <Note x={880} y={670} at={f(27.6 - 19.4)} size={34}>
            luật sư · nhà khảo cổ nghiệp dư
          </Note>
        </Board>
      </Sc>

      {/* S4 — 1912 công bố phát hiện thế kỷ */}
      <Sc a={30.5} b={42.0}>
        <Board pan={16}>
          <PinPhoto src="pd_gang.jpg" x={170} y={150} w={700} rot={-1.5} at={6} caption="nhóm 'khám phá' Piltdown" />
          <PinPhoto src="pd_recon.jpg" x={1010} y={130} w={330} rot={3} at={f(34.0 - 30.5)} caption="phục dựng" />
          <Label x={950} y={620} at={f(36.2 - 30.5)} size={44}>
            "Người đàn ông Piltdown"
          </Label>
          <Label x={1020} y={730} at={f(38.3 - 30.5)} rot={2} size={40}>
            500.000 năm tuổi?
          </Label>
        </Board>
      </Sc>

      {/* S5 — vinh danh */}
      <Sc a={42.0} b={50.2}>
        <Board pan={-14}>
          <PinPhoto src="pd_gang.jpg" x={520} y={140} w={560} rot={1.5} at={4} />
          <Label x={430} y={640} at={f(44.6 - 42.0)} size={44}>
            Đao-xơn — "nhà khảo cổ vĩ đại"
          </Label>
          <Note x={480} y={760} at={f(47.2 - 42.0)} size={36}>
            suýt phong tước hiệp sĩ · mất năm 1916
          </Note>
        </Board>
      </Sc>

      {/* S6 — 1953 kiểm nghiệm flo */}
      <Sc a={50.2} b={66.0}>
        <Board pan={18}>
          <Label x={140} y={120} at={4} size={44}>
            1953 · kiểm nghiệm flo
          </Label>
          <PinPhoto src="pd_1.jpg" x={150} y={250} w={620} rot={-2} at={10} caption="Hội Địa chất Anh, 1953" />
          <div style={{ position: "absolute", left: 920, top: 300, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 90, color: VC.ink, opacity: 0.9 }}>
            500.000
          </div>
          <HandX x={905} y={280} w={330} at={f(58.6 - 50.2)} />
          <Label x={950} y={470} at={f(59.6 - 50.2)} rot={2} size={54}>
            chỉ ~50.000 năm
          </Label>
          <Note x={930} y={610} at={f(62.6 - 50.2)} size={36}>
            xương hàm khác tuổi hộp sọ
            <br />
            nhiều mảnh bị nhuộm màu
          </Note>
        </Board>
      </Sc>

      {/* S7 — beat: ĐỒ GIẢ */}
      <Sc a={66.0} b={69.3}>
        <Board>
          <PinPhoto src="pd_skull.jpg" x={560} y={180} w={440} rot={-2} at={0} />
          <Stamp x={580} y={330} at={10} size={380} rot={-16}>
            ĐỒ GIẢ
          </Stamp>
        </Board>
      </Sc>

      {/* S8 — 2009 ADN */}
      <Sc a={69.3} b={83.2}>
        <Board pan={-16}>
          <Label x={140} y={120} at={4} size={44}>
            2009 · phân tích ADN
          </Label>
          <PinPhoto src="pd_skull.jpg" x={560} y={240} w={430} rot={1.5} at={8} />
          <Pin x={640} y={640} at={f(73.4 - 69.3)} />
          <RedString from={[640, 640]} to={[300, 560]} at={f(73.6 - 69.3)} sag={50} />
          <Label x={120} y={500} at={f(74.4 - 69.3)} rot={-2} size={38}>
            hàm + răng = vượn Sahara
          </Label>
          <Pin x={930} y={430} at={f(76.6 - 69.3)} />
          <RedString from={[930, 430]} to={[1240, 330]} at={f(76.8 - 69.3)} sag={40} />
          <Label x={1130} y={230} at={f(77.6 - 69.3)} rot={2} size={38}>
            sọ = người trung cổ
          </Label>
          <Note x={1080} y={620} at={f(79.6 - 69.3)} size={34}>
            trộn sỏi li ti — giả trọng lượng hóa thạch
          </Note>
        </Board>
      </Sc>

      {/* S9 — chủ mưu */}
      <Sc a={83.2} b={92.3}>
        <Board pan={12}>
          <PinPhoto src="pd_2.jpg" x={430} y={150} w={620} rot={-1.5} at={4} />
          <RedString from={[520, 300]} to={[740, 480]} at={f(85.0 - 83.2)} sag={30} />
          <RedString from={[1050, 260]} to={[760, 470]} at={f(85.6 - 83.2)} sag={30} />
          <Stamp x={620} y={560} at={f(86.6 - 83.2)} size={300} rot={-12}>
            CHỦ MƯU:
            <br />
            ĐAO-XƠN
          </Stamp>
        </Board>
      </Sc>

      {/* S10 — 15 người dính líu, Conan Doyle */}
      <Sc a={92.3} b={99.4}>
        <Board pan={-12}>
          <Label x={280} y={220} at={4} size={50}>
            15 người bị nghi dính líu
          </Label>
          <PinPhoto src="pd_doyle.png" x={950} y={200} w={340} rot={2.5} at={f(95.2 - 92.3)} caption="A. Cô-nan Đoi-lơ, 1914" />
          <RedString from={[700, 420]} to={[980, 360]} at={f(95.6 - 92.3)} sag={40} />
          <Pin x={700} y={420} at={f(95.4 - 92.3)} />
          <Label x={330} y={470} at={f(95.8 - 92.3)} rot={2} size={42}>
            trong đó có Cô-nan Đoi-lơ
          </Label>
          <Note x={360} y={590} at={f(97.2 - 92.3)} size={36}>
            cha đẻ của Sherlock Holmes
          </Note>
        </Board>
      </Sc>

      {/* S11 — kết */}
      <Sc a={99.4} b={108}>
        <Board pan={10}>
          <PinPhoto src="pd_skull.jpg" x={590} y={150} w={380} rot={2} at={2} />
          <Label x={480} y={620} at={f(100.6 - 99.4)} size={52}>
            một chiếc sọ giả — 40 năm
          </Label>
          <Label x={560} y={740} at={f(102.0 - 99.4)} rot={1.5} size={44}>
            cả thế giới tin theo
          </Label>
          <Note x={620} y={846} at={f(104.5 - 99.4)} size={28}>
            Nguồn: Chuyên trang QĐND · Ảnh: Wikimedia (PD)
          </Note>
        </Board>
      </Sc>

      <Audio src={staticFile("pd_voice.mp3")} />
      <Music mood="trang-nghiem" volume={0.07} />
    </AbsoluteFill>
  );
};
