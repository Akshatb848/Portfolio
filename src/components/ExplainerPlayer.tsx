'use client';

import { useEffect, useRef, useState } from 'react';
import { Clapperboard, MonitorPlay, Pause, Play, RotateCcw } from 'lucide-react';
import { isMotionOff } from '@/lib/motion';
import type { Caption } from '@/data/venture';

type Clip = { src: string; poster: string; captions?: Caption[] };

/**
 * A captioned explainer video. It starts muted when scrolled into view (never with reduced
 * motion or animations paused) and pauses when it leaves. The controls sit below the frame so
 * they never cover the burned-in captions, and on small screens, where those captions are too
 * small to read, the current caption is repeated as text under the video. When a real screen
 * recording exists, a toggle switches between the explainer and the product itself.
 */
export function ExplainerPlayer({
  title,
  explainer,
  recording,
}: {
  title: string;
  explainer: Clip;
  recording?: Clip;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'explainer' | 'recording'>('explainer');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(0);
  const clip = mode === 'recording' && recording ? recording : explainer;
  const caption = clip.captions?.filter((c) => c.t <= time + 0.05).at(-1)?.text ?? clip.captions?.[0]?.text;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMotionOff();
        if (e.isIntersecting && !reduced) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [clip.src]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const restart = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const btn =
    'inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-3 rounded-lg border border-border text-xs font-semibold text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400';

  return (
    <div>
      {recording && (
        <div className="flex gap-1 p-1 mb-3 rounded-lg border border-border bg-background/60 w-fit" role="group" aria-label="Video">
          {(
            [
              ['explainer', 'Explainer', Clapperboard],
              ['recording', 'Real product', MonitorPlay],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => {
                setMode(id);
                setTime(0);
              }}
              className={`inline-flex items-center gap-1.5 min-h-9 px-3 rounded-md text-xs font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                mode === id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-[#0b0f17] shadow-2xl shadow-black/20">
        <video
          key={clip.src}
          ref={ref}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
          aria-label={mode === 'recording' ? `Screen recording of ${title}` : `Captioned animated explainer of ${title}`}
          className="w-full h-full object-cover cursor-pointer"
        />
        {/* Progress, drawn as a thin bar so it never covers the captions */}
        <span className="absolute left-0 bottom-0 h-1 bg-linear-to-r from-violet-500 to-cyan-400" style={{ width: `${length ? (time / length) * 100 : 0}%` }} aria-hidden="true" />
      </div>

      {caption && (
        <p className="sm:hidden mt-3 min-h-[4.5rem] text-sm text-foreground leading-relaxed" aria-hidden="true">
          {caption}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggle} className={btn} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
        </button>
        <button type="button" onClick={restart} className={btn} aria-label="Play from the start">
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {Math.floor(time)}s / {Math.round(length || 0)}s
        </span>
        <p className="w-full sm:w-auto sm:ml-auto text-xs text-muted-foreground">
          {mode === 'recording'
            ? 'Real screen recording, run with made-up demo companies and people.'
            : 'Animated explainer made for this site. No sound needed.'}
        </p>
      </div>
      {clip.captions && (
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer min-h-8 inline-flex items-center hover:text-foreground">Read the transcript</summary>
          <ol className="mt-2 space-y-1 list-decimal pl-5">
            {clip.captions.map((c) => (
              <li key={c.t}>{c.text}</li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
