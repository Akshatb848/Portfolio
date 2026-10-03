'use client';

import { motion } from 'framer-motion';
import { chapterNumber, type ChapterId } from '@/data/chapters';

/** Shared cinematic section header: chapter number, eyebrow, title and an optional aside. */
export function SectionHeading({
  chapter,
  eyebrow,
  title,
  aside,
  children,
  center = false,
}: {
  chapter: ChapterId;
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{chapterNumber(chapter)}</span>
        <motion.span
          className="h-px w-12 bg-gradient-to-r from-violet-500 to-cyan-500 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold tracking-widest uppercase text-violet-700 dark:text-violet-400 font-mono">
          {eyebrow}
        </span>
      </div>
      <div
        className={`flex flex-col sm:flex-row sm:items-end gap-4 ${
          center ? 'items-center sm:justify-center' : 'justify-between'
        }`}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">{title}</h2>
        {aside}
      </div>
      {children}
    </motion.div>
  );
}
