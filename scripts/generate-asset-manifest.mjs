// Records which optional assets exist in /public, so the page can show the résumé button
// and demo clips without touching the filesystem at request time (ISR runs serverless,
// where /public is not on disk). Runs automatically before `dev` and `build`.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const resumePath = '/Akshat_Banga_Resume.pdf';
const videosDir = path.join(publicDir, 'videos');

const listVideoDir = (re) =>
  fs.existsSync(videosDir)
    ? fs
        .readdirSync(videosDir)
        .filter((f) => re.test(f))
        .sort()
        .map((f) => `/videos/${f}`)
    : [];

const manifest = {
  resume: fs.existsSync(path.join(publicDir, resumePath)) ? resumePath : null,
  videos: listVideoDir(/\.(mp4|webm)$/i),
  // Poster frames: <clip>.jpg next to each clip
  posters: listVideoDir(/\.jpg$/i),
};

const out = path.join(root, 'src/data/assets.generated.json');
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`asset manifest: résumé ${manifest.resume ? 'found' : 'not found'}, ${manifest.videos.length} video(s)`);
