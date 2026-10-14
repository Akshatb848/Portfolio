'use client';

import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMotionOff } from '@/lib/motion';
import { assets, type Broll } from '@/lib/assets';
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

/**
 * Vector motion graphic shown when a chapter has no b-roll clip. The SVG itself is static:
 * all motion comes from CSS transforms on wrapper layers, which the GPU compositor animates
 * without repainting, so the scene stays smooth while the page scrolls over it.
 */
function VectorScene({ motif, seed }: { motif: Motif; seed: number }) {
  const r = rng(seed);
  const gid = `scene-${motif}`;
  const defs = (
    <defs>
      <linearGradient id={`${gid}-ink`} x1="0" x2="1">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
  );
  const svg = 'absolute inset-0 w-full h-full';

  let layer: React.ReactNode = null;
  if (motif === 'streams') {
    // Drawn two screens wide with whole sine periods, so sliding it by half loops seamlessly.
    const paths = Array.from({ length: 11 }, (_, i) => {
      const y = 120 + i * 62;
      const a = 30 + r() * 70;
      const k = 1 + Math.floor(r() * 3);
      const d = Array.from({ length: 129 }, (_, j) => {
        const x = j * 25;
        return `${j ? 'L' : 'M'}${x} ${(y + Math.sin((x / W) * Math.PI * 2 * k + i) * a).toFixed(1)}`;
      }).join('');
      return (
        <g key={i}>
          <path d={d} stroke={`url(#${gid}-ink)`} strokeOpacity="0.2" strokeWidth="1" fill="none" />
          <path d={d} stroke={`url(#${gid}-ink)`} strokeWidth="2.5" strokeDasharray="4 22" strokeLinecap="round" fill="none" />
        </g>
      );
    });
    layer = (
      <div className="scene-drift absolute inset-y-0 left-0 w-[200%]">
        <svg viewBox={`0 0 ${W * 2} ${H}`} preserveAspectRatio="none" className={svg}>
          {defs}
          {paths}
        </svg>
      </div>
    );
  } else if (motif === 'blueprint') {
    layer = (
      <>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={svg}>
          {Array.from({ length: 28 }, (_, i) => {
            const x = r() * W;
            const y = r() * H;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={3} fill="#22d3ee" fillOpacity={0.4 + r() * 0.6} />
                <path d={`M${x} ${y}L${W / 2} ${H / 2}`} stroke="#8b5cf6" strokeOpacity="0.12" />
              </g>
            );
          })}
        </svg>
        <div className="scene-spin absolute left-1/2 top-1/2 w-[80vmin] h-[80vmin] -ml-[40vmin] -mt-[40vmin]">
          <svg viewBox="0 0 700 700" className="w-full h-full">
            {defs}
            {[340, 260, 180, 100].map((sz, i) => (
              <rect
                key={sz}
                x={350 - sz}
                y={350 - sz}
                width={sz * 2}
                height={sz * 2}
                rx={i * 6}
                stroke={`url(#${gid}-ink)`}
                strokeOpacity={0.25 + i * 0.15}
                strokeWidth={1.5}
                strokeDasharray={i % 2 ? '6 10' : undefined}
                fill="none"
                transform={`rotate(${i * 11} 350 350)`}
              />
            ))}
          </svg>
        </div>
      </>
    );
  } else if (motif === 'towers') {
    layer = (
      <div className="scene-breathe absolute inset-0 origin-bottom">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={svg}>
          {defs}
          {Array.from({ length: 32 }, (_, i) => {
            const w = W / 32;
            const h = 160 + r() * 520;
            return (
              <rect key={i} x={i * w + 6} y={H - h} width={w - 12} height={h} rx={4} fill={`url(#${gid}-ink)`} fillOpacity={0.15 + r() * 0.35} />
            );
          })}
        </svg>
      </div>
    );
  } else {
    layer = (
      <div className="scene-pulse absolute inset-0">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={svg}>
          {defs}
          {Array.from({ length: 36 }, (_, i) => {
            const ang = (i / 36) * Math.PI * 2;
            const x = W / 2 + Math.cos(ang) * 1100;
            const y = H / 2 + Math.sin(ang) * 1100;
            return (
              <path
                key={i}
                d={`M${x.toFixed(0)} ${y.toFixed(0)}L${W / 2} ${H / 2}`}
                stroke={`url(#${gid}-ink)`}
                strokeOpacity={0.3 + r() * 0.4}
                strokeWidth="2"
                strokeDasharray="4 22"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0f17]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.45),transparent_60%)]" />
      {layer}
    </div>
  );
}

function SceneLayer({ motif, seed, clip }: { motif: Motif; seed: number; clip?: Broll }) {
  return (
    <>
      <VectorScene motif={motif} seed={seed} />
      {clip && <BrollVideo clip={clip} className="absolute inset-0 w-full h-full opacity-80" />}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,15,23,0.85)_100%)]" />
    </>
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

  // Iris: a circle that scales up (compositor transform) with the scene counter-scaled inside,
  // instead of animating clip-path, which would repaint the whole screen every frame.
  const iris = useTransform(p, [0.12, 0.45], [0.08, 1]);
  const counter = useTransform(iris, (v) => 1 / v);
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
        {reduced ? (
          <div className="absolute inset-0">
            <SceneLayer motif={motif} seed={seed} clip={clipData} />
          </div>
        ) : (
          <m.div
            className="absolute left-1/2 top-1/2 w-[150vmax] h-[150vmax] -ml-[75vmax] -mt-[75vmax] rounded-full overflow-hidden will-change-transform"
            style={{ scale: iris }}
          >
            <m.div
              className="absolute left-1/2 top-1/2 w-screen h-screen -ml-[50vw] -mt-[50vh] will-change-transform"
              style={{ scale: counter }}
            >
              <SceneLayer motif={motif} seed={seed} clip={clipData} />
            </m.div>
          </m.div>
        )}

        <m.div
          className="absolute inset-x-0 top-[14%] will-change-transform text-6xl sm:text-8xl font-black uppercase tracking-tight leading-none whitespace-nowrap"
          style={reduced ? undefined : { x: rowA }}
        >
          <Row words={rows[0]} />
        </m.div>
        <m.div
          className="absolute inset-x-0 bottom-[14%] will-change-transform text-6xl sm:text-8xl font-black uppercase tracking-tight leading-none whitespace-nowrap"
          style={reduced ? undefined : { x: rowB }}
        >
          <Row words={rows[1]} outline />
        </m.div>

        <m.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center will-change-transform"
          style={reduced ? undefined : { scale: zoom, opacity: fade, y: lift }}
        >
          <span className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-cyan-300">Next chapter</span>
          <span className="mt-2 text-[28vw] sm:text-[16rem] font-black leading-none tracking-tighter text-white/95 tabular-nums [text-shadow:0_0_40px_rgba(139,92,246,0.55)]">
            {chapterNumber(to)}
          </span>
          <span className="text-2xl sm:text-4xl font-bold text-white">{label}</span>
        </m.div>
      </div>
    </div>
  );
}
