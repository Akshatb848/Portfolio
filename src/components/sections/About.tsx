'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Cpu,
  Cloud,
  Code2,
  Rocket,
  Globe,
  ArrowRight,
  Layers,
  Database,
  Zap,
} from 'lucide-react';

const highlights = [
  {
    icon: Brain,
    title: 'AI & ML Systems',
    description: 'Building production-grade ML models and deep learning architectures.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: Zap,
    title: 'Generative AI',
    description: 'LLM fine-tuning, RAG pipelines, and agentic AI frameworks.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Cloud,
    title: 'Cloud & MLOps',
    description: 'Scalable AI infrastructure on AWS, GCP, and Azure with Kubernetes.',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'End-to-end data pipelines for training and serving ML models at scale.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

const stats = [
  { value: '5+', label: 'Years Experience', icon: Rocket },
  { value: '20+', label: 'AI Projects', icon: Layers },
  { value: '3', label: 'Cloud Platforms', icon: Cloud },
  { value: '10+', label: 'Certifications', icon: Globe },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-max" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-indigo-500" />
              <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">
                About Me
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Building AI that{' '}
              <span className="text-gradient">actually works</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Story */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  I&apos;m <span className="text-foreground font-semibold">Akshat Banga</span>, an
                  AI Engineer with deep expertise in machine learning, deep learning, NLP, and
                  computer vision. I specialize in architecting and deploying AI systems that solve
                  real-world problems at scale.
                </p>
                <p>
                  At{' '}
                  <span className="text-foreground font-semibold">Jio Platforms</span>, I built
                  enterprise-grade AI solutions that handled millions of operations. My work spans
                  from building RAG-based retrieval systems and LLM pipelines to designing robust
                  cloud-native MLOps infrastructure on AWS, GCP, and Azure.
                </p>
                <p>
                  I specialize in building production-grade AI applications using{' '}
                  <span className="text-foreground font-semibold">
                    no-code and low-code AI frameworks
                  </span>{' '}
                  combined with agentic AI architectures — delivering solutions that are not just
                  functional, but enterprise-ready and scalable.
                </p>
                <p>
                  Currently focused on{' '}
                  <span className="text-foreground font-semibold">Generative AI engineering</span>{' '}
                  — designing multi-agent systems, building LLM-powered applications, and deploying
                  AI models that deliver business impact from day one.
                </p>
              </div>

              {/* Philosophy */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">My Philosophy</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;I build AI systems that are production-ready from day one — combining
                      deep technical expertise with a product-first mindset to deliver solutions
                      that scale.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() =>
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Let&apos;s work together
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <span className="text-border">·</span>
                <motion.a
                  href="https://www.linkedin.com/in/akshat-banga-6574aa170/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  View LinkedIn
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>

            {/* Right: Highlights + Stats */}
            <div className="space-y-6">
              {/* Capability cards */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-3"
              >
                {highlights.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`p-4 rounded-xl bg-card border ${item.border} transition-all duration-200 group cursor-default`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-4 gap-3"
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-center justify-center mb-1">
                      <stat.icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-xl font-black text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground leading-tight mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Tech stack snippet */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl bg-card border border-border/50 font-code text-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">akshat_banga.py</span>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div>
                    <span className="text-purple-400">class</span>{' '}
                    <span className="text-yellow-300">AkshatBanga</span>
                    <span className="text-muted-foreground">:</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-400">role</span>{' '}
                    <span className="text-muted-foreground">= </span>
                    <span className="text-green-400">&quot;AI Engineer&quot;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-400">focus</span>{' '}
                    <span className="text-muted-foreground">= [</span>
                    <span className="text-green-400">&quot;GenAI&quot;</span>
                    <span className="text-muted-foreground">, </span>
                    <span className="text-green-400">&quot;LLMs&quot;</span>
                    <span className="text-muted-foreground">, </span>
                    <span className="text-green-400">&quot;MLOps&quot;</span>
                    <span className="text-muted-foreground">]</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-400">status</span>{' '}
                    <span className="text-muted-foreground">= </span>
                    <span className="text-green-400">&quot;Open to opportunities&quot;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-400">superpower</span>{' '}
                    <span className="text-muted-foreground">= </span>
                    <span className="text-green-400">&quot;prod-grade AI systems&quot;</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
