'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Mail, Code2, Heart, ArrowUp } from 'lucide-react';
import { site } from '@/lib/site';

const socialLinks = [
  { icon: Github, href: site.github, label: 'GitHub' },
  { icon: Linkedin, href: site.linkedin, label: 'LinkedIn' },
  { icon: Instagram, href: site.instagram, label: 'Instagram' },
  { icon: Mail, href: `mailto:${site.email}`, label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-sm">
              <span className="text-foreground">Akshat Banga</span>
              <span className="text-violet-700 dark:text-violet-400"> · </span>
              <span className="text-muted-foreground">AI Generalist</span>
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
              <a
                key={link.label}
                href={link.href}
                {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="w-11 h-11 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-500/10 border border-border/50 hover:border-violet-500/30 transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
              </a>
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
            <span>© {new Date().getFullYear()} Akshat Banga. Built with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" aria-label="love" />
            <span>and Next.js, TailwindCSS, Framer Motion</span>
          </motion.p>
        </div>
      </div>

      {/* Scroll to top */}
      <a
        href="#main-content"
        className="absolute bottom-6 right-4 sm:right-8 w-11 h-11 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-500/10 border border-border/50 hover:border-violet-500/30 transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </a>
    </footer>
  );
}
