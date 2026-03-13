'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Code2, Heart, ArrowUp } from 'lucide-react';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/Akshatb848',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/akshat-banga-6574aa170/',
    label: 'LinkedIn',
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-border/50 bg-background">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">
              <span className="text-foreground">Akshat Banga</span>
              <span className="text-violet-500"> · </span>
              <span className="text-muted-foreground">AI Engineer</span>
            </span>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 border border-border/50 hover:border-violet-500/30 transition-all duration-200"
                aria-label={link.label}
              >
                <link.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs text-muted-foreground flex items-center gap-1.5"
          >
            <span>© 2025 Akshat Banga. Built with</span>
            <Heart className="w-3 h-3 text-red-400 fill-current" />
            <span>and Next.js, TailwindCSS, Framer Motion</span>
          </motion.p>
        </div>
      </div>

      {/* Scroll to top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-8 right-8 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 border border-border/50 hover:border-violet-500/30 transition-all duration-200"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </footer>
  );
}
