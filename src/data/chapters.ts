/**
 * Page chapters, in order. The navbar, the chapter rail and every section heading read
 * from this list, so numbering and labels never drift apart.
 */
export const chapters = [
  { id: 'about', label: 'About' },
  { id: 'systems', label: 'Systems' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'github', label: 'GitHub' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];

export const chapterNumber = (id: ChapterId) =>
  String(chapters.findIndex((c) => c.id === id) + 1).padStart(2, '0');
