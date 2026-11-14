# Composio Video Studio MVP
## What's included
Next.js homepage with Remotion Player for TemplateDemo; POST /api/render, job polling, MP4 download. Other 14 compositions remain untouched.
## Start on a Linux server (Node 22)
Run `npm install`, then `npm run web:build`, then `npm run web:start`.
For development: `npm run web:dev`.
## Hosting
Deploy as a persistent Node/Docker service with enough CPU, RAM, Chromium dependencies and FFmpeg. NOT a serverless Vercel function; rendering needs a persistent process and writable temporary storage.
Set build command: `npm install && npm run web:build` and start command: `npm run web:start`.
## Known MVP limitations
Single-job in-memory queue and local temp MP4. A process restart loses jobs and downloads. No login/authorization. Do not expose publicly without authentication, rate-limiting, quota, durable object storage, retention, and centralized job queue. No timeline editing yet. The UI shows TemplateDemo only.
## Next phase
Migrate editable content to inputProps, add authenticated projects and uploads, separate workers, Redis queue, S3 storage.
