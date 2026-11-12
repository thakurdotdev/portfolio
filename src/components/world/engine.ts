import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  FloatType,
  HalfFloatType,
  NearestFilter,
  PerspectiveCamera,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { onScenes, stageRect, type Rect, type SceneInfo, type SceneState } from "@/lib/scenes";
import { addTick } from "@/lib/ticker";
import { layoutBoot, type BootLayout } from "./boot-text";
import { loadPortrait, samplePortrait } from "./portrait";
import { FRAG, POSITION, VELOCITY, VERT } from "./shaders";

const KINDS: Record<string, number> = {
  scatter: 0,
  portrait: 1,
  tunnel: 2,
  supervisor: 3,
  wave: 4,
  pipeline: 5,
  workflow: 6,
  clock: 7,
  boot: 13,
  outbox: 9,
  encrypt: 10,
  screen: 11,
  chat: 12,
};

const FOV = 40;
const CAM_Z = 8;
const SIZE = 2.6;
/* Share of dots that drift free of the scenes, as faint dust. */
const DUST = 0.02;

/* A seeded random, so the dots sit in the same places on every visit. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const damp = (from: number, to: number, rate: number, dt: number) => from + (to - from) * (1 - Math.exp(-rate * dt));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function dataTexture(data: Float32Array, S: number) {
  const t = new DataTexture(data, S, S, RGBAFormat, FloatType);
  t.minFilter = t.magFilter = NearestFilter;
  t.needsUpdate = true;
  return t;
}

/* A 5×7 dot-matrix font, one string of 35 bits per digit. */
const GLYPHS = [
  "01110100011001110101110011000101110",
  "00100011000010000100001000010001110",
  "01110100010000100010001000100011111",
  "11110000010000101110000010000111110",
  "00010001100101010010111110001000010",
  "11111100001111000001000011000101110",
  "00110010001000011110100011000101110",
  "11111000010001000100010000100001000",
  "01110100011000101110100011000101110",
  "01110100011000101111000010001001100",
];

const clockFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

/*
 * Lays out "HHMM" as LEDs: lit ones get most of the dots, unlit ones a few, so the whole
 * display reads as a panel. Unit space: the stage is 2 tall. Returns the display width.
 */
function layoutClock(hhmm: string, out: Float32Array, slots: Int32Array) {
  const n = slots.length;
  const pitch = 0.225;
  const leds: { x: number; y: number; w: number }[] = [];
  // Columns: digit, gap, digit, gap, colon, gap, digit, gap, digit.
  const plan = [0, -1, 1, -1, "c", -1, 2, -1, 3] as const;
  let col = 0;
  for (const item of plan) {
    if (item === -1) {
      col += 1;
      continue;
    }
    if (item === "c") {
      for (let r = 0; r < 7; r++) leds.push({ x: col, y: r, w: r === 2 || r === 4 ? 2 : 0.13 });
      col += 1;
      continue;
    }
    const g = GLYPHS[Number(hhmm[item])];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) leds.push({ x: col + c, y: r, w: g[r * 5 + c] === "1" ? 1 : 0.13 });
    col += 5;
  }
  const cols = col;
  const lit = leds.filter((l) => l.w >= 1);
  const unlit = leds.filter((l) => l.w < 1);
  const litShare = Math.floor(n * 0.74);
  let i = 0;
  const place = (group: typeof leds, count: number, radius: number) => {
    group.forEach((l, gi) => {
      const m = Math.floor(count / group.length) + (gi < count % group.length ? 1 : 0);
      for (let k = 0; k < m && i < n; k++, i++) {
        const rr = Math.sqrt((k + 0.5) / m) * radius;
        const an = k * 2.39996323;
        const o = slots[i] * 4;
        out[o] = (l.x - (cols - 1) / 2) * pitch + Math.cos(an) * rr;
        out[o + 1] = (3 - l.y) * pitch + 0.14 + Math.sin(an) * rr;
        out[o + 2] = l.w >= 1 ? 0.05 : 0;
        out[o + 3] = l.w;
      }
    });
  };
  place(lit, litShare, pitch * 0.36);
  place(unlit, n - litShare, pitch * 0.26);
  return cols * pitch;
}

export function startWorld(canvas: HTMLCanvasElement, opts: { portrait: string; onReady?: () => void }) {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  // Every dot is one texel of an S×S texture.
  const S = coarse || small ? 90 : 128;
  const N = S * S;

  const fail = () => {
    root.dataset.webgl = "off";
    if (root.dataset.intro === "play") root.dataset.intro = "done";
    return () => {};
  };

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch {
    return fail();
  }
  const floatRT = renderer.extensions.has("EXT_color_buffer_float");
  if (!floatRT && !renderer.extensions.has("EXT_color_buffer_half_float")) {
    renderer.dispose();
    return fail();
  }
  renderer.setClearColor(0x000000, 0);
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 2 : 1.75);
  renderer.setPixelRatio(dpr);

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);
  const scene = new Scene();

  // Per-dot constants.
  const rand = rng(7);
  const seed = new Float32Array(N * 4);
  const extra = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) seed[i] = rand();
  for (let i = 0; i < N * 4; i++) extra[i] = rand();
  const portraitData = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) portraitData[i * 4 + 3] = -1;
  const tSeed = dataTexture(seed, S);
  const tExtra = dataTexture(extra, S);
  // Dots that take part in scenes. The rest (extra.x < DUST) only drift, so the scenes with
  // one dot per cell (the portrait, the clock) are laid out on these alone.
  const slots = Int32Array.from({ length: N }, (_, i) => i).filter((i) => extra[i * 4] >= DUST);
  const tPortrait = dataTexture(portraitData, S);
  const clockData = new Float32Array(N * 4);
  const tClock = dataTexture(clockData, S);
  const textData = new Float32Array(N * 4);
  const tText = dataTexture(textData, S);

  // World units per CSS pixel on the z = 0 plane.
  let vw = 0;
  let vh = 0;
  let wpp = 1;
  const viewH = 2 * CAM_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === vw && Math.abs(h - vh) < 2) return;
    vw = w;
    vh = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wpp = viewH / h;
  };
  resize();

  // The canvas is fixed to the viewport, so a DOM rect maps straight onto it.
  const toStage = (r: Rect, fill: boolean): [number, number, number] => [
    (r.x + r.w / 2 - vw / 2) * wpp,
    -(r.y + r.h / 2 - vh / 2) * wpp,
    (fill ? vh : Math.min(r.w, r.h)) * 0.5 * wpp,
  ];
  const stageOf = (s: SceneInfo) => toStage(stageRect(s), s.stage === "viewport");

  // The simulation: positions (xyz, opacity) and velocities (xyz, size).
  const gpu = new GPUComputationRenderer(S, S, renderer);
  if (!floatRT) gpu.setDataType(HalfFloatType);
  const posVar = gpu.addVariable("tPos", POSITION, gpu.createTexture());
  const velVar = gpu.addVariable("tVel", VELOCITY, gpu.createTexture());
  gpu.setVariableDependencies(posVar, [posVar, velVar]);
  gpu.setVariableDependencies(velVar, [posVar, velVar]);

  // Shared uniform objects: setting `.value` once updates both passes.
  const shared = {
    uTime: { value: 0 },
    uN: { value: N },
    uSec: { value: 0 },
    uClockW: { value: 5.6 },
    uGrid: { value: 100 },
    uWpp: { value: wpp },
    uSize: { value: SIZE },
    uRot: { value: [0, 0] },
    uKindA: { value: 1 },
    uKindB: { value: 1 },
    uStageA: { value: [0, 0, 1] },
    uStageB: { value: [0, 0, 1] },
    uAlphaA: { value: 1 },
    uAlphaB: { value: 1 },
    uSwitch: { value: -10 },
    uDt: { value: 1 / 60 },
    uSnap: { value: reduce ? 1 : 0 },
    tSeed: { value: tSeed },
    tExtra: { value: tExtra },
    tPortrait: { value: tPortrait },
    tClock: { value: tClock },
    tText: { value: tText },
    uTyped: { value: 0 },
    uChars: { value: 1 },
    uCursor: { value: [0, 0] },
  };
  const velU = {
    uPointer: { value: [0, 0, 0] },
    uPointerVel: { value: [0, 0] },
    uShock: { value: [0, 0, -10, 0] },
  };
  const posU = { uShiftA: { value: [0, 0, 0] }, uShiftB: { value: [0, 0, 0] } };
  Object.assign(velVar.material.uniforms, shared, velU);
  Object.assign(posVar.material.uniforms, shared, posU);
  if (gpu.init() !== null) {
    renderer.dispose();
    return fail();
  }

  // What is drawn: one point per texel.
  const refs = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    refs[i * 2] = ((i % S) + 0.5) / S;
    refs[i * 2 + 1] = (Math.floor(i / S) + 0.5) / S;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute("aRef", new BufferAttribute(refs, 2));
  const drawU = {
    tPos: { value: null as unknown },
    tVel: { value: null as unknown },
    tSeed: { value: tSeed },
    tExtra: { value: tExtra },
    uTime: shared.uTime,
    uView: { value: [1, 1] },
    uCamZ: { value: CAM_Z },
    uScroll: { value: 0 },
    uDpr: { value: dpr },
    uDust: { value: DUST },
    uSize: shared.uSize,
  };
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: drawU,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    premultipliedAlpha: true,
  });
  const points = new Points(geo, material);
  points.frustumCulled = false;
  scene.add(points);

  // Every dot starts in one point and bursts out of it.
  const burst = (center: [number, number, number]) => {
    const pos = new Float32Array(N * 4);
    const vel = new Float32Array(N * 4);
    const r = rng(11);
    for (let i = 0; i < N; i++) {
      const u = r() * 2 - 1;
      const a = r() * Math.PI * 2;
      const q = Math.sqrt(1 - u * u);
      const dir = [q * Math.cos(a), u, q * Math.sin(a)];
      const speed = center[2] * (1.5 + Math.pow(r(), 2) * 9);
      pos[i * 4] = center[0] + dir[0] * 0.01;
      pos[i * 4 + 1] = center[1] + dir[1] * 0.01;
      pos[i * 4 + 2] = dir[2] * 0.01;
      vel[i * 4] = dir[0] * speed;
      vel[i * 4 + 1] = dir[1] * speed;
      vel[i * 4 + 2] = dir[2] * speed;
      vel[i * 4 + 3] = 1.2;
    }
    const tp = dataTexture(pos, S);
    const tv = dataTexture(vel, S);
    for (const rt of posVar.renderTargets) gpu.renderTexture(tp, rt);
    for (const rt of velVar.renderTargets) gpu.renderTexture(tv, rt);
    tp.dispose();
    tv.dispose();
  };

  // The photo. Resampled when the theme flips, and the dots flow to the new halftone.
  let photo: ImageData | null = null;
  const fillPortrait = () => {
    if (!photo) return;
    shared.uGrid.value = samplePortrait(photo, portraitData, slots, !root.classList.contains("dark"));
    tPortrait.needsUpdate = true;
  };
  const themeWatch = new MutationObserver(fillPortrait);
  themeWatch.observe(root, { attributes: true, attributeFilter: ["class"] });

  // Pointer: tilt the shape towards it, push and stir dots. Drag a stage to turn it.
  const pointer = { x: -1e4, y: -1e4, lx: -1e4, ly: -1e4, nx: 0, ny: 0, on: 0, target: 0, vx: 0, vy: 0 };
  const spin = { yaw: 0, pitch: 0, vyaw: 0, dragging: false, lastX: 0, lastY: 0 };
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.nx = (e.clientX / vw) * 2 - 1;
    pointer.ny = (e.clientY / vh) * 2 - 1;
    pointer.target = e.pointerType === "mouse" || spin.dragging ? 1 : 0;
    if (spin.dragging) {
      const dx = e.clientX - spin.lastX;
      const dy = e.clientY - spin.lastY;
      spin.lastX = e.clientX;
      spin.lastY = e.clientY;
      spin.vyaw = dx * 0.008;
      spin.yaw += dx * 0.008;
      spin.pitch = clamp(spin.pitch + dy * 0.005, -0.8, 0.8);
    }
  };
  const onLeave = () => (pointer.target = 0);
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element | null)?.closest("[data-drag]")) {
      spin.dragging = true;
      spin.lastX = e.clientX;
      spin.lastY = e.clientY;
      root.dataset.dragging = "true";
    }
  };
  const onUp = (e: PointerEvent) => {
    if (spin.dragging) {
      spin.dragging = false;
      delete root.dataset.dragging;
      if (e.pointerType !== "mouse") pointer.target = 0;
      return;
    }
    // A click on empty page sends a ring through the dots.
    const target = e.target as Element | null;
    if (e.pointerType !== "mouse" || target?.closest("a, button, input, [role=tab], table, video")) return;
    velU.uShock.value = [(e.clientX - vw / 2) * wpp, -(e.clientY - vh / 2) * wpp, time, 1];
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("pointercancel", onUp, { passive: true });
  root.addEventListener("pointerleave", onLeave);

  // The clock: redrawn when the minute turns; the seconds run in the shader.
  let shownMinute = "";
  const updateClock = () => {
    const now = new Date();
    const parts = clockFmt.formatToParts(now);
    const hh = parts.find((x) => x.type === "hour")?.value ?? "00";
    const mm = parts.find((x) => x.type === "minute")?.value ?? "00";
    shared.uSec.value = now.getSeconds() + now.getMilliseconds() / 1000;
    const key = (hh + mm).slice(-4).padStart(4, "0");
    if (key === shownMinute) return;
    shownMinute = key;
    shared.uClockW.value = layoutClock(key, clockData, slots);
    tClock.needsUpdate = true;
  };

  // Frame state.
  let time = 0;
  let started = false;
  let current = 0;
  let previous = 0;
  let lastA: [number, number, number] | null = null;
  let lastB: [number, number, number] | null = null;
  let state: SceneState | null = null;
  let visible = !document.hidden;
  const onVis = () => (visible = !document.hidden);
  document.addEventListener("visibilitychange", onVis);
  const stopScenes = onScenes((s) => (state = s));

  // The boot sequence (first visit): the command is typed full screen, then becomes the page.
  const BOOT = -1;
  const TYPE_AT = 0.45;
  const PER_CHAR = 0.07;
  const HOLD = 0.9;
  // Seconds of boot shown so far. It advances by real frame time, so a slow device does not
  // stretch the sequence, but at most 0.1s a frame, so a stall (the GPU finishing its shader
  // compiles, a few frames in) pauses the typing instead of skipping it.
  let bootT = 0;
  // Nothing counts as on screen until frames come back to back.
  let drawn = 0;
  let lastDraw = 0;
  let bootLayout: BootLayout | null = null;
  const bootStage = (): [number, number, number] => [0, 0, vh * 0.5 * wpp];

  const start = () => {
    if (started) return;
    if (!state) {
      requestAnimationFrame(start);
      return;
    }
    started = true;
    fillPortrait();
    const booting = root.dataset.intro === "play" && !reduce;
    if (booting) {
      const lines = vw / vh < 0.9 ? ["$ pm0 start", "portfolio"] : ["$ pm0 start portfolio"];
      bootLayout = layoutBoot(lines, textData, slots, vw / vh);
      tText.needsUpdate = true;
      shared.uChars.value = bootLayout.chars;
      current = previous = BOOT;
      // Every dot starts where the loading caret was, in the middle of the screen.
      burst([0, 0, 0.0001]);
    } else {
      current = previous = state.active;
      if (root.dataset.intro === "play") root.dataset.intro = "done";
      if (!reduce) burst(stageOf(state.scenes[current]));
    }
    opts.onReady?.();
  };

  // Wait for the photo (not for long), then burst.
  const photoReady = loadPortrait(opts.portrait)
    .then((d) => {
      photo = d;
      if (started) fillPortrait();
    })
    .catch(() => {});
  if (root.dataset.intro === "play") start();
  else Promise.race([photoReady, new Promise((r) => setTimeout(r, 1500))]).then(start);

  const stopTick = addTick((_now, dtMs) => {
    if (!visible || !state || !started) return;
    resize();
    const s = state;
    const dt = Math.min(dtMs / 1000, 1 / 30);
    time += dt;
    shared.uTime.value = reduce ? 14 : time;
    shared.uDt.value = dt;
    shared.uWpp.value = wpp;
    updateClock();
    drawU.uScroll.value = s.scrollY;
    drawU.uView.value = [viewH * camera.aspect, viewH];

    if (current === BOOT && bootLayout) {
      // Type the command, hold a beat, then hand over to the page.
      if (root.dataset.webgl) bootT += Math.min((performance.now() - lastDraw) / 1000, 0.1);
      const bt = bootT;
      const typed = Math.max(0, Math.min(bootLayout.chars, Math.floor((bt - TYPE_AT) / PER_CHAR)));
      shared.uTyped.value = typed;
      shared.uCursor.value = bootLayout.cursors[typed];
      // Also hand over if the page's own watchdog already ended the intro.
      if (bt > TYPE_AT + bootLayout.chars * PER_CHAR + HOLD || root.dataset.intro !== "play") {
        previous = BOOT;
        current = s.active;
        shared.uSwitch.value = time;
        lastA = lastB;
        root.dataset.intro = "done";
      }
    } else if (s.active !== current) {
      // A new scene: dots that had not yet left for the last one now leave from where it is.
      previous = current;
      current = s.active;
      shared.uSwitch.value = time;
      lastA = lastB;
    }
    const spec = (i: number) =>
      i === BOOT
        ? { kind: KINDS.boot, stage: bootStage(), alpha: 1 }
        : { kind: KINDS[s.scenes[i].kind] ?? 0, stage: stageOf(s.scenes[i]), alpha: s.scenes[i].alpha };
    const A = spec(previous);
    const B = spec(current);
    const stA = A.stage;
    const stB = B.stage;
    posU.uShiftA.value = lastA ? [stA[0] - lastA[0], stA[1] - lastA[1], 0] : [0, 0, 0];
    posU.uShiftB.value = lastB ? [stB[0] - lastB[0], stB[1] - lastB[1], 0] : [0, 0, 0];
    lastA = stA;
    lastB = stB;
    shared.uKindA.value = A.kind;
    shared.uKindB.value = B.kind;
    shared.uStageA.value = stA;
    shared.uStageB.value = stB;
    shared.uAlphaA.value = A.alpha;
    shared.uAlphaB.value = B.alpha;

    // Pointer, and how fast it is moving.
    pointer.on = damp(pointer.on, reduce ? 0 : pointer.target, 6, dt);
    const tracked = pointer.lx > -1e3;
    pointer.vx = damp(pointer.vx, tracked ? ((pointer.x - pointer.lx) * wpp) / dt : 0, 12, dt);
    pointer.vy = damp(pointer.vy, tracked ? (-(pointer.y - pointer.ly) * wpp) / dt : 0, 12, dt);
    pointer.lx = pointer.x;
    pointer.ly = pointer.y;
    velU.uPointer.value = [(pointer.x - vw / 2) * wpp, -(pointer.y - vh / 2) * wpp, pointer.on];
    velU.uPointerVel.value = [clamp(pointer.vx, -8, 8), clamp(pointer.vy, -8, 8)];

    if (!spin.dragging) {
      // Let go: keep turning a moment, then settle back.
      spin.yaw += spin.vyaw;
      spin.vyaw *= Math.pow(0.9, dt * 60);
      spin.yaw = damp(spin.yaw, 0, 1.4, dt);
      spin.pitch = damp(spin.pitch, 0, 2, dt);
    }
    const tilt = coarse ? 0 : pointer.on;
    const [ry, rx] = shared.uRot.value;
    shared.uRot.value = reduce
      ? [0, 0]
      : [damp(ry, pointer.nx * 0.35 * tilt + spin.yaw, 5, dt), damp(rx, pointer.ny * 0.2 * tilt + spin.pitch, 5, dt)];

    gpu.compute();
    drawU.tPos.value = gpu.getCurrentRenderTarget(posVar).texture;
    drawU.tVel.value = gpu.getCurrentRenderTarget(velVar).texture;
    renderer.render(scene, camera);
    // Only once frames flow is something on screen: the loading caret gives way, and the boot
    // clock starts.
    const at = performance.now();
    if (at - lastDraw < 100) drawn++;
    lastDraw = at;
    if (drawn >= 3 && !root.dataset.webgl) root.dataset.webgl = "on";
  }, 2);

  return () => {
    stopTick();
    stopScenes();
    themeWatch.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    root.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVis);
    gpu.dispose();
    geo.dispose();
    material.dispose();
    tSeed.dispose();
    tExtra.dispose();
    tPortrait.dispose();
    tClock.dispose();
    tText.dispose();
    renderer.dispose();
  };
}
