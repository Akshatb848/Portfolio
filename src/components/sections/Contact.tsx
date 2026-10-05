'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Instagram, FileText, Copy, Check, ArrowUpRight } from 'lucide-react';
import { site } from '@/lib/site';
import { SectionHeading } from '@/components/SectionHeading';

export function ContactSection({ resumeUrl }: { resumeUrl: string | null }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const links = [
    { icon: Linkedin, label: 'LinkedIn', detail: 'Connect or message', href: site.linkedin },
    { icon: Github, label: 'GitHub', detail: `@${site.githubUsername}`, href: site.github },
    { icon: Instagram, label: 'Instagram', detail: `@${site.instagramHandle}`, href: site.instagram },
    ...(resumeUrl
      ? [{ icon: FileText, label: 'Résumé', detail: 'Download PDF', href: resumeUrl }]
      : []),
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <SectionHeading
            chapter="contact"
            eyebrow="Contact"
            center
            title={
              <>
                Let&apos;s <span className="text-gradient">work together</span>
              </>
            }
          />
          <p className="text-base text-muted-foreground -mt-6 mb-10 max-w-xl mx-auto leading-relaxed">
            Open to AI generalist and AI transformation roles, and to collaborations on low-code / no-code automation, agentic AI and RAG.
            Email is the fastest way to reach me.
          </p>

          {/* Primary: email */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 mb-8">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center justify-center gap-2.5 min-h-12 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {site.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-violet-500/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
              <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </div>

          {/* Secondary links */}
          <div className={`grid gap-3 ${links.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : { download: true })}
                className="group flex items-center gap-3 min-h-14 p-4 rounded-xl bg-card border border-border/60 hover:border-violet-500/40 text-left transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <link.icon className="w-5 h-5 text-violet-700 dark:text-violet-400" aria-hidden="true" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{link.label}</span>
                  <span className="block text-xs text-muted-foreground truncate">{link.detail}</span>
                </span>
                <ArrowUpRight
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
