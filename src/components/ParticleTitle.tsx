'use client';

import { useEffect, useRef } from 'react';
import { isMotionOff } from '@/lib/motion';

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; c: number };
const SHADES = 8;

const lerpColor = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

// Particles are drawn in a few colour batches (one path each) rather than one fillStyle per
// particle, which keeps a frame to a handful of draw calls.

/**
 * The hero name as particles. The real <h1> renders first (it is the LCP element and what
 * assistive tech reads); once fonts are ready its glyphs are sampled into particles that
 * burst out and reassemble, then the crisp text fades back in. Moving the pointer over the
 * name scatters the particles around the cursor. The canvas only animates while particles
 * are moving, and the whole effect is skipped when motion is paused or reduced.
 */
export function ParticleTitle({ className, children }: { className: string; children: React.ReactNode }) {
  const h1 = useRef<HTMLHeadingElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const title = h1.current;
    const cv = canvas.current;
    if (!title || !cv) return;
    if (isMotionOff() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const PAD = 60;
    let parts: P[] = [];
    let palette: string[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999, on: false };
    let cancelled = false;

    const sample = () => {
      const r = title.getBoundingClientRect();
      w = Math.ceil(r.width + PAD * 2);
      h = Math.ceil(r.height + PAD * 2);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      cv.style.left = `${-PAD}px`;
      cv.style.top = `${-PAD}px`;

      // Draw each word where the browser laid it out, then read back the filled pixels.
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      const words = [...title.querySelectorAll<HTMLElement>('[data-word]')];
      const ranges: { x0: number; x1: number; from: number[]; to: number[]; solid?: string }[] = [];
      for (const el of words) {
        const cs = getComputedStyle(el);
        const er = el.getBoundingClientRect();
        o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        o.textBaseline = 'alphabetic';
        o.fillStyle = '#000';
        // Baseline sits at roughly 0.8 of the line box for these display sizes.
        const size = parseFloat(cs.fontSize);
        const x = er.left - r.left + PAD;
        const y = er.top - r.top + PAD + (er.height + size * 0.7) / 2;
        o.fillText(el.textContent ?? '', x, y);
        ranges.push({
          x0: x,
          x1: x + er.width,
          from: el.dataset.word === 'gradient' ? [139, 92, 246] : [0, 0, 0],
          to: el.dataset.word === 'gradient' ? [34, 211, 238] : [0, 0, 0],
          solid: el.dataset.word === 'gradient' ? undefined : cs.color,
        });
      }
      const data = o.getImageData(0, 0, w, h).data;
      const gap = w > 700 ? 5 : 4;
      const next: P[] = [];
      // Palette: index 0 is the solid word colour, 1..SHADES the gradient word's steps.
      const solid = ranges.find((g) => g.solid)?.solid ?? '#fff';
      const grad = ranges.find((g) => !g.solid);
      palette = [solid, ...Array.from({ length: SHADES }, (_, i) => lerpColor(grad?.from ?? [139, 92, 246], grad?.to ?? [34, 211, 238], i / (SHADES - 1)))];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3] < 128) continue;
          const range = ranges.find((g) => x >= g.x0 - 4 && x <= g.x1 + 4) ?? ranges[0];
          const c = range.solid
            ? 0
            : 1 + Math.min(SHADES - 1, Math.floor(((x - range.x0) / Math.max(1, range.x1 - range.x0)) * SHADES));
          const a = Math.random() * Math.PI * 2;
          const d = 40 + Math.random() * 220;
          next.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: 0, vy: 0, tx: x, ty: y, c });
        }
      }
      parts = next;
    };

    const show = (particles: boolean) => {
      // The text stays faintly visible under the particles (never fully hidden), so the
      // browser keeps treating the heading as already painted.
      title.style.opacity = particles ? '0.12' : '1';
      cv.style.opacity = particles ? '1' : '0';
    };

    const step = () => {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      let moving = 0;
      const R = 70;
      const batches: P[][] = palette.map(() => []);
      for (const p of parts) {
        let ax = (p.tx - p.x) * 0.1;
        let ay = (p.ty - p.y) * 0.1;
        if (pointer.on) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const f = (1 - Math.sqrt(d2) / R) * 6;
            const d = Math.sqrt(d2) || 1;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        p.vx = (p.vx + ax) * 0.78;
        p.vy = (p.vy + ay) * 0.78;
        p.x += p.vx;
        p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.08 || Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.6) moving++;
        batches[p.c].push(p);
      }
      batches.forEach((list, i) => {
        if (!list.length) return;
        ctx.fillStyle = palette[i];
        ctx.beginPath();
        for (const p of list) ctx.rect(p.x, p.y, 3, 3);
        ctx.fill();
      });
      if (moving > 0 || pointer.on) raf = requestAnimationFrame(step);
      else show(false); // settled: hand back to the crisp text
    };

    const wake = () => {
      show(true);
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (isMotionOff()) return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x > PAD - 30 && x < w - PAD + 30 && y > PAD - 30 && y < h - PAD + 30;
      pointer.x = x;
      pointer.y = y;
      if (inside && !pointer.on) {
        pointer.on = true;
        wake();
      } else if (!inside && pointer.on) {
        pointer.on = false;
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (raf || cancelled) return;
        sample();
        parts.forEach((p) => {
          p.x = p.tx;
          p.y = p.ty;
        });
      }, 300);
    };

    // Boot burst once the page has loaded and the main thread is idle, so it never competes
    // with first paint or hydration.
    let idle = 0;
    const boot = () =>
      document.fonts.ready.then(() => {
        if (cancelled) return;
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
          .requestIdleCallback;
        const go = () => {
          // Only as an opening moment: skip it if the visitor has already scrolled on.
          if (cancelled || isMotionOff() || window.scrollY > window.innerHeight * 0.25) return;
          sample();
          wake();
        };
        if (ric) idle = ric(go, { timeout: 1500 });
        else idle = window.setTimeout(go, 300);
      });
    if (document.readyState === 'complete') boot();
    else window.addEventListener('load', boot, { once: true });
    // Stop the instant the title leaves the screen, so it never costs frames mid-scroll.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting || !raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      pointer.on = false;
      parts.forEach((p) => {
        p.x = p.tx;
        p.y = p.ty;
        p.vx = p.vy = 0;
      });
      show(false);
    });
    io.observe(title);
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', boot);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(idle);
      window.clearTimeout(idle);
      show(false);
    };
  }, []);

  return (
    <div className="relative">
      <h1 ref={h1} className={`${className} transition-opacity duration-300`}>
        {children}
      </h1>
      <canvas ref={canvas} aria-hidden="true" className="absolute pointer-events-none opacity-0 transition-opacity duration-300" />
    </div>
  );
}
