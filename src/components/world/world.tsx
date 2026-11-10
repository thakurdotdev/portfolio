"use client";

import { useEffect, useRef } from "react";

/*
 * The canvas that every scene on the page is drawn on. It sits over the content with
 * `mix-blend-mode: difference` and draws white dots, so a dot reads as ink on any
 * background: dark on the light theme, light on the dark theme and on inverted panels.
 * three.js loads after the page is up, so it never holds back the first paint.
 */
export function World() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let stop: (() => void) | undefined;
    let cancelled = false;

    const start = () =>
      import("./engine")
        .then(({ startWorld }) => {
          if (!cancelled) stop = startWorld(canvas, { portrait: "/pankaj-cutout.webp" });
        })
        .catch(() => {
          document.documentElement.dataset.webgl = "off";
        });

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    idle(start, { timeout: 400 });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="world" />;
}
