/**
 * Scenarios for the "Systems in motion" simulator. Each one is an illustrative walk-through
 * of the kind of pipeline behind a real project or role; the log values are simulated and
 * the UI labels them as such.
 */
import type { ToneName } from '@/lib/tones';

export type SimNode = { id: string; label: string; detail: string; log: string; outcome?: 'ok' | 'warn' | 'stop' };

export type Scenario = {
  id: string;
  title: string;
  tagline: string;
  color: ToneName;
  /** Projects (by id) or roles (by experience id) this scenario is based on. */
  basedOn: { projectIds?: number[]; experienceIds?: number[] };
  toggle: { label: string; description: string };
  /** Pipeline when the toggle is off / on. */
  paths: { off: SimNode[]; on: SimNode[] };
  showSignal?: boolean;
};

export const scenarios: Scenario[] = [
  {
    id: 'rag',
    title: 'Grounded RAG assistant',
    tagline: 'Answers only from retrieved documents, and refuses rather than guesses.',
    color: 'violet',
    basedOn: { projectIds: [5, 12] },
    toggle: {
      label: 'Ask an out-of-scope question',
      description: 'Retrieval confidence falls below the threshold, so the no-hallucination fallback takes over.',
    },
    paths: {
      off: [
        { id: 'q', label: 'Query', detail: 'User question', log: 'query: "What did the March newsletter report on enrolment?"' },
        { id: 'embed', label: 'Embed', detail: 'Sentence embeddings', log: 'embedded query into a 384-d vector' },
        { id: 'search', label: 'Vector search', detail: 'FAISS index', log: 'retrieved 4 chunks, top similarity 0.82' },
        { id: 'llm', label: 'LLM', detail: 'Local model via Ollama', log: 'generated an answer from the 4 retrieved chunks' },
        { id: 'cite', label: 'Citation check', detail: 'Every claim must cite a chunk', log: 'all 3 claims cite a source chunk', outcome: 'ok' },
        { id: 'answer', label: 'Answer', detail: 'With sources', log: 'answer returned with 3 citations', outcome: 'ok' },
      ],
      on: [
        { id: 'q', label: 'Query', detail: 'User question', log: 'query: "Who will win the next election?"' },
        { id: 'embed', label: 'Embed', detail: 'Sentence embeddings', log: 'embedded query into a 384-d vector' },
        { id: 'search', label: 'Vector search', detail: 'FAISS index', log: 'top similarity 0.21, below the 0.55 threshold', outcome: 'warn' },
        { id: 'fallback', label: 'Fallback', detail: 'Retrieval-only mode', log: 'LLM generation skipped: no grounded context', outcome: 'warn' },
        { id: 'answer', label: 'Safe reply', detail: 'No invented facts', log: 'reply: "That is not covered in the documents I have."', outcome: 'ok' },
      ],
    },
  },
  {
    id: 'automation',
    title: 'AI deal-intake automation',
    tagline: 'An automation that turns an inbound pitch into a scored, routed deal record.',
    color: 'fuchsia',
    basedOn: { experienceIds: [1] },
    toggle: {
      label: 'Send a messy, incomplete pitch',
      description: 'Extraction confidence drops, so the workflow pauses for a human instead of guessing.',
    },
    paths: {
      off: [
        { id: 'trigger', label: 'Trigger', detail: 'New email or form entry', log: 'new pitch received with a deck attached' },
        { id: 'extract', label: 'AI extract', detail: 'LLM reads the deck', log: 'extracted sector, stage, ask and traction (confidence 0.91)' },
        { id: 'score', label: 'Score', detail: 'Rubric prompt', log: 'thesis fit 4/5, stage fit 5/5', outcome: 'ok' },
        { id: 'crm', label: 'Update tracker', detail: 'Sheet or CRM node', log: 'deal row created and tagged "review this week"' },
        { id: 'notify', label: 'Notify', detail: 'Summary to the team', log: 'one-paragraph summary posted to the team channel', outcome: 'ok' },
      ],
      on: [
        { id: 'trigger', label: 'Trigger', detail: 'New email or form entry', log: 'new pitch received, no deck attached' },
        { id: 'extract', label: 'AI extract', detail: 'LLM reads the email', log: 'stage and ask missing (confidence 0.42)', outcome: 'warn' },
        { id: 'review', label: 'Human review', detail: 'Approval step', log: 'routed to an analyst with the missing fields highlighted', outcome: 'warn' },
        { id: 'crm', label: 'Update tracker', detail: 'Sheet or CRM node', log: 'deal row created as "needs info"', outcome: 'ok' },
      ],
    },
  },
  {
    id: 'governance',
    title: 'AI governance audit',
    tagline: 'Audits a model for fairness, drift and explainability, then writes the report.',
    color: 'emerald',
    basedOn: { projectIds: [2] },
    toggle: {
      label: 'Audit a GenAI / RAG system instead',
      description: 'Swaps the classic ML checks for prompt-injection and citation-coverage tests.',
    },
    paths: {
      off: [
        { id: 'model', label: 'Model', detail: 'Tabular classifier', log: 'loaded model and holdout set' },
        { id: 'fair', label: 'Fairness', detail: 'Disparate impact', log: 'disparate impact ratio 0.86 (minimum 0.80)', outcome: 'ok' },
        { id: 'drift', label: 'Drift', detail: 'Mean shift per feature', log: 'mean shift 0.27 on "income", above 0.20', outcome: 'warn' },
        { id: 'shap', label: 'Explainability', detail: 'SHAP values', log: 'top drivers: tenure, income, region' },
        { id: 'report', label: 'Report', detail: 'Compliance PDF', log: 'PDF report generated: 1 warning, 0 failures', outcome: 'ok' },
      ],
      on: [
        { id: 'model', label: 'GenAI system', detail: 'RAG chatbot', log: 'loaded RAG pipeline and test prompts' },
        { id: 'inject', label: 'Prompt injection', detail: 'Adversarial prompts', log: '48 of 50 injection attempts blocked', outcome: 'warn' },
        { id: 'cite', label: 'Citation coverage', detail: 'Sentences with a source', log: '94% of answer sentences cite a retrieved source', outcome: 'ok' },
        { id: 'report', label: 'Report', detail: 'Compliance PDF', log: 'PDF report generated: 1 warning, 0 failures', outcome: 'ok' },
      ],
    },
  },
];
