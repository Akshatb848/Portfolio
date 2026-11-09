'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, Briefcase, CheckCircle2, Github, Layers, Mail, Scale } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { ExplainerPlayer } from '@/components/ExplainerPlayer';
import { DealScreenerDemo } from '@/components/DealScreenerDemo';
import { PortalTour } from '@/components/PortalTour';
import { CaseStudyButton } from '@/components/CaseStudyButton';
import { ventureStories, portalTour } from '@/data/venture';
import { projectById } from '@/data/portfolio';

/** The life of a deal at a fund, and which product covers which stage. */
const journey: { label: string; detail: string; product?: 'dealscreener' | 'portal' }[] = [
  { label: 'Pitch arrives', detail: 'A startup sends its deck', product: 'dealscreener' },
  { label: 'First read', detail: 'AI reviewers score it', product: 'dealscreener' },
  { label: 'Partners decide', detail: 'People make the call' },
  { label: 'Investment', detail: 'The fund backs the company' },
  { label: 'Founder support', detail: 'News, resources, help', product: 'portal' },
];

const glance = [
  { icon: Briefcase, title: 'Role', text: 'Intern, Strategy and AI at YourNest Venture Capital, Gurugram (Jun to Nov 2026).' },
  { icon: Layers, title: 'Scope', text: 'Two products covering both ends of a deal: before the investment and after it.' },
  { icon: Scale, title: 'Approach', text: 'AI where it saves time, fixed rules and human approval where it must be right.' },
];

export function VentureSection() {
  const [active, setActive] = useState<'dealscreener' | 'portal'>('dealscreener');
  const story = ventureStories.find((s) => s.key === active)!;
  const project = projectById(story.projectId);

  return (
    <section id="venture" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-0 w-1/2 h-1/3 bg-linear-to-bl from-violet-500/10 to-transparent [mask-image:radial-gradient(closest-side,#000,transparent)]" />
      </div>

      <div className="container-max">
        <SectionHeading
          chapter="venture"
          eyebrow="Venture capital work"
          title={
            <>
              Inside a <span className="text-gradient">venture capital fund</span>
            </>
          }
        >
          <p className="text-base text-muted-foreground mt-4 max-w-3xl leading-relaxed">
            At YourNest Venture Capital I built two products the fund&apos;s team works with: one reads the startup
            pitches that come in, the other supports the founders the fund has backed. Each one is explained below in a
            short video, in plain English, and with something you can try yourself.
          </p>
        </SectionHeading>

        {/* At a glance, for a reader with one minute */}
        <ul className="grid sm:grid-cols-3 gap-3 mb-10" aria-label="At a glance">
          {glance.map(({ icon: Icon, title, text }) => (
            <li key={title} className="hud rounded-xl border border-border bg-card/90 p-4">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-(--ch-text)">
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {title}
              </p>
              <p className="mt-2 text-sm text-foreground leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>

        {/* Where each product sits in the life of a deal */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-foreground mb-3">Where each product fits in the life of a deal</p>
          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {journey.map((j, i) => {
              const mine = j.product === active;
              const Tag = j.product ? 'button' : 'div';
              return (
                <li key={j.label} className="relative">
                  <Tag
                    {...(j.product
                      ? { type: 'button' as const, onClick: () => setActive(j.product!), 'aria-label': `${j.label}: show ${j.product === 'portal' ? "Founder's Resource Portal" : 'Deal Screener'}` }
                      : {})}
                    className={`w-full h-full text-left rounded-xl border p-3 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      mine
                        ? 'border-violet-500/60 bg-violet-500/10'
                        : j.product
                          ? 'border-border bg-card hover:border-foreground/30'
                          : 'border-dashed border-border bg-background/40'
                    }`}
                  >
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="block text-sm font-semibold text-foreground">{j.label}</span>
                    <span className="block text-xs text-muted-foreground">{j.detail}</span>
                    {j.product && (
                      <span className={`mt-1.5 inline-block text-[11px] font-medium ${j.product === 'portal' ? 'text-teal-700 dark:text-teal-400' : 'text-violet-700 dark:text-violet-300'}`}>
                        {j.product === 'portal' ? 'Founder Portal' : 'Deal Screener'}
                      </span>
                    )}
                  </Tag>
                  {i < journey.length - 1 && (
                    <ArrowRight className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-1" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Product tabs */}
        <div role="tablist" aria-label="YourNest products" className="flex flex-wrap gap-2 mb-6">
          {ventureStories.map((s) => (
            <button
              key={s.key}
              id={`tab-${s.key}`}
              role="tab"
              type="button"
              aria-selected={active === s.key}
              aria-controls="venture-panel"
              onClick={() => setActive(s.key)}
              className={`min-h-11 px-5 rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                active === s.key
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <m.div
          key={story.key}
          id="venture-panel"
          role="tabpanel"
          aria-labelledby={`tab-${story.key}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 items-start">
            <ExplainerPlayer title={story.name} explainer={story.explainer} recording={story.recording} />

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{story.oneLiner}</h3>
              <dl className="mt-5 space-y-4">
                {(
                  [
                    ['The problem', story.problem],
                    ['What it does', story.solution],
                    ['Who uses it', story.users],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-(--ch-text)">{k}</dt>
                    <dd className="mt-1 text-sm text-foreground leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-5 space-y-2" aria-label="What changes for the fund">
                {story.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {project && <CaseStudyButton project={project} className="text-sm px-4" />}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 min-h-11 px-4 text-sm font-semibold rounded-lg border border-border text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Ask for a live walkthrough
                </a>
                {project?.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Public code for ${story.name} on GitHub`}
                    className="inline-flex items-center gap-2 min-h-11 px-4 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                    Public code
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            {story.key === 'dealscreener' ? <DealScreenerDemo /> : <PortalTour steps={portalTour} />}
          </div>
        </m.div>
      </div>
    </section>
  );
}
