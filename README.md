# Kho video Remotion — 11 composition mẫu

## Chạy ngay (3 lệnh, không cần tài khoản gì)
```bash
bash setup.sh          # cài 1 lần
npx remotion studio    # mở xem/duyệt 11 video
npx remotion render <TênComposition> out/video.mp4   # render
```
Composition có sẵn: ComposioEdit · HueMemorial · OnePlus16 · ChungKhoan · LietSi13 · YtNiches · RunwayAI · KaliSulphate · ClaudeCodeLeak · Piltdown · HanoiMapDoc · TakiGroup · TakiCinematic · ReviewTool · TemplateDemo

Master audio sau khi render:
```bash
ffmpeg -i out/video.mp4 -af "loudnorm=I=-14:TP=-1.5:LRA=6" -ar 48000 -c:v copy -c:a aac -b:a 256k out/video-mastered.mp4
```

## Tạo video MỚI có giọng Vbee (cần tài khoản Vbee riêng)
1. Tạo file `~/.vbee.env`:
```
export VBEE_APP_ID="app-id-của-bạn"
export VBEE_TOKEN="token-của-bạn"
```
2. `chmod 600 ~/.vbee.env`
3. Tạo voice: `source ~/.vbee.env && python3 vbee_tts.py script.txt public/voice.mp3 --voice <mã giọng>`
4. Đo timing: `python3 transcribe.py public/voice.mp3 words.json`

Kho template dùng chung: `src/lib/templates.tsx` (9 scene, 7 palette) · `src/vintage/` (hồ sơ cổ) · `src/mapdoc/` (bản đồ tư liệu) · quy trình đầy đủ xem skill news-to-video.
