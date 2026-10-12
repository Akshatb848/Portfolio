'use client';

import { useEffect } from 'react';

/**
 * One delegated pointer listener for the whole page. Any element with `fx-card` gets a
 * spotlight that follows the cursor (CSS vars --mx/--my); `fx-tilt` adds a subtle 3D tilt
 * (--rx/--ry). Styles live in globals.css; tilt is disabled under reduced motion there.
 */
export function PointerFX() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let active: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const reset = (el: HTMLElement) => {
      el.style.setProperty('--fx-o', '0');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    const update = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.('.fx-card') as HTMLElement | null;
      if (active && active !== el) reset(active);
      active = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      el.style.setProperty('--fx-o', '1');
      if (el.classList.contains('fx-tilt')) {
        el.style.setProperty('--rx', `${(0.5 - y / r.height) * 7}deg`);
        el.style.setProperty('--ry', `${(x / r.width - 0.5) * 9}deg`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeaveWindow = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
    };
  }, []);

  return null;
}
