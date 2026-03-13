'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Download, Sparkles, Zap, Brain } from 'lucide-react';

const titles = [
  'AI Engineer',
  'ML Specialist',
  'Generative AI Builder',
  'MLOps Architect',
  'LLM Engineer',
];

const floatingBadges = [
  { icon: Brain, label: 'LLMs', color: 'from-purple-500 to-indigo-600', delay: 0 },
  { icon: Sparkles, label: 'GenAI', color: 'from-pink-500 to-rose-600', delay: 0.5 },
  { icon: Zap, label: 'MLOps', color: 'from-amber-500 to-orange-600', delay: 1 },
];

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }[] = [];

    const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#c4b5fd'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#6366f1';
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-40"
    />
  );
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = texts[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 60);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentIndex((i) => (i + 1) % texts.length);
    }

    setDisplayText(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, currentIndex, isDeleting, texts]);

  return (
    <span className="text-indigo-500">
      {displayText}
      <span className="animate-pulse text-indigo-400">|</span>
    </span>
  );
}

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle background */}
      <ParticleBackground />

      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-16 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30 dark:opacity-20 pointer-events-none" />

      <motion.div
        style={{ y: springY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Available for new opportunities
        </motion.div>

        {/* Floating badges */}
        {floatingBadges.map((badge) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + badge.delay, type: 'spring' }}
            className={`absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${badge.color} text-white text-xs font-semibold shadow-lg`}
            style={{
              top: badge.delay === 0 ? '25%' : badge.delay === 0.5 ? '20%' : '35%',
              left: badge.delay === 0 ? '8%' : undefined,
              right: badge.delay === 0.5 ? '8%' : badge.delay === 1 ? '12%' : undefined,
            }}
          >
            <badge.icon className="w-3.5 h-3.5" />
            {badge.label}
          </motion.div>
        ))}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4"
        >
          <span className="text-foreground">Akshat </span>
          <span className="text-gradient">Banga</span>
        </motion.h1>

        {/* Dynamic title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground mb-6 h-10 flex items-center justify-center"
        >
          <TypewriterText texts={titles} />
        </motion.div>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI Engineer building{' '}
          <span className="text-foreground font-semibold">production-grade machine learning</span> and generative AI systems with scalable cloud infrastructure.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
          >
            View Projects
          </motion.button>

          <motion.a
            href="/Akshat_Banga_Resume.pdf"
            download
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 flex items-center gap-2 bg-background hover:bg-accent text-foreground text-sm font-semibold rounded-xl border border-border hover:border-indigo-500/50 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-xl border border-border hover:border-indigo-500/50 transition-all duration-200"
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          {[
            { icon: Github, href: 'https://github.com/Akshatb848', label: 'GitHub' },
            {
              icon: Linkedin,
              href: 'https://www.linkedin.com/in/akshat-banga-6574aa170/',
              label: 'LinkedIn',
            },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-400 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              <span className="hidden sm:block">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToAbout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
