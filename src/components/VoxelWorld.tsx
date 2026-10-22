'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { chapters, type ChapterId } from '@/data/chapters';
import { isMotionOff, subscribeMotion } from '@/lib/motion';
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
  desktop: { cols: 88, rows: 55 },
  tablet: { cols: 72, rows: 46 },
  mobile: { cols: 48, rows: 34 },
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

// One brand family (indigo → violet → cyan) with per-chapter shading, and a slow drift
// rather than a spin so shapes stay calm while you read.
const DARK_A: Palette = [0x1e1b4b, 0x7c3aed, 0x67e8f9];
const DARK_B: Palette = [0x312e81, 0x8b5cf6, 0xa5b4fc];
const DARK_C: Palette = [0x172554, 0x6366f1, 0x22d3ee];
const LIGHT_A: Palette = [0xddd6fe, 0x8b5cf6, 0x0e7490];
const LIGHT_B: Palette = [0xe0e7ff, 0x7c3aed, 0x4f46e5];
const LIGHT_C: Palette = [0xdbeafe, 0x4f46e5, 0x0891b2];

const LOOKS: Record<'hero' | ChapterId, Look> = {
  hero: { side: 0, y: 0, spin: 0, alpha: 1, dark: DARK_A, light: LIGHT_A },
  about: { side: 1, y: 0, spin: 0.03, alpha: 0.7, dark: DARK_B, light: LIGHT_B },
  systems: { side: -1, y: 20, spin: 0.02, alpha: 0.55, dark: DARK_C, light: LIGHT_C },
  skills: { side: 1, y: 0, spin: 0.05, alpha: 0.65, dark: DARK_A, light: LIGHT_A },
  toolkit: { side: 0, y: 10, spin: 0.03, alpha: 0.4, dark: DARK_B, light: LIGHT_B },
  projects: { side: -1, y: 30, spin: 0.02, alpha: 0.5, dark: DARK_C, light: LIGHT_C },
  experience: { side: 1, y: -10, xf: 0.3, spin: 0, alpha: 0.6, dark: DARK_A, light: LIGHT_A },
  github: { side: 0, y: -330, z: -600, spin: 0, alpha: 0.22, dark: DARK_C, light: LIGHT_C },
  education: { side: 1, y: 0, spin: 0.03, alpha: 0.6, dark: DARK_B, light: LIGHT_B },
  contact: { side: 0, y: -40, spin: 0.04, alpha: 0.45, dark: DARK_A, light: LIGHT_A },
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

/** True when WebGL would run without hardware acceleration (or not at all). */
function softwareOnly(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch {
    return true;
  }
}

/**
 * Still image of the hero terrain for devices without GPU rendering; fades out on scroll.
 * Drawn into a 2D canvas so the decorative backdrop is never the page's LCP element.
 */
function Poster() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgs = { dark: new Image(), light: new Image() };
    imgs.dark.src = '/world-poster-dark.webp';
    imgs.light.src = '/world-poster-light.webp';
    const draw = () => {
      const img = document.documentElement.classList.contains('dark') ? imgs.dark : imgs.light;
      if (!img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // cover-fit, anchored to the top
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - dw) / 2, 0, dw, img.naturalHeight * scale);
    };
    imgs.dark.onload = draw;
    imgs.light.onload = draw;
    const onScroll = () => {
      canvas.style.opacity = String(Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.7)));
    };
    onScroll();
    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', draw);
    return () => {
      themeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', draw);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-x-0 bottom-[4vh] h-[42vh] w-full" />;
}

export default function VoxelWorld({ portrait }: { portrait: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let cleanup = () => {};

    // Still = OS reduced motion or the visitor's Pause button; can change while the page is open.
    let prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMotionOff();
    const { cols, rows } = quality(window.innerWidth);
    const n = cols * rows;

    const start = async () => {
      // `?world=force` skips the GPU check (for testing the full scene on any machine).
      const forced = new URLSearchParams(window.location.search).get('world') === 'force';
      if (!forced && softwareOnly()) {
        setFallback(true);
        return;
      }
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
      // Shapes are built on first use, so start-up only pays for the hero and the next one.
      const built: (Shape | undefined)[] = [heroShape];
      const shapeAt = (i: number): Shape => {
        const id = ORDER[i];
        return (built[i] ??= id === 'hero' ? heroShape : SHAPES[id](n));
      };

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return;
      }
      // Without a GPU, Chrome draws WebGL on the CPU (SwiftShader/llvmpipe), so every frame
      // would block the page. Show a still frame there instead and re-render only on scroll.
      const gl = renderer.getContext();
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const rendererName = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      const software = /swiftshader|llvmpipe|software|basic render/i.test(rendererName);
      // Quality ladder: drop the render resolution step by step if frames run long, before
      // giving up on animation altogether (see the loop below).
      const ratios = software ? [1] : [1, 0.8, 0.6];
      let ratioStep = 0;
      renderer.setPixelRatio(ratios[0]);
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
      const fromAttr = new THREE.InstancedBufferAttribute(new Float32Array(shapeAt(0)), 4);
      const toAttr = new THREE.InstancedBufferAttribute(new Float32Array(shapeAt(1)), 4);
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
          (fromAttr.array as Float32Array).set(shapeAt(a));
          fromAttr.needsUpdate = true;
          fromIdx = a;
        }
        if (b !== toIdx) {
          (toAttr.array as Float32Array).set(shapeAt(b));
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
      let clock = 0;
      let lastFrame = 0;
      const render = (now: number) => {
        eased.x += (pointer.x - eased.x) * 0.05;
        eased.y += (pointer.y - eased.y) * 0.05;
        camera.position.set(camBase.x + eased.x * 60, camBase.y - eased.y * 40, camBase.z);
        camera.lookAt(0, 0, 0);
        // Scene time only advances while frames are drawn, so resuming after an idle stop
        // continues smoothly instead of jumping.
        if (!prefersReduced) {
          clock += Math.min(50, lastFrame ? now - lastFrame : 16);
          lastFrame = now;
        }
        uniforms.uTime.value = prefersReduced ? 0 : clock / 1000;
        renderer.render(scene, camera);
      };

      let raf = 0;
      let startTime = 0;
      let last = 0;
      let degraded = software;
      // Adaptive quality: average the frame time over 90 active frames; when it is over budget,
      // step down the resolution, and as a last resort switch to still frames on scroll.
      let sampleTime = 0;
      let samples = 0;
      // Frame pacing: full rate while the visitor scrolls or moves the pointer (or during the
      // intro), half rate when the page is idle, which halves GPU load for the ambient wave.
      let lastActive = 0;
      // Frame pacing: draw only while something changes (scroll, pointer, the intro). When
      // the page is idle the world holds its last frame and costs nothing.
      const loop = (now: number) => {
        raf = 0;
        if (degraded || prefersReduced || document.hidden) {
          last = 0;
          lastFrame = 0;
          return;
        }
        if (!startTime) startTime = now;
        const intro = now - startTime < 2400;
        const active = intro || now - lastActive < 900;
        if (!active) {
          last = 0;
          lastFrame = 0;
          return;
        }
        raf = requestAnimationFrame(loop);
        if (last) {
          sampleTime += now - last;
          if (++samples === 60) {
            const avg = sampleTime / samples;
            sampleTime = 0;
            samples = 0;
            if (avg > 22) {
              if (ratioStep < ratios.length - 1) {
                renderer.setPixelRatio(ratios[++ratioStep]);
                renderer.setSize(window.innerWidth, window.innerHeight);
              } else {
                degraded = true;
                cancelAnimationFrame(raf);
                raf = 0;
                uniforms.uIntro.value = 1;
                render(now);
                return;
              }
            }
          }
        }
        last = now;
        uniforms.uIntro.value = Math.min(1, (now - startTime) / 2400);
        render(now);
      };
      const wakeLoop = () => {
        if (!raf && !degraded && !prefersReduced) raf = requestAnimationFrame(loop);
      };

      let pending = 0;
      const onScroll = () => {
        lastActive = performance.now();
        wakeLoop();
        applyProgress();
        if ((prefersReduced || degraded) && !pending) {
          pending = requestAnimationFrame(() => {
            pending = 0;
            render(performance.now());
          });
        }
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
        lastActive = performance.now();
        wakeLoop();
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      // Layout shifts as lazy sections load, so re-measure when the page height changes.
      let roTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(roTimer);
        roTimer = window.setTimeout(() => {
          measure();
          applyProgress();
          if (prefersReduced || degraded) render(performance.now());
        }, 250);
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
      if (prefersReduced || degraded) {
        uniforms.uIntro.value = 1;
        render(0);
      } else {
        raf = requestAnimationFrame(loop);
      }
      window.addEventListener('pointermove', onPointer, { passive: true });

      // Pause / resume when the visitor toggles motion.
      const unsubscribeMotion = subscribeMotion(() => {
        const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const next = osReduced || isMotionOff();
        if (next === prefersReduced) return;
        prefersReduced = next;
        uniforms.uBurst.value = next ? 0 : 1;
        uniforms.uIntro.value = 1;
        fromIdx = toIdx = -1;
        applyProgress();
        cancelAnimationFrame(raf);
        if (next || degraded) render(performance.now());
        else raf = requestAnimationFrame(loop);
      });

      cleanup = () => {
        cancelAnimationFrame(raf);
        unsubscribeMotion();
        cancelAnimationFrame(pending);
        window.clearTimeout(roTimer);
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

    // Wait until the page has loaded and the main thread is idle, so the 3D world never
    // competes with the first paint or with hydration; it then fades in via the intro.
    let idleId = 0;
    let timer = 0;
    const kick = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (ric) idleId = ric(() => void start(), { timeout: 2500 });
      else timer = window.setTimeout(() => void start(), 600);
    };
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });
    return () => {
      window.removeEventListener('load', kick);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId && cic) cic(idleId);
      window.clearTimeout(timer);
      disposed = true;
      cleanup();
    };
  }, [portrait]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {fallback && <Poster />}
    </div>
  );
}
