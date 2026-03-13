'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Github, Star, GitFork, GitCommit, Users, ExternalLink, Code2 } from 'lucide-react';

const pinnedRepos = [
  {
    name: 'enterprise-rag-system',
    description: 'Production-grade RAG pipeline with LangChain, Pinecone & GPT-4. Handles 10K+ queries/day.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 48,
    forks: 12,
    topics: ['langchain', 'rag', 'openai', 'pinecone', 'fastapi'],
  },
  {
    name: 'ai-healthcare-diagnostics',
    description: 'Deep learning medical image analysis system with 94%+ accuracy for anomaly detection.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 73,
    forks: 19,
    topics: ['pytorch', 'computer-vision', 'medical-ai', 'deep-learning'],
  },
  {
    name: 'multi-agent-ai-platform',
    description: 'Agentic AI orchestration with LangGraph. Automates complex multi-step business workflows.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 61,
    forks: 15,
    topics: ['langraph', 'agents', 'gpt-4', 'automation'],
  },
  {
    name: 'mlops-infrastructure',
    description: 'End-to-end MLOps platform: model versioning, CI/CD, A/B testing, monitoring.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 42,
    forks: 11,
    topics: ['mlflow', 'kubernetes', 'kubeflow', 'terraform'],
  },
  {
    name: 'realtime-nlp-pipeline',
    description: 'High-throughput NLP processing at 1M+ records/hour using Kafka & transformer models.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 34,
    forks: 8,
    topics: ['nlp', 'kafka', 'transformers', 'spark'],
  },
  {
    name: 'yolov8-industrial-inspection',
    description: 'Real-time object detection & tracking at 60FPS with TensorRT optimization for edge devices.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 55,
    forks: 16,
    topics: ['yolov8', 'tensorrt', 'computer-vision', 'edge-ai'],
  },
];

const githubStats = [
  { label: 'Total Stars', value: '300+', icon: Star, color: 'text-yellow-400' },
  { label: 'Repositories', value: '25+', icon: Code2, color: 'text-indigo-400' },
  { label: 'Contributions', value: '1.2K+', icon: GitCommit, color: 'text-emerald-400' },
  { label: 'Followers', value: '50+', icon: Users, color: 'text-purple-400' },
];

function RepoCard({ repo, index }: { repo: (typeof pinnedRepos)[0]; index: number }) {
  return (
    <motion.a
      href={`https://github.com/Akshatb848/${repo.name}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      className="group p-5 rounded-xl bg-card border border-border/50 hover:border-indigo-500/30 transition-all duration-200 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors truncate">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{repo.description}</p>

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

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {githubStats.map((stat, i) => (
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
          {/* Stats card */}
          <div className="p-4 rounded-xl bg-card border border-border/50 overflow-hidden">
            <p className="text-xs font-semibold text-muted-foreground mb-3">GitHub Statistics</p>
            <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-muted">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=6366f1&icon_color=6366f1&text_color=94a3b8&bg_color=00000000`}
                alt="GitHub Stats"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Top languages */}
          <div className="p-4 rounded-xl bg-card border border-border/50 overflow-hidden">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Top Languages</p>
            <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-muted">
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&hide_border=true&title_color=6366f1&text_color=94a3b8&bg_color=00000000`}
                alt="Top Languages"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Contribution streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="p-4 rounded-xl bg-card border border-border/50 overflow-hidden mb-10"
        >
          <p className="text-xs font-semibold text-muted-foreground mb-3">Contribution Streak</p>
          <div className="w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=transparent&hide_border=true&ring=6366f1&fire=8b5cf6&currStreakLabel=6366f1&sideLabels=94a3b8&dates=94a3b8&currStreakNum=a5b4fc`}
              alt="Contribution Streak"
              className="w-full"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
          </div>
        </motion.div>

        {/* Pinned repos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Pinned Repositories
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedRepos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
