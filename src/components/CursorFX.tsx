'use client';

import { useEffect, useRef } from 'react';
import { isMotionOff, subscribeMotion } from '@/lib/motion';
import { playTick } from '@/lib/sound';

const INTERACTIVE = 'a, button, [role="tab"], [role="switch"], input, textarea, select, summary';

/**
 * Pointer micro-interactions on fine pointers, all decorative:
 * - a cursor ring that trails the pointer and grows over interactive elements;
 * - a magnetic pull on `.magnetic` elements (CSS vars --tx/--ty, transform only);
 * - a soft tick on clicks of buttons, tabs and switches when sound is on.
 * Motion pauses and the OS reduced-motion setting turn the ring and pull off.
 */
export function CursorFX() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('button, [role="tab"], [role="switch"]');
      if (el) playTick(el.getAttribute('aria-pressed') === 'true' || el.getAttribute('aria-checked') === 'true' ? 0.3 : 0.6);
    };
    document.addEventListener('click', onClick, true);

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const el = ring.current;
    if (!fine || !el) return () => document.removeEventListener('click', onClick, true);

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let hot = false;
    let magnet: HTMLElement | null = null;
    let enabled = !(reducedQuery.matches || isMotionOff());

    const release = () => {
      if (!magnet) return;
      magnet.style.setProperty('--tx', '0px');
      magnet.style.setProperty('--ty', '0px');
      magnet = null;
    };

    const frame = () => {
      raf = 0;
      rx += (x - rx) * 0.25;
      ry += (y - ry) * 0.25;
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${hot ? 1.8 : 1})`;
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.5) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (!enabled) return;
      x = e.clientX;
      y = e.clientY;
      const target = e.target as Element | null;
      hot = Boolean(target?.closest?.(INTERACTIVE));
      el.dataset.on = '1';
      const m = target?.closest?.('.magnetic') as HTMLElement | null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        m.style.setProperty('--tx', `${((x - (r.left + r.width / 2)) / r.width) * 10}px`);
        m.style.setProperty('--ty', `${((y - (r.top + r.height / 2)) / r.height) * 8}px`);
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      el.dataset.on = '';
      release();
    };
    const sync = () => {
      enabled = !(reducedQuery.matches || isMotionOff());
      if (!enabled) onLeave();
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    reducedQuery.addEventListener('change', sync);
    const unsub = subscribeMotion(sync);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      reducedQuery.removeEventListener('change', sync);
      unsub();
    };
  }, []);

  return <div ref={ring} className="cursor-ring" aria-hidden="true" />;
}
