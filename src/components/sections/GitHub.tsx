'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink, Code2, Clock, BookOpen, Radio } from 'lucide-react';
import { languageColors } from '@/data/portfolio';
import type { GitHubData } from '@/lib/github';
import { site } from '@/lib/site';
import { SectionHeading } from '@/components/SectionHeading';

// Formatted by hand (UTC, fixed month names) so server and browser always render the same
// string; Intl month abbreviations differ between ICU versions ("Sep" vs "Sept").
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const repoUrl = (name: string, url?: string) => url ?? `${site.github}/${name}`;

export function GitHubSection({ data }: { data: GitHubData }) {
  const { repos, source } = data;
  const live = source === 'live';

  // Language share across repositories
  const counts = repos.reduce<Record<string, number>>((acc, r) => {
    acc[r.lang] = (acc[r.lang] ?? 0) + 1;
    return acc;
  }, {});
  const languages = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primary = languages[0]?.[0] ?? 'Python';
  const recent = live ? repos.filter((r) => r.pushedAt).slice(0, 6) : [];
  const lastPush = recent[0]?.pushedAt;

  const stats = [
    { icon: Code2, label: 'Public repositories', value: String(repos.length) },
    { icon: BookOpen, label: 'Primary language', value: primary },
    { icon: Clock, label: 'Last push', value: lastPush ? fmtDate(lastPush) : 'See GitHub' },
  ];

  return (
    <section id="github" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-0 bottom-0 w-96 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-max">
        <SectionHeading
          chapter="github"
          eyebrow="Open source"
          title={
            <>
              GitHub <span className="text-gradient">activity</span>
            </>
          }
          aside={
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 min-h-11 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <Github className="w-4 h-4" aria-hidden="true" />@{site.githubUsername}
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          }
        >
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Radio
              className={`w-3.5 h-3.5 ${live ? 'text-emerald-800 dark:text-emerald-400' : ''}`}
              aria-hidden="true"
            />
            {live ? 'Live from the GitHub API, refreshed daily' : 'Snapshot of public repositories'}
          </p>
        </SectionHeading>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-5 rounded-xl bg-card border border-border/60"
            >
              <s.icon className="w-5 h-5 text-violet-700 dark:text-violet-400 mb-3" aria-hidden="true" />
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Language share */}
        <div className="p-5 rounded-xl bg-card border border-border/60 mb-8">
          <p className="text-sm font-semibold text-foreground mb-3">Languages by repository</p>
          <div className="flex h-2.5 rounded-full overflow-hidden bg-muted" aria-hidden="true">
            {languages.map(([lang, n]) => (
              <motion.span
                key={lang}
                initial={{ width: 0 }}
                whileInView={{ width: `${(n / repos.length) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ backgroundColor: languageColors[lang] ?? '#94a3b8' }}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
            {languages.map(([lang, n]) => (
              <li key={lang} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: languageColors[lang] ?? '#94a3b8' }}
                  aria-hidden="true"
                />
                <span className="text-foreground font-medium">{lang}</span>
                {Math.round((n / repos.length) * 100)}%
              </li>
            ))}
          </ul>
        </div>

        {/* Recently updated (live data only) */}
        {recent.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-foreground mb-4">Recently updated</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((repo, i) => (
                <motion.li
                  key={repo.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={repoUrl(repo.name, repo.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col h-full p-5 rounded-xl bg-card border border-border/60 hover:border-indigo-500/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <span className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 break-all">
                        {repo.name}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </span>
                    {repo.description && (
                      <span className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                        {repo.description}
                      </span>
                    )}
                    <span className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: languageColors[repo.lang] ?? '#94a3b8' }}
                          aria-hidden="true"
                        />
                        {repo.lang}
                      </span>
                      {repo.pushedAt && <span>Updated {fmtDate(repo.pushedAt)}</span>}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* All repositories */}
        <p className="text-sm font-semibold text-foreground mb-3">All {repos.length} repositories</p>
        <ul className="flex flex-wrap gap-2">
          {repos.map((repo) => (
            <li key={repo.name}>
              <a
                href={repoUrl(repo.name, repo.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 min-h-11 px-3 rounded-lg bg-card border border-border/60 hover:border-indigo-500/40 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: languageColors[repo.lang] ?? '#94a3b8' }}
                  aria-hidden="true"
                />
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
