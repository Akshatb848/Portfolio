'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award, ExternalLink, CheckCircle2, Calendar, MapPin } from 'lucide-react';

const education = [
  {
    institution: 'University of Southampton',
    degree: 'MSc Artificial Intelligence',
    period: '2023 – 2024',
    location: 'Southampton, UK',
    logo: '🎓',
    color: 'indigo',
    description:
      'Advanced studies in machine learning, deep learning, neural networks, and AI systems. Research focus on LLM efficiency and responsible AI.',
    highlights: [
      'Dissertation: "Efficient Fine-tuning of Large Language Models for Domain-Specific Tasks"',
      'Coursework: Advanced ML, Deep Learning, NLP, Computer Vision, Reinforcement Learning',
      'Research assistant in the AI Lab — working on foundation models',
    ],
  },
  {
    institution: 'Amity University',
    degree: 'B.Tech Computer Science & Engineering',
    period: '2018 – 2022',
    location: 'Noida, India',
    logo: '🏛️',
    color: 'emerald',
    description:
      'Bachelor\'s in Computer Science with specialization in Artificial Intelligence and Machine Learning. CGPA: 8.7/10.',
    highlights: [
      'Specialization: Artificial Intelligence & Machine Learning',
      'Final Year Project: Smart Healthcare Diagnosis System using CNN',
      'Won 2 national-level hackathons in AI/ML category',
    ],
  },
];

const certifications = [
  {
    name: 'AI & ML Engineering Professional',
    issuer: 'Microsoft',
    icon: '🔷',
    color: 'blue',
    year: '2024',
    verified: true,
  },
  {
    name: 'Professional ML Engineer',
    issuer: 'Google Cloud',
    icon: '🔴',
    color: 'red',
    year: '2024',
    verified: true,
  },
  {
    name: 'AWS Certified ML Specialty',
    issuer: 'Amazon Web Services',
    icon: '🟠',
    color: 'orange',
    year: '2023',
    verified: true,
  },
  {
    name: 'Azure AI Engineer Associate',
    issuer: 'Microsoft Azure',
    icon: '🔵',
    color: 'sky',
    year: '2023',
    verified: true,
  },
  {
    name: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    icon: '🔴',
    color: 'red',
    year: '2023',
    verified: true,
  },
  {
    name: 'CCNA (Cisco Certified Network Associate)',
    issuer: 'Cisco',
    icon: '🟢',
    color: 'emerald',
    year: '2022',
    verified: true,
  },
  {
    name: 'Deep Learning Specialization',
    issuer: 'deeplearning.ai (Coursera)',
    icon: '🟣',
    color: 'purple',
    year: '2022',
    verified: true,
  },
  {
    name: 'MLOps Specialization',
    issuer: 'deeplearning.ai (Coursera)',
    icon: '🟣',
    color: 'purple',
    year: '2023',
    verified: true,
  },
  {
    name: 'LangChain for LLM Application Development',
    issuer: 'deeplearning.ai',
    icon: '🟢',
    color: 'emerald',
    year: '2024',
    verified: true,
  },
  {
    name: 'Generative AI with Large Language Models',
    issuer: 'AWS & Coursera',
    icon: '🟠',
    color: 'orange',
    year: '2024',
    verified: true,
  },
];

const colorMap: Record<string, { border: string; badge: string; dot: string }> = {
  indigo: {
    border: 'hover:border-indigo-500/30',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    dot: 'bg-indigo-500',
  },
  emerald: {
    border: 'hover:border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
};

export function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
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
              Education & Certifications
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Academic background &{' '}
            <span className="text-gradient">credentials</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-6"
            >
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-foreground">Education</h3>
            </motion.div>

            <div className="space-y-4">
              {education.map((edu, i) => {
                const colors = colorMap[edu.color];
                return (
                  <motion.div
                    key={edu.institution}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    whileHover={{ y: -2 }}
                    className={`p-6 rounded-2xl bg-card border border-border/50 ${colors.border} transition-all duration-200`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{edu.logo}</span>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-foreground">{edu.degree}</h4>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" /> {edu.period}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {edu.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {edu.description}
                    </p>

                    <ul className="space-y-1.5">
                      {edu.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`} />
                          <span className="text-xs text-muted-foreground">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-6"
            >
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Certifications</h3>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {certifications.length} earned
              </span>
            </motion.div>

            <div className="grid grid-cols-1 gap-2.5">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/50 hover:border-indigo-500/30 transition-all duration-200 group"
                >
                  <span className="text-lg">{cert.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.year}</p>
                  </div>
                  {cert.verified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
