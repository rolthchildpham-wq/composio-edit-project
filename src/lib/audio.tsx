import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import * as sfxLib from "@remotion/sfx";
import { musicManifest } from "./musicManifest";

// ---------------------------------------------------------------------------
// KHO SFX — tên tiếng Việt → file @remotion/sfx (hosted trên remotion.media)
// Dùng tiết chế: 2-4 SFX / video, đặt ở chuyển chương / chip quan trọng / CTA.
// ---------------------------------------------------------------------------
export const SFX = {
  // chuyển cảnh / nhấn
  "whoosh": sfxLib.whoosh, // lướt gió — chuyển chương
  "whip": sfxLib.whip, // vụt nhanh — flash cut, CTA
  "lat-trang": sfxLib.pageTurn, // lật trang — đổi mục
  // pop / UI
  "pop": sfxLib.uiSwitch, // bật công tắc — chip/badge bung
  "click": sfxLib.mouseClick, // click chuột — bullet nhỏ
  "ding": sfxLib.ding, // chuông sáng — khuyến mãi, điểm nhấn tích cực
  "thong-bao": sfxLib.snapchatNotification, // notification — số liệu mới
  // máy ảnh
  "chup-anh": sfxLib.shutterModern, // màn trập — ảnh sản phẩm xuất hiện
  "chup-anh-film": sfxLib.shutterOld,
  // nhấn mạnh / meme (video giải trí mới dùng)
  "boom": sfxLib.vineBoom,
  "xe-bang": sfxLib.recordScratch, // khựng lại — plot twist
  "that-bai": sfxLib.priceIsRightFail,
  "wow": sfxLib.animeWow,
} as const;

export type SfxName = keyof typeof SFX;

// Đặt 1 SFX tại mốc giây tuyệt đối trên timeline
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.5,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(at * fps)} layout="none">
      <Audio src={SFX[name]} volume={volume} />
    </Sequence>
  );
};

// ---------------------------------------------------------------------------
// KHO NHẠC — file đặt trong public/music/<mood>/*.mp3 (bạn tự bỏ nhạc có bản
// quyền sử dụng vào). Chạy `npm run scan-music` để cập nhật manifest.
// Mood: soi-dong | corporate | lofi-chill | trang-nghiem | quang-cao
// ---------------------------------------------------------------------------
export type Mood = keyof typeof musicManifest;

export const pickMusic = (mood: Mood, index = 0): string | null => {
  const list: readonly string[] = musicManifest[mood] ?? [];
  if (list.length === 0) return null;
  return list[index % list.length];
};

// Nhạc nền chạy suốt video: mức thấp cố định dưới voice (~ -20dB), fade in/out.
// Trả về null lặng lẽ nếu mood chưa có file nhạc nào.
export const Music: React.FC<{
  mood: Mood;
  index?: number;
  volume?: number; // 0.10 ≈ nền dưới voice; 0.06 cho tưởng niệm
  fadeOutFrom?: number; // giây bắt đầu fade out (mặc định: 1.5s cuối)
}> = ({ mood, index = 0, volume = 0.1, fadeOutFrom }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const src = pickMusic(mood, index);
  if (!src) return null;
  const fadeOutStart = fadeOutFrom !== undefined ? fadeOutFrom * fps : durationInFrames - 1.5 * fps;
  return (
    <Audio
      loop
      src={staticFile(src)}
      volume={(f) => {
        const fadeIn = Math.min(1, f / (0.5 * fps));
        const fadeOut = f > fadeOutStart ? Math.max(0, 1 - (f - fadeOutStart) / (1.5 * fps)) : 1;
        return volume * fadeIn * fadeOut;
      }}
    />
  );
};
