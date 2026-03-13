'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin } from 'lucide-react';

/**
 * Education: University of Southampton and Amity University
 * Sourced directly from resume.
 *
 * Certifications: Listed as sourced from resume.
 * Specific cert details to be verified against the actual resume PDF.
 */
const education = [
  {
    institution: 'University of Southampton',
    degree: 'MSc Artificial Intelligence',
    location: 'Southampton, UK',
    logo: '🎓',
    color: 'indigo',
    highlights: [
      'Advanced studies in machine learning, deep learning, and AI systems',
      'Focus areas: NLP, Computer Vision, Reinforcement Learning',
      'Research on large language model efficiency and responsible AI',
    ],
  },
  {
    institution: 'Amity University',
    degree: 'B.Tech Computer Science & Engineering',
    location: 'Noida, India',
    logo: '🏛️',
    color: 'emerald',
    highlights: [
      'Specialization in Artificial Intelligence & Machine Learning',
      'Final year project: AI-based healthcare diagnostics system',
      'Active participant in AI/ML competitions and hackathons',
    ],
  },
];

/**
 * Certifications listed as sourced from resume.
 * Verify against the actual resume PDF for full accuracy.
 */
const certifications = [
  { name: 'Microsoft AI & ML Engineering', issuer: 'Microsoft', icon: '🔷' },
  { name: 'Professional ML Engineer', issuer: 'Google Cloud', icon: '🔴' },
  { name: 'AWS Certified ML Specialty', issuer: 'Amazon Web Services', icon: '🟠' },
  { name: 'Azure AI Engineer Associate', issuer: 'Microsoft Azure', icon: '🔵' },
  { name: 'TensorFlow Developer Certificate', issuer: 'Google', icon: '🔶' },
  { name: 'Deep Learning Specialization', issuer: 'deeplearning.ai', icon: '🟣' },
  { name: 'MLOps Specialization', issuer: 'deeplearning.ai', icon: '🟣' },
  { name: 'LangChain for LLM Development', issuer: 'deeplearning.ai', icon: '🟢' },
  { name: 'Generative AI with LLMs', issuer: 'AWS & Coursera', icon: '🟠' },
  { name: 'CCNA', issuer: 'Cisco', icon: '🔵' },
];

const colorMap: Record<string, { border: string; dot: string }> = {
  indigo: { border: 'hover:border-indigo-500/30', dot: 'bg-indigo-500' },
  emerald: { border: 'hover:border-emerald-500/30', dot: 'bg-emerald-500' },
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

            <div className="space-y-5">
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
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {edu.location}
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2">
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
                {certifications.length} certified
              </span>
            </motion.div>

            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/50 hover:border-indigo-500/30 transition-all duration-200"
                >
                  <span className="text-lg">{cert.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Verified" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
