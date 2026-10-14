'use client';

import { useEffect } from 'react';

/**
 * Pauses looping CSS animations in page sections that are off-screen, by toggling
 * `data-offscreen` (see globals.css). Browsers keep ticking infinite animations even when
 * nothing is visible, which costs style work on every frame while scrolling.
 */
export function AnimationGate() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute('data-offscreen');
          else e.target.setAttribute('data-offscreen', '');
        }
      },
      { rootMargin: '25% 0px' }
    );
    const watch = () => document.querySelectorAll('main > *, footer').forEach((el) => io.observe(el));
    watch();
    // Sections load lazily, so pick up new children as they mount.
    const mo = new MutationObserver(watch);
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
