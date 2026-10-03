'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Briefcase, FolderGit2, RotateCcw } from 'lucide-react';
import { skillGroups, alsoFamiliar, evidenceFor, projects, type Skill, type Evidence } from '@/data/portfolio';
import { tone, type Tone } from '@/lib/tones';
import { SectionHeading } from '@/components/SectionHeading';
import { FOCUS_PROJECT_EVENT } from '@/lib/events';

const MAX_EVIDENCE = 3;

function EvidenceLink({ item, tabbable }: { item: Evidence; tabbable: boolean }) {
  const Icon = item.kind === 'role' ? Briefcase : FolderGit2;
  return (
    <a
      href={item.href}
      tabIndex={tabbable ? undefined : -1}
      onClick={() => {
        const m = item.href.match(/^#project-(\d+)$/);
        if (m) window.dispatchEvent(new CustomEvent(FOCUS_PROJECT_EVENT, { detail: Number(m[1]) }));
      }}
      className="flex items-center gap-2 min-h-11 px-2 -mx-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-muted-foreground" aria-hidden="true" />
    </a>
  );
}

function Flashcard({ skill, t, index }: { skill: Skill; t: Tone; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const evidence = useMemo(() => evidenceFor(skill), [skill]);
  const roles = evidence.filter((e) => e.kind === 'role').length;
  const projectCount = evidence.length - roles;
  const shown = evidence.slice(0, MAX_EVIDENCE);
  const backId = `skill-proof-${skill.name.replace(/\W+/g, '-').toLowerCase()}`;

  const summary = [
    projectCount ? `${projectCount} project${projectCount > 1 ? 's' : ''}` : null,
    roles ? `${roles} role${roles > 1 ? 's' : ''}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="list-none [perspective:1000px]"
    >
      <motion.div
        className="relative grid grid-cols-[minmax(0,1fr)] h-full min-h-[13.5rem] preserve-3d"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      >
        {/* Front */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-expanded={flipped}
          aria-controls={backId}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : undefined}
          className={`flip-face min-w-0 w-full h-full flex flex-col text-left p-5 rounded-2xl bg-card border ${t.border} ${t.hoverBorder} hover:shadow-lg ${t.glow} transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400`}
        >
          <span className={`font-mono text-[11px] tracking-widest uppercase ${t.text}`}>Skill</span>
          <span className="mt-2 text-lg font-bold text-foreground leading-snug">{skill.name}</span>
          <span className="mt-auto pt-6 flex items-end justify-between gap-2">
            <span className="text-sm text-muted-foreground">{summary}</span>
            <span className={`flex items-center gap-1 text-xs font-semibold ${t.text}`}>
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              See proof
            </span>
          </span>
        </button>

        {/* Back */}
        <div
          id={backId}
          aria-hidden={!flipped}
          className={`flip-face flip-back min-w-0 h-full flex flex-col p-5 rounded-2xl border ${t.border} bg-card`}
        >
          <p className={`font-mono text-[11px] tracking-widest uppercase ${t.text} mb-2`}>Used in</p>
          <ul className="space-y-0.5 flex-1">
            {shown.map((item) => (
              <li key={item.href}>
                <EvidenceLink item={item} tabbable={flipped} />
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="text-xs text-muted-foreground">
              {evidence.length > MAX_EVIDENCE ? `+${evidence.length - MAX_EVIDENCE} more` : ''}
            </span>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              tabIndex={flipped ? undefined : -1}
              aria-label={`Back to ${skill.name}`}
              className="flex items-center gap-1 min-h-11 px-3 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Flip back
            </button>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

export function SkillsSection() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const active = skillGroups.find((g) => g.id === activeId)!;
  const t = tone(active.color);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-max">
        <SectionHeading
          chapter="skills"
          eyebrow="Skills"
          title={
            <>
              Skills, <span className="text-gradient">with receipts</span>
            </>
          }
        >
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-2xl">
            No self-rated percentages. Flip a card to see the {projects.length} public projects and the
            roles where each skill was actually used.
          </p>
        </SectionHeading>

        {/* Category tabs */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="tablist"
          aria-label="Skill categories"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const idx = skillGroups.findIndex((g) => g.id === activeId);
            const step = e.key === 'ArrowRight' ? 1 : -1;
            const next = skillGroups[(idx + step + skillGroups.length) % skillGroups.length];
            setActiveId(next.id);
            document.getElementById(`skills-tab-${next.id}`)?.focus();
          }}
        >
          {skillGroups.map((g) => {
            const gt = tone(g.color);
            const on = g.id === activeId;
            return (
              <button
                key={g.id}
                id={`skills-tab-${g.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="skills-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActiveId(g.id)}
                className={`flex items-center gap-2 min-h-11 px-4 rounded-xl text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  on ? `${gt.badge} shadow-md ${gt.glow}` : 'border-border/60 text-muted-foreground hover:text-foreground bg-card'
                }`}
              >
                <g.icon className="w-4 h-4" aria-hidden="true" />
                {g.title}
              </button>
            );
          })}
        </div>

        <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${activeId}`}>
          <p className="text-sm text-muted-foreground mb-5">{active.description}</p>
          <AnimatePresence mode="wait">
            <motion.ul
              key={activeId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {active.skills.map((skill, i) => (
                <Flashcard key={skill.name} skill={skill} t={t} index={i} />
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <div className="mt-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            Also familiar with
          </p>
          <ul className="flex flex-wrap gap-2">
            {alsoFamiliar.map((name) => (
              <li
                key={name}
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 text-sm text-muted-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
