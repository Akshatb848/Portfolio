'use client';

import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { useMotionOff } from '@/lib/motion';
import type { Broll } from '@/lib/assets';

/**
 * Silent b-roll loop. Nothing downloads until it is near the viewport (preload="none"),
 * it only plays while visible, and it holds on its poster frame when motion is paused.
 * Decorative: always aria-hidden, never focusable.
 */
export function BrollVideo({ clip, className = '' }: { clip: Broll; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: '200px 0px' });
  const motionOff = useMotionOff();
  const reduced = useReducedMotion() || motionOff;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced]);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
      poster={clip.poster ?? undefined}
      className={`pointer-events-none object-cover ${className}`}
    >
      {clip.sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
