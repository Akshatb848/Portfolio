'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Terminal } from 'lucide-react';

const titles = [
  'AI Engineer',
  'ML Specialist',
  'Generative AI Builder',
  'MLOps Architect',
  'LLM Engineer',
];

// ─── Code Rain Background ────────────────────────────────────────────────────
function CodeRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const chars = 'アイウエオカキクケコ0123456789ABCDEFdef{}[]()=>const type import class return async await'.split('');
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    let animId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(9, 11, 18, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        // head char brighter
        const brightness = drops[i] === 1 ? 1 : Math.random() * 0.4 + 0.1;
        ctx.fillStyle = `rgba(${i % 3 === 0 ? '99,102,241' : i % 3 === 1 ? '139,92,246' : '34,197,94'},${brightness})`;
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(char, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', setSize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12]" />;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function TypewriterText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = texts[index];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < current.length) {
      t = setTimeout(() => setCharIdx((c) => c + 1), 60);
    } else if (!deleting && charIdx === current.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      t = setTimeout(() => setCharIdx((c) => c - 1), 32);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(t);
  }, [charIdx, index, deleting, texts]);

  return (
    <span className="text-violet-400 dark:text-violet-300 font-mono">
      {display}
      <span className="animate-pulse text-violet-400">|</span>
    </span>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Code rain */}
      <CodeRainBackground />

      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 left-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 grid-pattern opacity-100 pointer-events-none" />

      <motion.div
        style={{ y: springY, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-xs font-medium mb-10 tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for new opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 leading-none"
        >
          <span className="text-foreground">Akshat </span>
          <span className="text-gradient">Banga</span>
        </motion.h1>

        {/* Dynamic title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground mb-6 h-10"
        >
          <Terminal className="w-5 h-5 text-violet-400 hidden sm:block" />
          <TypewriterText texts={titles} />
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Building{' '}
          <span className="text-foreground font-semibold">production-grade machine learning</span>{' '}
          and generative AI systems with scalable cloud infrastructure.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(139,92,246,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-violet-500/25"
          >
            View Projects
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:border-violet-500/40 transition-all duration-200"
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex items-center justify-center gap-6 mb-16"
        >
          {[
            { icon: Github, href: 'https://github.com/Akshatb848', label: 'GitHub' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/akshat-banga-6574aa170/', label: 'LinkedIn' },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-400 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              <span className="hidden sm:block">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <span className="text-xs font-medium tracking-widest uppercase opacity-60">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
