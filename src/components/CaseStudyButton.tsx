'use client';

import { FileSearch } from 'lucide-react';
import type { Project } from '@/data/portfolio';

/** Projects with an entry in data/caseStudies.ts (kept here so the button stays tiny). */
export const HAS_CASE_STUDY = new Set([14, 13, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]);

export const OPEN_CASE_STUDY_EVENT = 'open-case-study';

/** Remembered so a click before the dialog's code has loaded still opens it. */
export let pendingCaseStudy: number | null = null;
export const takePendingCaseStudy = () => {
  const id = pendingCaseStudy;
  pendingCaseStudy = null;
  return id;
};

export const openCaseStudy = (id: number) => {
  pendingCaseStudy = id;
  window.dispatchEvent(new CustomEvent(OPEN_CASE_STUDY_EVENT, { detail: id }));
};

/** Button that opens a project's case study. */
export function CaseStudyButton({
  project,
  tabbable = true,
  className = '',
}: {
  project: Project;
  tabbable?: boolean;
  className?: string;
}) {
  if (!HAS_CASE_STUDY.has(project.id)) return null;
  return (
    <button
      type="button"
      onClick={() => openCaseStudy(project.id)}
      tabIndex={tabbable ? undefined : -1}
      aria-haspopup="dialog"
      aria-label={`Case study: ${project.title}`}
      className={`flex items-center gap-1.5 min-h-11 px-3.5 text-xs font-semibold rounded-lg border border-border hover:border-foreground/40 text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${className}`}
    >
      <FileSearch className="w-3.5 h-3.5" aria-hidden="true" />
      Case study
    </button>
  );
}

