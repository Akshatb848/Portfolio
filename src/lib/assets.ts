import raw from '@/data/assets.generated.json';

export type Broll = { sources: { src: string; type: string }[]; poster: string | null };

/** Optional files found in /public at build time (see scripts/generate-asset-manifest.mjs). */
export const assets = raw as unknown as {
  covers: Record<string, string>;
  broll: Record<string, Broll>;
  resume: string | null;
  videos: string[];
  posters: string[];
  portrait: string | null;
};
