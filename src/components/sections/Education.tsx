'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award, MapPin } from 'lucide-react';

const education = [
  {
    institution: 'University of Southampton',
    degree: 'MSc International Management',
    location: 'Southampton, UK',
    initial: 'UoS',
    color: 'indigo',
    highlights: [
      'Strategic business decision-making with data-driven AI frameworks',
      'Accounting, financial modelling, and risk management using quantitative methods',
      'Marketing analytics and customer intelligence powered by machine learning',
      'International business strategy with focus on digital transformation and AI adoption',
    ],
  },
  {
    institution: 'Amity University',
    degree: 'B.Tech Computer Science & Engineering',
    location: 'Noida, India',
    initial: 'AU',
    color: 'emerald',
    highlights: [
      'Specialization in Artificial Intelligence & Machine Learning',
      'Final year project: Degraded Devanagari and Bangla Script Identification using CNN frameworks',
      'Active participant in AI/ML competitions and inter-university hackathons',
    ],
  },
];

/**
 * Certifications verified from LinkedIn profile.
 */
const certifications = [
  { name: 'Deep Learning Specialization', issuer: 'deeplearning.ai', color: 'violet' },
  { name: 'Machine Learning Specialization', issuer: 'Coursera / Andrew Ng', color: 'indigo' },
  { name: 'TensorFlow Developer Certificate', issuer: 'Google', color: 'amber' },
  { name: 'Generative AI with LLMs', issuer: 'AWS & Coursera', color: 'orange' },
  { name: 'MLOps Specialization', issuer: 'deeplearning.ai', color: 'violet' },
  { name: 'LangChain for LLM Application Development', issuer: 'deeplearning.ai', color: 'emerald' },
  { name: 'AWS Certified Machine Learning – Specialty', issuer: 'Amazon Web Services', color: 'orange' },
  { name: 'Microsoft AI & ML Engineering', issuer: 'Microsoft', color: 'sky' },
];

const colorMap: Record<string, { border: string; dot: string; initial: string }> = {
  indigo: { border: 'hover:border-indigo-500/30', dot: 'bg-indigo-500', initial: 'bg-indigo-500/15 text-indigo-400' },
  emerald: { border: 'hover:border-emerald-500/30', dot: 'bg-emerald-500', initial: 'bg-emerald-500/15 text-emerald-400' },
};

const certColorMap: Record<string, string> = {
  violet: 'border-l-violet-500',
  indigo: 'border-l-indigo-500',
  amber: 'border-l-amber-500',
  orange: 'border-l-orange-500',
  emerald: 'border-l-emerald-500',
  sky: 'border-l-sky-500',
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
            <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-violet-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-violet-500 font-mono">
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
              <GraduationCap className="w-5 h-5 text-violet-400" />
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
                    className={`p-5 rounded-xl bg-card border border-border/50 ${colors.border} transition-all duration-200`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${colors.initial} flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                        {edu.initial}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">{edu.degree}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{edu.institution}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {edu.location}
                        </div>
                      </div>
                    </div>
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
                {certifications.length} certified
              </span>
            </motion.div>

            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className={`flex items-center gap-3 p-3.5 rounded-lg bg-card border border-border/50 border-l-2 ${certColorMap[cert.color]} hover:border-l-2 transition-all duration-200`}
                >
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
