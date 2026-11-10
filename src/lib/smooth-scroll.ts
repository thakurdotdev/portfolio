import Lenis from "lenis";
import { addTick } from "@/lib/ticker";

let lenis: Lenis | null = null;

/** Wheel scrolling eases a little, so scroll-driven scenes move without steps. Touch stays native. */
export function startSmoothScroll() {
  if (lenis || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.13, anchors: { offset: -64 } });
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
