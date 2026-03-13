'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ChevronDown, ExternalLink, TrendingUp } from 'lucide-react';

const experiences = [
  {
    id: 1,
    company: 'Jio Platforms',
    role: 'AI Engineer',
    type: 'Full-time',
    period: '2023 – Present',
    location: 'Mumbai, India',
    logo: '🔵',
    color: 'indigo',
    description:
      'Leading AI engineering initiatives at India\'s largest telecommunications company, building enterprise-grade ML systems that serve 400M+ users.',
    achievements: [
      'Architected an AI-driven network operations system using anomaly detection (LSTM + Isolation Forest), reducing MTTR by 60% and saving $2M+ annually',
      'Built production RAG system using LangChain + Pinecone that answers 50K+ internal queries/day with 92% accuracy',
      'Led development of automated ML pipeline for customer churn prediction achieving 89% accuracy, deployed on AWS SageMaker',
      'Designed and deployed GenAI-powered customer service bot serving 100K+ daily interactions with 85% resolution rate',
      'Established MLOps practices using MLflow + Kubeflow, reducing model deployment time from 2 weeks to 2 hours',
    ],
    tech: ['Python', 'PyTorch', 'LangChain', 'AWS SageMaker', 'Kubernetes', 'MLflow', 'Kafka'],
  },
  {
    id: 2,
    company: 'Deloitte',
    role: 'AI & ML Consultant',
    type: 'Full-time',
    period: '2022 – 2023',
    location: 'Hybrid',
    logo: '🟢',
    color: 'emerald',
    description:
      'Delivered enterprise AI transformation projects for Fortune 500 clients across finance, healthcare, and retail verticals.',
    achievements: [
      'Deployed NLP-based document intelligence system for a global bank processing 500K+ documents/month with 96% accuracy',
      'Built predictive analytics dashboard for supply chain optimization, reducing inventory costs by 23% for a retail client',
      'Implemented computer vision-based quality inspection system achieving 98% defect detection rate in manufacturing',
      'Led AI readiness assessments for 5+ enterprise clients, creating roadmaps for responsible AI adoption',
    ],
    tech: ['Python', 'TensorFlow', 'Azure ML', 'Power BI', 'FastAPI', 'PostgreSQL', 'Docker'],
  },
  {
    id: 3,
    company: 'Unified Mentor',
    role: 'Machine Learning Engineer',
    type: 'Full-time',
    period: '2021 – 2022',
    location: 'Remote',
    logo: '🟣',
    color: 'purple',
    description:
      'Built ML-powered educational technology products that personalized learning experiences for 100K+ students.',
    achievements: [
      'Designed recommendation engine using collaborative filtering + content-based hybrid model serving 100K+ students',
      'Built NLP pipeline for automatic quiz generation from educational content using GPT-3 fine-tuning',
      'Created student performance prediction model with 87% accuracy for early intervention systems',
      'Reduced model inference latency by 65% through model quantization and TensorRT optimization',
    ],
    tech: ['Python', 'PyTorch', 'HuggingFace', 'GCP', 'FastAPI', 'Redis', 'PostgreSQL'],
  },
  {
    id: 4,
    company: 'C-DOT (Govt. of India)',
    role: 'Research Engineer – AI/ML',
    type: 'Contract',
    period: '2020 – 2021',
    location: 'New Delhi, India',
    logo: '🔴',
    color: 'rose',
    description:
      'Contributed to national-level telecommunications research with focus on AI-driven network optimization and security.',
    achievements: [
      'Developed intrusion detection system using deep learning (CNN-LSTM), achieving 97.3% detection accuracy',
      'Built ML models for 5G network traffic classification and optimization in collaboration with Telecom Regulatory Authority of India',
      'Implemented anomaly detection for critical infrastructure monitoring using unsupervised learning techniques',
    ],
    tech: ['Python', 'TensorFlow', 'OpenCV', 'Scikit-learn', 'Linux', 'Docker'],
  },
  {
    id: 5,
    company: 'Feynn Labs',
    role: 'AI Research Intern',
    type: 'Internship',
    period: '2019 – 2020',
    location: 'Remote',
    logo: '🟡',
    color: 'amber',
    description:
      'Early-stage AI research and development, building foundational ML models and contributing to open-source AI tools.',
    achievements: [
      'Developed sentiment analysis model for financial news achieving 88% accuracy using BERT fine-tuning',
      'Built data augmentation pipeline for computer vision tasks, improving model accuracy by 15%',
      'Contributed to 3 open-source ML projects with 200+ GitHub stars combined',
    ],
    tech: ['Python', 'PyTorch', 'HuggingFace', 'Pandas', 'Matplotlib', 'Scikit-learn'],
  },
];

const colorMap: Record<string, { dot: string; border: string; badge: string; line: string }> = {
  indigo: {
    dot: 'bg-indigo-500 shadow-indigo-500/50',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    line: 'from-indigo-500/50',
  },
  emerald: {
    dot: 'bg-emerald-500 shadow-emerald-500/50',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    line: 'from-emerald-500/50',
  },
  purple: {
    dot: 'bg-purple-500 shadow-purple-500/50',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    line: 'from-purple-500/50',
  },
  rose: {
    dot: 'bg-rose-500 shadow-rose-500/50',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    line: 'from-rose-500/50',
  },
  amber: {
    dot: 'bg-amber-500 shadow-amber-500/50',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    line: 'from-amber-500/50',
  },
};

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const colors = colorMap[exp.color];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-6"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${colors.dot} shadow-lg flex-shrink-0 mt-1 ring-4 ring-background`}
        />
        {index < experiences.length - 1 && (
          <div className={`w-px flex-1 min-h-full bg-gradient-to-b ${colors.line} to-transparent mt-2`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-10 border rounded-2xl bg-card p-6 ${colors.border} mb-2 hover:shadow-md transition-all duration-200`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{exp.logo}</span>
            <div>
              <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-semibold text-foreground/80">{exp.company}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge}`}>
                  {exp.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {exp.period}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>

        {/* Achievements */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mb-4">
                {exp.achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{achievement}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {exp.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-md bg-background border border-border/50 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? 'Hide details' : 'Show achievements'}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
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
        <div className="absolute right-0 top-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
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
              Experience
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Where I&apos;ve{' '}
              <span className="text-gradient">made an impact</span>
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>5+ years · 5 companies</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
