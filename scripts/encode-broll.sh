#!/usr/bin/env bash
# Re-encode a generated clip for the web: silent 720p WebM (VP9) + MP4 (H.264) + JPG poster.
# Usage: scripts/encode-broll.sh <input video> <slot: hero|systems|projects|experience|contact>
set -euo pipefail
in="$1"; slot="$2"
out="$(dirname "$0")/../public/broll"
mkdir -p "$out"
scale="scale=-2:720,fps=24"
ffmpeg -y -loglevel error -i "$in" -an -vf "$scale" -c:v libvpx-vp9 -crf 40 -b:v 1200k -row-mt 1 "$out/$slot.webm"
ffmpeg -y -loglevel error -i "$in" -an -vf "$scale" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "$out/$slot.mp4"
ffmpeg -y -loglevel error -ss 1 -i "$in" -frames:v 1 -vf "scale=-2:720" -q:v 4 "$out/$slot.jpg"
ls -lh "$out/$slot".*
