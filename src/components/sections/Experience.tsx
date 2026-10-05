'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, ChevronDown, CheckCircle2, ExternalLink } from 'lucide-react';
import { experiences, type Experience } from '@/data/portfolio';
import { tone } from '@/lib/tones';
import { SectionHeading } from '@/components/SectionHeading';

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const t = tone(exp.color);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      id={`experience-${exp.id}`}
      className="relative flex gap-5"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-3 h-3 rounded-full ${t.dot} ring-4 ring-background mt-2 shrink-0`} />
        {index < experiences.length - 1 && (
          <div className={`w-px flex-1 bg-linear-to-b from-border to-transparent mt-1.5 min-h-[40px]`} />
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 pb-8 mb-1 p-5 rounded-xl bg-card border ${t.border} ${t.hoverBorder} transition-colors duration-200`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Company initial badge */}
            <div className={`w-9 h-9 rounded-lg ${t.soft} ${t.text} flex items-center justify-center font-bold text-xs shrink-0`}>
              {exp.companyInitial}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-tight">{exp.role}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground font-medium">{exp.company}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${t.badge}`}>
                  {exp.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-x-3 gap-y-1 shrink-0 pl-12 sm:pl-0 text-xs text-muted-foreground">
            {exp.period && <span className="font-medium text-foreground tabular-nums whitespace-nowrap">{exp.period}</span>}
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden="true" /> {exp.location}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{exp.description}</p>

        {exp.githubRepo && (
          <a
            href={exp.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-11 text-xs text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors mb-1 font-mono"
          >
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
            View related work on GitHub
          </a>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              id={`exp-details-${exp.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 mb-4">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-700 dark:text-violet-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{bullet}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {exp.tech.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded font-mono bg-background border border-border/60 text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={`exp-details-${exp.id}`}
          className="flex items-center gap-1.5 min-h-11 -mb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          {expanded ? 'Hide details' : 'Show details'}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max" ref={ref}>
        <SectionHeading
          chapter="experience"
          eyebrow="Experience"
          title={
            <>
              Where I&apos;ve <span className="text-gradient">made an impact</span>
            </>
          }
          aside={
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 text-violet-700 dark:text-violet-400" aria-hidden="true" />
              <span>{experiences.length} roles across AI &amp; ML</span>
            </div>
          }
        />

        <div className="max-w-4xl">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
