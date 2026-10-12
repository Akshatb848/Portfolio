'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { chapters, chapterNumber } from '@/data/chapters';
import { useActiveChapter } from '@/lib/useActiveChapter';

/**
 * Corner HUD on wide screens: current chapter and overall progress, like a control panel.
 * Decorative (the navbar and chapter rail carry the real navigation).
 */
export function HudReadout() {
  const active = useActiveChapter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const label = active ? chapters.find((c) => c.id === active)?.label : 'Intro';
  const num = active ? chapterNumber(active) : '00';

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed left-6 bottom-6 z-40 w-44 pointer-events-none font-mono text-[11px] tracking-widest uppercase text-muted-foreground"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span>
          <span className="text-foreground tabular-nums">{num}</span> / {String(chapters.length).padStart(2, '0')}
        </span>
        <span className="text-violet-700 dark:text-violet-400">{label}</span>
      </div>
      <div className="h-0.5 w-full bg-border/70 rounded-full overflow-hidden">
        <motion.div
          className="h-full origin-left bg-linear-to-r from-violet-500 to-cyan-400"
          style={{ scaleX }}
        />
      </div>
    </div>
  );
}
