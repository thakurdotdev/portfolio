"use client";

import { useEffect, useState } from "react";
import { onScenes } from "@/lib/scenes";
import { scrollToEl } from "@/lib/smooth-scroll";

/** One pip per scene down the right edge. The current one is lit; its name shows beside it. */
export function SceneRail() {
  const [items, setItems] = useState<{ label: string; el: HTMLElement }[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let last = -1;
    let count = 0;
    return onScenes((s) => {
      if (s.active !== last) {
        last = s.active;
        setActive(s.active);
      }
      if (s.scenes.length !== count) {
        count = s.scenes.length;
        setItems(s.scenes.map((x) => ({ label: x.label, el: x.el })));
      }
    });
  }, []);

  if (!items.length) return null;

  return (
    <nav aria-label="Scenes" className="rail nav-in fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 text-white mix-blend-difference lg:block xl:right-6">
      <ol className="flex flex-col items-end gap-1">
        {items.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => scrollToEl(it.el)}
              aria-current={i === active ? "step" : undefined}
              className="group flex cursor-pointer items-center gap-3 py-1 font-mono text-[11px]"
            >
              <span
                className={`transition-[opacity,transform] duration-300 ${
                  i === active
                    ? "translate-x-0 opacity-100"
                    : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                <span className="opacity-50">{String(i).padStart(2, "0")}</span> {it.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === active ? "h-2 w-2 bg-white" : "h-1.5 w-1.5 bg-white/35 group-hover:bg-white"
                }`}
              />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
