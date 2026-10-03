#!/usr/bin/env bash
# Downloads the AI-generated concept clips (Google Veo 3.1 Lite, via Higgsfield), encodes each
# for the web as WebM (VP9) and MP4 (H.264), 1280px wide with no audio, and writes a poster frame.
# Requires curl and ffmpeg. Usage: bash scripts/import-concept-clips.sh
set -euo pipefail

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

CDN="https://d8j0ntlcm91z4.cloudfront.net/user_3Iv0tlffo0mAWvDQE0vV3SRvARt"
CLIPS=(
  "ai-tennis-demo|hf_20261003_090338_aecaa273-4bfc-40a2-b827-6b47ee2c7a26.mp4"
  "aegis-demo|hf_20261003_090338_98fb04e9-2f24-416d-8e4e-8ca9e7c38ba5.mp4"
  "ds-agent-demo|hf_20261003_090338_36b28cf4-fc06-422a-af8b-239740926ef1.mp4"
  "analytics-demo|hf_20261003_090344_125efd2b-def6-407f-8122-fbeacd5402f6.mp4"
  "llm-dashboard-demo|hf_20261003_090338_e7bc48a0-b9f4-4943-a341-c472a240e9c8.mp4"
)

for entry in "${CLIPS[@]}"; do
  name="${entry%%|*}"
  file="${entry#*|}"
  echo "→ $name"
  curl -fsSL "$CDN/$file" -o "$TMP/$name.mp4"
  ffmpeg -v error -y -i "$TMP/$name.mp4" -an -vf "scale=1280:-2" \
    -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -i "$TMP/$name.mp4" -an -vf "scale=1280:-2" \
    -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 "$OUT/$name.webm"
  ffmpeg -v error -y -ss 1.5 -i "$OUT/$name.mp4" -frames:v 1 -vf "scale=1280:-2" -q:v 4 "$OUT/$name.jpg"
done

ls -lh "$OUT"
echo "Done. Rebuild (npm run build) so the asset manifest picks the clips up."
