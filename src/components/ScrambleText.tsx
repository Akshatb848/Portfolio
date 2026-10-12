'use client';

import { isMotionOff } from '@/lib/motion';
import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/';

const scramble = (text: string, revealed: number) =>
  Array.from(text, (ch, i) =>
    i < revealed || ch === ' ' || ch === '·' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  ).join('');

/**
 * Text that decodes from random glyphs into its final value the first time it scrolls
 * into view, like a terminal printing output. Screen readers always get the final text;
 * the server render is the final text too, and reduced motion skips the effect.
 * Best on monospaced text, where the width never shifts.
 */
export function ScrambleText({
  text,
  className,
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMotionOff())) {
      setShown(text);
      return;
    }
    setShown(scramble(text, 0));
    let raf = 0;
    let startTime = 0;
    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min(1, (now - startTime) / duration);
      setShown(progress >= 1 ? text : scramble(text, Math.floor(progress * text.length)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(step);
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
