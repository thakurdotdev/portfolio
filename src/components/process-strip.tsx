import type { CSSProperties } from "react";
import { projectSlug, serverSnapshot as snap } from "@/constants/server";

/**
 * `pm0 ls` as a row of pips: one per process online on my server. Mine are lit and link to
 * their project; the rest belong to other people and stay dim.
 */
export function ProcessStrip() {
  const others = snap.totalOnline - snap.processes.length;

  return (
    <div className="strip">
      <p className="font-mono text-[13px] text-muted">
        <span className="text-accent">$</span> <span className="strip-type">pm0 ls</span>
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <ul
          className="flex gap-[7px]"
          aria-label={`${snap.totalOnline} processes online on my server, ${snap.processes.length} of them mine`}
        >
          {snap.processes.map((p, i) => (
            <li key={p.id}>
              <a
                href={`#${projectSlug(p.project)}`}
                className="group relative block before:absolute before:-inset-[5px]"
                aria-label={`${p.app}, part of ${p.project}`}
              >
                <span className="pip" style={{ "--i": i } as CSSProperties} />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 font-mono text-[11px] text-bg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {p.app} {p.port.split(" ")[0]}
                </span>
              </a>
            </li>
          ))}
          {Array.from({ length: others }, (_, i) => (
            <li key={`other-${i}`} aria-hidden="true">
              <span className="pip pip-dim" style={{ "--i": snap.processes.length + i } as CSSProperties} />
            </li>
          ))}
        </ul>
        <p className="strip-count whitespace-nowrap text-[15px]">
          {/* The visible number counts up as the pips come online. */}
          <span className="strip-n inline-block min-w-[2ch] font-semibold tabular-nums" aria-hidden="true" />
          <span className="sr-only">{snap.totalOnline}</span> online
        </p>
      </div>
    </div>
  );
}
