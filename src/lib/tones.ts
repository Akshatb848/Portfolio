/**
 * Colour tokens shared by every section. Light-mode text uses 700/800 shades and dark mode
 * uses 300/400, which keeps all text at WCAG AA contrast in both themes. Class strings are
 * written out in full so Tailwind can see them.
 */
export type Tone = {
  text: string;
  badge: string;
  soft: string;
  border: string;
  hoverBorder: string;
  dot: string;
  bar: string;
  glow: string;
  hex: string;
};

export const tones = {
  indigo: {
    text: 'text-indigo-700 dark:text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
    soft: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    hoverBorder: 'hover:border-indigo-500/50',
    dot: 'bg-indigo-500',
    bar: 'from-indigo-500 to-indigo-400',
    glow: 'shadow-indigo-500/20',
    hex: '#6366f1',
  },
  violet: {
    text: 'text-violet-700 dark:text-violet-400',
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
    soft: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    hoverBorder: 'hover:border-violet-500/50',
    dot: 'bg-violet-500',
    bar: 'from-violet-500 to-violet-400',
    glow: 'shadow-violet-500/20',
    hex: '#8b5cf6',
  },
  purple: {
    text: 'text-purple-700 dark:text-purple-400',
    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25',
    soft: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    hoverBorder: 'hover:border-purple-500/50',
    dot: 'bg-purple-500',
    bar: 'from-purple-500 to-purple-400',
    glow: 'shadow-purple-500/20',
    hex: '#a855f7',
  },
  fuchsia: {
    text: 'text-fuchsia-700 dark:text-fuchsia-400',
    badge: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/25',
    soft: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/25',
    hoverBorder: 'hover:border-fuchsia-500/50',
    dot: 'bg-fuchsia-500',
    bar: 'from-fuchsia-500 to-fuchsia-400',
    glow: 'shadow-fuchsia-500/20',
    hex: '#d946ef',
  },
  rose: {
    text: 'text-rose-700 dark:text-rose-400',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    soft: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    hoverBorder: 'hover:border-rose-500/50',
    dot: 'bg-rose-500',
    bar: 'from-rose-500 to-rose-400',
    glow: 'shadow-rose-500/20',
    hex: '#f43f5e',
  },
  orange: {
    text: 'text-orange-800 dark:text-orange-400',
    badge: 'bg-orange-500/10 text-orange-800 dark:text-orange-400 border-orange-500/25',
    soft: 'bg-orange-500/10',
    border: 'border-orange-500/25',
    hoverBorder: 'hover:border-orange-500/50',
    dot: 'bg-orange-500',
    bar: 'from-orange-500 to-orange-400',
    glow: 'shadow-orange-500/20',
    hex: '#f97316',
  },
  amber: {
    text: 'text-amber-800 dark:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/25',
    soft: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    hoverBorder: 'hover:border-amber-500/50',
    dot: 'bg-amber-500',
    bar: 'from-amber-500 to-amber-400',
    glow: 'shadow-amber-500/20',
    hex: '#f59e0b',
  },
  green: {
    text: 'text-green-800 dark:text-green-400',
    badge: 'bg-green-500/10 text-green-800 dark:text-green-400 border-green-500/25',
    soft: 'bg-green-500/10',
    border: 'border-green-500/25',
    hoverBorder: 'hover:border-green-500/50',
    dot: 'bg-green-500',
    bar: 'from-green-500 to-green-400',
    glow: 'shadow-green-500/20',
    hex: '#22c55e',
  },
  emerald: {
    text: 'text-emerald-800 dark:text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/25',
    soft: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    hoverBorder: 'hover:border-emerald-500/50',
    dot: 'bg-emerald-500',
    bar: 'from-emerald-500 to-emerald-400',
    glow: 'shadow-emerald-500/20',
    hex: '#10b981',
  },
  teal: {
    text: 'text-teal-800 dark:text-teal-400',
    badge: 'bg-teal-500/10 text-teal-800 dark:text-teal-400 border-teal-500/25',
    soft: 'bg-teal-500/10',
    border: 'border-teal-500/25',
    hoverBorder: 'hover:border-teal-500/50',
    dot: 'bg-teal-500',
    bar: 'from-teal-500 to-teal-400',
    glow: 'shadow-teal-500/20',
    hex: '#14b8a6',
  },
  cyan: {
    text: 'text-cyan-700 dark:text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
    soft: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    hoverBorder: 'hover:border-cyan-500/50',
    dot: 'bg-cyan-500',
    bar: 'from-cyan-500 to-cyan-400',
    glow: 'shadow-cyan-500/20',
    hex: '#06b6d4',
  },
  sky: {
    text: 'text-sky-700 dark:text-sky-400',
    badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25',
    soft: 'bg-sky-500/10',
    border: 'border-sky-500/25',
    hoverBorder: 'hover:border-sky-500/50',
    dot: 'bg-sky-500',
    bar: 'from-sky-500 to-sky-400',
    glow: 'shadow-sky-500/20',
    hex: '#0ea5e9',
  },
  slate: {
    text: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25',
    soft: 'bg-slate-500/10',
    border: 'border-slate-500/25',
    hoverBorder: 'hover:border-slate-500/50',
    dot: 'bg-slate-500',
    bar: 'from-slate-500 to-slate-400',
    glow: 'shadow-slate-500/20',
    hex: '#64748b',
  },
} satisfies Record<string, Tone>;

export type ToneName = keyof typeof tones;

export const tone = (name: string): Tone => tones[name as ToneName] ?? tones.indigo;
