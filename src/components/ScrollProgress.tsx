'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress bar along the top edge. Decorative. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400"
      style={{ scaleX }}
    />
  );
}
