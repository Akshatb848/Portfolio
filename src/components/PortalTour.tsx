'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import type { TourStep } from '@/data/venture';

/**
 * "Click through the real product": real screenshots of the Founder's Resource Portal, one
 * step at a time, with a ring on the part of the screen that step is about. Screens are from
 * a local run with made-up demo companies and people.
 */
export function PortalTour({ steps }: { steps: TourStep[] }) {
  const [i, setI] = useState(0);
  if (!steps.length) return null;
  const step = steps[i];
  const go = (d: number) => setI((n) => (n + d + steps.length) % steps.length);

  return (
    <div className="hud rounded-2xl border border-border bg-card p-4 sm:p-5" style={{ ['--ch' as string]: '#14b8a6' }}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
            Try it: click through the real portal
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Real screens from a local run, with made-up demo companies and people.</p>
        </div>
        <p className="font-mono text-xs text-muted-foreground tabular-nums" aria-live="polite">
          Step {i + 1} of {steps.length}
        </p>
      </div>

      <ol className="flex flex-wrap gap-1.5 mb-4" aria-label="Tour steps">
        {steps.map((s, n) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i ? 'step' : undefined}
              className={`min-h-9 px-2.5 rounded-md border text-xs font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                n === i
                  ? 'border-teal-500/60 bg-teal-500/10 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {n + 1}. {s.title}
            </button>
          </li>
        ))}
      </ol>

      <figure>
        <div className="relative rounded-xl overflow-hidden border border-border bg-background">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={step.image}
            src={step.image}
            alt={`${step.title}: ${step.caption}`}
            width={1440}
            height={900}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
          {step.spot && (
            <span
              aria-hidden="true"
              className="tour-ring absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-2 border-teal-400 shadow-[0_0_0_6px_rgba(20,184,166,0.25)]"
              style={{ left: `${step.spot.x * 100}%`, top: `${step.spot.y * 100}%` }}
            />
          )}
        </div>
        <figcaption className="mt-3 flex items-start justify-between gap-3">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">{step.title}.</span> {step.caption}
          </p>
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
              className="w-11 h-11 rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
