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
          const d = document.documentElement;
          d.dataset.webgl = "off";
          if (d.dataset.intro === "play") d.dataset.intro = "done";
        });

    // During the boot sequence the page is waiting on WebGL, so start at once.
    if (document.documentElement.dataset.intro === "play") start();
    else (window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1)))(start, { timeout: 400 });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="world" />;
}
