'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Configuration ────────────────────────────────────────────────────────────
const CFG = {
  desktop: { count: 150, connDist: 150, speed: 0.12, size: 2.0, signals: 28 },
  tablet:  { count: 110, connDist: 120, speed: 0.10, size: 1.8, signals: 18 },
  mobile:  { count:  70, connDist:  90, speed: 0.08, size: 1.6, signals: 12 },
} as const;

function getConfig(w: number) {
  if (w < 640) return CFG.mobile;
  if (w < 1024) return CFG.tablet;
  return CFG.desktop;
}

/**
 * Hero backdrop: a drifting 3D neural network with signal pulses travelling along its
 * connections. The camera follows the pointer (parallax) and dollies forward as the page
 * scrolls. Paused off-screen and in hidden tabs; a single static frame under reduced
 * motion; renders nothing if WebGL is unavailable.
 */
export default function AiBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cfg = getConfig(window.innerWidth);
    const W = container.clientWidth;
    const H = container.clientHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    } catch {
      return; // No WebGL: the gradient backdrop behind the canvas still renders.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000);
    camera.position.set(0, 0, 320);
    const group = new THREE.Group();
    scene.add(group);

    // ── Nodes ──────────────────────────────────────────────────────────────
    const count = cfg.count;
    const spread = { x: 500, y: 350, z: 200 };
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
      vx[i] = (Math.random() - 0.5) * cfg.speed;
      vy[i] = (Math.random() - 0.5) * cfg.speed;
      vz[i] = (Math.random() - 0.5) * cfg.speed * 0.3;
    }

    const particleGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    particleGeo.setAttribute('position', posAttr);
    const particleMat = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: cfg.size,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
    });
    group.add(new THREE.Points(particleGeo, particleMat));

    // ── Connections ────────────────────────────────────────────────────────
    const maxSegs = Math.floor((count * (count - 1)) / 2);
    const linePos = new Float32Array(maxSegs * 6);
    const pairs = new Int32Array(maxSegs * 2);
    let pairCount = 0;
    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePos, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', linePosAttr);
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const connDist2 = cfg.connDist * cfg.connDist;
    function rebuildLines() {
      let seg = 0;
      pairCount = 0;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const dz = pz[i] - pz[j];
          if (dx * dx + dy * dy + dz * dz < connDist2) {
            linePos[seg++] = px[i];
            linePos[seg++] = py[i];
            linePos[seg++] = pz[i];
            linePos[seg++] = px[j];
            linePos[seg++] = py[j];
            linePos[seg++] = pz[j];
            pairs[pairCount * 2] = i;
            pairs[pairCount * 2 + 1] = j;
            pairCount++;
          }
        }
      }
      lineGeo.setDrawRange(0, seg / 3);
      linePosAttr.needsUpdate = true;
    }

    // ── Signal pulses travelling node → node along connections ─────────────
    const sCount = cfg.signals;
    const sFrom = new Int32Array(sCount);
    const sTo = new Int32Array(sCount);
    const sT = new Float32Array(sCount);
    const sSpeed = new Float32Array(sCount);
    const sPos = new Float32Array(sCount * 3);
    const signalGeo = new THREE.BufferGeometry();
    const sPosAttr = new THREE.BufferAttribute(sPos, 3);
    sPosAttr.setUsage(THREE.DynamicDrawUsage);
    signalGeo.setAttribute('position', sPosAttr);
    const signalMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: cfg.size * 2.4,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(signalGeo, signalMat));

    /** Pick a connected neighbour of `node`, or a random edge if it has none. */
    function nextHop(node: number): [number, number] {
      if (pairCount === 0) return [node, node];
      const start = Math.floor(Math.random() * pairCount);
      for (let k = 0; k < pairCount; k++) {
        const p = (start + k) % pairCount;
        if (pairs[p * 2] === node) return [node, pairs[p * 2 + 1]];
        if (pairs[p * 2 + 1] === node) return [node, pairs[p * 2]];
      }
      const p = Math.floor(Math.random() * pairCount);
      return [pairs[p * 2], pairs[p * 2 + 1]];
    }

    function placeSignals(dt: number) {
      for (let s = 0; s < sCount; s++) {
        sT[s] += sSpeed[s] * dt;
        if (sT[s] >= 1) {
          [sFrom[s], sTo[s]] = nextHop(sTo[s]);
          sT[s] = 0;
        }
        const a = sFrom[s];
        const b = sTo[s];
        const t = sT[s];
        sPos[s * 3] = px[a] + (px[b] - px[a]) * t;
        sPos[s * 3 + 1] = py[a] + (py[b] - py[a]) * t;
        sPos[s * 3 + 2] = pz[a] + (pz[b] - pz[a]) * t;
      }
      sPosAttr.needsUpdate = true;
    }

    function writeNodes() {
      for (let i = 0; i < count; i++) {
        positions[i * 3] = px[i];
        positions[i * 3 + 1] = py[i];
        positions[i * 3 + 2] = pz[i];
      }
      posAttr.needsUpdate = true;
    }

    // ── Pointer parallax + scroll dolly ────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!prefersReduced) window.addEventListener('pointermove', onPointer, { passive: true });

    // ── Loop ───────────────────────────────────────────────────────────────
    let animId = 0;
    let frame = 0;
    let onScreen = true;
    const running = () => onScreen && !document.hidden && !prefersReduced;

    const animate = () => {
      if (!running()) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(animate);
      frame++;

      for (let i = 0; i < count; i++) {
        px[i] += vx[i];
        py[i] += vy[i];
        pz[i] += vz[i];
        // Bounce
        if (Math.abs(px[i]) > spread.x) vx[i] *= -1;
        if (Math.abs(py[i]) > spread.y) vy[i] *= -1;
        if (Math.abs(pz[i]) > spread.z) vz[i] *= -1;
      }
      writeNodes();
      if (frame % 2 === 0) rebuildLines();
      placeSignals(1);

      // Camera: slow drift + eased pointer parallax + scroll dolly
      const t = frame * 0.0006;
      const scroll = Math.min(window.scrollY / Math.max(H, 1), 1);
      const tx = Math.sin(t) * 15 + pointer.x * 40;
      const ty = Math.cos(t * 0.7) * 10 - pointer.y * 28;
      camera.position.x += (tx - camera.position.x) * 0.04;
      camera.position.y += (ty - camera.position.y) * 0.04;
      camera.position.z = 320 - scroll * 140;
      group.rotation.y = scroll * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (!animId && running()) animate();
    };

    // First frame is always drawn, so reduced-motion users get a static network.
    writeNodes();
    rebuildLines();
    for (let s = 0; s < sCount; s++) {
      const p = pairCount ? Math.floor(Math.random() * pairCount) : 0;
      sFrom[s] = pairCount ? pairs[p * 2] : 0;
      sTo[s] = pairCount ? pairs[p * 2 + 1] : 0;
      sT[s] = Math.random();
      sSpeed[s] = 0.008 + Math.random() * 0.012;
    }
    placeSignals(0);
    renderer.render(scene, camera);
    start();

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    observer.observe(container);
    const onVisibility = () => start();
    document.addEventListener('visibilitychange', onVisibility);

    const handleResize = () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
      if (!running()) renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      signalGeo.dispose();
      signalMat.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
