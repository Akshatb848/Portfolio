'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Zap,
  Cloud,
  Code2,
  ArrowRight,
  Database,
  Users,
  GitBranch,
} from 'lucide-react';

const highlights = [
  {
    icon: Brain,
    title: 'AI & ML Systems',
    description: 'Production ML models, deep learning architectures, and NLP pipelines.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Zap,
    title: 'Generative AI',
    description: 'LLM fine-tuning, RAG pipelines, agentic AI, and multi-agent orchestration.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Cloud,
    title: 'Cloud & MLOps',
    description: 'Cloud-native ML on AWS, GCP, and Azure with Kubernetes and Docker.',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'End-to-end data pipelines and feature stores for ML training and serving.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-max" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-violet-500">
              About Me
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Building AI that{' '}
            <span className="text-gradient">actually works</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                I&apos;m <span className="text-foreground font-semibold">Akshat Banga</span>, an AI
                Engineer with expertise in machine learning, deep learning, NLP, and computer
                vision. I architect and deploy AI systems that solve real-world problems at scale.
              </p>
              <p>
                At{' '}
                <span className="text-foreground font-semibold">Jio Platforms</span>, I engineer
                AI systems that serve{' '}
                <span className="text-foreground font-semibold">400M+ users</span> — building
                production ML pipelines, RAG-based retrieval systems, and LLM-powered automation
                tools on scalable cloud infrastructure.
              </p>
              <p>
                My background spans enterprise AI consulting at{' '}
                <span className="text-foreground font-semibold">Deloitte South Asia</span>, ML
                engineering at{' '}
                <span className="text-foreground font-semibold">Unified Mentor</span>, and AI
                research at{' '}
                <span className="text-foreground font-semibold">C-DOT</span> (Government of India)
                and{' '}
                <span className="text-foreground font-semibold">Feynn Labs</span>.
              </p>
              <p>
                I specialize in building production-grade AI applications from scratch using{' '}
                <span className="text-foreground font-semibold">agentic AI architectures</span>{' '}
                combined with scalable cloud-native deployment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Code2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">My Approach</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;I specialize in building production-grade AI applications from scratch
                    using agentic AI architectures combined with scalable cloud-native
                    deployment.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <motion.button
                whileHover={{ scale: 1.02, x: 3 }}
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="flex items-center gap-2 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors"
              >
                Let&apos;s work together
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <span className="text-border">·</span>
              <motion.a
                href="https://www.linkedin.com/in/akshat-banga-6574aa170/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, x: 3 }}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn Profile
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`p-4 rounded-xl bg-card border ${item.border} transition-all duration-200 group cursor-default`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { icon: Users, value: '400M+', label: 'Users Served', note: 'at Jio Platforms' },
                { icon: GitBranch, value: '14', label: 'GitHub Repos', note: 'open source' },
                { icon: Cloud, value: '3', label: 'Cloud Platforms', note: 'AWS · GCP · Azure' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-3 rounded-xl bg-card border border-border/50"
                >
                  <s.icon className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                  <div className="text-lg font-black text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
                  <div className="text-xs text-muted-foreground/60 leading-tight">{s.note}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              className="p-4 rounded-xl bg-card border border-border/50 font-mono"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground">akshat.py</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-purple-400">class</span>{' '}
                  <span className="text-yellow-300">AkshatBanga</span>
                  <span className="text-muted-foreground">:</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">role</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-400">&quot;AI Engineer&quot;</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">focus</span>
                  <span className="text-muted-foreground"> = [</span>
                  <span className="text-green-400">&quot;GenAI&quot;</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-green-400">&quot;MLOps&quot;</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-green-400">&quot;LLMs&quot;</span>
                  <span className="text-muted-foreground">]</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">companies</span>
                  <span className="text-muted-foreground"> = [</span>
                  <span className="text-orange-300">&quot;Jio Platforms&quot;</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-orange-300">&quot;Deloitte&quot;</span>
                  <span className="text-muted-foreground">, ...]</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">status</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-400">&quot;Open to opportunities&quot;</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
