'use client';

import { useEffect, useState } from 'react';
import { chapters, type ChapterId } from '@/data/chapters';

/** The chapter currently crossing the upper third of the viewport ('' above the first one). */
export function useActiveChapter(): ChapterId | '' {
  const [active, setActive] = useState<ChapterId | ''>('');

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.33;
      let current: ChapterId | '' = '';
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return active;
}
