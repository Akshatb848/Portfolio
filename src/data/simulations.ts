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
    id: 'aiops',
    title: 'AIOps incident triage',
    tagline: 'From a noisy metric stream to a ranked root-cause hypothesis and a ticket.',
    color: 'cyan',
    basedOn: { experienceIds: [1] },
    showSignal: true,
    toggle: {
      label: 'Inject a latency fault',
      description: 'A latency spike on one service triggers detection, correlation and root-cause analysis.',
    },
    paths: {
      off: [
        { id: 'ingest', label: 'Telemetry', detail: 'Metrics and logs', log: 'ingesting latency, error-rate and CPU metrics' },
        { id: 'detect', label: 'Anomaly detection', detail: 'Rolling baseline', log: 'all signals within 3σ of baseline', outcome: 'ok' },
        { id: 'idle', label: 'No action', detail: 'Keep watching', log: 'no incident opened', outcome: 'ok' },
      ],
      on: [
        { id: 'ingest', label: 'Telemetry', detail: 'Metrics and logs', log: 'ingesting latency, error-rate and CPU metrics' },
        { id: 'detect', label: 'Anomaly detection', detail: 'Rolling baseline', log: 'p95 latency 4.6σ above baseline on api-gateway', outcome: 'warn' },
        { id: 'correlate', label: 'Correlate', detail: 'Group related alerts', log: '17 alerts grouped into 1 incident' },
        { id: 'rca', label: 'Root cause', detail: 'LLM over logs + topology', log: 'top hypothesis: connection-pool exhaustion after a deploy' },
        { id: 'ticket', label: 'Ticket + runbook', detail: 'Routed to on-call', log: 'incident ticket opened with runbook steps attached', outcome: 'ok' },
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
      description: 'Swaps the classic ML checks for prompt-injection and citation-accuracy tests.',
    },
    paths: {
      off: [
        { id: 'model', label: 'Model', detail: 'Tabular classifier', log: 'loaded model and holdout set' },
        { id: 'fair', label: 'Fairness', detail: 'Group parity', log: 'demographic parity gap 0.04 (limit 0.10)', outcome: 'ok' },
        { id: 'drift', label: 'Drift', detail: 'PSI per feature', log: 'PSI 0.27 on "income", above 0.20', outcome: 'warn' },
        { id: 'shap', label: 'Explainability', detail: 'SHAP values', log: 'top drivers: tenure, income, region' },
        { id: 'report', label: 'Report', detail: 'Compliance PDF', log: 'PDF report generated: 1 warning, 0 failures', outcome: 'ok' },
      ],
      on: [
        { id: 'model', label: 'GenAI system', detail: 'RAG chatbot', log: 'loaded RAG pipeline and test prompts' },
        { id: 'inject', label: 'Prompt injection', detail: 'Adversarial prompts', log: '48 of 50 injection attempts blocked', outcome: 'warn' },
        { id: 'cite', label: 'Citation accuracy', detail: 'Answer vs source', log: '94% of answers fully supported by sources', outcome: 'ok' },
        { id: 'report', label: 'Report', detail: 'Compliance PDF', log: 'PDF report generated: 1 warning, 0 failures', outcome: 'ok' },
      ],
    },
  },
];
