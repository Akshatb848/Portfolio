'use client';

import { useEffect, useRef, useState } from 'react';

interface ProjectVideoProps {
  videoSrc: string;
  poster?: string;
  title: string;
}

export function ProjectVideo({ videoSrc, poster, title }: ProjectVideoProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [errored, setErrored] = useState(false);
  const [loaded,  setLoaded]  = useState(false);

  // Pause when off-screen, resume when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video || errored || prefersReduced) return;
        if (entry.isIntersecting) {
          video.play().catch(() => setErrored(true));
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [errored]);

  // A clip that fails to load is dropped rather than shown as an empty frame
  if (errored) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden group shadow-lg shadow-black/30 transition-all duration-300 hover:shadow-violet-500/10">
      {/* Loading placeholder shown until video metadata loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-indigo-900/40 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/40 border-t-violet-400 animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={() => setLoaded(true)}
        onError={() => setErrored(true)}
        aria-label={`${title} demo video`}
        className="w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
