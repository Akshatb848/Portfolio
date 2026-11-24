'use client';

import { useState } from 'react';
import { BarChart3, ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import type { Tour } from '@/data/tours';

/**
 * A step-by-step look at a project's real screens or charts. Same pattern as the Founder's
 * Resource Portal tour, but images keep their own shape (letterboxed, never cropped) because
 * screenshots and charts come in many sizes.
 */
export function ProjectTour({ tour, name }: { tour: Tour; name: string }) {
  const [i, setI] = useState(0);
  const { steps } = tour;
  if (!steps.length) return null;
  const step = steps[i];
  const many = steps.length > 1;
  const go = (d: number) => setI((n) => (n + d + steps.length) % steps.length);
  const Icon = tour.kind === 'app' ? MousePointerClick : BarChart3;
  const heading = tour.kind === 'app' ? `Click through ${name}` : many ? 'Step through the results' : 'The key result';

  return (
    <div className="hud rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Icon className="w-4 h-4 text-(--ch-text,#6d28d9)" aria-hidden="true" />
            {heading}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{tour.note}</p>
        </div>
        {many && (
          <p className="font-mono text-xs text-muted-foreground tabular-nums" aria-live="polite">
            Step {i + 1} of {steps.length}
          </p>
        )}
      </div>

      {many && (
        <ol className="flex flex-wrap gap-1.5 mb-4" aria-label="Tour steps">
          {steps.map((s, n) => (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-current={n === i ? 'step' : undefined}
                className={`min-h-9 px-2.5 rounded-md border text-xs font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  n === i ? 'border-violet-500/60 bg-violet-500/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {n + 1}. {s.title}
              </button>
            </li>
          ))}
        </ol>
      )}

      <figure>
        <div className="rounded-xl overflow-hidden border border-border bg-white dark:bg-[#0b0f17] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={step.image}
            src={step.image}
            alt={`${step.title}: ${step.caption}`}
            loading="lazy"
            decoding="async"
            className="block max-w-full h-auto max-h-[62vh] object-contain"
          />
        </div>
        <figcaption className="mt-3 flex items-start justify-between gap-3">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">{step.title}.</span> {step.caption}
          </p>
          {many && (
            <span className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous step"
                className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next step"
                className="w-11 h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
