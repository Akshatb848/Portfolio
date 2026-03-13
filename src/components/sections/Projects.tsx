'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

/**
 * All projects sourced from real GitHub repositories at github.com/Akshatb848
 * Repository descriptions, tech stacks, and links are accurate as of March 2026.
 */
const projects = [
  {
    id: 1,
    name: 'AI-Tennis-Swing-Analyzer',
    title: 'AI Tennis Swing Analyzer',
    description:
      'Computer vision system that analyzes tennis swings using pose estimation and AI coaching models. Provides real-time biomechanical feedback to help players improve technique.',
    tech: ['Python', 'OpenCV', 'Streamlit', 'LangChain', 'Pose Estimation'],
    category: 'Computer Vision',
    color: 'indigo',
    github: 'https://github.com/Akshatb848/AI-Tennis-Swing-Analyzer',
    stars: 1,
    forks: 0,
    language: 'Python',
    icon: '🎾',
    featured: true,
  },
  {
    id: 2,
    name: 'AI-Governance-and-Risk-Management',
    title: 'AEGIS – AI Governance & Risk Platform',
    description:
      'End-to-end AI Governance & Risk Management platform using a multi-agent architecture. Audits ML models for fairness, drift, and explainability (SHAP), and evaluates GenAI/RAG systems for prompt injection resistance and citation accuracy. Generates compliance-ready PDF reports.',
    tech: ['Python', 'LangGraph', 'Streamlit', 'SHAP', 'Jupyter', 'RAG'],
    category: 'Generative AI',
    color: 'purple',
    github: 'https://github.com/Akshatb848/AI-Governance-and-Risk-Management',
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    icon: '🛡️',
    featured: true,
  },
  {
    id: 3,
    name: 'data-science-agent-platform',
    title: 'Data Science Agent Platform',
    description:
      'Agentic AI platform designed to automate data science workflows. Agents collaborate to handle data ingestion, EDA, feature engineering, model selection, and evaluation — reducing manual iteration cycles.',
    tech: ['Python', 'Agents', 'LLMs', 'FastAPI'],
    category: 'Agentic AI',
    color: 'emerald',
    github: 'https://github.com/Akshatb848/data-science-agent-platform',
    stars: 0,
    forks: 0,
    language: 'Python',
    icon: '🤖',
    featured: true,
  },
  {
    id: 4,
    name: 'AI-Analytics-Dashboard',
    title: 'AI Analytics Dashboard',
    description:
      'Open-source Tableau AI alternative offering automated statistical insights, time-series forecasting with Facebook Prophet, and natural language queries for plain-English data exploration. Features an executive dashboard studio for saving AI-generated insights as reusable cards.',
    tech: ['Python', 'Streamlit', 'Plotly', 'Prophet', 'Pandas', 'NumPy', 'SciPy'],
    category: 'Data & Analytics',
    color: 'sky',
    github: 'https://github.com/Akshatb848/AI-Analytics-Dashboard',
    stars: 0,
    forks: 0,
    language: 'Python',
    icon: '📊',
    featured: true,
  },
  {
    id: 5,
    name: 'LLM-dashboard',
    title: 'LLM Education Dashboard & RAG Chatbot',
    description:
      'Conference-ready Ministry of Education dashboard featuring a RAG-first AI chatbot that strictly prevents hallucinations. Includes monthly newsletter retrieval, analytics overview, and optional OLLAMA integration. REST API backend with strict no-hallucination retrieval-only fallback mode.',
    tech: ['JavaScript', 'Python', 'FastAPI', 'RAG', 'OLLAMA', 'REST API'],
    category: 'Generative AI',
    color: 'violet',
    github: 'https://github.com/Akshatb848/LLM-dashboard',
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    icon: '📚',
    featured: true,
  },
  {
    id: 6,
    name: 'EcomPriceGen-AI-Powered-Pricing-Discount-Calculator',
    title: 'EcomPriceGen – LLM-Powered Pricing Calculator',
    description:
      'AI-powered e-commerce pricing solution using LLM fine-tuning with LoRA (Low-Rank Adaptation) on the Zephyr-7B model. Provides a natural language interface for computing discounted prices, fine-tuned on specialized e-commerce datasets for accurate product-aware calculations.',
    tech: ['Python', 'HuggingFace', 'LoRA', 'Zephyr-7B', 'PEFT', 'Jupyter'],
    category: 'Generative AI',
    color: 'amber',
    github: 'https://github.com/Akshatb848/EcomPriceGen-AI-Powered-Pricing-Discount-Calculator',
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    icon: '🛒',
    featured: false,
  },
  {
    id: 7,
    name: 'Degraded-Devanagari-and-Bangla-Script-Identification-Using-CNN-Frameworks',
    title: 'CNN-Based Script Identification',
    description:
      'Deep learning system for identifying degraded Devanagari and Bangla scripts using CNN frameworks. Showcases ML/DL projects with cutting-edge computer vision techniques for low-quality document digitization.',
    tech: ['Python', 'CNN', 'TensorFlow', 'Keras', 'OpenCV', 'Jupyter'],
    category: 'Computer Vision',
    color: 'rose',
    github:
      'https://github.com/Akshatb848/Degraded-Devanagari-and-Bangla-Script-Identification-Using-CNN-Frameworks',
    stars: 0,
    forks: 0,
    language: 'Python',
    icon: '🔤',
    featured: false,
  },
  {
    id: 8,
    name: 'Real-Time-Air-Quality-Prediction-Using-ML-Algorithms',
    title: 'Real-Time Air Quality Prediction',
    description:
      'ML solution for forecasting air quality indicators from real-time chemical sensor data (CO, NMHC, C6H6). Implements Random Forest Regressor (250 estimators) with feature importance ranking from a Random Forest-based selection pipeline.',
    tech: ['Python', 'Scikit-learn', 'Random Forest', 'Pandas', 'Matplotlib', 'Jupyter'],
    category: 'Machine Learning',
    color: 'teal',
    github: 'https://github.com/Akshatb848/Real-Time-Air-Quality-Prediction-Using-ML-Algorithms',
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    icon: '🌫️',
    featured: false,
  },
  {
    id: 9,
    name: 'Market-Segmentation-for-Edtech-Startups',
    title: 'EdTech Market Segmentation',
    description:
      'Unsupervised ML project segmenting EdTech users into meaningful groups using K-Means clustering with Elbow Method optimization and PCA dimensionality reduction. Produces four distinct behavioral segments for targeted marketing and personalization strategies.',
    tech: ['Python', 'Scikit-learn', 'K-Means', 'PCA', 'Pandas', 'Seaborn'],
    category: 'Machine Learning',
    color: 'cyan',
    github: 'https://github.com/Akshatb848/Market-Segmentation-for-Edtech-Startups',
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    icon: '📈',
    featured: false,
  },
  {
    id: 10,
    name: 'Music-Genre-Classification-USING-KNN-and-CNN',
    title: 'Music Genre Classification',
    description:
      'Audio classification system that identifies music genres using both K-Nearest Neighbors (KNN) and Convolutional Neural Network (CNN) architectures. Demonstrates comparison of traditional ML vs deep learning for audio feature classification.',
    tech: ['Python', 'KNN', 'CNN', 'Librosa', 'PyTorch', 'Jupyter'],
    category: 'Deep Learning',
    color: 'fuchsia',
    github: 'https://github.com/Akshatb848/Music-Genre-Classification-USING-KNN-and-CNN',
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    icon: '🎵',
    featured: false,
  },
  {
    id: 11,
    name: 'NPS-Driven-Strategy-for-Aviation',
    title: 'NPS-Driven Aviation Strategy',
    description:
      'Data-driven business strategy analysis for the aviation sector using Net Promoter Score (NPS) methodologies. Derives actionable insights from passenger satisfaction data to guide airline operational and customer experience improvements.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter', 'Statistics'],
    category: 'Data & Analytics',
    color: 'slate',
    github: 'https://github.com/Akshatb848/NPS-Driven-Strategy-for-Aviation',
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    icon: '✈️',
    featured: false,
  },
  {
    id: 12,
    name: 'Deloitte-South-Asia-projects',
    title: 'Deloitte South Asia – AI Projects',
    description:
      'Collection of AI and machine learning projects developed during tenure at Deloitte South Asia. Demonstrates enterprise-grade AI solutions applied to real-world business problems.',
    tech: ['Python', 'Machine Learning', 'Data Analysis', 'Pandas'],
    category: 'Enterprise AI',
    color: 'green',
    github: 'https://github.com/Akshatb848/Deloitte-South-Asia-projects',
    stars: 0,
    forks: 0,
    language: 'Python',
    icon: '🏢',
    featured: false,
  },
];

const categories = [
  'All',
  'Generative AI',
  'Computer Vision',
  'Machine Learning',
  'Deep Learning',
  'Agentic AI',
  'Data & Analytics',
  'Enterprise AI',
];

const colorMap: Record<
  string,
  { border: string; badge: string; glow: string; dot: string }
> = {
  indigo: {
    border: 'hover:border-indigo-500/40',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    glow: 'hover:shadow-indigo-500/10',
    dot: 'bg-indigo-500',
  },
  purple: {
    border: 'hover:border-purple-500/40',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glow: 'hover:shadow-purple-500/10',
    dot: 'bg-purple-500',
  },
  emerald: {
    border: 'hover:border-emerald-500/40',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    glow: 'hover:shadow-emerald-500/10',
    dot: 'bg-emerald-500',
  },
  sky: {
    border: 'hover:border-sky-500/40',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    glow: 'hover:shadow-sky-500/10',
    dot: 'bg-sky-500',
  },
  violet: {
    border: 'hover:border-violet-500/40',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    glow: 'hover:shadow-violet-500/10',
    dot: 'bg-violet-500',
  },
  amber: {
    border: 'hover:border-amber-500/40',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    glow: 'hover:shadow-amber-500/10',
    dot: 'bg-amber-500',
  },
  rose: {
    border: 'hover:border-rose-500/40',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    glow: 'hover:shadow-rose-500/10',
    dot: 'bg-rose-500',
  },
  teal: {
    border: 'hover:border-teal-500/40',
    badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    glow: 'hover:shadow-teal-500/10',
    dot: 'bg-teal-500',
  },
  cyan: {
    border: 'hover:border-cyan-500/40',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    glow: 'hover:shadow-cyan-500/10',
    dot: 'bg-cyan-500',
  },
  fuchsia: {
    border: 'hover:border-fuchsia-500/40',
    badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    glow: 'hover:shadow-fuchsia-500/10',
    dot: 'bg-fuchsia-500',
  },
  slate: {
    border: 'hover:border-slate-400/40',
    badge: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
    glow: 'hover:shadow-slate-400/10',
    dot: 'bg-slate-400',
  },
  green: {
    border: 'hover:border-green-500/40',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    glow: 'hover:shadow-green-500/10',
    dot: 'bg-green-500',
  },
};

const langColorMap: Record<string, string> = {
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
};

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const colors = colorMap[project.color] ?? colorMap['indigo'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col p-6 rounded-2xl bg-card border border-border/50 ${colors.border} ${colors.glow} hover:shadow-lg transition-all duration-300`}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-400">Featured</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4 pr-16">
        <span className="text-2xl flex-shrink-0">{project.icon}</span>
        <div className="min-w-0">
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md border ${colors.badge} mb-1.5`}
          >
            {project.category}
          </span>
          <h3 className="text-base font-bold text-foreground leading-snug">{project.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-md bg-background border border-border/50 text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{
                backgroundColor:
                  langColorMap[project.language] ?? '#6b7280',
              }}
            />
            {project.language}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {project.forks}
          </span>
        </div>
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          <Github className="w-3.5 h-3.5" />
          View on GitHub
        </motion.a>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState('All');

  const filtered =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl" />
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
              Projects
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Things I&apos;ve{' '}
              <span className="text-gradient">built & shipped</span>
            </h2>
            <motion.a
              href="https://github.com/Akshatb848"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <Github className="w-4 h-4" />
              All repositories on GitHub
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
          <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            All projects are real, open-source repositories from{' '}
            <a
              href="https://github.com/Akshatb848"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              github.com/Akshatb848
            </a>
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                filter === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
                  : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border bg-card'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({projects.filter((p) => p.category === cat).length})
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 p-4 rounded-xl bg-card border border-border/50 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Github className="w-4 h-4 text-indigo-400" />
            <strong className="text-foreground">14</strong> public repositories
          </span>
          <span className="text-border">·</span>
          <span>
            Primary language: <strong className="text-foreground">Python</strong>
          </span>
          <span className="text-border">·</span>
          <span>
            Domains:{' '}
            <strong className="text-foreground">GenAI · CV · MLOps · NLP · Analytics</strong>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
