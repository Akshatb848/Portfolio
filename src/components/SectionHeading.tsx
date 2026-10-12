'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { chapterNumber, type ChapterId } from '@/data/chapters';
import { ScrambleText } from '@/components/ScrambleText';

/**
 * Shared cinematic section header: chapter number, decoding eyebrow, a title that slides up
 * from behind a mask, and a giant outlined chapter word that drifts sideways with scroll
 * (kinetic typography). The drifting word is decorative.
 */
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], center ? ['18%', '-18%'] : ['6%', '-26%']);

  return (
    <div ref={ref} className={`relative mb-12 ${center ? 'text-center' : ''}`}>
      <m.span
        aria-hidden="true"
        style={{ x: drift }}
        className={`outline-word pointer-events-none select-none absolute -top-10 sm:-top-16 whitespace-nowrap text-[22vw] sm:text-[15vw] lg:text-[11rem] font-black uppercase leading-none tracking-tighter -z-10 ${
          center ? 'left-1/2 -translate-x-1/2' : '-left-2'
        }`}
      >
        {eyebrow}
      </m.span>

      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}
      >
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{chapterNumber(chapter)}</span>
        <m.span
          className="h-px w-12 bg-linear-to-r from-violet-500 to-cyan-500 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold tracking-widest uppercase text-violet-700 dark:text-violet-400 font-mono">
          <ScrambleText text={eyebrow} />
        </span>
      </m.div>
      <div
        className={`flex flex-col sm:flex-row sm:items-end gap-4 ${
          center ? 'items-center sm:justify-center' : 'justify-between'
        }`}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight overflow-hidden pb-1">
          <m.span
            className="block"
            initial={{ y: '110%', rotate: 2 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </m.span>
        </h2>
        {aside && (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {aside}
          </m.div>
        )}
      </div>
      {children && (
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </m.div>
      )}
    </div>
  );
}
