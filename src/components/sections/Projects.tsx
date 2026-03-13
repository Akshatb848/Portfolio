'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork, Eye, ChevronRight, Sparkles } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Enterprise RAG System',
    description:
      'Production-grade Retrieval-Augmented Generation system built with LangChain, featuring multi-document retrieval, semantic chunking, and hybrid search. Handles 10K+ queries/day with sub-500ms response times.',
    longDescription:
      'Built a highly scalable RAG pipeline that processes documents in real-time, uses vector similarity search with Pinecone, and includes LLM-based reranking. Features conversation memory, source attribution, and guardrails.',
    tech: ['LangChain', 'OpenAI GPT-4', 'Pinecone', 'FastAPI', 'Docker', 'Redis'],
    category: 'Generative AI',
    color: 'indigo',
    github: 'https://github.com/Akshatb848',
    featured: true,
    stars: 48,
    forks: 12,
    metrics: ['10K+ queries/day', 'Sub-500ms response', '99.9% uptime'],
    icon: '🧠',
  },
  {
    id: 2,
    title: 'AI Healthcare Diagnostics',
    description:
      'Deep learning system for automated medical image analysis using CNN architectures. Achieves 94%+ accuracy in anomaly detection across X-rays and MRI scans.',
    longDescription:
      'Built on a custom ResNet-50 backbone with transfer learning, this system processes DICOM images and provides diagnostic confidence scores. Deployed on AWS SageMaker with HIPAA-compliant infrastructure.',
    tech: ['PyTorch', 'ResNet-50', 'DICOM', 'AWS SageMaker', 'FastAPI', 'OpenCV'],
    category: 'Computer Vision',
    color: 'emerald',
    github: 'https://github.com/Akshatb848',
    featured: true,
    stars: 73,
    forks: 19,
    metrics: ['94%+ accuracy', 'HIPAA compliant', '< 2s inference'],
    icon: '🏥',
  },
  {
    id: 3,
    title: 'Multi-Agent AI Automation Platform',
    description:
      'Agentic AI orchestration platform using LangGraph and AutoGen for automating complex business workflows. Features tool-use, human-in-the-loop, and multi-step reasoning.',
    longDescription:
      'Designed a multi-agent framework where specialized AI agents collaborate to handle research, analysis, and execution tasks. Built with LangGraph for stateful agent graphs and integrated with Slack and email for notifications.',
    tech: ['LangGraph', 'AutoGen', 'GPT-4', 'Python', 'Celery', 'PostgreSQL'],
    category: 'Agentic AI',
    color: 'purple',
    github: 'https://github.com/Akshatb848',
    featured: true,
    stars: 61,
    forks: 15,
    metrics: ['10+ agent types', '5x efficiency gain', 'Real-time execution'],
    icon: '🤖',
  },
  {
    id: 4,
    title: 'Real-time NLP Pipeline',
    description:
      'High-throughput NLP system for sentiment analysis, entity extraction, and text classification at scale. Processes 1M+ records per hour using distributed architecture.',
    longDescription:
      'Built on Apache Kafka for stream processing, with custom-trained transformer models for domain-specific NLP tasks. Includes automated model retraining pipeline and A/B testing infrastructure.',
    tech: ['HuggingFace', 'Apache Kafka', 'Spark', 'BERT', 'MLflow', 'Kubernetes'],
    category: 'NLP',
    color: 'sky',
    github: 'https://github.com/Akshatb848',
    featured: false,
    stars: 34,
    forks: 8,
    metrics: ['1M+ records/hour', '95% F1 score', 'Real-time streaming'],
    icon: '📝',
  },
  {
    id: 5,
    title: 'MLOps Infrastructure Platform',
    description:
      'End-to-end MLOps platform with automated model versioning, deployment pipelines, A/B testing, and monitoring dashboards. Reduces model deployment time by 80%.',
    longDescription:
      'Complete MLOps solution featuring model registry, automated CI/CD pipelines, shadow deployment, canary releases, and real-time performance monitoring with Prometheus and Grafana.',
    tech: ['MLflow', 'Kubeflow', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
    category: 'MLOps',
    color: 'amber',
    github: 'https://github.com/Akshatb848',
    featured: false,
    stars: 42,
    forks: 11,
    metrics: ['80% faster deploys', 'Auto-rollback', 'Multi-env support'],
    icon: '⚙️',
  },
  {
    id: 6,
    title: 'Computer Vision Object Detection',
    description:
      'Real-time object detection and tracking system using YOLOv8 for industrial inspection. Deployed on edge devices with TensorRT optimization for 60FPS inference.',
    longDescription:
      'Custom-trained YOLOv8 model optimized for industrial defect detection. Features custom data augmentation pipeline, TensorRT optimization for edge deployment, and WebSocket-based real-time streaming.',
    tech: ['YOLOv8', 'TensorRT', 'OpenCV', 'PyTorch', 'WebSocket', 'ONNX'],
    category: 'Computer Vision',
    color: 'rose',
    github: 'https://github.com/Akshatb848',
    featured: false,
    stars: 55,
    forks: 16,
    metrics: ['60FPS real-time', '97% mAP', 'Edge deployment'],
    icon: '👁️',
  },
];

const categories = ['All', 'Generative AI', 'Computer Vision', 'NLP', 'MLOps', 'Agentic AI'];

const colorMap: Record<string, { border: string; badge: string; glow: string }> = {
  indigo: {
    border: 'hover:border-indigo-500/40',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    glow: 'hover:shadow-indigo-500/10',
  },
  emerald: {
    border: 'hover:border-emerald-500/40',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    glow: 'hover:shadow-emerald-500/10',
  },
  purple: {
    border: 'hover:border-purple-500/40',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glow: 'hover:shadow-purple-500/10',
  },
  sky: {
    border: 'hover:border-sky-500/40',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    glow: 'hover:shadow-sky-500/10',
  },
  amber: {
    border: 'hover:border-amber-500/40',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    glow: 'hover:shadow-amber-500/10',
  },
  rose: {
    border: 'hover:border-rose-500/40',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    glow: 'hover:shadow-rose-500/10',
  },
};

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = colorMap[project.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`group relative p-6 rounded-2xl bg-card border border-border/50 ${colors.border} ${colors.glow} hover:shadow-lg transition-all duration-300 flex flex-col`}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
          <span className="text-xs font-medium text-indigo-400">Featured</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">{project.icon}</div>
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md border ${colors.badge} mb-2`}
          >
            {project.category}
          </span>
          <h3 className="text-lg font-bold text-foreground leading-tight">{project.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
        {expanded ? project.longDescription : project.description}
      </p>

      {/* Metrics */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.metrics.map((metric) => (
          <span
            key={metric}
            className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium"
          >
            {metric}
          </span>
        ))}
      </div>

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
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" /> {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" /> {project.forks}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {expanded ? 'Less' : 'More'}
            <ChevronRight
              className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <Github className="w-3.5 h-3.5" />
            View Code
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState('All');

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

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
              View all on GitHub
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
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
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
