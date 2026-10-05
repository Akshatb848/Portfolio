'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award, MapPin } from 'lucide-react';
import { education, certifications, languages } from '@/data/portfolio';
import { SectionHeading } from '@/components/SectionHeading';

const colorMap: Record<string, { border: string; dot: string; initial: string }> = {
  indigo: { border: 'hover:border-indigo-500/30', dot: 'bg-indigo-500', initial: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400' },
  emerald: { border: 'hover:border-emerald-500/30', dot: 'bg-emerald-500', initial: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400' },
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
        <SectionHeading
          chapter="education"
          eyebrow="Education & certifications"
          title={
            <>
              Academic background &amp; <span className="text-gradient">credentials</span>
            </>
          }
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-6"
            >
              <GraduationCap className="w-5 h-5 text-violet-700 dark:text-violet-400" />
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
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg ${colors.initial} flex items-center justify-center font-bold text-xs shrink-0`}>
                        {edu.initial}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">{edu.degree}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{edu.institution}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground tabular-nums">{edu.period}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" aria-hidden="true" />
                            {edu.location}
                          </span>
                        </div>
                      </div>
                    </div>
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
              <Award className="w-5 h-5 text-amber-800 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Certifications</h3>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                {certifications.length}
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
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-foreground mb-3">Languages</h3>
              <ul className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <li key={l.name} className="px-3 py-2 rounded-lg bg-card border border-border/60 text-sm">
                    <span className="font-semibold text-foreground">{l.name}</span>
                    <span className="text-muted-foreground"> · {l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
