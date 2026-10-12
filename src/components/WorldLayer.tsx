'use client';

import dynamic from 'next/dynamic';

// The voxel world is WebGL-only, so it loads client-side after the page is interactive.
const VoxelWorld = dynamic(() => import('@/components/VoxelWorld'), { ssr: false });

export function WorldLayer({ portrait }: { portrait: string | null }) {
  return <VoxelWorld portrait={portrait} />;
}
