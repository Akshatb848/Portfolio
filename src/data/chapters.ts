/**
 * Page chapters, in order. `accent` mirrors the per-chapter --ch colour in globals.css. The navbar, the chapter rail and every section heading read
 * from this list, so numbering and labels never drift apart.
 */
export const chapters = [
  { id: 'about', label: 'About', accent: '#8b5cf6' },
  { id: 'systems', label: 'Systems', accent: '#22d3ee' },
  { id: 'skills', label: 'Skills', accent: '#d946ef' },
  { id: 'toolkit', label: 'Toolkit', accent: '#38bdf8' },
  { id: 'projects', label: 'Projects', accent: '#06b6d4' },
  { id: 'experience', label: 'Experience', accent: '#f59e0b' },
  { id: 'github', label: 'GitHub', accent: '#10b981' },
  { id: 'education', label: 'Education', accent: '#6366f1' },
  { id: 'contact', label: 'Contact', accent: '#a78bfa' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];

export const chapterNumber = (id: ChapterId) =>
  String(chapters.findIndex((c) => c.id === id) + 1).padStart(2, '0');
