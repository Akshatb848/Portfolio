'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight, Github, Mail, X } from 'lucide-react';
import { projects, type Project } from '@/data/portfolio';
import { caseStudies } from '@/data/caseStudies';
import { tone } from '@/lib/tones';
import { CountUp } from '@/components/CountUp';
import { ProjectCover } from '@/components/ProjectCover';

import { OPEN_CASE_STUDY_EVENT, takePendingCaseStudy } from '@/components/CaseStudyButton';

/**
 * Full-screen case study in a native <dialog> (focus trap, Esc to close and an inert page
 * behind it come from the browser). The architecture draws itself stage by stage as the
 * reader scrolls the dialog, and the headline figures count up.
 */
export function CaseStudyDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [id, setId] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => ref.current?.close(), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      opener.current = document.activeElement as HTMLElement | null;
      takePendingCaseStudy();
      setId((e as CustomEvent<number>).detail);
    };
    window.addEventListener(OPEN_CASE_STUDY_EVENT, onOpen);
    const early = takePendingCaseStudy();
    if (early !== null) {
      opener.current = document.activeElement as HTMLElement | null;
      setId(early);
    }
    return () => window.removeEventListener(OPEN_CASE_STUDY_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (id === null || !d) return;
    if (!d.open) d.showModal();
    // Land keyboard focus on Close, not on the scroll container.
    closeBtn.current?.focus();
    scroller.current?.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    const onClose = () => {
      document.documentElement.style.overflow = '';
      setId(null);
      opener.current?.focus();
    };
    d.addEventListener('close', onClose, { once: true });
    return () => d.removeEventListener('close', onClose);
  }, [id]);

  const project = id === null ? null : projects.find((p) => p.id === id) ?? null;
  const study = id === null ? null : caseStudies[id];
  const t = project ? tone(project.color) : tone('violet');

  return (
    <dialog
      ref={ref}
      aria-labelledby="case-study-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="case-study m-0 p-0 w-screen h-dvh max-w-none max-h-none bg-transparent backdrop:bg-black/70"
    >
      {project && study && (
        <div ref={scroller} className="h-full overflow-y-auto overscroll-contain">
          <div className="hud relative max-w-4xl mx-auto my-0 sm:my-8 min-h-full sm:min-h-0 bg-background border border-border sm:rounded-2xl" style={{ ['--ch' as string]: t.hex }}>
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-background/95 border-b border-border sm:rounded-t-2xl">
              <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground truncate">
                Case study · {project.category}
              </p>
              <button
                type="button"
                onClick={close}
                ref={closeBtn}
                aria-label="Close case study"
                className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </header>

            <div className="px-5 sm:px-8 py-8">
              <h2 id="case-study-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {project.title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-3xl">{project.description}</p>

              {/* Figures */}
              <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {study.figures.map((f) => (
                  <div key={f.label} className="hud rounded-xl border border-border bg-card p-4" style={{ ['--ch' as string]: t.hex }}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                      <CountUp value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Architecture, drawn as the reader scrolls */}
              <h3 className="mt-12 mb-6 text-xl font-bold text-foreground">How it works</h3>
              <ol className="relative">
                {study.stages.map((s, i) => (
                  <m.li
                    key={s.label}
                    className="relative pl-12 pb-8 last:pb-0"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ root: scroller, once: true, amount: 0.6 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {i < study.stages.length - 1 && (
                      <m.span
                        aria-hidden="true"
                        className="absolute left-[15px] top-8 bottom-0 w-0.5 origin-top rounded-full"
                        style={{ background: `linear-gradient(${t.hex}, ${t.hex}33)` }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ root: scroller, once: true, amount: 0.8 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white"
                      style={{ backgroundColor: t.hex, boxShadow: `0 0 18px ${t.hex}66` }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-semibold text-foreground">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.detail}</p>
                  </m.li>
                ))}
              </ol>

              {/* Visual */}
              <h3 className="mt-12 mb-4 text-xl font-bold text-foreground">Visual</h3>
              <ProjectCover project={project} />

              <h3 className="mt-12 mb-3 text-xl font-bold text-foreground">Stack</h3>
              <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                {project.tech.map((tech) => (
                  <li key={tech} className="text-xs px-2 py-1 rounded-md bg-card border border-border text-muted-foreground font-mono">
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic inline-flex items-center gap-2 min-h-11 px-5 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                    View the code on GitHub
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                ) : (
                  <a
                    href="#contact"
                    onClick={close}
                    className="magnetic inline-flex items-center gap-2 min-h-11 px-5 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Ask for a walkthrough
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
