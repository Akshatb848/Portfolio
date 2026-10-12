'use client';

import { useRef } from 'react';
import { m, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMotionOff } from '@/lib/motion';
import { assets } from '@/lib/assets';
import { chapters, chapterNumber, type ChapterId } from '@/data/chapters';
import { BrollVideo } from '@/components/BrollVideo';

export type Motif = 'streams' | 'blueprint' | 'towers' | 'converge';

const W = 1600;
const H = 900;

// Deterministic PRNG so the server and browser draw the same artwork.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

/** Vector motion graphic shown when a chapter has no b-roll clip (and under the clip's poster). */
function VectorScene({ motif, seed }: { motif: Motif; seed: number }) {
  const r = rng(seed);
  const gid = `scene-${motif}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id={`${gid}-ink`} x1="0" x2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0b0f17" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${gid}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="#0b0f17" />
      <rect width={W} height={H} fill={`url(#${gid}-grid)`} />
      <rect width={W} height={H} fill={`url(#${gid}-glow)`} />

      {motif === 'streams' &&
        Array.from({ length: 11 }, (_, i) => {
          const y = 120 + i * 62;
          const a = 30 + r() * 70;
          const k = 1.5 + r() * 2;
          const d = Array.from({ length: 33 }, (_, j) => {
            const x = j * 50;
            return `${j ? 'L' : 'M'}${x} ${(y + Math.sin((x / W) * Math.PI * k + i) * a).toFixed(1)}`;
          }).join('');
          return (
            <g key={i}>
              <path d={d} stroke={`url(#${gid}-ink)`} strokeOpacity="0.18" strokeWidth="1" fill="none" />
              <path
                d={d}
                className="dash-flow"
                style={{ animationDuration: `${2.5 + r() * 3}s` }}
                stroke={`url(#${gid}-ink)`}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          );
        })}

      {motif === 'blueprint' && (
        <g>
          {[340, 260, 180, 100].map((s, i) => (
            <rect
              key={s}
              x={W / 2 - s}
              y={H / 2 - s}
              width={s * 2}
              height={s * 2}
              rx={i * 6}
              className={i % 2 ? 'spin-rev' : 'spin-slow'}
              stroke={`url(#${gid}-ink)`}
              strokeOpacity={0.25 + i * 0.15}
              strokeWidth={1.5}
              strokeDasharray={i % 2 ? '6 10' : undefined}
              fill="none"
            />
          ))}
          {Array.from({ length: 28 }, (_, i) => {
            const x = r() * W;
            const y = r() * H;
            return (
              <g key={i} className="node-blink" style={{ animationDelay: `${(r() * 3).toFixed(2)}s` }}>
                <circle cx={x} cy={y} r={3} fill="#22d3ee" />
                <path d={`M${x} ${y}L${W / 2} ${H / 2}`} stroke="#8b5cf6" strokeOpacity="0.12" />
              </g>
            );
          })}
        </g>
      )}

      {motif === 'towers' &&
        Array.from({ length: 32 }, (_, i) => {
          const w = W / 32;
          const h = 160 + r() * 520;
          return (
            <rect
              key={i}
              x={i * w + 6}
              y={H - h}
              width={w - 12}
              height={h}
              rx={4}
              className="tower"
              style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
              fill={`url(#${gid}-ink)`}
              fillOpacity={0.15 + r() * 0.35}
            />
          );
        })}

      {motif === 'converge' &&
        Array.from({ length: 36 }, (_, i) => {
          const ang = (i / 36) * Math.PI * 2;
          const x = W / 2 + Math.cos(ang) * 1100;
          const y = H / 2 + Math.sin(ang) * 1100;
          return (
            <path
              key={i}
              d={`M${x.toFixed(0)} ${y.toFixed(0)}L${W / 2} ${H / 2}`}
              className="dash-flow"
              style={{ animationDuration: `${2 + r() * 2.5}s` }}
              stroke={`url(#${gid}-ink)`}
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
    </svg>
  );
}

function Row({ words, outline }: { words: string[]; outline?: boolean }) {
  return (
    <div className="flex w-max gap-10 pr-10">
      {[...words, ...words].map((w, i) => (
        <span
          key={i}
          className={
            outline ? 'outline-word-strong' : 'bg-linear-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent'
          }
        >
          {w}
        </span>
      ))}
    </div>
  );
}

/**
 * Cinematic cut between chapters: the screen pins while an iris opens onto a b-roll loop
 * (public/broll/<slot>.webm) or, without one, a vector motion graphic. Two rows of kinetic
 * type cross in opposite directions and the next chapter's number zooms in. Decorative:
 * the chapter itself carries the real heading, so this is hidden from assistive tech.
 */
export function SceneCut({
  to,
  slot,
  motif,
  rows,
}: {
  to: ChapterId;
  slot: string;
  motif: Motif;
  rows: [string[], string[]];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOff = useMotionOff();
  const reduced = useReducedMotion() || motionOff;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const radius = useTransform(p, [0.12, 0.45], [8, 80]);
  const clip = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  const zoom = useTransform(p, [0.2, 0.5, 0.85], [0.55, 1, 1.25]);
  const fade = useTransform(p, [0.18, 0.38, 0.72, 0.9], [0, 1, 1, 0]);
  const rowA = useTransform(p, [0, 1], ['5%', '-45%']);
  const rowB = useTransform(p, [0, 1], ['-45%', '5%']);
  const lift = useTransform(p, [0, 1], [60, -60]);

  const clipData = assets.broll[slot];
  const label = chapters.find((c) => c.id === to)?.label ?? '';
  const seed = [...slot].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);

  return (
    <div ref={ref} aria-hidden="true" className={`relative select-none ${reduced ? 'h-[70vh]' : 'h-[150vh]'}`}>
      <div className={`${reduced ? 'relative h-full' : 'sticky top-0 h-screen'} overflow-hidden`}>
        <m.div className="absolute inset-0" style={reduced ? undefined : { clipPath: clip }}>
          <VectorScene motif={motif} seed={seed} />
          {clipData && <BrollVideo clip={clipData} className="absolute inset-0 w-full h-full opacity-80" />}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,15,23,0.85)_100%)]" />
        </m.div>

        <m.div
          className="absolute inset-x-0 top-[14%] text-6xl sm:text-8xl font-black uppercase tracking-tight leading-none whitespace-nowrap"
          style={reduced ? undefined : { x: rowA }}
        >
          <Row words={rows[0]} />
        </m.div>
        <m.div
          className="absolute inset-x-0 bottom-[14%] text-6xl sm:text-8xl font-black uppercase tracking-tight leading-none whitespace-nowrap"
          style={reduced ? undefined : { x: rowB }}
        >
          <Row words={rows[1]} outline />
        </m.div>

        <m.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={reduced ? undefined : { scale: zoom, opacity: fade, y: lift }}
        >
          <span className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-cyan-300">Next chapter</span>
          <span className="mt-2 text-[28vw] sm:text-[16rem] font-black leading-none tracking-tighter text-white/95 tabular-nums drop-shadow-[0_0_40px_rgba(139,92,246,0.55)]">
            {chapterNumber(to)}
          </span>
          <span className="text-2xl sm:text-4xl font-bold text-white">{label}</span>
        </m.div>
      </div>
    </div>
  );
}
