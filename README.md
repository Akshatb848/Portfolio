# Akshat Banga — AI Generalist Portfolio

A world-class, production-grade personal portfolio website for Akshat Banga, an AI Generalist and transformation expert working across low-code / no-code AI, generative AI and machine learning.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion (respects `prefers-reduced-motion`)
- **3D background**: Three.js
- **Theme**: next-themes (Dark/Light mode)
- **Fonts**: `next/font` (Inter, JetBrains Mono)
- **Icons**: Lucide React

## ✨ Features

- **Cinematic 3D hero**: a Three.js neural network with signal pulses travelling along its connections, pointer parallax and a scroll-driven camera dolly. It pauses off-screen, stays static under reduced motion, and falls back gracefully without WebGL.
- **Chapters**: eight numbered chapters shared by the navbar, a fixed chapter rail (wide screens) and section headings, plus a scroll progress bar
- **Voxel world**: one fixed WebGL layer behind the whole page. The same voxels form a different 3D shape for every chapter (terrain, globe, neural network, DNA helix, orbit ring, screen wall, career-growth towers, GitHub contribution city, crystal lattice, signal rings); crossing into the next chapter bursts them into particles that reassemble into the next shape. One instanced draw call, morphing in the vertex shader; static under reduced motion
- **Kinetic type and motion**: section titles slide up from a mask, giant outlined chapter words drift with scroll, velocity-reactive marquee bands, cursor spotlight and 3D tilt on cards, count-up stats and a self-drawing experience timeline
- **Pixel-tower hero**: the opening chapter of the voxel world. Drop a head-and-shoulders photo at `public/portrait.jpg` (or `.png`/`.webp`) and the hero switches to a 3D relief of it, with the headline beside it on wide screens; without one it shows a generated terrain
- **AI Toolkit**: floating 3D tiles for the tools used in real projects; pick one to see what it was used for and jump to the evidence
- **Decoding text and HUD**: section labels and the headline decode from random glyphs, and a corner readout shows the current chapter and progress
- **Systems in motion**: interactive pipeline simulations (grounded RAG, AI deal-intake automation, AI governance audit) with play/pause/step, what-if switches and a live log, each linked to the project or role it is based on
- **Skill flashcards**: flip cards that list the projects and roles where each skill was used; links jump to the matching project slide or role
- **Project carousel**: 3D coverflow of featured projects with swipe, keyboard, autoplay (pausable, off under reduced motion), deep links (`/#project-3`) and generative cover art; filterable grid for the rest
- **Live GitHub panel**: repositories fetched from the GitHub API at build time and refreshed daily, with a bundled snapshot as fallback
- **Contact section** with email, LinkedIn, GitHub and an optional résumé download
- **Dark/Light mode**, both meeting WCAG AA contrast (axe: 0 violations)
- **Accessible navigation**: anchor links, skip link, keyboard-friendly menu, tabs and carousel, 44px touch targets
- **SEO**: Open Graph/Twitter image, Person JSON-LD, generated sitemap

## 🔗 Content and sync

All content lives in one place, so every section stays in sync:

- `src/data/portfolio.ts`: projects, experience, education, certifications, skills and the repo snapshot
- `src/data/simulations.ts`: simulator scenarios
- `src/data/chapters.ts`: chapter order and labels
- `src/lib/site.ts`: name, headline, email and social links
- `src/lib/tones.ts`: shared, contrast-safe colour tokens

Skill flashcards derive their evidence from the tech stacks in `portfolio.ts`, so adding a project updates them automatically.

## 📎 Optional assets

These render only when the file exists in `public/` at build time (`scripts/generate-asset-manifest.mjs` runs before `dev` and `build`), so nothing shows as a broken link:

- **Résumé**: `public/Akshat_Banga_Resume.pdf` adds résumé buttons to the navbar, hero and contact section.
- **Project clips**: `public/videos/<name>.mp4`, plus an optional `<name>.webm` and a `<name>.jpg` poster, using the paths set in `src/data/portfolio.ts`
  (`ai-tennis-demo`, `aegis-demo`, `ds-agent-demo`, `analytics-demo`, `llm-dashboard-demo`). A clip replaces that project's generated cover in the carousel; only the centre slide plays, and a clip that fails to load falls back to the cover.
  - `bash scripts/import-concept-clips.sh` downloads the five AI-generated concept clips (Google Veo 3.1 Lite), encodes WebM + MP4 and writes posters. These are labelled "Concept visual · AI-generated" on the site.
  - For a real screen recording, add the files the same way and set `videoKind: 'recording'` on the project to drop the label.

Optional environment variable: `GITHUB_TOKEN` raises the GitHub API rate limit for the live panel.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the .next folder
```

### Cloudflare Pages
```bash
npm run build
# Deploy with Cloudflare Pages connector
```

## 📧 Contact

- **Email**: [akshatbanga848@gmail.com](mailto:akshatbanga848@gmail.com)
- **LinkedIn**: [akshat-banga](https://www.linkedin.com/in/akshat-banga-6574aa170/)
- **GitHub**: [@Akshatb848](https://github.com/Akshatb848)
