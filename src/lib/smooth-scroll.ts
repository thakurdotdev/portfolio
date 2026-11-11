import Lenis, { type VirtualScrollData } from "lenis";
import { addTick } from "@/lib/ticker";

let lenis: Lenis | null = null;

/*
 * Stepped sections. Inside a run of registered elements (the projects, the experience
 * chapters), one wheel or trackpad gesture glides to the next or previous element instead
 * of scrolling freely. The rest of that gesture, a trackpad's momentum tail included, is
 * swallowed, so one flick moves one step. Desktop with a fine pointer only; touch, keys
 * and the scrollbar are left alone.
 */
const runs = new Set<HTMLElement[]>();
const step = { locked: false, animating: false, lastWheel: 0, lastAbs: 0 };
/* A pause this long ends a gesture. So does a sudden rise in speed (a new swipe while
   the last one's momentum is still fading): momentum only ever decays. */
const GESTURE_GAP = 450;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* The top to glide to from scroll position y in direction dir, or undefined to scroll freely. */
function stepTarget(run: HTMLElement[], y: number, dir: number) {
  const tops = run.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  const first = tops[0];
  const last = tops[tops.length - 1];
  const vh = window.innerHeight;
  const eps = 4;
  if (dir > 0) {
    if (y < first - eps) return first - y < vh * 0.75 ? first : undefined;
    if (y < last - eps) return tops.find((t) => t > y + eps);
    return undefined;
  }
  if (y > last + eps) return y - last < vh ? last : undefined;
  if (y > first + eps) return [...tops].reverse().find((t) => t < y - eps);
  return undefined;
}

function onWheel({ deltaY, event }: VirtualScrollData): boolean {
  if (!lenis || !runs.size || event.type !== "wheel" || event.ctrlKey) return true;
  if (!matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return true;

  const now = performance.now();
  const abs = Math.abs(deltaY);
  if (step.locked) {
    const gap = now - step.lastWheel;
    const rising = abs > 12 && abs > step.lastAbs * 1.6;
    step.lastWheel = now;
    step.lastAbs = abs;
    if (step.animating || (gap < GESTURE_GAP && !rising)) {
      event.preventDefault();
      return false;
    }
    step.locked = false;
  }

  const dir = Math.sign(deltaY);
  if (!dir) return true;
  // Where the page is heading, so a flick that is still easing counts where it will land.
  const y = lenis.targetScroll;
  let target: number | undefined;
  for (const run of runs) {
    target = stepTarget(run, y, dir);
    if (target !== undefined) break;
  }
  if (target === undefined) return true;

  event.preventDefault();
  step.locked = true;
  step.animating = true;
  step.lastWheel = now;
  step.lastAbs = abs;
  lenis.scrollTo(target, {
    duration: 0.95,
    easing: easeInOutCubic,
    lock: true,
    force: true,
    onComplete: () => {
      step.animating = false;
    },
  });
  return false;
}

/** Makes the given elements a stepped run. Returns a function that removes it. */
export function registerSteps(els: HTMLElement[]) {
  if (els.length) runs.add(els);
  return () => {
    runs.delete(els);
  };
}

/** Wheel scrolling eases a little, so scroll-driven scenes move without steps. Touch stays native. */
export function startSmoothScroll() {
  if (lenis || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.13, anchors: { offset: -64 }, virtualScroll: onWheel });
  const stop = addTick((time) => lenis?.raf(time), 0);
  return () => {
    stop();
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y });
}

export function scrollToEl(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -64 });
  else el.scrollIntoView();
}
