#!/bin/bash
# Cài mọi thứ cần thiết trong 1 lệnh:  bash setup.sh
set -e
echo "== 1/3 Cài dependencies Remotion =="
npm i
echo "== 2/3 Kiểm tra ffmpeg =="
ffmpeg -version >/dev/null 2>&1 && echo "ffmpeg OK" || echo "⚠ CHƯA CÓ ffmpeg — cài: sudo apt install ffmpeg (Ubuntu) / brew install ffmpeg (Mac)"
echo "== 3/3 Công cụ tạo video MỚI (bỏ qua nếu chỉ render video có sẵn) =="
pip install --user --break-system-packages -q faster-whisper edge-tts 2>/dev/null && echo "whisper + edge-tts OK" || echo "⚠ pip lỗi — tạo video mới sẽ cần cài tay"
echo ""
echo "XONG. Chạy thử:  npx remotion studio"
echo "Render 1 video:  npx remotion render ReviewTool out/test.mp4"
