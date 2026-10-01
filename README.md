# Akshat Banga — AI Engineer Portfolio

A world-class, production-grade personal portfolio website for Akshat Banga, an AI Engineer specializing in machine learning, generative AI, and MLOps.

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

- **Three.js neural-network hero background**, paused off-screen and static under reduced motion
- **Contact section** with email, LinkedIn, GitHub and an optional résumé download
- **Filterable project cards** with optional demo clips
- **Experience timeline** with expandable achievements
- **GitHub activity** and featured repositories
- **Dark/Light mode**, both meeting WCAG AA contrast
- **Accessible navigation**: anchor links, skip link, keyboard-friendly mobile menu and skill tabs, 44px touch targets
- **SEO**: Open Graph/Twitter image, Person JSON-LD, generated sitemap

## 📎 Optional assets

These render only when the file exists in `public/` at build time, so nothing shows as a broken link:

- **Résumé**: `public/Akshat_Banga_Resume.pdf` adds résumé buttons to the navbar, hero and contact section.
- **Project demo clips**: `public/videos/<name>.mp4`, using the paths set in `src/components/sections/Projects.tsx`
  (`ai-tennis-demo.mp4`, `aegis-demo.mp4`, `ds-agent-demo.mp4`, `analytics-demo.mp4`, `llm-dashboard-demo.mp4`).

Contact details and links live in `src/lib/site.ts`.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout, metadata, fonts, JSON-LD
│   ├── page.tsx              # Assembles sections; detects optional assets
│   ├── opengraph-image.tsx   # Generated social preview image
│   ├── twitter-image.tsx
│   ├── sitemap.ts
│   └── globals.css           # Global styles & CSS variables
├── components/
│   ├── AiBackground.tsx      # Three.js hero background
│   ├── ProjectVideo.tsx      # Lazy demo clip player
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── GitHub.tsx
│   │   ├── Education.tsx
│   │   └── Contact.tsx
│   └── providers/
│       ├── ThemeProvider.tsx
│       └── MotionProvider.tsx
└── lib/
    └── site.ts               # Name, headline, email and social links
```

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
