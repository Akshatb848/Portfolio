'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Configuration ────────────────────────────────────────────────────────────
const CFG = {
  desktop: { count: 200, connDist: 140, speed: 0.12, size: 2.0 },
  tablet:  { count: 130, connDist: 110, speed: 0.10, size: 1.8 },
  mobile:  { count:  70, connDist:  80, speed: 0.08, size: 1.5 },
} as const;

// Neural-palette: violet → indigo → cyan
const COLORS = [0x7c3aed, 0x6366f1, 0x22d3ee, 0xa78bfa, 0x38bdf8];

function getConfig(w: number) {
  if (w < 640) return CFG.mobile;
  if (w < 1024) return CFG.tablet;
  return CFG.desktop;
}

export default function AiBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cfg = getConfig(window.innerWidth);
    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Scene / Camera / Renderer ──────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Particles ──────────────────────────────────────────────────────────
    const count = cfg.count;
    const spread = { x: 500, y: 350, z: 200 };

    // Per-particle data
    const px = new Float32Array(count);
    const py = new Float32Array(count);
    const pz = new Float32Array(count);
    const vx = new Float32Array(count);
    const vy = new Float32Array(count);
    const vz = new Float32Array(count);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      px[i] = (Math.random() - 0.5) * spread.x * 2;
      py[i] = (Math.random() - 0.5) * spread.y * 2;
      pz[i] = (Math.random() - 0.5) * spread.z * 2;
      const s = cfg.speed;
      vx[i] = (Math.random() - 0.5) * s;
      vy[i] = (Math.random() - 0.5) * s;
      vz[i] = (Math.random() - 0.5) * s * 0.3;
    }

    const particleGeo = new THREE.BufferGeometry();
    const posAttr     = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    particleGeo.setAttribute('position', posAttr);

    const particleMat = new THREE.PointsMaterial({
      color: COLORS[0],
      size: cfg.size,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const dots = new THREE.Points(particleGeo, particleMat);
    scene.add(dots);

    // ── Connection Lines ────────────────────────────────────────────────────
    // Pre-allocate max possible segments (count*(count-1)/2)
    const maxSegs    = Math.floor(count * (count - 1) / 2);
    const linePos    = new Float32Array(maxSegs * 6);
    const lineGeo    = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePos, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', linePosAttr);
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Subtle ambient glow blobs (additive sprites)
    const spriteTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0,   'rgba(139,92,246,0.6)');
      g.addColorStop(0.4, 'rgba(99,102,241,0.2)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const blobCount = Math.floor(count * 0.12);
    for (let b = 0; b < blobCount; b++) {
      const sp  = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteTex, transparent: true, opacity: 0.08, depthWrite: false }));
      sp.scale.set(90, 90, 1);
      sp.position.set(
        (Math.random() - 0.5) * spread.x * 2,
        (Math.random() - 0.5) * spread.y * 2,
        (Math.random() - 0.5) * 80
      );
      scene.add(sp);
    }

    // ── Animation loop ──────────────────────────────────────────────────────
    const connDist  = cfg.connDist;
    const connDist2 = connDist * connDist;
    let   animId    = 0;
    let   frame     = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      // Update particle positions
      for (let i = 0; i < count; i++) {
        if (!prefersReduced) {
          px[i] += vx[i];
          py[i] += vy[i];
          pz[i] += vz[i];
        }
        // Bounce
        if (Math.abs(px[i]) > spread.x) vx[i] *= -1;
        if (Math.abs(py[i]) > spread.y) vy[i] *= -1;
        if (Math.abs(pz[i]) > spread.z) vz[i] *= -1;

        positions[i * 3]     = px[i];
        positions[i * 3 + 1] = py[i];
        positions[i * 3 + 2] = pz[i];
      }
      posAttr.needsUpdate = true;

      // Rebuild connection line segments every 2nd frame for performance
      if (frame % 2 === 0) {
        let segIdx = 0;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const dx = px[i] - px[j];
            const dy = py[i] - py[j];
            const dz = pz[i] - pz[j];
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < connDist2) {
              linePos[segIdx++] = px[i];
              linePos[segIdx++] = py[i];
              linePos[segIdx++] = pz[i];
              linePos[segIdx++] = px[j];
              linePos[segIdx++] = py[j];
              linePos[segIdx++] = pz[j];
            }
          }
        }
        lineGeo.setDrawRange(0, segIdx / 3);
        linePosAttr.needsUpdate = true;
      }

      // Very slow camera drift
      if (!prefersReduced) {
        const t = frame * 0.0006;
        camera.position.x = Math.sin(t) * 15;
        camera.position.y = Math.cos(t * 0.7) * 10;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handler ─────────────────────────────────────────────────────
    const handleResize = () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      spriteTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
