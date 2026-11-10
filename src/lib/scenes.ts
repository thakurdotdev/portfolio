import { addTick } from "@/lib/ticker";

/*
 * The page is a sequence of scenes. Any element with `data-scene` starts one:
 *
 *   data-scene="tunnel"               which shape the dots take
 *   data-stage="#a, #b"               where on screen they take it: the first of these
 *                                     elements that is laid out, or "viewport"
 *   data-label="Tunl"                 name in the scene rail
 *   data-alpha="0.5"                  optional, how strongly the dots show
 *
 * A scene becomes active when its element passes a line just below the middle of the
 * viewport. The dots then fly to its shape on their own time, so a shape is always whole
 * when the page stops. Everything here is plain DOM; WebGL and the rail only listen.
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SceneInfo {
  el: HTMLElement;
  kind: string;
  label: string;
  alpha: number;
  stage: string;
}

export interface SceneState {
  scenes: SceneInfo[];
  active: number;
  vw: number;
  vh: number;
  scrollY: number;
}

type Listener = (s: SceneState) => void;

const listeners = new Set<Listener>();
let scenes: SceneInfo[] = [];
let stop: (() => void) | null = null;

function collect() {
  scenes = [...document.querySelectorAll<HTMLElement>("[data-scene]")].map((el) => ({
    el,
    kind: el.dataset.scene!,
    label: el.dataset.label ?? el.dataset.scene!,
    alpha: Number(el.dataset.alpha ?? 1),
    stage: el.dataset.stage ?? "viewport",
  }));
}

/** The rect, in viewport pixels, where a scene is drawn. */
export function stageRect(scene: SceneInfo): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (scene.stage !== "viewport") {
    for (const el of document.querySelectorAll<HTMLElement>(scene.stage)) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
  }
  return { x: 0, y: 0, w: vw, h: vh };
}

function read(): SceneState | null {
  if (!scenes.length) return null;
  const vh = window.innerHeight;
  const line = vh * 0.62;
  let active = 0;
  for (let i = 0; i < scenes.length; i++) if (scenes[i].el.getBoundingClientRect().top <= line) active = i;
  return { scenes, active, vw: window.innerWidth, vh, scrollY: window.scrollY };
}

const onResize = () => collect();

/** Called every frame with the scene state. Starts the tracker on first use. */
export function onScenes(fn: Listener) {
  listeners.add(fn);
  if (!stop) {
    collect();
    window.addEventListener("resize", onResize);
    const remove = addTick(() => {
      const s = read();
      if (s) for (const l of listeners) l(s);
    }, 1);
    stop = () => {
      remove();
      window.removeEventListener("resize", onResize);
    };
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size && stop) {
      stop();
      stop = null;
    }
  };
}
