'use client';

import { motion } from 'framer-motion';
import { chapters, chapterNumber } from '@/data/chapters';
import { useActiveChapter } from '@/lib/useActiveChapter';

/** Fixed chapter index on wide screens; shows where you are in the story. */
export function ChapterRail() {
  const active = useActiveChapter();

  return (
    <nav
      aria-label="Chapters"
      className={`hidden 2xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <ol className="flex flex-col">
        {chapters.map((c) => {
          const on = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                tabIndex={active ? undefined : -1}
                aria-current={on ? 'location' : undefined}
                className="group flex items-center justify-end gap-3 min-h-11 pl-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span
                  className={`text-xs font-mono transition-all duration-300 ${
                    on
                      ? 'opacity-100 text-foreground'
                      : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 text-muted-foreground'
                  }`}
                >
                  {chapterNumber(c.id)} {c.label}
                </span>
                <span className="relative w-6 flex justify-center" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-foreground transition-colors" />
                  {on && (
                    <motion.span
                      layoutId="chapter-dot"
                      className="absolute -top-[3px] w-3 h-3 rounded-full border-2 border-violet-500 bg-background"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
