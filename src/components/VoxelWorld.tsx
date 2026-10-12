'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { chapters, type ChapterId } from '@/data/chapters';
import {
  terrain,
  portraitRelief,
  globe,
  network,
  helix,
  torus,
  screens,
  timeline,
  contributionCity,
  lattice,
  signalRings,
  type Shape,
} from '@/lib/worldShapes';

/**
 * One fixed WebGL layer behind the whole page. The same voxels form a different shape for
 * every chapter; crossing into the next chapter bursts them into particles that
 * reassemble into the next shape. One instanced draw call, morphing in the vertex shader.
 *
 * Paused in hidden tabs; under reduced motion shapes swap without the burst and only
 * render on scroll; degrades to scroll-only rendering on slow devices; renders nothing
 * without WebGL.
 */

const QUALITY = {
  desktop: { cols: 120, rows: 75 },
  tablet: { cols: 96, rows: 62 },
  mobile: { cols: 70, rows: 48 },
} as const;
const quality = (w: number) => (w < 640 ? QUALITY.mobile : w < 1024 ? QUALITY.tablet : QUALITY.desktop);

type Palette = [number, number, number];
type Look = {
  /** -1 left, 0 centre, 1 right on wide screens (always centre on narrow ones). */
  side: -1 | 0 | 1;
  y: number;
  /** Push the shape back (negative) so it reads as a floor/backdrop. */
  z?: number;
  /** Horizontal distance from centre as a share of the visible width (default 0.21). */
  xf?: number;
  spin: number;
  /** Opacity while this chapter is on screen; lower where the shape sits behind text. */
  alpha: number;
  dark: Palette;
  light: Palette;
};

const LOOKS: Record<'hero' | ChapterId, Look> = {
  hero: { side: 0, y: 0, spin: 0, alpha: 1, dark: [0x1e1b4b, 0x7c3aed, 0x67e8f9], light: [0xddd6fe, 0x8b5cf6, 0x0e7490] },
  about: { side: 1, y: 0, spin: 0.08, alpha: 0.75, dark: [0x4c1d95, 0xa855f7, 0xf0abfc], light: [0xe9d5ff, 0x9333ea, 0xc026d3] },
  systems: { side: -1, y: 20, spin: 0.06, alpha: 0.6, dark: [0x0c4a6e, 0x0ea5e9, 0x67e8f9], light: [0xbae6fd, 0x0284c7, 0x0e7490] },
  skills: { side: 1, y: 0, spin: 0.18, alpha: 0.7, dark: [0x312e81, 0x6366f1, 0x5eead4], light: [0xc7d2fe, 0x4f46e5, 0x0d9488] },
  toolkit: { side: 0, y: 10, spin: 0.1, alpha: 0.45, dark: [0x701a75, 0xd946ef, 0xfbbf24], light: [0xf5d0fe, 0xc026d3, 0xd97706] },
  projects: { side: -1, y: 30, spin: 0.05, alpha: 0.55, dark: [0x1e1b4b, 0x8b5cf6, 0x93c5fd], light: [0xddd6fe, 0x7c3aed, 0x2563eb] },
  experience: { side: 1, y: -10, xf: 0.3, spin: 0, alpha: 0.65, dark: [0x134e4a, 0x14b8a6, 0x99f6e4], light: [0xccfbf1, 0x0d9488, 0x0f766e] },
  github: { side: 0, y: -330, z: -600, spin: 0, alpha: 0.24, dark: [0x14532d, 0x22c55e, 0xbbf7d0], light: [0xdcfce7, 0x16a34a, 0x15803d] },
  education: { side: 1, y: 0, spin: 0.12, alpha: 0.65, dark: [0x1e3a8a, 0x3b82f6, 0xc4b5fd], light: [0xdbeafe, 0x2563eb, 0x7c3aed] },
  contact: { side: 0, y: -40, spin: 0.15, alpha: 0.5, dark: [0x2e1065, 0x8b5cf6, 0x22d3ee], light: [0xede9fe, 0x7c3aed, 0x0891b2] },
};

const ORDER: ('hero' | ChapterId)[] = ['hero', ...chapters.map((c) => c.id)];

const SHAPES: Record<Exclude<ChapterId, never>, (n: number) => Shape> = {
  about: globe,
  systems: network,
  skills: helix,
  toolkit: torus,
  projects: screens,
  experience: timeline,
  github: contributionCity,
  education: lattice,
  contact: signalRings,
};

async function portraitHeights(src: string, cols: number, rows: number): Promise<Float32Array> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas unavailable');
  const scale = Math.max(cols / img.width, rows / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (cols - w) / 2, Math.min(0, (rows - h) * 0.25), w, h);
  const { data } = ctx.getImageData(0, 0, cols, rows);
  const out = new Float32Array(cols * rows);
  let min = 1;
  let max = 0;
  for (let i = 0; i < out.length; i++) {
    const l = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
    out[i] = l;
    min = Math.min(min, l);
    max = Math.max(max, l);
  }
  const range = Math.max(0.05, max - min);
  for (let i = 0; i < out.length; i++) out[i] = Math.pow((out[i] - min) / range, 1.15);
  return out;
}

const vertexShader = /* glsl */ `
  attribute vec4 aFrom;
  attribute vec4 aTo;
  attribute vec4 aRand;
  uniform float uMix;
  uniform float uBurst;
  uniform float uIntro;
  uniform float uTime;
  uniform float uSize;
  uniform float uBar;
  uniform vec4 uOffFrom;
  uniform vec4 uOffTo;
  uniform float uSpinFrom;
  uniform float uSpinTo;
  uniform float uAlphaFrom;
  uniform float uAlphaTo;
  uniform vec3 uFrom0; uniform vec3 uFrom1; uniform vec3 uFrom2;
  uniform vec3 uTo0; uniform vec3 uTo1; uniform vec3 uTo2;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  vec3 ramp(vec3 a, vec3 b, vec3 c, float k) {
    return mix(mix(a, b, smoothstep(0.0, 0.55, k)), c, smoothstep(0.55, 1.0, k));
  }

  void main() {
    // Per-voxel stagger so the morph ripples through the shape rather than moving as a block.
    float t = clamp(uMix * 1.45 - aRand.w * 0.45, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float burst = sin(3.14159265 * t) * uBurst;

    vec3 pf = rotY(aFrom.xyz * uOffFrom.w, uTime * uSpinFrom) + uOffFrom.xyz;
    vec3 pt = rotY(aTo.xyz * uOffTo.w, uTime * uSpinTo) + uOffTo.xyz;
    vec3 center = mix(pf, pt, t) + aRand.xyz * burst * (240.0 + 300.0 * aRand.w);

    // Intro: voxels fly in from a scattered cloud on first load.
    float intro = clamp(uIntro * 1.5 - aRand.w * 0.5, 0.0, 1.0);
    intro = 1.0 - pow(1.0 - intro, 3.0);
    center += aRand.xyz * (1.0 - intro) * 900.0;

    float hf = abs(aFrom.w);
    float ht = abs(aTo.w);
    float wave = 1.0 + 0.07 * sin(uTime * 1.1 + center.x * 0.02 + center.z * 0.015);
    float h = mix(hf, ht, t) * wave * (1.0 - burst * 0.9) * intro;
    float zAxis = t < 0.5 ? step(aFrom.w, -0.0001) : step(aTo.w, -0.0001);
    float s = uSize * (1.0 - burst * 0.5) * mix(0.4, 1.0, intro);
    float len = max(h * uBar, s);

    vec3 p = position;
    vec3 local;
    float top;
    if (zAxis > 0.5) {
      local = vec3(p.x * s, p.y * s, (p.z + 0.5) * len);
      top = normal.z > 0.5 ? 1.0 : (normal.y > 0.5 ? 0.78 : 0.6);
    } else {
      local = vec3(p.x * s, (p.y + 0.5) * len, p.z * s);
      top = normal.y > 0.5 ? 1.0 : (abs(normal.x) > 0.5 ? 0.62 : 0.78);
    }

    // Colour by bar height, or by height within the shape for plain cubes.
    float yk = clamp((center.y - mix(uOffFrom.y, uOffTo.y, t) + 260.0) / 520.0, 0.0, 1.0);
    float k = max(mix(hf, ht, t), yk * 0.85);
    vec3 cf = ramp(uFrom0, uFrom1, uFrom2, k);
    vec3 ct = ramp(uTo0, uTo1, uTo2, k);
    vColor = mix(cf, ct, t) * top;
    vAlpha = mix(uAlphaFrom, uAlphaTo, t);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(center + local, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha * uOpacity);
  }
`;

export default function VoxelWorld({ portrait }: { portrait: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let cleanup = () => {};

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { cols, rows } = quality(window.innerWidth);
    const n = cols * rows;

    const start = async () => {
      // ── Shapes ────────────────────────────────────────────────────────────────
      let heroShape = terrain(cols, rows);
      let heroIsPortrait = false;
      if (portrait) {
        try {
          heroShape = portraitRelief(await portraitHeights(portrait, cols, rows), cols, rows, 620);
          heroIsPortrait = true;
        } catch {
          /* keep the terrain */
        }
      }
      if (disposed) return;
      const shapes: Shape[] = ORDER.map((id) => (id === 'hero' ? heroShape : SHAPES[id](n)));

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
      const camBase = new THREE.Vector3(0, 140, 900);

      // ── Geometry ──────────────────────────────────────────────────────────────
      const box = new THREE.BoxGeometry(1, 1, 1);
      const geo = new THREE.InstancedBufferGeometry();
      geo.index = box.index;
      geo.setAttribute('position', box.getAttribute('position'));
      geo.setAttribute('normal', box.getAttribute('normal'));
      const fromAttr = new THREE.InstancedBufferAttribute(new Float32Array(shapes[0]), 4);
      const toAttr = new THREE.InstancedBufferAttribute(new Float32Array(shapes[1]), 4);
      fromAttr.setUsage(THREE.DynamicDrawUsage);
      toAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aFrom', fromAttr);
      geo.setAttribute('aTo', toAttr);
      const rands = new Float32Array(n * 4);
      for (let i = 0; i < n; i++) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        rands.set([Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph), Math.random()], i * 4);
      }
      geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rands, 4));
      geo.instanceCount = n;

      const col = () => new THREE.Color();
      const uniforms = {
        uMix: { value: 0 },
        uBurst: { value: prefersReduced ? 0 : 1 },
        uIntro: { value: prefersReduced ? 1 : 0 },
        uTime: { value: 0 },
        uSize: { value: (840 / cols) * 0.62 },
        uBar: { value: 190 },
        uOffFrom: { value: new THREE.Vector4(0, 0, 0, 1) },
        uOffTo: { value: new THREE.Vector4(0, 0, 0, 1) },
        uSpinFrom: { value: 0 },
        uSpinTo: { value: 0 },
        uAlphaFrom: { value: 1 },
        uAlphaTo: { value: 1 },
        uFrom0: { value: col() },
        uFrom1: { value: col() },
        uFrom2: { value: col() },
        uTo0: { value: col() },
        uTo1: { value: col() },
        uTo2: { value: col() },
        uOpacity: { value: 1 },
      };
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);

      // ── Per-chapter placement ─────────────────────────────────────────────────
      const visibleWidth = () => 2 * camBase.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      const isDark = () => document.documentElement.classList.contains('dark');
      const placement = (idx: number) => {
        const id = ORDER[idx];
        const look = LOOKS[id];
        const wide = window.innerWidth >= 1024;
        const vw = visibleWidth();
        if (id === 'hero') {
          // Portrait sits beside the headline on wide screens; terrain stays centred.
          const x = heroIsPortrait && wide ? vw * 0.24 : 0;
          return new THREE.Vector4(x, heroIsPortrait ? 30 : 0, 0, 1);
        }
        const scale = wide ? 1 : Math.min(1, vw / 620);
        return new THREE.Vector4(wide ? look.side * vw * (look.xf ?? 0.21) : 0, look.y, look.z ?? 0, scale * (wide ? 0.9 : 1));
      };
      const narrowAlpha = (a: number) => (window.innerWidth >= 1024 ? a : a * 0.35);

      let fromIdx = -1;
      let toIdx = -1;
      const setPair = (a: number, b: number) => {
        const dark = isDark();
        if (a !== fromIdx) {
          (fromAttr.array as Float32Array).set(shapes[a]);
          fromAttr.needsUpdate = true;
          fromIdx = a;
        }
        if (b !== toIdx) {
          (toAttr.array as Float32Array).set(shapes[b]);
          toAttr.needsUpdate = true;
          toIdx = b;
        }
        const la = LOOKS[ORDER[a]];
        const lb = LOOKS[ORDER[b]];
        uniforms.uOffFrom.value.copy(placement(a));
        uniforms.uOffTo.value.copy(placement(b));
        uniforms.uSpinFrom.value = prefersReduced ? 0 : la.spin;
        uniforms.uSpinTo.value = prefersReduced ? 0 : lb.spin;
        uniforms.uAlphaFrom.value = a === 0 ? la.alpha : narrowAlpha(la.alpha);
        uniforms.uAlphaTo.value = b === 0 ? lb.alpha : narrowAlpha(lb.alpha);
        const pa = dark ? la.dark : la.light;
        const pb = dark ? lb.dark : lb.light;
        uniforms.uFrom0.value.setHex(pa[0]);
        uniforms.uFrom1.value.setHex(pa[1]);
        uniforms.uFrom2.value.setHex(pa[2]);
        uniforms.uTo0.value.setHex(pb[0]);
        uniforms.uTo1.value.setHex(pb[1]);
        uniforms.uTo2.value.setHex(pb[2]);
        uniforms.uOpacity.value = dark ? 1 : 0.85;
      };

      // ── Scroll → chapter progress ─────────────────────────────────────────────
      // Each boundary has a transition window centred where the next section's top
      // reaches 60% of the viewport; between windows the current shape holds still.
      let tops: number[] = [];
      const measure = () => {
        tops = chapters.map((c) => {
          const el = document.getElementById(c.id);
          return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
        });
      };
      const progress = () => {
        const vh = window.innerHeight;
        const line = window.scrollY + vh * 0.6;
        const win = vh * 0.55;
        let f = 0;
        for (const top of tops) f += Math.min(1, Math.max(0, (line - (top - win / 2)) / win));
        return Math.min(f, ORDER.length - 1);
      };
      const applyProgress = () => {
        const f = progress();
        const a = Math.min(Math.floor(f), ORDER.length - 1);
        const b = Math.min(a + 1, ORDER.length - 1);
        let t = f - a;
        if (prefersReduced) t = t < 0.5 ? 0 : 1;
        setPair(a, b);
        uniforms.uMix.value = t;
      };

      measure();
      applyProgress();

      // ── Camera & loop ─────────────────────────────────────────────────────────
      const pointer = { x: 0, y: 0 };
      const eased = { x: 0, y: 0 };
      const render = (now: number) => {
        eased.x += (pointer.x - eased.x) * 0.05;
        eased.y += (pointer.y - eased.y) * 0.05;
        camera.position.set(camBase.x + eased.x * 60, camBase.y - eased.y * 40, camBase.z);
        camera.lookAt(0, 0, 0);
        uniforms.uTime.value = prefersReduced ? 0 : now / 1000;
        renderer.render(scene, camera);
      };

      let raf = 0;
      let startTime = 0;
      let frames = 0;
      let slow = 0;
      let last = 0;
      let degraded = false;
      const loop = (now: number) => {
        if (degraded) return;
        raf = requestAnimationFrame(loop);
        if (document.hidden) {
          last = 0;
          return;
        }
        if (!startTime) startTime = now;
        if (last && frames < 40) {
          frames++;
          if (now - last > 60) slow++;
          if (slow > 12) {
            degraded = true;
            uniforms.uIntro.value = 1;
            render(now);
            return;
          }
        }
        last = now;
        uniforms.uIntro.value = Math.min(1, (now - startTime) / 2400);
        render(now);
      };

      const onScroll = () => {
        applyProgress();
        if (prefersReduced || degraded) render(performance.now());
      };
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        measure();
        fromIdx = toIdx = -1;
        applyProgress();
        if (prefersReduced || degraded) render(performance.now());
      };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      // Layout shifts as lazy sections load, so re-measure when the page height changes.
      const ro = new ResizeObserver(() => {
        measure();
        applyProgress();
        if (prefersReduced || degraded) render(performance.now());
      });
      ro.observe(document.body);
      const themeObserver = new MutationObserver(() => {
        fromIdx = toIdx = -1;
        applyProgress();
        if (prefersReduced || degraded) render(performance.now());
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      if (prefersReduced) {
        render(0);
      } else {
        window.addEventListener('pointermove', onPointer, { passive: true });
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        themeObserver.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointer);
        box.dispose();
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [portrait]);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
