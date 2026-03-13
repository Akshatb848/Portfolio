# Akshat Banga — AI Engineer Portfolio

A world-class, production-grade personal portfolio website for Akshat Banga, an AI Engineer specializing in machine learning, generative AI, and MLOps.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **UI Components**: ShadCN UI + Radix UI
- **Theme**: next-themes (Dark/Light mode)
- **Icons**: Lucide React
- **Notifications**: Sonner

## ✨ Features

- **Particle canvas background** with connected-node animation
- **Typewriter effect** for dynamic role titles
- **Scroll-based parallax** on hero section
- **Dark/Light mode** with smooth transitions
- **Animated skill bars** with stagger effects
- **Project filtering** by category
- **Experience timeline** with expandable achievements
- **GitHub stats** and pinned repositories
- **Contact form** with validation and toast notifications
- **Fully responsive** across all devices
- **SEO optimized** with metadata
- **Smooth scrolling** and section navigation
- **Micro-interactions** throughout

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata & theme
│   ├── page.tsx            # Main page assembling all sections
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Sticky navbar with active section detection
│   │   └── Footer.tsx      # Footer with social links
│   ├── sections/
│   │   ├── Hero.tsx        # Hero with particle canvas & typewriter
│   │   ├── About.tsx       # About with capability cards & stats
│   │   ├── Skills.tsx      # Interactive skill categories with progress bars
│   │   ├── Projects.tsx    # Filterable project cards
│   │   ├── Experience.tsx  # Timeline with expandable achievements
│   │   ├── GitHub.tsx      # GitHub stats & pinned repos
│   │   ├── Education.tsx   # Education & certifications
│   │   └── Contact.tsx     # Contact form & info
│   └── providers/
│       └── ThemeProvider.tsx
└── lib/
    └── utils.ts            # cn() utility
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

- **LinkedIn**: [akshat-banga](https://www.linkedin.com/in/akshat-banga-6574aa170/)
- **GitHub**: [@Akshatb848](https://github.com/Akshatb848)
