'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero backdrop: an image rebuilt from thousands of glowing 3D "pixel towers".
 *
 * - With a portrait (public/portrait.jpg|png|webp) the towers stand on a vertical plane and
 *   extrude toward the camera by brightness, so the face reads as a relief.
 * - Without one, a generated terrain is laid on a neon floor grid.
 *
 * The towers rise in on load and burst outward into particles as the hero scrolls away.
 * Everything is one instanced draw call with the animation done in the vertex shader.
 * Paused off-screen and in hidden tabs; one static frame under reduced motion; renders
 * nothing if WebGL is unavailable (the gradient backdrop behind it still shows).
 */

type Mode = 'portrait' | 'terrain';

const QUALITY = {
  desktop: { cols: 150, rows: 90 },
  tablet: { cols: 110, rows: 66 },
  mobile: { cols: 72, rows: 46 },
} as const;

const quality = (w: number) => (w < 640 ? QUALITY.mobile : w < 1024 ? QUALITY.tablet : QUALITY.desktop);

/** Brightness 0..1 per cell, row-major from the top-left. */
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
  // Cover-fit, biased towards the top so the face stays in frame.
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
  // Stretch contrast so dark photos still produce a readable relief.
  const range = Math.max(0.05, max - min);
  for (let i = 0; i < out.length; i++) out[i] = Math.pow((out[i] - min) / range, 1.15);
  return out;
}

function terrainHeights(cols: number, rows: number): Float32Array {
  const out = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c / cols - 0.5;
      const y = r / rows - 0.5;
      // Two ridges and a central peak, with layered ripples for texture.
      const ridges =
        0.55 * Math.exp(-((x + 0.22) ** 2 * 18 + (y - 0.05) ** 2 * 10)) +
        0.75 * Math.exp(-((x - 0.18) ** 2 * 26 + (y + 0.1) ** 2 * 14)) +
        0.35 * Math.exp(-((x - 0.02) ** 2 * 60 + (y + 0.02) ** 2 * 60));
      const ripples =
        0.08 * Math.sin(x * 23 + y * 7) * Math.cos(y * 17 - x * 5) + 0.05 * Math.sin((x + y) * 41);
      out[r * cols + c] = Math.max(0, Math.min(1, ridges + ripples * (0.4 + ridges)));
    }
  }
  return out;
}

const vertexShader = /* glsl */ `
  attribute vec2 aOffset;
  attribute float aHeight;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uRise;
  uniform float uExplode;
  uniform float uCell;
  uniform float uDepth;
  uniform float uFloor;
  varying float vH;
  varying float vShade;
  varying float vFade;

  void main() {
    float rise = clamp(uRise * 1.6 - aRand.w * 0.6, 0.0, 1.0);
    rise = rise * rise * (3.0 - 2.0 * rise);
    float wave = 0.07 * sin(uTime * 1.1 + aOffset.x * 0.045 + aOffset.y * 0.035);
    float e = smoothstep(0.0, 1.0, uExplode);
    // While bursting, towers collapse into small cubes so they read as particles.
    float shrink = min(1.0, e * 3.0);
    float h = max(0.015, aHeight * (1.0 + wave) * rise) * (1.0 - shrink * 0.94) + shrink * 0.02;
    float foot = uCell * mix(0.62, 0.35, e);

    vec3 p = position;                   // unit box, -0.5..0.5
    float ext = (p.z + 0.5) * h * uDepth; // extrusion length
    vec3 world;
    if (uFloor > 0.5) {
      world = vec3(aOffset.x + p.x * foot, ext, aOffset.y + p.y * foot);
      vShade = normal.z > 0.5 ? 1.0 : (abs(normal.x) > 0.5 ? 0.62 : 0.78);
    } else {
      world = vec3(aOffset.x + p.x * foot, aOffset.y + p.y * foot, ext);
      vShade = normal.z > 0.5 ? 1.0 : (normal.y > 0.5 ? 0.78 : 0.6);
    }

    // Burst up and away from the camera (which sits on +z), never into the viewer's face.
    vec3 dir = vec3(aRand.x, abs(aRand.y) * 0.8 + 0.2, -abs(aRand.z));
    world += dir * e * (600.0 + 900.0 * aRand.w);

    vH = aHeight;
    vFade = 1.0 - smoothstep(0.6, 1.0, uExplode);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying float vH;
  varying float vShade;
  varying float vFade;

  void main() {
    vec3 c = mix(uColorA, uColorB, smoothstep(0.0, 0.55, vH));
    c = mix(c, uColorC, smoothstep(0.55, 1.0, vH));
    gl_FragColor = vec4(c * vShade, uOpacity * vFade);
  }
`;

const PALETTES = {
  dark: { a: 0x1e1b4b, b: 0x7c3aed, c: 0x67e8f9, grid: 0x6d28d9, opacity: 1, gridOpacity: 0.35 },
  light: { a: 0xddd6fe, b: 0x8b5cf6, c: 0x0e7490, grid: 0xa78bfa, opacity: 0.9, gridOpacity: 0.45 },
};

export default function PixelField({ portrait }: { portrait: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let cleanup = () => {};

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { cols, rows } = quality(window.innerWidth);
    const mode: Mode = portrait ? 'portrait' : 'terrain';

    const start = async () => {
      let heights: Float32Array;
      try {
        heights = portrait ? await portraitHeights(portrait, cols, rows) : terrainHeights(cols, rows);
      } catch {
        heights = terrainHeights(cols, rows);
      }
      if (disposed) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      const W = container.clientWidth;
      const H = container.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, W / H, 1, 4000);

      // ── Instances (skip near-empty cells: they add cost and visual noise) ──────────
      const cell = mode === 'portrait' ? 6 : 7;
      const offsets: number[] = [];
      const hs: number[] = [];
      const rands: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const h = heights[r * cols + c];
          if (h < 0.06) continue;
          const x = (c - cols / 2) * cell;
          const y = mode === 'portrait' ? (rows / 2 - r) * cell : (r - rows / 2) * cell;
          offsets.push(x, y);
          hs.push(h);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          rands.push(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.random());
        }
      }

      const box = new THREE.BoxGeometry(1, 1, 1);
      const geo = new THREE.InstancedBufferGeometry();
      geo.index = box.index;
      geo.setAttribute('position', box.getAttribute('position'));
      geo.setAttribute('normal', box.getAttribute('normal'));
      geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 2));
      geo.setAttribute('aHeight', new THREE.InstancedBufferAttribute(new Float32Array(hs), 1));
      geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(new Float32Array(rands), 4));
      geo.instanceCount = hs.length;

      const uniforms = {
        uTime: { value: 0 },
        uRise: { value: prefersReduced ? 1 : 0 },
        uExplode: { value: 0 },
        uCell: { value: cell },
        uDepth: { value: mode === 'portrait' ? 170 : 190 },
        uFloor: { value: mode === 'terrain' ? 1 : 0 },
        uColorA: { value: new THREE.Color() },
        uColorB: { value: new THREE.Color() },
        uColorC: { value: new THREE.Color() },
        uOpacity: { value: 1 },
      };
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);

      // Neon floor grid under the field.
      const span = Math.max(cols, rows) * cell * 1.6;
      const grid = new THREE.GridHelper(span, 40, 0xffffff, 0xffffff);
      grid.renderOrder = -1;
      const gridMat = grid.material as THREE.LineBasicMaterial;
      gridMat.transparent = true;
      grid.position.y = mode === 'portrait' ? -(rows / 2) * cell - 4 : -2;
      scene.add(grid);

      const applyTheme = () => {
        const p = document.documentElement.classList.contains('dark') ? PALETTES.dark : PALETTES.light;
        uniforms.uColorA.value.setHex(p.a);
        uniforms.uColorB.value.setHex(p.b);
        uniforms.uColorC.value.setHex(p.c);
        // On narrow screens the portrait sits behind the text, so it becomes a dimmer backdrop.
        const behindText = mode === 'portrait' && container.clientWidth < 1024;
        uniforms.uOpacity.value = p.opacity * (behindText ? 0.45 : 1);
        gridMat.color.setHex(p.grid);
        gridMat.opacity = p.gridOpacity;
      };
      applyTheme();
      const themeObserver = new MutationObserver(applyTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // ── Camera rig ────────────────────────────────────────────────────────────────
      // Terrain sits low in the frame so the headline reads against dark space above it.
      // On wide screens the portrait sits to the right of the headline (see Hero's split layout).
      const look = new THREE.Vector3(0, 230, 0);
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      let baseDist = Math.max(cols * cell * 0.62, 520);
      // Portrait: size the camera so the image fills the right half on wide screens
      // (beside the headline) or the full width on narrow ones, and keep that on resize.
      const fitPortrait = () => {
        if (mode !== 'portrait') return;
        const wide = container.clientWidth >= 1024;
        const share = wide ? 0.5 : 1.05;
        baseDist = (cols * cell) / (share * 2 * tanHalf * camera.aspect);
        const visibleW = 2 * baseDist * tanHalf * camera.aspect;
        look.set(wide ? -visibleW * 0.23 : 0, wide ? 0 : rows * cell * 0.22, 0);
      };
      fitPortrait();
      const baseHeight = mode === 'portrait' ? 30 : baseDist * 0.42;
      const pointer = { x: 0, y: 0 };
      const eased = { x: 0, y: 0 };
      const placeCamera = (t: number) => {
        eased.x += (pointer.x - eased.x) * 0.05;
        eased.y += (pointer.y - eased.y) * 0.05;
        const yaw = (prefersReduced ? 0 : Math.sin(t * 0.12) * 0.22) + eased.x * 0.18;
        const dist = baseDist * (1 - uniforms.uExplode.value * 0.25);
        camera.position.set(Math.sin(yaw) * dist, baseHeight + eased.y * -60, Math.cos(yaw) * dist);
        camera.lookAt(look);
      };
      placeCamera(0);

      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };

      // Burst outward as the hero scrolls away.
      const onScroll = () => {
        const h = container.clientHeight || window.innerHeight;
        uniforms.uExplode.value = prefersReduced ? 0 : Math.min(1, Math.max(0, window.scrollY / (h * 0.7)));
        if (prefersReduced || degraded) render(performance.now());
      };

      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        fitPortrait();
        renderer.setSize(w, h);
        if (prefersReduced || degraded) render(performance.now());
      };

      const render = (now: number) => {
        const t = now / 1000;
        uniforms.uTime.value = prefersReduced ? 0 : t;
        placeCamera(t);
        renderer.render(scene, camera);
      };

      let raf = 0;
      let visible = true;
      let startTime = 0;
      // Safety net for devices without GPU acceleration: if the first frames are slow,
      // finish the rise instantly and fall back to rendering only on scroll.
      let frames = 0;
      let slowFrames = 0;
      let lastFrame = 0;
      let degraded = false;
      const loop = (now: number) => {
        if (degraded) return;
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden || uniforms.uExplode.value >= 1) {
          lastFrame = 0;
          return;
        }
        if (!startTime) startTime = now;
        if (lastFrame && frames < 40) {
          frames++;
          if (now - lastFrame > 60) slowFrames++;
          if (slowFrames > 12) {
            degraded = true;
            uniforms.uRise.value = 1;
            render(now);
            return;
          }
        }
        lastFrame = now;
        uniforms.uRise.value = Math.min(1, (now - startTime) / 2200);
        render(now);
      };

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(container);

      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      if (prefersReduced) {
        render(0);
      } else {
        window.addEventListener('pointermove', onPointer, { passive: true });
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        themeObserver.disconnect();
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointermove', onPointer);
        box.dispose();
        geo.dispose();
        mat.dispose();
        grid.geometry.dispose();
        gridMat.dispose();
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

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
