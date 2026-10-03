'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, FileText, Github, Instagram, Linkedin, Mail, Terminal } from 'lucide-react';
import { site } from '@/lib/site';

// Three.js background — SSR disabled, loads client-only
const AiBackground = dynamic(() => import('@/components/AiBackground'), { ssr: false });

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection({ resumeUrl }: { resumeUrl: string | null }) {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* Three.js neural-network background (z-0, no pointer events) */}
      <AiBackground />

      {/* Soft gradient blobs layered on top of canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 left-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none z-[1]" />

      {/* Hero content — z-10 to stay above canvas */}
      <motion.div
        style={{ y: springY, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-800 dark:text-emerald-400 text-xs font-medium mb-10 tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" aria-hidden="true" />
          Available for new opportunities
        </motion.div>

        {/* Name */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 leading-none"
        >
          <span className="text-foreground">Akshat </span>
          <span className="text-gradient">Banga</span>
        </h1>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-lg sm:text-2xl md:text-3xl font-semibold mb-6 font-mono text-violet-700 dark:text-violet-300"
        >
          <Terminal className="w-5 h-5 hidden sm:block" aria-hidden="true" />
          {site.headline}
        </motion.p>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          An <span className="text-foreground font-semibold">AI tools expert</span> who transforms
          manual work with{' '}
          <span className="text-foreground font-semibold">low-code / no-code AI</span>, and builds{' '}
          <span className="text-foreground font-semibold">LLM apps, RAG and multi-agent systems</span>{' '}
          when a problem needs custom code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <a
            href="#projects"
            className="inline-flex items-center min-h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-violet-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 min-h-12 px-6 text-sm font-semibold text-foreground rounded-lg border border-border hover:border-violet-500/50 bg-background/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Get in touch
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 min-h-12 px-6 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:border-violet-500/50 bg-background/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Résumé
            </a>
          )}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex items-center justify-center gap-2 mb-16"
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
              className="flex items-center justify-center gap-2 min-h-11 min-w-11 px-3 rounded-lg text-sm text-muted-foreground hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <link.icon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:block" aria-hidden="true">{link.label}</span>
            </a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          aria-label="Scroll to About section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-2 min-h-11 px-3 w-fit text-muted-foreground hover:text-foreground transition-colors mx-auto rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <span className="text-xs font-medium tracking-widest uppercase" aria-hidden="true">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </motion.div>
        </motion.a>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
}
