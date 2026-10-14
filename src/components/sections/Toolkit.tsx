'use client';

import { useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { tools, type Tool } from '@/data/toolkit';
import { tone } from '@/lib/tones';
import { FOCUS_PROJECT_EVENT } from '@/lib/events';
import { SectionHeading } from '@/components/SectionHeading';

function ToolTile({ tool, selected, onSelect }: { tool: Tool; selected: boolean; onSelect: () => void }) {
  const t = tone(tool.color);
  const Icon = tool.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex flex-col items-center gap-2 min-h-11 rounded-2xl p-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
    >
      <span
        className={`w-16 h-16 rounded-2xl flex items-center justify-center border bg-card shadow-lg ${t.glow} ${
          selected ? `${t.border} ring-2 ring-offset-2 ring-offset-background ring-violet-500` : 'border-border/70'
        } group-hover:-translate-y-1 transition-transform duration-300`}
        style={{
          backgroundImage: `radial-gradient(circle at 30% 25%, ${t.hex}33, transparent 70%)`,
        }}
        aria-hidden="true"
      >
        <Icon className={`w-7 h-7 ${t.text}`} />
      </span>
      <span className="text-xs font-semibold text-foreground text-center leading-tight max-w-28">{tool.name}</span>
    </button>
  );
}

function Detail({ tool }: { tool: Tool | null }) {
  return (
    <div aria-live="polite" className="max-w-md mx-auto text-center">
      {tool ? (
        <>
          <p className="text-xs font-mono uppercase tracking-widest text-violet-700 dark:text-violet-400 mb-2">
            {tool.name}
          </p>
          <p className="text-lg sm:text-xl font-bold text-foreground leading-snug">{tool.usedFor}</p>
          {tool.href && (
            <a
              href={tool.href}
              {...(tool.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => {
                if (tool.projectId) window.dispatchEvent(new CustomEvent(FOCUS_PROJECT_EVENT, { detail: tool.projectId }));
              }}
              className="inline-flex items-center gap-1.5 min-h-11 mt-3 px-4 rounded-lg border border-border text-sm font-semibold text-foreground hover:border-violet-500/50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {tool.linkLabel}
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Every AI tool, <span className="text-gradient">the right job.</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a tool to see what I actually built with it.
          </p>
        </>
      )}
    </div>
  );
}

/** Desktop stage: tiles burst out from the centre into a floating ellipse with pointer parallax. */
function Stage({ selected, setSelected }: { selected: string | null; setSelected: (id: string | null) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 560 });
  const [inView, setInView] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 80, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 80, damping: 18 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const rx = Math.min(size.w * 0.42, 500);
  const ry = size.h * 0.36;
  const current = tools.find((t) => t.id === selected) ?? null;

  return (
    <div
      ref={stageRef}
      className="relative h-[560px] [perspective:1200px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* Particle burst when the section arrives */}
      <div className="absolute left-1/2 top-1/2 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => {
          const a = (i / 28) * Math.PI * 2;
          const d = 180 + (i % 5) * 70;
          return (
            <m.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-violet-400"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={inView ? { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.6, opacity: [0, 1, 0] } : {}}
              transition={{ duration: 1.4, ease: 'easeOut', delay: (i % 7) * 0.02 }}
            />
          );
        })}
      </div>

      <m.div style={{ rotateX, rotateY }} className="absolute inset-0 [transform-style:preserve-3d] pointer-events-none">
        <ul className="contents">
          {tools.map((tool, i) => {
            const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * rx;
            const y = Math.sin(angle) * ry;
            const z = (i % 3) * 40 - 40;
            return (
              <m.li
                key={tool.id}
                className="absolute left-1/2 top-1/2 pointer-events-auto"
                style={{ translateZ: z }}
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, marginLeft: -56, marginTop: -48 }}
                animate={inView ? { x, y, scale: 1, opacity: 1 } : {}}
                transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.15 + i * 0.05 }}
              >
                <div
                  className="bob w-28"
                  style={{ animationDuration: `${4 + (i % 4) * 0.7}s`, animationDelay: `${i * 0.3}s` }}
                >
                  <ToolTile
                    tool={tool}
                    selected={selected === tool.id}
                    onSelect={() => setSelected(selected === tool.id ? null : tool.id)}
                  />
                </div>
              </m.li>
            );
          })}
        </ul>
      </m.div>

      {/* Clicks pass through to the tiles beside the panel; only its own link is interactive. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-40 pointer-events-none [&_a]:pointer-events-auto">
        <Detail tool={current} />
      </div>
    </div>
  );
}

export function ToolkitSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = tools.find((t) => t.id === selected) ?? null;
  // Render one layout, not both: the grid server-side and on phones, the 3D stage on wider
  // screens once mounted (the section is below the fold, so the swap is never seen).
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <section id="toolkit" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-violet-600/10 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
      </div>
      <div className="container-max relative">
        <SectionHeading
          chapter="toolkit"
          eyebrow="AI toolkit"
          center
          title={
            <>
              The right AI tool <span className="text-gradient">for every job</span>
            </>
          }
        />

        {wide ? (
          <Stage selected={selected} setSelected={setSelected} />
        ) : (
        <div>
          <Detail tool={current} />
          <ul className="mt-8 grid grid-cols-3 gap-x-2 gap-y-6">
            {tools.map((tool) => (
              <li key={tool.id} className="flex justify-center">
                <ToolTile
                  tool={tool}
                  selected={selected === tool.id}
                  onSelect={() => setSelected(selected === tool.id ? null : tool.id)}
                />
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </section>
  );
}
