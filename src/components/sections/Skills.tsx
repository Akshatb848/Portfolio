'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Cloud,
  Code2,
  Database,
  Cpu,
  Layers,
  GitBranch,
  Server,
  Globe,
} from 'lucide-react';

const skillCategories = [
  {
    id: 'ai-ml',
    icon: Brain,
    title: 'AI & Machine Learning',
    color: 'indigo',
    description: 'Core ML/DL frameworks and algorithms for building intelligent systems.',
    skills: [
      { name: 'Python', level: 97 },
      { name: 'PyTorch', level: 92 },
      { name: 'TensorFlow', level: 88 },
      { name: 'Scikit-learn', level: 93 },
      { name: 'Computer Vision', level: 88 },
      { name: 'NLP / Transformers', level: 90 },
      { name: 'Keras', level: 85 },
      { name: 'OpenCV', level: 86 },
    ],
  },
  {
    id: 'genai',
    icon: Zap,
    title: 'Generative AI',
    color: 'purple',
    description: 'LLMs, RAG systems, and agentic AI architectures.',
    skills: [
      { name: 'LangChain', level: 93 },
      { name: 'LlamaIndex', level: 87 },
      { name: 'RAG Systems', level: 92 },
      { name: 'LLM Fine-tuning', level: 88 },
      { name: 'Prompt Engineering', level: 94 },
      { name: 'Vector Databases', level: 90 },
      { name: 'OpenAI / Anthropic APIs', level: 92 },
      { name: 'Agentic AI', level: 85 },
    ],
  },
  {
    id: 'mlops',
    icon: Layers,
    title: 'MLOps & Infrastructure',
    color: 'sky',
    description: 'Building scalable ML pipelines and deployment infrastructure.',
    skills: [
      { name: 'Docker', level: 91 },
      { name: 'Kubernetes', level: 85 },
      { name: 'FastAPI', level: 92 },
      { name: 'MLflow', level: 87 },
      { name: 'Apache Airflow', level: 83 },
      { name: 'CI/CD Pipelines', level: 88 },
      { name: 'Prometheus / Grafana', level: 80 },
      { name: 'Terraform', level: 78 },
    ],
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Platforms',
    color: 'emerald',
    description: 'Multi-cloud expertise for deploying AI at enterprise scale.',
    skills: [
      { name: 'AWS (SageMaker, EC2, S3)', level: 90 },
      { name: 'GCP (Vertex AI, BigQuery)', level: 85 },
      { name: 'Azure (ML Studio)', level: 82 },
      { name: 'Pinecone / Weaviate', level: 88 },
      { name: 'Redis', level: 85 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'MongoDB', level: 83 },
      { name: 'Snowflake', level: 75 },
    ],
  },
  {
    id: 'data',
    icon: Database,
    title: 'Data & Programming',
    color: 'amber',
    description: 'Data engineering, APIs, and full-stack development.',
    skills: [
      { name: 'Pandas / NumPy', level: 95 },
      { name: 'Apache Spark', level: 80 },
      { name: 'SQL / NoSQL', level: 90 },
      { name: 'REST APIs', level: 92 },
      { name: 'TypeScript / JavaScript', level: 82 },
      { name: 'React / Next.js', level: 78 },
      { name: 'Jupyter / Colab', level: 95 },
      { name: 'Git / GitHub', level: 93 },
    ],
  },
];

const colorMap: Record<string, { bar: string; badge: string; icon: string; glow: string }> = {
  indigo: {
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    icon: 'bg-indigo-500/15 text-indigo-400',
    glow: 'shadow-indigo-500/20',
  },
  purple: {
    bar: 'bg-gradient-to-r from-purple-500 to-violet-600',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: 'bg-purple-500/15 text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  sky: {
    bar: 'bg-gradient-to-r from-sky-400 to-blue-500',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    icon: 'bg-sky-500/15 text-sky-400',
    glow: 'shadow-sky-500/20',
  },
  emerald: {
    bar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  amber: {
    bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: 'bg-amber-500/15 text-amber-400',
    glow: 'shadow-amber-500/20',
  },
};

const techLogos = [
  'Python', 'PyTorch', 'TensorFlow', 'LangChain', 'Docker',
  'Kubernetes', 'AWS', 'GCP', 'Azure', 'FastAPI', 'React', 'PostgreSQL',
  'MongoDB', 'Redis', 'Hugging Face', 'OpenAI', 'Pinecone', 'MLflow',
];

function SkillBar({ name, level, color, index }: {
  name: string;
  level: number;
  color: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const colors = colorMap[color];

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${colors.badge}`}>
          {level}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('ai-ml');

  const activeData = skillCategories.find((c) => c.id === activeCategory)!;
  const colors = colorMap[activeData.color];

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
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
              Technical Skills
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            The{' '}
            <span className="text-gradient">tools & technologies</span>
            <br />
            I work with
          </h2>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {skillCategories.map((cat) => {
            const catColors = colorMap[cat.color];
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  isActive
                    ? `${catColors.badge} shadow-md ${catColors.glow}`
                    : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground bg-card'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.title}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Description card */}
            <div className="space-y-6">
              <div className={`p-5 rounded-2xl border bg-card ${colorMap[activeData.color].badge.replace('text-', 'border-').split(' ')[2]}`}>
                <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center mb-3`}>
                  <activeData.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{activeData.title}</h3>
                <p className="text-sm text-muted-foreground">{activeData.description}</p>
              </div>

              {/* Skills list - first 4 */}
              <div className="space-y-4">
                {activeData.skills.slice(0, 4).map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={activeData.color}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Skills list - last 4 */}
            <div className="space-y-4 md:pt-[98px]">
              {activeData.skills.slice(4).map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={activeData.color}
                  index={i + 4}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tech logos scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 overflow-hidden"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center mb-6">
            Technologies I work with
          </p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex gap-4 w-max"
            >
              {[...techLogos, ...techLogos].map((tech, i) => (
                <div
                  key={`${tech}-${i}`}
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-card border border-border/50 text-sm font-medium text-muted-foreground whitespace-nowrap hover:text-foreground hover:border-indigo-500/30 transition-colors"
                >
                  {tech}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
