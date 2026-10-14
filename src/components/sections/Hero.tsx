'use client';

import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, FileText, Github, Instagram, Linkedin, Mail, Terminal } from 'lucide-react';
import { site } from '@/lib/site';
import { ScrambleText } from '@/components/ScrambleText';
import { BrollVideo } from '@/components/BrollVideo';
import { assets } from '@/lib/assets';


// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection({ resumeUrl, portrait }: { resumeUrl: string | null; portrait: string | null }) {
  // With a portrait, wide screens split the hero: text left, pixel-tower face right.
  const split = Boolean(portrait);
  const lgLeft = split ? 'lg:justify-start' : '';
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* The pixel-tower field is the page-wide VoxelWorld behind this section (see page.tsx). */}

      {/* Optional b-roll loop (public/broll/hero.webm), blended into the field below the headline */}
      {assets.broll.hero && (
        <BrollVideo
          clip={assets.broll.hero}
          className="absolute inset-0 w-full h-full opacity-30 [mask-image:linear-gradient(to_bottom,transparent_20%,black_70%)]"
        />
      )}

      {/* Scrim so the headline stays readable over the field */}
      <div
        className={`absolute inset-x-0 top-0 h-[62%] z-1 pointer-events-none bg-linear-to-b from-background via-background/85 to-transparent ${split ? 'lg:inset-y-0 lg:right-auto lg:h-full lg:w-[58%] lg:bg-linear-to-r' : ''}`}
        aria-hidden="true"
      />

      {/* Soft gradient blobs layered on top of canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-violet-600/8 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/8 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
        <div className="absolute -bottom-20 left-1/2 w-[400px] h-[400px] bg-cyan-500/5 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none z-1" />

      {/* Hero content — z-10 to stay above canvas */}
      <m.div
        style={{ y: springY, opacity }}
        className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${split ? 'lg:text-left lg:mx-0 lg:mr-auto lg:ml-[7vw] lg:max-w-[46rem] lg:px-0' : ''}`}
      >
        {/* Status badge */}
        <m.div
          style={{ animationDelay: '0.1s' }}
          className="hero-in inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-800 dark:text-emerald-400 text-xs font-medium mb-10 tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" aria-hidden="true" />
          Available for new opportunities
        </m.div>

        {/* Name */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 leading-none"
        >
          <span className="text-foreground">Akshat </span>
          <span className="text-gradient">Banga</span>
        </h1>

        {/* Headline */}
        <m.p
          style={{ animationDelay: '0.2s' }}
          className={`hero-in flex items-center justify-center ${lgLeft} gap-2 text-lg sm:text-2xl md:text-3xl ${split ? 'lg:text-[1.6rem]' : ''} font-semibold mb-6 font-mono text-violet-700 dark:text-violet-300`}
        >
          <Terminal className="w-5 h-5 hidden sm:block" aria-hidden="true" />
          <ScrambleText text={site.headline} duration={1400} />
        </m.p>

        {/* Sub-headline */}
        <m.p
          style={{ animationDelay: '0.45s' }}
          className={`hero-in text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed ${split ? 'lg:mx-0' : ''}`}
        >
          An <span className="text-foreground font-semibold">AI tools expert</span> who transforms
          manual work with{' '}
          <span className="text-foreground font-semibold">low-code / no-code AI</span>, and builds{' '}
          <span className="text-foreground font-semibold">LLM apps, RAG and multi-agent systems</span>{' '}
          when a problem needs custom code.
        </m.p>

        {/* CTAs */}
        <m.div
          style={{ animationDelay: '0.55s' }}
          className={`hero-in flex flex-wrap items-center justify-center ${lgLeft} gap-3 mb-12`}
        >
          <a
            href="#projects"
            className="inline-flex items-center min-h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-violet-500/25 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 min-h-12 px-6 text-sm font-semibold text-foreground rounded-lg border border-border hover:border-violet-500/50 bg-background/60 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Get in touch
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 min-h-12 px-6 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:border-violet-500/50 bg-background/60 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Résumé
            </a>
          )}
        </m.div>

        {/* Social links */}
        <m.div
          style={{ animationDelay: '0.65s' }}
          className={`hero-in flex items-center justify-center ${lgLeft} gap-2 mb-16`}
        >
          {[
            { icon: Github,   href: site.github,   label: 'GitHub'   },
            { icon: Linkedin, href: site.linkedin, label: 'LinkedIn' },
            { icon: Instagram, href: site.instagram, label: 'Instagram' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex items-center justify-center gap-2 min-h-11 min-w-11 px-3 rounded-lg text-sm text-muted-foreground hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <link.icon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:block" aria-hidden="true">{link.label}</span>
            </a>
          ))}
        </m.div>

        {/* Scroll indicator */}
        <m.a
          href="#about"
          aria-label="Scroll to About section"
          style={{ animationDelay: '1.2s' }}
          className="hero-in flex flex-col items-center gap-2 min-h-11 px-3 w-fit text-muted-foreground hover:text-foreground transition-colors mx-auto rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <span className="text-xs font-medium tracking-widest uppercase" aria-hidden="true">Scroll</span>
          <span className="nudge">
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </span>
        </m.a>
      </m.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
}
