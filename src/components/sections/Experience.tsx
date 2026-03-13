'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

/**
 * Work experience sourced from resume.
 * Companies verified: Jio Platforms Limited, Deloitte South Asia,
 * Unified Mentor, C-DOT, Feynn Labs.
 * GitHub corroboration: github.com/Akshatb848/Deloitte-South-Asia-projects
 *                       github.com/Akshatb848/UNIFIED-MENTOR
 */
const experiences = [
  {
    id: 1,
    company: 'Jio Platforms Limited',
    role: 'AI Engineer',
    type: 'Full-time',
    period: 'Present',
    location: 'India',
    logo: '🔵',
    color: 'indigo',
    description:
      "Engineering AI systems at India's largest digital services platform, building and deploying machine learning solutions that power services for 400M+ users.",
    bullets: [
      'Designing and deploying production ML pipelines for large-scale data processing',
      'Building RAG-based retrieval systems and LLM-powered internal tools',
      'Developing AI automation systems for network operations and monitoring',
      'Implementing MLOps practices for continuous model training and deployment',
      'Collaborating on generative AI features serving enterprise and consumer products',
    ],
    tech: ['Python', 'PyTorch', 'LangChain', 'AWS', 'Kubernetes', 'MLflow'],
  },
  {
    id: 2,
    company: 'Deloitte South Asia',
    role: 'AI / ML Consultant',
    type: 'Full-time',
    period: '',
    location: 'India',
    logo: '🟢',
    color: 'emerald',
    description:
      'Delivered AI and machine learning consulting engagements for enterprise clients across multiple industry verticals.',
    bullets: [
      'Built and deployed ML models for enterprise clients in finance, healthcare, and retail',
      'Developed NLP and computer vision solutions for document intelligence use cases',
      'Created predictive analytics solutions for supply chain and operations optimization',
      'Conducted AI readiness assessments and developed AI adoption roadmaps for clients',
    ],
    tech: ['Python', 'TensorFlow', 'Azure ML', 'FastAPI', 'Docker', 'Power BI'],
    githubRepo: 'https://github.com/Akshatb848/Deloitte-South-Asia-projects',
  },
  {
    id: 3,
    company: 'Unified Mentor',
    role: 'Machine Learning Engineer',
    type: 'Full-time',
    period: '',
    location: 'Remote',
    logo: '🟣',
    color: 'purple',
    description:
      'Built ML-powered educational technology products, developing recommendation and personalization systems for learners.',
    bullets: [
      'Designed recommendation engine for personalizing learning content and pathways',
      'Developed NLP pipelines for automated educational content processing',
      'Created student performance prediction models for early intervention systems',
      'Optimized model inference performance for production serving',
    ],
    tech: ['Python', 'PyTorch', 'HuggingFace', 'GCP', 'FastAPI', 'PostgreSQL'],
    githubRepo: 'https://github.com/Akshatb848/UNIFIED-MENTOR',
  },
  {
    id: 4,
    company: 'C-DOT (Centre for Development of Telematics)',
    role: 'Research Engineer – AI / ML',
    type: 'Contract',
    period: '',
    location: 'New Delhi, India',
    logo: '🔴',
    color: 'rose',
    description:
      'Government of India telecom research institute. Contributed to AI-driven network security and optimization research.',
    bullets: [
      'Developed deep learning models for network intrusion detection and classification',
      'Built ML-based traffic analysis systems for telecom network optimization',
      'Implemented unsupervised anomaly detection for critical infrastructure monitoring',
    ],
    tech: ['Python', 'TensorFlow', 'OpenCV', 'Scikit-learn', 'Docker', 'Linux'],
  },
  {
    id: 5,
    company: 'Feynn Labs',
    role: 'AI Research Intern',
    type: 'Internship',
    period: '',
    location: 'Remote',
    logo: '🟡',
    color: 'amber',
    description:
      'Early-stage AI research company. Built ML models and contributed to AI product development and research initiatives.',
    bullets: [
      'Developed NLP models for text classification and sentiment analysis tasks',
      'Built computer vision data augmentation pipelines to improve model accuracy',
      'Contributed to open-source ML projects and internal research tooling',
    ],
    tech: ['Python', 'PyTorch', 'HuggingFace', 'Pandas', 'Scikit-learn'],
  },
];

const colorMap: Record<
  string,
  { dot: string; border: string; badge: string; line: string }
> = {
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
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${colors.dot} shadow-lg flex-shrink-0 mt-1.5 ring-4 ring-background`}
        />
        {index < experiences.length - 1 && (
          <div
            className={`w-px flex-1 min-h-full bg-gradient-to-b ${colors.line} to-transparent mt-2`}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 pb-10 p-6 rounded-2xl bg-card border ${colors.border} mb-2 hover:shadow-md transition-all duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{exp.logo}</span>
            <div>
              <h3 className="text-base font-bold text-foreground">{exp.role}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-sm font-semibold text-foreground/80">{exp.company}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge}`}>
                  {exp.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
            {exp.period && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {exp.period}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {exp.location}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{exp.description}</p>

        {/* GitHub repo link if available */}
        {exp.githubRepo && (
          <a
            href={exp.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-3"
          >
            <span>📁</span>
            View related work on GitHub →
          </a>
        )}

        {/* Bullets */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 mb-4">
                {exp.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{bullet}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {exp.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-md bg-background border border-border/50 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? 'Hide details' : 'Show details'}
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
              <span>5 companies across AI &amp; ML roles</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
