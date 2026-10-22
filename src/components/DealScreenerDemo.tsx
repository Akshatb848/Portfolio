'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { isMotionOff } from '@/lib/motion';

type Signal = 'market' | 'financials' | 'founder' | 'esg';
type Deal = { name: string; values: Record<Signal, number>; hasFinancials: boolean };

const AGENTS: { id: Signal; label: string; weight: number }[] = [
  { id: 'market', label: 'Market & moat', weight: 0.3 },
  { id: 'financials', label: 'Financial metrics', weight: 0.3 },
  { id: 'founder', label: 'Founder–market fit', weight: 0.3 },
  { id: 'esg', label: 'ESG', weight: 0.1 },
];

// Synthetic example deals (not real companies).
const PRESETS: Deal[] = [
  { name: 'B2B SaaS, seed', values: { market: 8, financials: 7, founder: 9, esg: 7 }, hasFinancials: true },
  { name: 'D2C brand, thin margins', values: { market: 6, financials: 4, founder: 6, esg: 6 }, hasFinancials: true },
  { name: 'Pitch missing financials', values: { market: 7, financials: 0, founder: 8, esg: 6 }, hasFinancials: false },
];

type Verdict = 'Yes' | 'Maybe' | 'Needs Review' | 'No';

function score(d: Deal): { verdict: Verdict; total: number | null; reason: string } {
  if (!d.hasFinancials) return { verdict: 'Needs Review', total: null, reason: 'Financials are missing, so the deal goes to a person instead of being guessed.' };
  const total = AGENTS.reduce((s, a) => s + d.values[a.id] * a.weight, 0);
  if (total >= 7.5) return { verdict: 'Yes', total, reason: 'Strong across market, financials and team.' };
  if (total >= 6) return { verdict: 'Maybe', total, reason: 'Promising, with gaps to probe in a first call.' };
  return { verdict: 'No', total, reason: 'Below the bar on the weighted signals.' };
}

const VERDICT_STYLE: Record<Verdict, string> = {
  Yes: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
  Maybe: 'border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  'Needs Review': 'border-sky-500/50 bg-sky-500/10 text-sky-800 dark:text-sky-300',
  No: 'border-rose-500/50 bg-rose-500/10 text-rose-800 dark:text-rose-300',
};

/**
 * "Screen a deal": an illustrative, client-side walk-through of the Deal Screener flow.
 * Agents report one by one, then a deterministic rule turns their signals into a verdict.
 * The weights here are simplified for the demo; the production rules live in the repo.
 */
export function DealScreenerDemo() {
  const [deal, setDeal] = useState<Deal>(PRESETS[0]);
  const [step, setStep] = useState(-1); // -1 idle, 0..3 agents, 4 scored
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const instant = isMotionOff() || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (instant) return setStep(AGENTS.length);
    setStep(0);
    for (let i = 1; i <= AGENTS.length; i++) timers.current.push(window.setTimeout(() => setStep(i), 420 * i));
  };

  const edit = (next: Deal) => {
    setDeal(next);
    setStep(-1);
  };
  const result = score(deal);
  const done = step >= AGENTS.length;

  return (
    <div className="hud rounded-2xl border border-border bg-card p-5" style={{ ['--ch' as string]: '#8b5cf6' }}>
      <h3 className="text-lg font-bold text-foreground">Try it: screen a deal</h3>
      <p className="text-xs text-muted-foreground mt-1">
        Illustrative: synthetic deals and simplified weights. In production, local Ollama agents read the real pitch and
        deterministic Python rules make the call.
      </p>

      <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Example deals">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            aria-pressed={deal.name === p.name}
            onClick={() => edit(p)}
            className={`min-h-11 px-3 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
              deal.name === p.name ? 'border-violet-500/60 bg-violet-500/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-5">
        {AGENTS.map((a) => (
          <label key={a.id} className="block">
            <span className="flex justify-between text-xs text-muted-foreground">
              <span>{a.label}</span>
              <span className="font-mono tabular-nums text-foreground">{deal.values[a.id]}/10</span>
            </span>
            <input
              type="range"
              min={0}
              max={10}
              value={deal.values[a.id]}
              disabled={a.id === 'financials' && !deal.hasFinancials}
              onChange={(e) => edit({ ...deal, name: 'Custom deal', values: { ...deal.values, [a.id]: Number(e.target.value) } })}
              className="w-full accent-violet-600 min-h-8"
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-foreground min-h-11">
          <input
            type="checkbox"
            checked={deal.hasFinancials}
            onChange={(e) => edit({ ...deal, name: 'Custom deal', hasFinancials: e.target.checked })}
            className="w-4 h-4 accent-violet-600"
          />
          Pitch includes financials
        </label>
      </div>

      <button
        type="button"
        onClick={run}
        className="magnetic mt-4 inline-flex items-center gap-2 min-h-11 px-5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      >
        <Play className="w-4 h-4" aria-hidden="true" />
        Run the screen
      </button>

      {step >= 0 && (
        <div className="mt-5">
          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2" aria-label="Agent results">
            {AGENTS.map((a, i) => {
              const reported = i < step || done;
              const missing = a.id === 'financials' && !deal.hasFinancials;
              return (
                <li
                  key={a.id}
                  className={`rounded-lg border p-3 transition-colors duration-300 ${reported ? 'border-violet-500/40 bg-violet-500/5' : 'border-border'}`}
                >
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{a.label}</p>
                  <p className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">
                    {!reported ? '…' : missing ? 'n/a' : `${deal.values[a.id]}/10`}
                  </p>
                </li>
              );
            })}
          </ol>
          <div aria-live="polite" className="mt-3">
            {done && (
              <div className={`rounded-xl border p-4 ${VERDICT_STYLE[result.verdict]}`}>
                <p className="font-mono text-xs uppercase tracking-widest">
                  Verdict{result.total !== null ? ` · weighted ${result.total.toFixed(1)}/10` : ''}
                </p>
                <p className="mt-1 text-2xl font-bold">{result.verdict}</p>
                <p className="mt-1 text-sm text-foreground">{result.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
