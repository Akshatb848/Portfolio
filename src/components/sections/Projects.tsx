'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ChevronRight, BookOpen } from 'lucide-react';
import { projects, languageColors, type Project } from '@/data/portfolio';
import { tone } from '@/lib/tones';
import { site } from '@/lib/site';
import { ProjectCarousel } from '@/components/ProjectCarousel';
import { SectionHeading } from '@/components/SectionHeading';

const moreProjects = projects.filter((p) => !p.featured);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const t = tone(project.color);
  const Icon = project.icon;

  return (
    <motion.article
      id={`project-${project.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={`group relative flex flex-col p-5 rounded-2xl bg-card border border-border/60 ${t.hoverBorder} hover:-translate-y-1 hover:shadow-lg ${t.glow} transition-[transform,box-shadow,border-color] duration-300`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${t.badge}`}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md border ${t.badge} mb-1.5`}>
            {project.category}
          </span>
          <h3 className="text-base font-bold text-foreground leading-snug">{project.title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
      <ul className="flex flex-wrap gap-1.5 mb-4" aria-label="Tech stack">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="text-xs px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: languageColors[project.language] ?? '#6b7280' }}
            aria-hidden="true"
          />
          {project.language}
        </span>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} on GitHub`}
          className="flex items-center gap-1.5 min-h-11 px-3.5 text-xs font-semibold rounded-lg border border-border hover:border-foreground/40 text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <Github className="w-3.5 h-3.5" aria-hidden="true" />
          Code
        </a>
      </div>
    </motion.article>
  );
}

export function ProjectsSection({ availableVideos }: { availableVideos: string[] }) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(moreProjects.map((p) => p.category)))],
    []
  );
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? moreProjects : moreProjects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl" />
      </div>

      <div className="container-max">
        <SectionHeading
          chapter="projects"
          eyebrow="Projects"
          title={
            <>
              Things I&apos;ve <span className="text-gradient">built & shipped</span>
            </>
          }
          aside={
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 min-h-11 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              All repositories
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          }
        >
          <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" aria-hidden="true" />
            Every project is a public repository. Swipe, use the arrows, or pick one below.
          </p>
        </SectionHeading>

        <ProjectCarousel availableVideos={availableVideos} />

        {/* More projects */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">More projects</h3>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`min-h-11 px-4 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                    filter === cat
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-border/60 text-muted-foreground hover:text-foreground bg-card'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
