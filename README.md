# Akshat Banga: portfolio site

Personal portfolio of Akshat Banga, an AI engineer and full-stack AI developer in New Delhi. It covers his projects in generative AI, multi-agent systems and machine learning, his work experience, and a few interactive demos.

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion (respects `prefers-reduced-motion`)
- **3D background**: Three.js
- **Theme**: next-themes (dark and light)
- **Fonts**: `next/font` (Inter, JetBrains Mono, Space Grotesk)
- **Icons**: Lucide React

## Features

- **Chapters**: ten numbered chapters shared by the navbar, a fixed chapter rail (wide screens) and the section headings, plus a scroll progress bar.
- **Voxel world**: one fixed WebGL layer behind the whole page. The same voxels form a different 3D shape for each chapter (terrain, globe, neural network, DNA helix, orbit ring, screen wall, towers, a GitHub contribution city, crystal lattice, signal rings). Moving to the next chapter breaks them into particles that reform as the next shape. It is one instanced draw call with the morph done in the vertex shader, and it stays still under reduced motion.
- **Pixel-tower hero**: the first shape of the voxel world. Put a head-and-shoulders photo at `public/portrait.jpg` (or `.png`/`.webp`) and the hero shows a 3D relief of it, with the headline beside it on wide screens. Without a photo it shows generated terrain.
- **Motion details**: section titles slide up from a mask, large outlined words drift between chapters, cards tilt and light up under the cursor, stats count up and the experience timeline draws itself.
- **Decoding text and HUD**: section labels and the headline decode from random glyphs, and a corner readout shows the current chapter.
- **AI toolkit**: 3D tiles for the tools used in the projects. Pick one to see what it was used for and jump to that project or role.
- **Systems in motion**: three pipeline simulations (grounded RAG, AI deal intake, AI governance audit) with play, pause and step controls, a what-if switch and a log. Each links to the project or role it is based on.
- **Ask this site**: TF-IDF retrieval over the projects and roles, run in the browser, that cites its source or refuses.
- **Skill flashcards**: each card flips to list the projects and roles where the skill was used, with links to them.
- **Project carousel**: 3D coverflow of the featured projects with swipe, keyboard, autoplay (pausable, off under reduced motion), deep links (`/#project-3`) and generated cover art. The other projects sit in a filterable grid.
- **Case studies**: each project opens a dialog with its architecture as a flow, key figures and an animated explainer.
- **GitHub panel**: repositories fetched from the GitHub API at build time and refreshed daily, with a bundled snapshot as fallback.
- **Contact section** with email, LinkedIn, GitHub, Instagram and an optional résumé download.
- **Dark and light themes**, both passing WCAG AA contrast (axe: 0 violations).
- **Accessible navigation**: skip link, keyboard-friendly menu, tabs and carousel, 44px touch targets.
- **SEO**: Open Graph and Twitter image, Person JSON-LD, generated sitemap.

## Content

All content lives in a few data files, and every section reads from them:

- `src/data/portfolio.ts`: projects, experience, education, certifications, skills and the repo snapshot
- `src/data/caseStudies.ts`: case-study flows and figures
- `src/data/venture.ts`: the YourNest products and the portal walkthrough
- `src/data/simulations.ts`: simulator scenarios
- `src/data/toolkit.ts`: the AI toolkit tiles
- `src/data/chapters.ts`: chapter order and labels
- `src/lib/site.ts`: name, headline, email and social links
- `src/lib/tones.ts`: shared, contrast-safe colour tokens

The skill flashcards take their evidence from the tech stacks in `portfolio.ts`, so a new project shows up on them without extra work.

## Optional assets

These render only when the file exists in `public/` at build time (`scripts/generate-asset-manifest.mjs` runs before `dev` and `build`), so nothing shows as a broken link:

- **Résumé**: `public/Akshat_Banga_Resume.pdf` adds résumé buttons to the navbar, hero and contact section.
- **Project videos**: `public/videos/<name>.mp4`, with an optional `<name>.webm` and a `<name>.jpg` poster, at the paths set in `src/data/portfolio.ts` (for example `dealscreener-explainer.mp4`). A video replaces the project's generated cover in the carousel; only the centre slide plays, and a video that fails to load falls back to the cover.
  - Each project's `videoKind` sets its label on the site: `explainer` (animated explainer made for this site), `recording` (real screen capture) or `concept` (AI-generated visual, labelled "Concept visual · AI-generated").
  - `bash scripts/import-concept-clips.sh` downloads and encodes the older AI-generated concept clips (Google Veo 3.1 Lite).

Optional environment variable: `GITHUB_TOKEN` raises the GitHub API rate limit for the live panel.

## Getting started

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

## Deployment

### Vercel (recommended)
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

## Contact

- **Email**: [akshatbanga848@gmail.com](mailto:akshatbanga848@gmail.com)
- **LinkedIn**: [akshat-banga](https://www.linkedin.com/in/akshat-banga/)
- **GitHub**: [@Akshatb848](https://github.com/Akshatb848)
