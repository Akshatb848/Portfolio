'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';
import { useMotionOff } from '@/lib/motion';

const loadFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

// LazyMotion keeps the animation engine out of the initial bundle (components use `m.*`),
// and MotionConfig honours the OS "reduce motion" setting for every animation.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const off = useMotionOff();
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={off ? 'always' : 'user'}>{children}</MotionConfig>
    </LazyMotion>
  );
}
