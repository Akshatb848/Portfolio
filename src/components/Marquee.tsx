'use client';

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ items, baseVelocity, outline }: { items: string[]; baseVelocity: number; outline?: boolean }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smooth, [-2000, 2000], [8, -8]);
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    baseX.set(baseX.get() + direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(b)));
  });

  const line = items.map((item) => (
    <span key={item} className="flex items-center gap-8 pr-8">
      <span
        className={
          outline
            ? 'outline-word-strong'
            : 'bg-linear-to-r from-violet-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent'
        }
      >
        {item}
      </span>
      <span className="w-3 h-3 rotate-45 bg-violet-500/70 shrink-0" />
    </span>
  ));

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x, skewX: reduced ? 0 : skew }} className="flex w-max text-5xl sm:text-7xl font-black uppercase tracking-tight leading-tight">
        <div className="flex">{line}</div>
        <div className="flex">{line}</div>
      </motion.div>
    </div>
  );
}

/**
 * Kinetic type band between sections: two rows scrolling in opposite directions that
 * speed up and skew with scroll velocity. Decorative; the same words appear as real
 * content elsewhere on the page.
 */
export function Marquee({ top, bottom }: { top: string[]; bottom: string[] }) {
  return (
    <div aria-hidden="true" className="relative py-10 sm:py-14 -rotate-2 select-none pointer-events-none">
      <div className="border-y border-violet-500/20 bg-background/70 backdrop-blur-sm py-3 space-y-1">
        <Row items={top} baseVelocity={-3} />
        <Row items={bottom} baseVelocity={2.4} outline />
      </div>
    </div>
  );
}
