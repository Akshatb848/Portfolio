'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Check, Pause, Play, RotateCcw, StepForward, Terminal } from 'lucide-react';
import { scenarios, type Scenario, type SimNode } from '@/data/simulations';
import { experiences, projectById } from '@/data/portfolio';
import { tone } from '@/lib/tones';
import { FOCUS_PROJECT_EVENT } from '@/lib/events';
import { SectionHeading } from '@/components/SectionHeading';

const STEP_MS = 1300;

// ─── Signal chart (scenarios with showSignal) ───────────────────────────────────────────
function SignalChart({ faulty, detected, running }: { faulty: boolean; detected: boolean; running: boolean }) {
  const W = 600;
  const H = 120;
  const points = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 60 }, (_, i) => {
      const base = 62 + Math.sin(i / 4) * 6 + (rand() - 0.5) * 10;
      const spike = faulty && i >= 44 && i <= 52 ? Math.sin(((i - 44) / 8) * Math.PI) * 48 : 0;
      return { x: (i / 59) * W, y: H - base - spike + 20 };
    });
  }, [faulty]);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const threshold = H - 62 - 26 + 20;

  return (
    <figure className="relative rounded-xl border border-border/60 bg-background/60 p-3 overflow-hidden">
      <figcaption className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span className="font-mono">api-gateway · p95 latency (simulated)</span>
        <span className={detected && faulty ? 'text-amber-800 dark:text-amber-400 font-semibold' : ''}>
          {detected ? (faulty ? 'Anomaly detected' : 'Normal') : 'Monitoring…'}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" role="img" aria-label={faulty ? 'Latency chart with a spike' : 'Latency chart within normal range'}>
        <line x1="0" x2={W} y1={threshold} y2={threshold} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="4 4" className="text-muted-foreground" />
        {faulty && detected && (
          <rect x={(44 / 59) * W - 6} y="0" width={((52 - 44) / 59) * W + 12} height={H} className="fill-amber-500/15" />
        )}
        <motion.path
          d={d}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          key={d}
        />
      </svg>
      {running && (
        <motion.span
          className="absolute top-0 bottom-0 w-px bg-cyan-400/50"
          initial={{ left: '0%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      )}
    </figure>
  );
}

// ─── Pipeline node ────────────────────────────────────────────────────────────
function Node({ node, state, hex }: { node: SimNode; state: 'done' | 'active' | 'pending'; hex: string }) {
  const warn = state === 'done' && node.outcome === 'warn';
  return (
    <motion.div
      layout
      className={`relative flex-1 min-w-0 rounded-xl border p-3 transition-colors duration-300 ${
        state === 'pending' ? 'border-border/60 bg-card/60' : 'bg-card'
      } ${warn ? 'border-amber-500/50' : ''}`}
      style={
        state === 'active'
          ? { borderColor: hex, boxShadow: `0 0 0 1px ${hex}, 0 0 28px ${hex}55` }
          : state === 'done' && !warn
            ? { borderColor: `${hex}88` }
            : undefined
      }
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
            state === 'pending' ? 'bg-muted text-muted-foreground' : 'text-white'
          } ${warn ? 'bg-amber-600' : ''}`}
          style={state !== 'pending' && !warn ? { backgroundColor: hex } : undefined}
          aria-hidden="true"
        >
          {state === 'done' ? (
            warn ? <AlertTriangle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />
          ) : state === 'active' ? (
            <motion.span
              className="w-2 h-2 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : null}
        </span>
        <span className={`text-sm font-semibold truncate ${state === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
          {node.label}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground truncate">{node.detail}</p>
      <span className="sr-only">
        {state === 'done' ? (warn ? 'Completed with a warning' : 'Completed') : state === 'active' ? 'Running' : 'Waiting'}
      </span>
    </motion.div>
  );
}

function Connector({ live, hex }: { live: boolean; hex: string }) {
  return (
    <div className="relative shrink-0 w-px h-5 mx-auto md:w-6 md:h-px md:mx-0 md:self-center bg-border" aria-hidden="true">
      {live && (
        <motion.span
          className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 md:left-0"
          style={{ backgroundColor: hex, boxShadow: `0 0 10px ${hex}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: STEP_MS / 1000, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// ─── Simulator ────────────────────────────────────────────────────────────────
function BasedOn({ scenario }: { scenario: Scenario }) {
  const links = [
    ...(scenario.basedOn.experienceIds ?? []).map((id) => {
      const e = experiences.find((x) => x.id === id);
      return e ? { href: `#experience-${id}`, label: `${e.role}, ${e.company}`, projectId: undefined } : null;
    }),
    ...(scenario.basedOn.projectIds ?? []).map((id) => {
      const p = projectById(id);
      return p ? { href: `#project-${id}`, label: p.title, projectId: id } : null;
    }),
  ].filter(Boolean) as { href: string; label: string; projectId?: number }[];

  return (
    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>Based on:</span>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onClick={() => {
            if (l.projectId) window.dispatchEvent(new CustomEvent(FOCUS_PROJECT_EVENT, { detail: l.projectId }));
          }}
          className="inline-flex items-center min-h-11 px-3 rounded-lg border border-border bg-background/60 font-medium text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          {l.label}
        </a>
      ))}
    </p>
  );
}

export function SystemsSection() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [toggled, setToggled] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const startedOnce = useRef(false);

  const scenario = scenarios.find((s) => s.id === scenarioId)!;
  const nodes = toggled ? scenario.paths.on : scenario.paths.off;
  const t = tone(scenario.color);
  const done = step >= nodes.length;

  const reset = useCallback(
    (autoplay: boolean) => {
      setStep(0);
      setPlaying(autoplay && !reduced);
    },
    [reduced]
  );

  // Start the first run when the stage scrolls into view.
  useEffect(() => {
    if (inView && !startedOnce.current) {
      startedOnce.current = true;
      setPlaying(!reduced);
    }
  }, [inView, reduced]);

  // Advance while playing and visible.
  useEffect(() => {
    if (!playing || !inView) return;
    if (done) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, inView, step, done]);

  const detectIndex = nodes.findIndex((n) => n.id === 'detect');
  const logs = nodes.slice(0, step);

  return (
    <section id="systems" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full blur-3xl bg-violet-500/10" />
      </div>

      <div className="container-max relative">
        <SectionHeading
          chapter="systems"
          eyebrow="Systems in motion"
          title={
            <>
              Watch the <span className="text-gradient">pipelines</span> run
            </>
          }
        >
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-2xl">
            Interactive, illustrative simulations of the kinds of systems I build. Flip the switch to see how
            each pipeline behaves when something goes wrong. Values are simulated.
          </p>
        </SectionHeading>

        {/* Scenario tabs */}
        <div
          role="tablist"
          aria-label="Simulation scenarios"
          className="flex flex-wrap gap-2 mb-6"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const i = scenarios.findIndex((s) => s.id === scenarioId);
            const next = scenarios[(i + (e.key === 'ArrowRight' ? 1 : -1) + scenarios.length) % scenarios.length];
            setScenarioId(next.id);
            setToggled(false);
            reset(true);
            document.getElementById(`sim-tab-${next.id}`)?.focus();
          }}
        >
          {scenarios.map((s) => {
            const st = tone(s.color);
            const on = s.id === scenarioId;
            return (
              <button
                key={s.id}
                id={`sim-tab-${s.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="sim-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => {
                  if (on) return;
                  setScenarioId(s.id);
                  setToggled(false);
                  reset(true);
                }}
                className={`min-h-11 px-4 rounded-xl text-sm font-medium border transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  on ? `${st.badge} shadow-md ${st.glow}` : 'border-border/60 text-muted-foreground hover:text-foreground bg-card'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        <div
          id="sim-panel"
          role="tabpanel"
          aria-labelledby={`sim-tab-${scenarioId}`}
          ref={stageRef}
          className={`rounded-3xl border ${t.border} bg-card/70 backdrop-blur-xs p-5 sm:p-7 shadow-2xl ${t.glow}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mb-6">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-foreground">{scenario.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-2">{scenario.tagline}</p>
              <BasedOn scenario={scenario} />
            </div>

            {/* What-if switch */}
            <button
              type="button"
              role="switch"
              aria-checked={toggled}
              onClick={() => {
                setToggled((v) => !v);
                reset(true);
              }}
              className="flex items-center gap-3 min-h-11 px-4 py-2 rounded-xl border border-border bg-background/60 text-left hover:border-foreground/30 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 lg:max-w-xs"
            >
              <span
                className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${toggled ? 'bg-amber-600' : 'bg-muted'}`}
                aria-hidden="true"
              >
                <motion.span
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: toggled ? 16 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{scenario.toggle.label}</span>
                <span className="block text-xs text-muted-foreground">{scenario.toggle.description}</span>
              </span>
            </button>
          </div>

          {scenario.showSignal && (
            <div className="mb-6">
              <SignalChart faulty={toggled} detected={detectIndex >= 0 && step > detectIndex} running={playing && !done} />
            </div>
          )}

          {/* Pipeline */}
          <ol className="flex flex-col md:flex-row md:items-stretch" aria-label={`${scenario.title} pipeline`}>
            {nodes.map((node, i) => {
              const state = i < step ? 'done' : i === step ? 'active' : 'pending';
              return (
                <li key={`${scenarioId}-${toggled}-${node.id}`} className="flex flex-col md:flex-row md:flex-1 min-w-0">
                  {i > 0 && <Connector live={i === step && playing} hex={t.hex} />}
                  <Node node={node} state={state} hex={t.hex} />
                </li>
              );
            })}
          </ol>

          {/* Console + controls */}
          <div className="mt-6 grid lg:grid-cols-[1fr_auto] gap-4 items-start">
            <div className="rounded-xl border border-border/60 bg-[#0b0f17] p-4 font-mono text-xs min-h-38">
              <p className="flex items-center gap-2 text-slate-300 mb-2">
                <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                run.log <span className="text-slate-400">(simulated)</span>
              </p>
              <div role="log" aria-live={playing ? 'off' : 'polite'}>
                <ol className="space-y-1">
                  <AnimatePresence initial={false}>
                    {logs.map((n, i) => (
                      <motion.li
                        key={`${scenarioId}-${toggled}-${n.id}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={
                          n.outcome === 'warn'
                            ? 'text-amber-300'
                            : n.outcome === 'ok'
                              ? 'text-emerald-300'
                              : 'text-slate-200'
                        }
                      >
                        <span className="text-slate-400">[{String(i + 1).padStart(2, '0')}] </span>
                        {n.log}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {logs.length === 0 && <li className="text-slate-400">Waiting to start…</li>}
                  {done && <li className="text-slate-300">✓ run complete</li>}
                </ol>
              </div>
            </div>

            <div className="flex lg:flex-col gap-2">
              <button
                type="button"
                onClick={() => (done ? reset(true) : setPlaying((p) => !p))}
                className="flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {playing ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
                {playing ? 'Pause' : done ? 'Run again' : 'Play'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStep((s) => Math.min(s + 1, nodes.length));
                }}
                disabled={done}
                className="flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg border border-border bg-background/60 text-sm font-semibold text-foreground hover:border-foreground/30 disabled:opacity-50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <StepForward className="w-4 h-4" aria-hidden="true" />
                Step
              </button>
              <button
                type="button"
                onClick={() => reset(false)}
                className="flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg border border-border bg-background/60 text-sm font-semibold text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
