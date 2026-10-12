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

const listDir = (dir, re) =>
  fs.existsSync(path.join(publicDir, dir))
    ? fs
        .readdirSync(path.join(publicDir, dir))
        .filter((f) => re.test(f))
        .sort()
    : [];

// Project cover art: public/covers/<project id>.(svg|webp|png|jpg)
const covers = Object.fromEntries(
  listDir('covers', /^\d+\.(svg|webp|png|jpe?g)$/i).map((f) => [f.split('.')[0], `/covers/${f}`])
);

// Chapter b-roll loops: public/broll/<slot>.(webm|mp4), optional <slot>.jpg poster.
// Slots: hero, systems, projects, experience, contact (see docs/broll/FLOW_PROMPTS.md).
const brollFiles = listDir('broll', /\.(webm|mp4|jpe?g|webp)$/i);
const broll = {};
for (const f of brollFiles) {
  const [slot, ext] = [f.replace(/\.[^.]+$/, ''), f.split('.').pop().toLowerCase()];
  broll[slot] ??= { sources: [], poster: null };
  if (ext === 'webm' || ext === 'mp4') broll[slot].sources.push({ src: `/broll/${f}`, type: `video/${ext}` });
  else broll[slot].poster ??= `/broll/${f}`;
}
// WebM first: smaller, and browsers pick the first source they can play.
for (const v of Object.values(broll)) v.sources.sort((a, b) => (a.type === 'video/webm' ? -1 : b.type === 'video/webm' ? 1 : 0));
for (const [k, v] of Object.entries(broll)) if (!v.sources.length) delete broll[k];

const manifest = {
  covers,
  broll,
  resume: fs.existsSync(path.join(publicDir, resumePath)) ? resumePath : null,
  videos: listVideoDir(/\.(mp4|webm)$/i),
  // Poster frames: <clip>.jpg next to each clip
  posters: listVideoDir(/\.jpg$/i),
  // Hero pixel-tower portrait: public/portrait.(jpg|jpeg|png|webp)
  portrait:
    ['portrait.jpg', 'portrait.jpeg', 'portrait.png', 'portrait.webp']
      .filter((f) => fs.existsSync(path.join(publicDir, f)))
      .map((f) => `/${f}`)[0] ?? null,
};

const out = path.join(root, 'src/data/assets.generated.json');
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `asset manifest: résumé ${manifest.resume ? 'found' : 'not found'}, ${manifest.videos.length} video(s), ` +
    `${Object.keys(covers).length} cover(s), b-roll [${Object.keys(broll).join(', ') || 'none'}], ` +
    `portrait ${manifest.portrait ? 'found' : 'not found'}`
);
