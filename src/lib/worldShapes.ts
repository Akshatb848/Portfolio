/**
 * Target shapes for the page-wide voxel world. Every shape has exactly `n` voxels so any
 * shape can morph into any other. Each voxel is 4 floats: x, y, z and w, where |w| is a
 * bar height (0..1, 0 = plain cube) and the sign picks the extrusion axis (+y, or +z when
 * negative, used by the portrait relief). Units are world units (camera ~900 away).
 */

export type Shape = Float32Array;

/** Deterministic PRNG so shapes are identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const put = (out: Shape, i: number, x: number, y: number, z: number, w = 0) => {
  out[i * 4] = x;
  out[i * 4 + 1] = y;
  out[i * 4 + 2] = z;
  out[i * 4 + 3] = w;
};

/** Hero: a terrain of bars on the floor. Uses the full cols x rows grid. */
export function terrain(cols: number, rows: number): Shape {
  const out = new Float32Array(cols * rows * 4);
  const cell = 840 / cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c / cols - 0.5;
      const y = r / rows - 0.5;
      const ridges =
        0.55 * Math.exp(-((x + 0.22) ** 2 * 18 + (y - 0.05) ** 2 * 10)) +
        0.75 * Math.exp(-((x - 0.18) ** 2 * 26 + (y + 0.1) ** 2 * 14)) +
        0.35 * Math.exp(-((x - 0.02) ** 2 * 60 + (y + 0.02) ** 2 * 60));
      const ripples = 0.08 * Math.sin(x * 23 + y * 7) * Math.cos(y * 17 - x * 5) + 0.05 * Math.sin((x + y) * 41);
      const h = Math.max(0.02, Math.min(1, ridges + ripples * (0.4 + ridges)));
      put(out, r * cols + c, (c - cols / 2) * cell, -230, (r - rows / 2) * cell * 0.9, h);
    }
  }
  return out;
}

/** Hero with a photo: a vertical relief, bars extruding toward the camera (+z). */
export function portraitRelief(heights: Float32Array, cols: number, rows: number, width: number): Shape {
  const out = new Float32Array(cols * rows * 4);
  const cell = width / cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = heights[r * cols + c];
      put(out, r * cols + c, (c - cols / 2) * cell, (rows / 2 - r) * cell, 0, -Math.max(0.02, h));
    }
  }
  return out;
}

/** About: a globe with noisy "continents". */
export function globe(n: number): Shape {
  const out = new Float32Array(n * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const x = Math.cos(th) * rad;
    const z = Math.sin(th) * rad;
    const land = Math.sin(x * 5.1 + z * 2.3) * Math.cos(y * 4.2 - x * 1.7) + 0.4 * Math.sin(z * 9 + y * 6);
    const r = 220 + (land > 0.25 ? 16 : 0);
    put(out, i, x * r, y * r, z * r, land > 0.25 ? 0.12 : 0);
  }
  return out;
}

/** Systems: a layered neural network, nodes plus signal paths between layers. */
export function network(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(7);
  const layers = [5, 8, 10, 8, 4];
  const nodes: [number, number, number][][] = layers.map((count, li) => {
    const x = (li - (layers.length - 1) / 2) * 150;
    return Array.from({ length: count }, (_, k) => {
      const a = (k / count) * Math.PI * 2;
      const rad = 40 + count * 13;
      return [x, Math.cos(a) * rad, Math.sin(a) * rad * 0.6] as [number, number, number];
    });
  });
  const flat = nodes.flat();
  const nodeShare = Math.floor(n * 0.3);
  for (let i = 0; i < nodeShare; i++) {
    const [x, y, z] = flat[i % flat.length];
    const u = rand() * Math.PI * 2;
    const v = Math.acos(2 * rand() - 1);
    const r = 14 * Math.cbrt(rand());
    put(out, i, x + r * Math.sin(v) * Math.cos(u), y + r * Math.sin(v) * Math.sin(u), z + r * Math.cos(v));
  }
  for (let i = nodeShare; i < n; i++) {
    const li = Math.floor(rand() * (layers.length - 1));
    const a = nodes[li][Math.floor(rand() * nodes[li].length)];
    const b = nodes[li + 1][Math.floor(rand() * nodes[li + 1].length)];
    const t = rand();
    put(out, i, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }
  return out;
}

/** Skills: a DNA double helix with rungs. */
export function helix(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(11);
  const height = 560;
  const turns = 3;
  for (let i = 0; i < n; i++) {
    const t = rand();
    const a = t * turns * Math.PI * 2;
    const y = (t - 0.5) * height;
    const kind = rand();
    if (kind < 0.7) {
      const strand = kind < 0.35 ? 0 : Math.PI;
      const j = (rand() - 0.5) * 10;
      put(out, i, Math.cos(a + strand) * (120 + j), y, Math.sin(a + strand) * (120 + j));
    } else {
      // rung: quantise height so rungs read as discrete steps
      const steps = 40;
      const ts = Math.round(t * steps) / steps;
      const aa = ts * turns * Math.PI * 2;
      const u = rand() * 2 - 1;
      put(out, i, Math.cos(aa) * 120 * u, (ts - 0.5) * height, Math.sin(aa) * 120 * u);
    }
  }
  return out;
}

/** Toolkit: an orbit ring (torus), echoing the floating tool tiles. */
export function torus(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(13);
  for (let i = 0; i < n; i++) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 2;
    const R = 250;
    const r = 34 + rand() * 6;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const z = (R + r * Math.cos(v)) * Math.sin(u);
    const y = r * Math.sin(v);
    // tilt the ring toward the viewer
    const tilt = 1.1;
    put(out, i, x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt));
  }
  return out;
}

/** Projects: a curved wall of floating screens. */
export function screens(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(17);
  const cols = 3;
  const rows = 2;
  const w = 170;
  const h = 112;
  const gap = 34;
  for (let i = 0; i < n; i++) {
    const k = i % (cols * rows);
    const cx = ((k % cols) - (cols - 1) / 2) * (w + gap);
    const cy = (Math.floor(k / cols) - (rows - 1) / 2) * (h + gap);
    let x = (rand() - 0.5) * w;
    let y = (rand() - 0.5) * h;
    // bias toward the frame so each screen has a crisp border
    if (rand() < 0.35) {
      if (rand() < 0.5) x = (rand() < 0.5 ? -0.5 : 0.5) * w;
      else y = (rand() < 0.5 ? -0.5 : 0.5) * h;
    }
    const px = cx + x;
    put(out, i, px, cy + y, -((px / 400) ** 2) * 160);
  }
  return out;
}

/** Experience: a career "growth chart" — five ascending voxel towers, one per role. */
export function timeline(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(19);
  const towers = 5;
  const width = 64;
  const gap = 34;
  for (let i = 0; i < n; i++) {
    const k = i % towers;
    const height = 120 + k * 75; // ascending, oldest role on the left
    const cx = (k - (towers - 1) / 2) * (width + gap);
    const cz = (k - (towers - 1) / 2) * -18;
    let x = (rand() - 0.5) * width;
    let z = (rand() - 0.5) * width;
    const y = rand() * height;
    // Most voxels on the faces so each tower reads as a solid block.
    if (rand() < 0.75) {
      if (rand() < 0.5) x = (rand() < 0.5 ? -0.5 : 0.5) * width;
      else z = (rand() < 0.5 ? -0.5 : 0.5) * width;
    }
    put(out, i, cx + x, y - 220, cz + z, y > height - 6 ? 0.04 : 0);
  }
  return out;
}

/** GitHub: a contribution graph rendered as a 3D city of voxel columns. */
export function contributionCity(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(23);
  const weeks = 26;
  const days = 7;
  const cells = weeks * days;
  const per = Math.max(1, Math.floor(n / cells));
  const sub = Math.ceil(Math.sqrt(per));
  const pitch = 26;
  const heights = Array.from({ length: cells }, (_, k) => {
    const w = Math.floor(k / days);
    const busy = 0.5 + 0.5 * Math.sin(w * 0.55) * Math.cos(w * 0.21);
    return rand() < 0.18 ? 0.03 : Math.min(1, 0.08 + busy * rand() * 1.1);
  });
  for (let i = 0; i < n; i++) {
    const k = Math.min(cells - 1, Math.floor(i / per));
    const j = i % per;
    const wk = Math.floor(k / days);
    const d = k % days;
    const sx = ((j % sub) / sub - 0.5) * pitch * 0.8;
    const sz = (Math.floor(j / sub) / sub - 0.5) * pitch * 0.8;
    put(out, i, (wk - weeks / 2) * pitch + sx, -150, (d - days / 2) * pitch + sz, heights[k]);
  }
  return out;
}

/** Education: a crystal lattice clipped to a sphere. */
export function lattice(n: number): Shape {
  const out = new Float32Array(n * 4);
  const side = Math.ceil(Math.cbrt(n * 1.95));
  const pts: [number, number, number][] = [];
  const pitch = 460 / side;
  for (let a = 0; a < side; a++)
    for (let b = 0; b < side; b++)
      for (let c = 0; c < side; c++) {
        const x = (a - side / 2) * pitch;
        const y = (b - side / 2) * pitch;
        const z = (c - side / 2) * pitch;
        if (Math.hypot(x, y, z) < 230) pts.push([x, y, z]);
      }
  for (let i = 0; i < n; i++) {
    const [x, y, z] = pts[i % pts.length];
    put(out, i, x, y, z);
  }
  return out;
}

/** Contact: concentric signal rings radiating outward. */
export function signalRings(n: number): Shape {
  const out = new Float32Array(n * 4);
  const rand = rng(29);
  const rings = 9;
  for (let i = 0; i < n; i++) {
    const k = i % rings;
    const r = 36 + k * 36;
    const a = rand() * Math.PI * 2;
    const ripple = Math.sin(r * 0.05) * 16;
    put(out, i, Math.cos(a) * r, ripple - 40, Math.sin(a) * r, k === 0 ? 0.3 : 0);
  }
  return out;
}
