/*
 * One requestAnimationFrame loop for the whole page. Smooth scroll runs first, then the
 * scene tracker reads the settled scroll position, then WebGL draws: one frame, one order.
 */

type Tick = (time: number, dt: number) => void;

const ticks: { fn: Tick; order: number }[] = [];
let raf = 0;
let last = 0;

function loop(time: number) {
  const dt = last ? Math.min(time - last, 64) : 16.7;
  last = time;
  for (const t of ticks.slice()) t.fn(time, dt);
  raf = ticks.length ? requestAnimationFrame(loop) : 0;
}

/** Lower `order` runs first. Returns a function that removes the tick. */
export function addTick(fn: Tick, order = 0) {
  const entry = { fn, order };
  ticks.push(entry);
  ticks.sort((a, b) => a.order - b.order);
  if (!raf) {
    last = 0;
    raf = requestAnimationFrame(loop);
  }
  return () => {
    const i = ticks.indexOf(entry);
    if (i >= 0) ticks.splice(i, 1);
  };
}
