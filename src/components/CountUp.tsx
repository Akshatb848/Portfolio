'use client';

import { isMotionOff } from '@/lib/motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts a stat like "40%" or "149" up from zero the first time it scrolls into view.
 * Renders the final value on the server and for reduced motion; screen readers always
 * get the final value.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const match = value.match(/^(\D*)(\d[\d,.]*)(.*)$/);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMotionOff())) return;
    const [, pre, raw, post] = match;
    const grouped = raw.includes(',');
    const num = raw.replace(/,/g, '');
    const target = parseFloat(num);
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const fmt = (v: number) =>
      grouped ? Math.round(v).toLocaleString('en-US') : v.toFixed(decimals);
    setShown(`${pre}${fmt(0)}${post}`);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(`${pre}${fmt(target * eased)}${post}`);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {shown}
      </span>
    </span>
  );
}
