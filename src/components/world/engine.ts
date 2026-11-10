import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { onScenes, type Rect, type SceneState } from "@/lib/scenes";
import { addTick } from "@/lib/ticker";
import { loadPortrait, samplePortrait } from "./portrait";
import { FRAG, VERT } from "./shaders";

const KINDS: Record<string, number> = {
  scatter: 0,
  portrait: 1,
  tunnel: 2,
  lattice: 3,
  wave: 4,
  stack: 5,
  terrain: 6,
  orbit: 7,
  sphere: 8,
};

const FOV = 40;
const CAM_Z = 8;
const INTRO_MS = 1900;

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

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const damp = (from: number, to: number, rate: number, dt: number) => from + (to - from) * (1 - Math.exp(-rate * dt));

export function startWorld(canvas: HTMLCanvasElement, opts: { portrait: string }) {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const N = coarse || small ? 7200 : 15000;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch {
    root.dataset.webgl = "off";
    return () => {};
  }
  renderer.setClearColor(0x000000, 0);
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 2 : 1.75);
  renderer.setPixelRatio(dpr);

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);
  const scene = new Scene();

  // Attributes: everything a dot needs to find its place in any scene.
  const rand = rng(7);
  const seed = new Float32Array(N * 4);
  const extra = new Float32Array(N * 4);
  const ids = new Float32Array(N);
  const portrait = new Float32Array(N * 4).fill(-1);
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < 4; k++) seed[i * 4 + k] = rand();
    extra[i * 4] = rand();
    extra[i * 4 + 1] = rand();
    extra[i * 4 + 2] = 0.3 + rand() * 0.7;
    extra[i * 4 + 3] = rand();
    ids[i] = i;
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute("aSeed", new BufferAttribute(seed, 4));
  geo.setAttribute("aExtra", new BufferAttribute(extra, 4));
  geo.setAttribute("aId", new BufferAttribute(ids, 1));
  const portraitAttr = new BufferAttribute(portrait, 4);
  geo.setAttribute("aPortrait", portraitAttr);

  const u = {
    uTime: { value: 0 },
    uN: { value: N },
    uKindA: { value: 0 },
    uKindB: { value: 1 },
    uT: { value: 0 },
    uStageA: { value: [0, 0, 1] },
    uStageB: { value: [0, 0, 1] },
    uAlphaA: { value: 1 },
    uAlphaB: { value: 1 },
    uRot: { value: [0, 0] },
    uPointer: { value: [0, 0, 0] },
    uShock: { value: [0, 0, -10, 0] },
    uView: { value: [1, 1] },
    uCamZ: { value: CAM_Z },
    uScroll: { value: 0 },
    uVel: { value: 0 },
    uHi: { value: -1 },
    uSize: { value: coarse ? 2.6 : 2.4 },
    uDpr: { value: dpr },
    uDust: { value: 0.035 },
  };

  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: u,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    premultipliedAlpha: true,
  });

  const points = new Points(geo, material);
  points.frustumCulled = false;
  scene.add(points);

  // Sizes: world units per CSS pixel on the z = 0 plane.
  let vw = 0;
  let vh = 0;
  let wpp = 1;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === vw && Math.abs(h - vh) < 2) return;
    vw = w;
    vh = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const viewH = 2 * CAM_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
    wpp = viewH / h;
    u.uView.value = [viewH * camera.aspect, viewH];
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // The canvas is fixed to the viewport, so a DOM rect maps straight onto it.
  const toStage = (r: Rect, fill: boolean): [number, number, number] => {
    const cx = (r.x + r.w / 2 - vw / 2) * wpp;
    const cy = -(r.y + r.h / 2 - vh / 2) * wpp;
    const radius = (fill ? vh : Math.min(r.w, r.h)) * 0.5 * wpp;
    return [cx, cy, radius];
  };

  // The photo arrives after the first frame; the portrait scene shows a sphere until then.
  let photo: ImageData | null = null;
  const isDark = () => root.classList.contains("dark");
  const fillPortrait = () => {
    if (!photo) return;
    samplePortrait(photo, portrait, N, !isDark());
    portraitAttr.needsUpdate = true;
  };
  loadPortrait(opts.portrait)
    .then((d) => {
      photo = d;
      fillPortrait();
    })
    .catch(() => {});
  const themeWatch = new MutationObserver(fillPortrait);
  themeWatch.observe(root, { attributes: true, attributeFilter: ["class"] });

  // Pointer: tilt the shape towards it and push dots aside. Drag on a stage to turn it.
  const pointer = { x: 0, y: 0, nx: 0, ny: 0, on: 0, target: 0 };
  const spin = { yaw: 0, pitch: 0, vyaw: 0, dragging: false, lastX: 0, lastY: 0 };
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.nx = (e.clientX / vw) * 2 - 1;
    pointer.ny = (e.clientY / vh) * 2 - 1;
    pointer.target = e.pointerType === "mouse" ? 1 : 0;
    if (spin.dragging) {
      const dx = e.clientX - spin.lastX;
      const dy = e.clientY - spin.lastY;
      spin.lastX = e.clientX;
      spin.lastY = e.clientY;
      spin.vyaw = dx * 0.008;
      spin.yaw += dx * 0.008;
      spin.pitch = Math.max(-0.8, Math.min(0.8, spin.pitch + dy * 0.005));
    }
  };
  const onLeave = () => (pointer.target = 0);
  const onDown = (e: PointerEvent) => {
    const target = e.target as Element | null;
    if (target?.closest("[data-drag]")) {
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
      return;
    }
    // A click on empty page sends a ring through the dots.
    const target = e.target as Element | null;
    if (e.pointerType !== "mouse" || target?.closest("a, button, input, [role=tab], table, video")) return;
    u.uShock.value = [(e.clientX - vw / 2) * wpp, -(e.clientY - vh / 2) * wpp, time, 1];
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  // Hovering a process anywhere on the page lights its satellite.
  const onHighlight = (e: Event) => (u.uHi.value = (e as CustomEvent<number>).detail);
  window.addEventListener("world:highlight", onHighlight);

  // Frame state.
  let time = reduce ? 14 : 0;
  let introStart = -1;
  let introDone = reduce || !!location.hash || window.scrollY > 40;
  let lastScroll = window.scrollY;
  let vel = 0;
  let state: SceneState | null = null;
  let visible = !document.hidden;
  const onVis = () => (visible = !document.hidden);
  document.addEventListener("visibilitychange", onVis);

  const stopScenes = onScenes((s) => (state = s));

  const stopTick = addTick((now, dt) => {
    if (!visible || !state) return;
    const s = state;
    const sec = dt / 1000;
    if (!reduce) time += sec;
    u.uTime.value = time;

    // Scroll: position for the terrain and dust, velocity for the drag.
    const dy = s.scrollY - lastScroll;
    lastScroll = s.scrollY;
    vel = damp(vel, Math.max(-1, Math.min(1, dy / 60)), 10, sec);
    u.uScroll.value = s.scrollY;
    u.uVel.value = reduce ? 0 : vel;

    // Pointer.
    pointer.on = damp(pointer.on, reduce ? 0 : pointer.target, 6, sec);
    u.uPointer.value = [(pointer.x - vw / 2) * wpp, -(pointer.y - vh / 2) * wpp, pointer.on];

    if (!spin.dragging) {
      // Let go: keep turning a moment, then settle back.
      spin.yaw += spin.vyaw;
      spin.vyaw *= Math.pow(0.9, dt / 16.7);
      spin.yaw = damp(spin.yaw, 0, 1.6, sec);
      spin.pitch = damp(spin.pitch, 0, 2, sec);
    }
    const tilt = reduce ? [0, 0] : [pointer.nx * 0.32 * pointer.on, pointer.ny * 0.18 * pointer.on];
    const [ry, rx] = u.uRot.value;
    u.uRot.value = [damp(ry, tilt[0] + spin.yaw, 5, sec), damp(rx, tilt[1] + spin.pitch, 5, sec)];

    // Scenes.
    const A = s.scenes[s.a];
    const B = s.scenes[s.b];
    let kindA = KINDS[A.kind] ?? 0;
    let kindB = KINDS[B.kind] ?? 0;
    let stageA = toStage(s.rectA, A.stage === "viewport");
    let stageB = toStage(s.rectB, B.stage === "viewport");
    let alphaA = A.alpha;
    let alphaB = B.alpha;
    let t = s.t;

    // The first time: the dots gather from everywhere into the first scene.
    if (!introDone) {
      if (introStart < 0 && (photo || now > 1200)) introStart = now;
      const p = introStart < 0 ? 0 : Math.min(1, (now - introStart) / INTRO_MS);
      if (s.a !== 0 || s.t > 0.02 || p >= 1) introDone = true;
      else {
        kindB = kindA;
        stageB = stageA;
        alphaB = alphaA;
        kindA = KINDS.scatter;
        stageA = [0, 0, u.uView.value[1] / 2];
        alphaA = 0.6 * p;
        t = ease(p);
      }
    }

    u.uKindA.value = kindA;
    u.uKindB.value = kindB;
    u.uStageA.value = stageA;
    u.uStageB.value = stageB;
    u.uAlphaA.value = alphaA;
    u.uAlphaB.value = alphaB;
    u.uT.value = t;

    renderer.render(scene, camera);
  }, 2);

  root.dataset.webgl = "on";

  return () => {
    stopTick();
    stopScenes();
    ro.disconnect();
    themeWatch.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("world:highlight", onHighlight);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVis);
    geo.dispose();
    material.dispose();
    renderer.dispose();
  };
}
