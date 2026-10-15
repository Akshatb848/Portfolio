'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CornerDownLeft, ShieldCheck } from 'lucide-react';
import { embed, MIN_SCORE, search, type Hit } from '@/lib/retrieval';
import { isMotionOff } from '@/lib/motion';
import { FOCUS_PROJECT_EVENT } from '@/lib/events';

const STAGES = ['Query', 'Tokenise', 'Vectorise', 'Search', 'Cite', 'Answer'] as const;
const EXAMPLES = ['Which projects use RAG?', 'What did you build at Deloitte?', 'Kubernetes experience?', 'Forecasting work'];

type Result = { query: string; terms: [string, number][]; hits: Hit[] };

/**
 * "Ask this site": real retrieval (TF-IDF + cosine) over the projects and roles on this page,
 * run in the browser. The answer is the best-matching sentence, cited; below a similarity
 * threshold it refuses rather than guessing, mirroring the no-hallucination chatbot.
 */
export function LiveRag() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [stage, setStage] = useState(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ask = (q: string) => {
    const query = q.trim();
    if (!query) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const vec = embed(query);
    const terms = [...vec.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    setResult({ query, terms, hits: search(query) });
    const instant = isMotionOff() || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (instant) {
      setStage(STAGES.length);
      return;
    }
    setStage(0);
    STAGES.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStage(i + 1), 220 * (i + 1)));
    });
  };

  const done = stage >= STAGES.length;
  const hits = result?.hits ?? [];
  const grounded = hits.length > 0 && hits[0].score >= MIN_SCORE;

  return (
    <div className="hud mt-8 rounded-3xl border border-border bg-card/90 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Try it: ask this site</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Real retrieval, running in your browser: TF-IDF vectors and cosine similarity over the projects and
            roles on this page. No LLM: the answer is the best-matching sentence, with its source.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2"
      >
        <label htmlFor="rag-q" className="sr-only">
          Ask a question about my work
        </label>
        <input
          id="rag-q"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Which projects use LangGraph?"
          autoComplete="off"
          className="flex-1 min-w-0 min-h-11 px-4 rounded-xl border border-border bg-background font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
        />
        <button
          type="submit"
          className="magnetic inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          Ask
          <CornerDownLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
      <div className="flex flex-wrap gap-2 mt-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setInput(ex);
              ask(ex);
            }}
            className="min-h-11 px-3 rounded-lg border border-border bg-background text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {ex}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-6">
          {/* Pipeline progress */}
          <ol className="flex flex-wrap gap-1.5 mb-5" aria-label="Retrieval steps">
            {STAGES.map((s, i) => (
              <li
                key={s}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] uppercase tracking-wider border transition-colors duration-200 ${
                  i < stage
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-800 dark:text-cyan-300'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {s}
              </li>
            ))}
          </ol>

          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5">
            {/* Query vector */}
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                Query vector · top terms
              </p>
              {result.terms.length ? (
                <ul className="space-y-1.5">
                  {result.terms.map(([t, w]) => (
                    <li key={t} className="flex items-center gap-2 font-mono text-xs">
                      <span className="w-28 truncate text-foreground">{t}</span>
                      <span className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-400 origin-left transition-transform duration-500"
                          style={{ transform: `scaleX(${stage >= 3 ? w : 0})` }}
                        />
                      </span>
                      <span className="w-10 text-right tabular-nums text-muted-foreground">{w.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No searchable words in that question.</p>
              )}
            </div>

            {/* Results and answer */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                Nearest documents · cosine similarity
              </p>
              <ul className="space-y-2">
                {hits.map((h, i) => (
                  <li key={h.doc.id} className={`rounded-xl border border-border bg-background/60 p-3 transition-opacity duration-300 ${stage >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <a
                        href={h.doc.href}
                        onClick={() => {
                          const m = h.doc.href.match(/^#project-(\d+)$/);
                          if (m) window.dispatchEvent(new CustomEvent(FOCUS_PROJECT_EVENT, { detail: Number(m[1]) }));
                        }}
                        className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-foreground hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 rounded"
                      >
                        [{i + 1}] {h.doc.title}
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                        {h.doc.kind} · {h.score.toFixed(2)}
                      </span>
                    </div>
                    <span className="block mt-1 h-1 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                      <span className="block h-full bg-cyan-500 origin-left" style={{ transform: `scaleX(${Math.min(1, h.score * 2)})` }} />
                    </span>
                  </li>
                ))}
              </ul>

              <div aria-live="polite" className="mt-4">
                {done && (
                  <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/5 p-4">
                    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cyan-800 dark:text-cyan-300 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      {grounded ? 'Grounded answer' : 'Refused: nothing relevant retrieved'}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {grounded
                        ? `${hits[0].doc.title}: ${hits[0].sentence} [1]${
                            hits.length > 1
                              ? ` Also relevant: ${hits
                                  .slice(1)
                                  .filter((h) => h.score >= MIN_SCORE)
                                  .map((h, i) => `${h.doc.title} [${i + 2}]`)
                                  .join(', ')}.`
                              : ''
                          }`.replace(/ Also relevant: \.$/, '')
                        : `I can only answer from what is on this site, and nothing here matches “${result.query}” closely enough (best similarity ${
                            hits[0]?.score.toFixed(2) ?? '0.00'
                          }, threshold ${MIN_SCORE}).`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
