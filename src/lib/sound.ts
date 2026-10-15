'use client';

import { useSyncExternalStore } from 'react';

/**
 * Optional UI sound, off by default. The visitor turns it on from the navbar; the choice is
 * kept in localStorage. Tones are synthesised with Web Audio, so there are no files to load.
 */
const KEY = 'sound';
const listeners = new Set<() => void>();

export function isSoundOn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(KEY) === 'on';
  } catch {
    return false;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, isSoundOn, () => false);
}

let ctx: AudioContext | null = null;

/** A short, quiet sine blip. `pitch` 0–1 maps to roughly 520–1040 Hz. */
export function playTick(pitch = 0.5, force = false) {
  if (!force && !isSoundOn()) return;
  try {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 + pitch * 520, t);
    osc.frequency.exponentialRampToValueAtTime(380 + pitch * 380, t + 0.09);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  } catch {}
}
