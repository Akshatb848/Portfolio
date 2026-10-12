'use client';

import { useSyncExternalStore } from 'react';

/**
 * Site-wide "pause animations" preference (WCAG 2.2.2). Stored in localStorage and mirrored
 * on <html data-motion="on|off"> (set before first paint by a script in layout.tsx), so CSS
 * and every animated component can honour it. Defaults to off when the OS asks for reduced
 * motion.
 */
const KEY = 'motion';
const listeners = new Set<() => void>();

export function isMotionOff(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.motion === 'off';
}

export function setMotionOff(off: boolean) {
  document.documentElement.dataset.motion = off ? 'off' : 'on';
  try {
    localStorage.setItem(KEY, off ? 'off' : 'on');
  } catch {
    /* storage unavailable: the choice lasts for this page view */
  }
  listeners.forEach((l) => l());
}

export function subscribeMotion(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** React hook: true when the visitor has paused animations. */
export function useMotionOff(): boolean {
  return useSyncExternalStore(subscribeMotion, isMotionOff, () => false);
}

/** Inline script for <head>: applies the stored choice before the page paints. */
export const motionInitScript = `(function(){try{var v=localStorage.getItem('${KEY}');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.dataset.motion=v||(r?'off':'on');}catch(e){}})();`;
