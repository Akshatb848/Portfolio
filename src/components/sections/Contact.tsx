'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Linkedin, Github, Send, Loader2, CheckCircle2, MapPin, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/akshat-banga',
    href: 'https://www.linkedin.com/in/akshat-banga-6574aa170/',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@Akshatb848',
    href: 'https://github.com/Akshatb848',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'India · Open to Remote',
    href: null,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', company: '', subject: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Send failed');
      }

      setSubmitted(true);
      toast.success("Message sent! I'll get back to you within 24 hours.");
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      toast.error('Failed to send message. Please reach out directly on LinkedIn.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border/60 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 focus:outline-none placeholder:text-muted-foreground/40 transition-colors font-mono';

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-t from-violet-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container-max" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-violet-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-violet-500 font-mono">Contact</span>
            <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-violet-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Let&apos;s build something{' '}
            <span className="text-gradient">amazing together</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Open to AI engineering roles, consulting, and collaboration. Let&apos;s talk about your next AI system.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/8 border border-emerald-500/20 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Available for new opportunities</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            <span className="text-emerald-400/70 text-xs">Responds within 24h</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/8 to-indigo-500/8 border border-violet-500/20">
              <MessageSquare className="w-7 h-7 text-violet-400 mb-3" />
              <h3 className="font-bold text-foreground mb-2">Get in touch</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you&apos;re looking for an AI engineer to join your team, need a consultant for an AI project, or want to collaborate on research — I&apos;d love to hear from you.
              </p>
            </div>

            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.08 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-3.5 rounded-lg bg-card border border-border/50 hover:border-violet-500/30 transition-all duration-200 group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-violet-400 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-lg bg-card border border-border/50">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <h3 className="font-bold text-foreground mb-5 flex items-center gap-2 font-mono">
                <span className="text-violet-400">$</span> send_message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1.5 font-mono">
                      name <span className="text-violet-400">*</span>
                    </label>
                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5 font-mono">
                      email <span className="text-violet-400">*</span>
                    </label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@company.com" className={inputCls} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-muted-foreground mb-1.5 font-mono">
                      company
                    </label>
                    <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} placeholder="Google, OpenAI, ..." className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium text-muted-foreground mb-1.5 font-mono">
                      subject
                    </label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className={inputCls}>
                      <option value="">Select topic...</option>
                      <option value="Job Opportunity">Job Opportunity</option>
                      <option value="AI Consulting">AI Consulting</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1.5 font-mono">
                    message <span className="text-violet-400">*</span>
                  </label>
                  <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell me about your project, the role, or what you're building..." className={`${inputCls} resize-none`} />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  whileHover={!isSubmitting && !submitted ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting && !submitted ? { scale: 0.99 } : {}}
                  className={`w-full py-3 px-6 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    submitted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
                  ) : submitted ? (
                    <><CheckCircle2 className="w-4 h-4" />Message Sent!</>
                  ) : (
                    <><Send className="w-4 h-4" />Send Message</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
