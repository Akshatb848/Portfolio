'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ProjectVideoProps {
  videoSrc: string;
  /** Optional WebM (VP9) version, offered first for browsers without H.264. */
  webmSrc?: string;
  poster?: string;
  title: string;
  /** Only the active slide plays; others stay on their poster frame. */
  active?: boolean;
  /** Shown instead if the clip fails to load. */
  fallback?: React.ReactNode;
  /** Clips generated with AI (not screen recordings) carry a visible label. */
  concept?: boolean;
}

export function ProjectVideo({
  videoSrc,
  webmSrc,
  poster,
  title,
  active = true,
  fallback = null,
  concept = false,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errored, setErrored] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Play only while active, on screen, and motion is allowed. A blocked autoplay
  // (e.g. low-power mode) simply leaves the poster frame showing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || errored) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (active && inView && !reduced) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, inView, errored]);

  if (errored) return <>{fallback}</>;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 bg-[#0b0f17]">
      <video
        ref={videoRef}
        poster={poster}
        loop
        muted
        playsInline
        preload={active ? 'auto' : 'none'}
        aria-label={concept ? `AI-generated concept visual for ${title}` : `${title} demo video`}
        className="w-full h-full object-cover"
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {/* Errors on <source> do not reach the <video>; the last source failing means none can play. */}
        <source src={videoSrc} type="video/mp4" onError={() => setErrored(true)} />
      </video>
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      {concept && (
        <span className="absolute left-3 bottom-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-medium text-white">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          Concept visual · AI-generated
        </span>
      )}
    </div>
  );
}
