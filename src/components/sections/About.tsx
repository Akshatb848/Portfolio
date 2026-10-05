'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Zap,
  Cloud,
  ArrowRight,
  Workflow,
  Users,
  Instagram,
} from 'lucide-react';
import { site } from '@/lib/site';
import { SectionHeading } from '@/components/SectionHeading';

const highlights = [
  {
    icon: Brain,
    title: 'AI & ML Systems',
    description: 'Forecasting, text classification and computer vision with CNNs.',
    color: 'text-violet-700 dark:text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Zap,
    title: 'Generative AI',
    description: 'LLM apps, RAG pipelines, LangGraph agents and multi-agent orchestration.',
    color: 'text-purple-700 dark:text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Cloud,
    title: 'Cloud & MLOps',
    description: 'GCP, Azure and AWS deployments with Docker, Kubernetes, Terraform and CI/CD.',
    color: 'text-sky-700 dark:text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Workflow,
    title: 'Low-code / No-code AI',
    description: 'Automations built from AI tools and n8n workflows that take manual steps out of everyday work.',
    color: 'text-emerald-800 dark:text-emerald-500',
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
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-linear-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-linear-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-max" ref={ref}>
        <SectionHeading
          chapter="about"
          eyebrow="About me"
          title={
            <>
              Building AI that <span className="text-gradient">actually works</span>
            </>
          }
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                I&apos;m <span className="text-foreground font-semibold">Akshat Banga</span>, an{' '}
                <span className="text-foreground font-semibold">AI Generalist and transformation expert</span>{' '}
                in New Delhi. I pick the right AI tool for the job and use{' '}
                <span className="text-foreground font-semibold">low-code / no-code AI</span> to
                transform manual processes quickly, then write custom code where it pays off.
              </p>
              <p>
                I build <span className="text-foreground font-semibold">LLM apps, RAG and multi-agent systems</span>:
                currently a multi-agent dealflow workflow at{' '}
                <span className="text-foreground font-semibold">YourNest Venture Capital</span>{' '}
                (internship through November 2026), and earlier
                LangChain multi-agent systems at{' '}
                <span className="text-foreground font-semibold">Deloitte South Asia</span> that cut
                manual data-analysis effort by 40%.
              </p>
              <p>
                At <span className="text-foreground font-semibold">Jio Platforms</span> I worked on
                enterprise cloud platforms (Jio CloudXP and NIC Meghraj 2.0), including controlled
                releases and Kubernetes and database operations.
              </p>
              <p>
                Earlier work includes forecasting and text-classification models at{' '}
                <span className="text-foreground font-semibold">Unified Mentor</span>, and deep
                learning and computer vision at{' '}
                <span className="text-foreground font-semibold">C-DOT</span> and{' '}
                <span className="text-foreground font-semibold">Feynn Labs</span>. I recently completed
                an MSc in International Management at the University of Southampton.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <a
                href="#contact"
                className="flex items-center gap-2 min-h-11 text-sm font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                Let&apos;s work together
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <span className="text-border" aria-hidden="true">·</span>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 min-h-11 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                LinkedIn Profile
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
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
                { icon: Zap, value: '40%', label: 'Less manual analysis', note: 'Deloitte, multi-agent' },
                { icon: Brain, value: '149', label: 'Passing tests', note: 'TennisIQ CI' },
                { icon: Users, value: '8', label: 'Agents in ASIS', note: 'decision intelligence' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-3 rounded-xl bg-card border border-border/50"
                >
                  <s.icon className="w-4 h-4 text-violet-700 dark:text-violet-400 mx-auto mb-1" />
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
                  <span className="text-purple-700 dark:text-purple-400">class</span>{' '}
                  <span className="text-yellow-800 dark:text-yellow-300">AkshatBanga</span>
                  <span className="text-muted-foreground">:</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-700 dark:text-sky-400">role</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-800 dark:text-green-400">&quot;AI Generalist&quot;</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-700 dark:text-sky-400">focus</span>
                  <span className="text-muted-foreground"> = [</span>
                  <span className="text-green-800 dark:text-green-400">&quot;No-code AI&quot;</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-green-800 dark:text-green-400">&quot;AI tools&quot;</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-green-800 dark:text-green-400">&quot;LLMs&quot;</span>
                  <span className="text-muted-foreground">]</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-700 dark:text-sky-400">companies</span>
                  <span className="text-muted-foreground"> = [</span>
                  <span className="text-orange-800 dark:text-orange-300">&quot;YourNest VC&quot;</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-orange-800 dark:text-orange-300">&quot;Deloitte&quot;</span>
                  <span className="text-muted-foreground">, ...]</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-700 dark:text-sky-400">status</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-800 dark:text-green-400">&quot;Open to opportunities&quot;</span>
                </div>
              </div>
            </motion.div>

            <motion.a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
              className="ig-ring group block rounded-xl p-px focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex items-center gap-4 rounded-[11px] bg-card p-4">
                <span className="ig-gradient relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6 text-white" aria-hidden="true" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Creator on Instagram
                  </span>
                  <span className="block text-sm font-bold text-foreground truncate">
                    @{site.instagramHandle}
                  </span>
                  <span className="block text-xs text-muted-foreground leading-relaxed">
                    AI tools and low-code automations that do the busywork for you.
                  </span>
                </span>
                <ArrowRight
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-[color,transform]"
                  aria-hidden="true"
                />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
