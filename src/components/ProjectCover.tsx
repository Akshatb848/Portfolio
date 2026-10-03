import type { Project } from '@/data/portfolio';
import { tone } from '@/lib/tones';

// Small deterministic PRNG so each project always gets the same artwork (and SSR matches CSR).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generative cover art: a small network graph in the project's colour, drawn from a seed.
 * Purely decorative (aria-hidden); it stands in until real screenshots or clips exist.
 */
export function ProjectCover({ project, className = '' }: { project: Project; className?: string }) {
  const rand = mulberry32(project.id * 9973);
  const hex = tone(project.color).hex;
  const W = 320;
  const H = 180;
  const nodes = Array.from({ length: 16 }, () => ({
    x: 16 + rand() * (W - 32),
    y: 16 + rand() * (H - 32),
    r: 1.5 + rand() * 2.5,
  }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => {
      if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 78) edges.push([i, j]);
    })
  );
  const Icon = project.icon;
  const gid = `cover-${project.id}`;

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-xl border border-border/60 bg-[#0b0f17] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${gid}-glow`} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor={hex} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0b0f17" stopOpacity="0" />
          </radialGradient>
          <pattern id={`${gid}-grid`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0H0V16" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#${gid}-grid)`} />
        <rect width={W} height={H} fill={`url(#${gid}-glow)`} />
        {edges.map(([i, j]) => (
          <line
            key={`${i}-${j}`}
            x1={nodes[i].x}
            y1={nodes[i].y}
            x2={nodes[j].x}
            y2={nodes[j].y}
            stroke={hex}
            strokeOpacity="0.35"
            strokeWidth="0.6"
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={hex} fillOpacity="0.85" />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/15 shadow-2xl"
          style={{ background: `${hex}33`, boxShadow: `0 0 40px ${hex}55` }}
        >
          <Icon className="w-8 h-8 text-white" />
        </span>
      </div>
      <span className="absolute left-3 bottom-2.5 font-mono text-[10px] tracking-widest uppercase text-white/70">
        {project.category}
      </span>
    </div>
  );
}
