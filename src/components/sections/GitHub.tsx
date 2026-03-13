'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  BookOpen,
} from 'lucide-react';

/**
 * All repository data sourced from real GitHub API:
 * https://api.github.com/users/Akshatb848/repos
 * Last verified: March 2026
 */
const pinnedRepos = [
  {
    name: 'AI-Tennis-Swing-Analyzer',
    description:
      'Multi-agent AI platform for tennis swing analysis. Modular agents/core/services architecture with ChromaDB RAG, Streamlit dashboard. 129 commits — Python 78%, TypeScript 17%.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 1,
    forks: 0,
    topics: ['streamlit', 'chromadb', 'rag', 'agents'],
    url: 'https://github.com/Akshatb848/AI-Tennis-Swing-Analyzer',
  },
  {
    name: 'AI-Governance-and-Risk-Management',
    description:
      'AEGIS: End-to-end AI Governance & Risk Management platform with ML and GenAI audits. Multi-agent architecture with SHAP explainability and compliance-ready PDF reports.',
    language: 'Jupyter Notebook',
    languageColor: '#DA5B0B',
    stars: 0,
    forks: 0,
    topics: ['langgraph', 'shap', 'rag', 'ai-governance', 'streamlit'],
    url: 'https://github.com/Akshatb848/AI-Governance-and-Risk-Management',
  },
  {
    name: 'data-science-agent-platform',
    description:
      'Production-grade agentic AI platform (126 commits, 2 open PRs). Modular agents/core/services architecture with RAG pipeline setup and Docker support.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 0,
    forks: 0,
    topics: ['agents', 'rag', 'docker', 'fastapi'],
    url: 'https://github.com/Akshatb848/data-science-agent-platform',
  },
  {
    name: 'AI-Analytics-Dashboard',
    description:
      'Open-source Tableau AI alternative: automated insights, time-series forecasting with Prophet, natural language queries, and executive dashboard studio.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 0,
    forks: 0,
    topics: ['streamlit', 'plotly', 'prophet', 'nlq', 'analytics'],
    url: 'https://github.com/Akshatb848/AI-Analytics-Dashboard',
  },
  {
    name: 'LLM-dashboard',
    description:
      'Conference-ready Ministry of Education dashboard featuring RAG-first AI chatbot with strict no-hallucination mode and monthly newsletter retrieval.',
    language: 'JavaScript',
    languageColor: '#F1E05A',
    stars: 0,
    forks: 0,
    topics: ['rag', 'llm', 'fastapi', 'education', 'ollama'],
    url: 'https://github.com/Akshatb848/LLM-dashboard',
  },
  {
    name: 'EcomPriceGen-AI-Powered-Pricing-Discount-Calculator',
    description:
      'AI e-commerce pricing engine using LLM fine-tuning with LoRA on Zephyr-7B. Natural language interface for discount calculations.',
    language: 'Jupyter Notebook',
    languageColor: '#DA5B0B',
    stars: 0,
    forks: 0,
    topics: ['lora', 'llm-finetuning', 'huggingface', 'zephyr', 'peft'],
    url: 'https://github.com/Akshatb848/EcomPriceGen-AI-Powered-Pricing-Discount-Calculator',
  },
];

const allRepos = [
  { name: 'AI-Tennis-Swing-Analyzer', lang: 'Python', stars: 1 },
  { name: 'data-science-agent-platform', lang: 'Python', stars: 0 },
  { name: 'Degraded-Devanagari-Bangla-CNN', lang: 'Python', stars: 0 },
  { name: 'LLM-dashboard', lang: 'JavaScript', stars: 0 },
  { name: 'Deloitte-South-Asia-projects', lang: 'Python', stars: 0 },
  { name: 'AI-Analytics-Dashboard', lang: 'Python', stars: 0 },
  { name: 'Dashboard-demo', lang: 'Python', stars: 0 },
  { name: 'AI-Governance-and-Risk-Management', lang: 'Jupyter', stars: 0 },
  { name: 'UNIFIED-MENTOR', lang: 'Jupyter', stars: 0 },
  { name: 'Market-Segmentation-Edtech', lang: 'Jupyter', stars: 0 },
  { name: 'EcomPriceGen', lang: 'Jupyter', stars: 0 },
  { name: 'Real-Time-Air-Quality-Prediction', lang: 'Jupyter', stars: 0 },
  { name: 'Music-Genre-Classification', lang: 'Jupyter', stars: 0 },
  { name: 'NPS-Driven-Strategy-Aviation', lang: 'Jupyter', stars: 0 },
];

function RepoCard({
  repo,
  index,
}: {
  repo: (typeof pinnedRepos)[0];
  index: number;
}) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="group p-5 rounded-xl bg-card border border-border/50 hover:border-indigo-500/30 transition-all duration-200 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Github className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors truncate">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
        {repo.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1 mb-3">
        {repo.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: repo.languageColor }}
          />
          {repo.language}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" /> {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3 h-3" /> {repo.forks}
        </span>
      </div>
    </motion.a>
  );
}

export function GitHubSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const username = 'Akshatb848';

  return (
    <section id="github" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 bottom-0 w-96 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">
              Open Source
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              GitHub{' '}
              <span className="text-gradient">Activity</span>
            </h2>
            <motion.a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              @{username}
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </motion.div>

        {/* Profile summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: Code2, label: 'Public Repositories', value: '14', color: 'text-indigo-400' },
            { icon: Star, label: 'Total Stars', value: '1', color: 'text-yellow-400' },
            { icon: BookOpen, label: 'Primary Language', value: 'Python', color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center hover:border-indigo-500/30 transition-colors"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub Stats Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 gap-4 mb-10"
        >
          <div className="p-4 rounded-xl bg-card border border-border/50 overflow-hidden">
            <p className="text-xs font-semibold text-muted-foreground mb-3">GitHub Statistics</p>
            <div className="w-full overflow-hidden rounded-lg bg-muted/30 p-2">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=6366f1&icon_color=6366f1&text_color=94a3b8&bg_color=00000000&count_private=true`}
                alt={`${username} GitHub Stats`}
                className="w-full"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = 'none';
                  const fallback = el.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                className="hidden items-center justify-center py-6 text-sm text-muted-foreground"
              >
                Stats available at{' '}
                <a
                  href={`https://github.com/${username}`}
                  className="text-indigo-400 ml-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/{username}
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/50 overflow-hidden">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Top Languages</p>
            <div className="w-full overflow-hidden rounded-lg bg-muted/30 p-2">
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&hide_border=true&title_color=6366f1&text_color=94a3b8&bg_color=00000000`}
                alt={`${username} Top Languages`}
                className="w-full"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = 'none';
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Contribution activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="p-4 rounded-xl bg-card border border-border/50 overflow-hidden mb-10"
        >
          <p className="text-xs font-semibold text-muted-foreground mb-3">Contribution Activity</p>
          <div className="w-full overflow-hidden rounded-lg bg-muted/30">
            <img
              src={`https://ghchart.rshah.org/6366f1/${username}`}
              alt={`${username} contribution chart`}
              className="w-full opacity-90"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
              }}
            />
          </div>
        </motion.div>

        {/* Featured repos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Featured Repositories
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedRepos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        </motion.div>

        {/* All repos list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            All {allRepos.length} repositories
          </p>
          <div className="flex flex-wrap gap-2">
            {allRepos.map((repo) => (
              <a
                key={repo.name}
                href={`https://github.com/${username}/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/50 hover:border-indigo-500/30 text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400/60" />
                {repo.name}
                {repo.stars > 0 && (
                  <span className="flex items-center gap-0.5 text-yellow-400">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {repo.stars}
                  </span>
                )}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
