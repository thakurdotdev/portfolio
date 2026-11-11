/*
 * Turns the cut-out photo into the portrait scene: a halftone on a hexagonal grid, where
 * dot size carries the tone, raised into a relief like pin art. Every cell inside the
 * silhouette gets a dot, so dark areas read as small dots, never as holes.
 */

export async function loadPortrait(url: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();

  const size = 240;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size);
}

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/*
 * Writes x, y, z, tone into `out` for the dots listed in `slots` (the ones that take part
 * in scenes; drifting dust is left out, or it would leave holes). Unused dots get tone -1.
 * Returns the number of grid cells across the photo, which sets the dot spacing.
 */
export function samplePortrait(data: ImageData, out: Float32Array, slots: Int32Array, inkIsDark: boolean) {
  const count = slots.length;
  for (let i = 0; i < out.length / 4; i++) {
    out[i * 4] = 0;
    out[i * 4 + 1] = -0.3;
    out[i * 4 + 2] = 0;
    out[i * 4 + 3] = -1;
  }
  const { width: W, height: H, data: px } = data;
  const lumAt = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) lumAt[i] = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
  const at = (u: number, v: number) => {
    const x = Math.min(W - 1, Math.max(0, Math.floor(u * W)));
    const y = Math.min(H - 1, Math.max(0, Math.floor(v * H)));
    return { a: px[(y * W + x) * 4 + 3] / 255, lum: lumAt[y * W + x] };
  };
  // The bust dissolves at the bottom rather than stopping at a hard edge.
  const fadeAt = (v: number) => 1 - smooth(0.55, 0.97, v);

  // Levels: use the photo's own range, gently, so the face is neither flat nor harsh.
  const lums: number[] = [];
  let inside = 0;
  for (let i = 0; i < W * H; i++) {
    if (px[i * 4 + 3] > 100 && fadeAt(Math.floor(i / W) / H) > 0.15) {
      inside++;
      if (i % 3 === 0) lums.push(lumAt[i]);
    }
  }
  lums.sort((a, b) => a - b);
  const lo = lums[Math.floor(lums.length * 0.02)] ?? 0;
  const hi = lums[Math.floor(lums.length * 0.985)] ?? 1;

  // Pick the grid so the silhouette uses most of the dots. Rows are offset (hexagonal).
  const coverage = inside / (W * H);
  const G = Math.max(40, Math.floor(Math.sqrt((count * 0.94) / Math.max(coverage, 0.05)) / 1.07));
  const rowStep = Math.sqrt(3) / 2;
  let n = 0;

  for (let r = 0; r * rowStep < G && n < count; r++) {
    const v = (r * rowStep + 0.5) / G;
    const offset = r % 2 ? 0.5 : 0;
    for (let c = 0; c < G && n < count; c++) {
      const u = (c + offset + 0.25) / G;
      const { a, lum } = at(u, v);
      const fade = fadeAt(v);
      // Toward the bottom, cells drop out at random as well as shrinking: a dissolve, not an edge.
      const keep = ((Math.sin(r * 127.1 + c * 311.7) * 43758.5453) % 1 + 1) % 1;
      if (a < 0.4 || fade < 0.02 || keep > fade * 1.15) continue;
      const l = Math.min(1, Math.max(0, (lum - lo) / (hi - lo)));
      // A slightly lifted floor: shadows keep visible dots instead of emptying out.
      const tone = (0.03 + 0.97 * Math.pow(inkIsDark ? 1 - l : l, 1.05)) * fade;
      const x = (u - 0.5) * 2;
      const y = -(v - 0.5) * 2;
      // Relief: a gentle head-and-shoulders curve, enough to turn in 3D. Kept shallow and
      // independent of brightness, or perspective pulls the features out of shape.
      const head = Math.max(0, 1 - (x * x) / 0.18 - ((y - 0.28) * (y - 0.28)) / 0.4);
      const body = Math.max(0, 1 - (x * x) / 0.95);
      const z = Math.sqrt(head) * 0.12 + Math.sqrt(body) * 0.05;
      const o = slots[n] * 4;
      out[o] = x;
      out[o + 1] = y;
      out[o + 2] = z;
      out[o + 3] = tone;
      n++;
    }
  }
  return G;
}
