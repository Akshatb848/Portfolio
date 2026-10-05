'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, Mail, Pause, Play } from 'lucide-react';
import { featuredProjects, languageColors, type Project } from '@/data/portfolio';
import { tone } from '@/lib/tones';
import { ProjectCover } from '@/components/ProjectCover';
import { ProjectVideo } from '@/components/ProjectVideo';
import { FOCUS_PROJECT_EVENT } from '@/lib/events';

const AUTOPLAY_MS = 7000;


function wrapOffset(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function Slide({
  project,
  offset,
  compact,
  hasVideo,
  poster,
  webm,
  index,
  total,
  onSelect,
}: {
  project: Project;
  offset: number;
  compact: boolean;
  hasVideo: boolean;
  poster?: string;
  webm?: string;
  index: number;
  total: number;
  onSelect: () => void;
}) {
  const t = tone(project.color);
  const isActive = offset === 0;
  const abs = Math.abs(offset);
  const visible = abs <= (compact ? 1 : 2);

  return (
    <motion.div
      id={`project-${project.id}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${project.title}`}
      aria-hidden={!isActive}
      initial={false}
      animate={{
        x: `${offset * (compact ? 88 : 62)}%`,
        rotateY: compact ? 0 : offset * -28,
        scale: isActive ? 1 : compact ? 0.9 : 0.82 - (abs - 1) * 0.08,
        opacity: visible ? 1 : 0,
        filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
      }}
      transition={{ type: 'spring', stiffness: 170, damping: 26 }}
      style={{ zIndex: 10 - abs, gridArea: '1 / 1', transformStyle: 'preserve-3d' }}
      className="w-full max-w-[560px] mx-auto"
    >
      <article
        className={`relative flex flex-col h-full p-4 sm:p-5 rounded-2xl bg-card border ${t.border} shadow-2xl ${
          isActive ? t.glow : 'shadow-black/20'
        }`}
      >
        {/* Side slides: dimmed by a scrim that also catches the click, so it selects the slide
            rather than following a link underneath. */}
        {!isActive && (
          <div
            onClick={onSelect}
            className={`absolute inset-0 z-10 rounded-2xl cursor-pointer ${abs > 1 ? 'bg-background/85' : 'bg-background/65'}`}
          />
        )}
        {hasVideo && project.video ? (
          <ProjectVideo
            videoSrc={project.video}
            webmSrc={webm}
            poster={poster}
            title={project.title}
            active={isActive}
            concept={project.videoKind !== 'recording'}
            fallback={<ProjectCover project={project} />}
          />
        ) : (
          <ProjectCover project={project} />
        )}
        <div className="flex items-center gap-2 mt-4 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${t.badge}`}>
            {project.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: languageColors[project.language] ?? '#6b7280' }}
              aria-hidden="true"
            />
            {project.language}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4 min-h-[5.6rem]">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-1.5 mb-4 max-h-[3.5rem] overflow-hidden" aria-label="Tech stack">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="text-xs px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            tabIndex={isActive ? undefined : -1}
            className="mt-auto self-start flex items-center gap-2 min-h-11 px-4 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            View on GitHub
          </a>
        ) : (
          <a
            href="#contact"
            aria-label={`Ask about ${project.title}`}
            tabIndex={isActive ? undefined : -1}
            className="mt-auto self-start flex items-center gap-2 min-h-11 px-4 text-sm font-semibold rounded-lg border border-border text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Ask for a walkthrough
          </a>
        )}
      </article>
    </motion.div>
  );
}

/** A sibling file (poster .jpg, .webm) of a clip, if it was present at build time. */
const sibling = (video: string | undefined, ext: string, available: string[]) => {
  const path = video?.replace(/\.\w+$/, ext);
  return path && available.includes(path) ? path : undefined;
};

export function ProjectCarousel({
  availableVideos,
  availablePosters,
}: {
  availableVideos: string[];
  availablePosters: string[];
}) {
  const slides = featuredProjects;
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [compact, setCompact] = useState(false);
  const [inView, setInView] = useState(false);
  // The OS motion preference is unknown during server rendering, so only apply it after
  // mount; reading it during hydration made the pause button's label mismatch.
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted && !!prefersReduced;
  const rootRef = useRef<HTMLElement>(null);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  // Layout mode follows the viewport width.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Only autoplay while the carousel is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = !reduced && !userPaused && !paused && inView;
  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [autoplay, active, go]);

  // Deep links (#project-3) and in-page requests select the matching slide.
  useEffect(() => {
    const select = (id: number) => {
      const idx = slides.findIndex((p) => p.id === id);
      if (idx >= 0) {
        go(idx);
        setUserPaused(true);
      }
    };
    const fromHash = () => {
      const m = window.location.hash.match(/^#project-(\d+)$/);
      if (m) select(Number(m[1]));
    };
    const fromEvent = (e: Event) => select((e as CustomEvent<number>).detail);
    fromHash();
    window.addEventListener('hashchange', fromHash);
    window.addEventListener(FOCUS_PROJECT_EVENT, fromEvent);
    return () => {
      window.removeEventListener('hashchange', fromHash);
      window.removeEventListener(FOCUS_PROJECT_EVENT, fromEvent);
    };
  }, [slides, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(active + 1);
    else if (info.offset.x > 60) go(active - 1);
  };

  const current = slides[active];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Featured projects"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(active + 1);
        if (e.key === 'ArrowLeft') go(active - 1);
      }}
    >
      {/* Stage */}
      <motion.div
        className="relative grid items-stretch py-2 touch-pan-y"
        style={{ perspective: 1400 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
      >
        {slides.map((p, i) => (
          <Slide
            key={p.id}
            project={p}
            index={i}
            total={n}
            offset={wrapOffset(i, active, n)}
            compact={compact}
            hasVideo={!!p.video && availableVideos.includes(p.video)}
            poster={sibling(p.video, '.jpg', availablePosters)}
            webm={sibling(p.video, '.webm', availableVideos)}
            onSelect={() => go(i)}
          />
        ))}
      </motion.div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous project"
            className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused || reduced ? 'Start automatic rotation' : 'Stop automatic rotation'}
            disabled={!!reduced}
            className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/50 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {userPaused || reduced ? (
              <Play className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Pause className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next project"
            className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Synced chapter strip */}
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Choose a featured project">
          {slides.map((p, i) => {
            const t = tone(p.color);
            const on = i === active;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  go(i);
                  setUserPaused(true);
                }}
                aria-current={on ? 'true' : undefined}
                aria-label={`Show ${p.title}`}
                className={`relative flex items-center justify-center gap-2 min-h-11 min-w-11 px-3 rounded-full border text-xs font-medium transition-colors overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  on ? `${t.badge}` : 'border-border/60 bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline max-w-[11rem] truncate">{p.title}</span>
                {on && autoplay && (
                  <motion.span
                    key={`progress-${active}`}
                    className={`absolute left-0 bottom-0 h-0.5 ${t.dot}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live={autoplay ? 'off' : 'polite'}>
          {`Showing ${current.title}, ${active + 1} of ${n}`}
        </p>
      </div>
    </section>
  );
}
