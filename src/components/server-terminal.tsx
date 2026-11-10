"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/use-reduced-motion";
import { projectSlug, serverSnapshot as snap } from "@/constants/server";

/*
 * Two sessions:
 *  - "pm0 ls": a real snapshot of my server (see constants/server.ts), styled like pm0's own table.
 *  - "tunl":   the real command and output from the tunl README.
 */

const tunlLines: [string, string][][] = [
  [],
  [[">_ tunl", "text-fg"], ["  •  ", "text-dim"], ["● Online", "text-accent"]],
  [["─────────────────────────────────────────────", "text-dim"]],
  [["Account     ", "text-muted"], ["Anonymous Device", "text-fg"]],
  [["Forwarding  ", "text-muted"], ["http://localhost:3000", "text-fg"]],
  [["Public URL  ", "text-muted"], ["https://frosty-pine.tunl.online", "text-accent"]],
  [["Inspector   ", "text-muted"], ["https://tunl.online/inspect/frosty-pine", "text-accent"]],
  [["─────────────────────────────────────────────", "text-dim"]],
  [["Press Ctrl+C or Ctrl+D to stop the tunnel", "text-muted"]],
];

const sessions = [
  { id: "pm0", label: "pm0 ls", cmd: "pm0 ls", steps: snap.processes.length + 1 },
  { id: "tunl", label: "tunl", cmd: "ssh -p 2222 -R 80:localhost:3000 tunl.online", steps: tunlLines.length },
] as const;

/** Types `text`, then reveals `steps` items one by one. Runs only while `active`. */
function usePlayback(text: string, steps: number, active: boolean, key: string) {
  const reduce = usePrefersReducedMotion();
  const [chars, setChars] = useState(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setChars(0);
    setShown(0);
  }, [key]);

  useEffect(() => {
    if (reduce || !active) return;
    if (chars < text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), chars === 0 ? 500 : 45);
      return () => clearTimeout(t);
    }
    if (shown < steps) {
      const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 380 : 75);
      return () => clearTimeout(t);
    }
  }, [chars, shown, text, steps, active, reduce]);

  if (reduce) return { chars: text.length, shown: steps, typing: false, done: true };
  return { chars, shown, typing: chars < text.length, done: chars >= text.length && shown >= steps };
}

export function ServerTerminal({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tab, setTab] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const s = sessions[tab];
  const play = usePlayback(s.cmd, s.steps, inView && active, s.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-[14px] border border-line bg-surface text-fg">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-line bg-soft px-4 py-2.5">
          <div role="tablist" aria-label="Terminal sessions" className="flex gap-1">
            {sessions.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`term-tab-${t.id}`}
                aria-selected={i === tab}
                aria-controls={`term-panel-${t.id}`}
                onClick={() => setTab(i)}
                className={`relative cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-colors before:absolute before:-inset-1.5 ${
                  i === tab ? "bg-bg text-fg shadow-[0_0_0_1px_var(--color-line)]" : "text-muted hover:text-fg"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="ml-auto hidden font-mono text-[11px] text-dim sm:block">
            {tab === 0 ? `captured ${snap.capturedOn}` : "from the tunl README"}
          </span>
        </div>

        <div
          id={`term-panel-${s.id}`}
          role="tabpanel"
          aria-labelledby={`term-tab-${s.id}`}
          className="min-h-[392px] px-3 py-4 font-mono text-[11px] leading-[1.7] sm:min-h-[430px] sm:px-5 sm:text-[12.5px]"
        >
          <p className="truncate whitespace-pre">
            <span className="font-semibold text-accent">ubuntu@instance</span>
            <span className="text-muted">:</span>
            <span className="font-semibold text-accent">~</span>
            <span className="text-muted">$ </span>
            <span className="text-fg">{s.cmd.slice(0, play.chars)}</span>
            {play.typing && <Cursor />}
          </p>

          {s.id === "pm0" ? (
            <ProcessTable shown={play.shown} hovered={hovered} onHover={setHovered} />
          ) : (
            <div className="mt-1 overflow-x-auto">
              {tunlLines.map((parts, i) => (
                <p
                  key={i}
                  className={`whitespace-pre transition-opacity duration-200 ${i < play.shown ? "opacity-100" : "opacity-0"}`}
                >
                  {parts.length ? parts.map(([t, c], j) => <span key={j} className={c}>{t}</span>) : " "}
                </p>
              ))}
            </div>
          )}

          {play.done && (
            <p className="mt-2 whitespace-pre">
              <span className="font-semibold text-accent">ubuntu@instance</span>
              <span className="text-muted">:</span>
              <span className="font-semibold text-accent">~</span>
              <span className="text-muted">$ </span>
              <Cursor />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const cellBorder = "border-l border-line first:border-l-0";

function ProcessTable({
  shown,
  hovered,
  onHover,
}: {
  shown: number;
  hovered: string | null;
  onHover: (p: string | null) => void;
}) {
  const rowsVisible = Math.min(shown, snap.processes.length);
  const footerVisible = shown > snap.processes.length;

  // Columns drop away on narrow screens; app, status, uptime and mem always stay.
  const sm = "hidden sm:table-cell";
  const md = "hidden md:table-cell";

  return (
    <div className={`mt-2 overflow-hidden rounded-md border border-line transition-opacity duration-300 ${shown > 0 ? "opacity-100" : "opacity-0"}`}>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse whitespace-nowrap text-left tabular-nums">
        <caption className="sr-only">
          Processes on my server, captured {snap.capturedOn}. Each app links to its project.
        </caption>
        <thead>
          <tr className="border-b border-line text-fg [&>th]:px-2.5 [&>th]:py-2 [&>th]:font-semibold sm:[&>th]:px-3.5">
            <th scope="col" className={`${cellBorder} ${sm}`}>id</th>
            <th scope="col" className={cellBorder}>app</th>
            <th scope="col" className={`${cellBorder} ${md}`}>mode</th>
            <th scope="col" className={cellBorder}>status</th>
            <th scope="col" className={`${cellBorder} ${sm}`}>port</th>
            <th scope="col" className={`${cellBorder} ${md} text-right`}>pid</th>
            <th scope="col" className={cellBorder}>uptime</th>
            <th scope="col" className={`${cellBorder} ${md}`}><span aria-label="restarts">↺</span></th>
            <th scope="col" className={`${cellBorder} ${md} text-right`}>cpu</th>
            <th scope="col" className={`${cellBorder} hidden text-right min-[420px]:table-cell`}>mem</th>
          </tr>
        </thead>
        <tbody>
          {snap.processes.map((p, i) => {
            const lit = hovered === p.project;
            return (
              <tr
                key={p.id}
                onMouseEnter={() => onHover(p.project)}
                onMouseLeave={() => onHover(null)}
                className={`transition-[opacity,background-color] duration-200 [&>td]:px-2.5 [&>td]:py-[5px] sm:[&>td]:px-3.5 sm:[&>td]:py-[3px] ${
                  i < rowsVisible ? "opacity-100" : "opacity-0"
                } ${lit ? "bg-soft" : ""} ${i === 0 ? "[&>td]:pt-2.5" : ""} ${i === snap.processes.length - 1 ? "[&>td]:pb-2.5" : ""}`}
              >
                <td className={`${cellBorder} ${sm} text-fg`}>{p.id}</td>
                <td className={cellBorder}>
                  <a
                    href={`#${projectSlug(p.project)}`}
                    className="relative text-fg underline decoration-transparent before:absolute before:-inset-y-1.5 before:-inset-x-1 sm:before:-inset-y-1 underline-offset-4 transition-colors hover:decoration-line-strong"
                    aria-label={`${p.app}, part of ${p.project}. Jump to project`}
                  >
                    {p.app}
                  </a>
                  <span
                    aria-hidden="true"
                    className={`ml-2 hidden text-muted transition-opacity duration-200 lg:inline ${lit ? "opacity-100" : "opacity-0"}`}
                  >
                    → {p.project}
                  </span>
                </td>
                <td className={`${cellBorder} ${md} text-dim`}>{p.mode}</td>
                <td className={`${cellBorder} whitespace-nowrap font-semibold text-accent`}>● online</td>
                <td className={`${cellBorder} ${sm} whitespace-nowrap text-muted`}>{p.port}</td>
                <td className={`${cellBorder} ${md} text-right text-fg`}>{p.pid}</td>
                <td className={`${cellBorder} text-fg`}>{p.uptime}</td>
                <td className={`${cellBorder} ${md} ${p.restarts ? "font-semibold text-fg" : "text-dim"}`}>{p.restarts}</td>
                <td className={`${cellBorder} ${md} text-right text-fg`}>{p.cpu}</td>
                <td className={`${cellBorder} hidden text-right text-fg min-[420px]:table-cell`}>{p.mem}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      <div
        className={`grid gap-x-6 gap-y-0.5 border-t border-line px-2.5 py-2.5 text-muted transition-opacity duration-300 sm:grid-cols-2 sm:px-3.5 ${
          footerVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p>
          processes: <span className="font-semibold text-accent">{snap.totalOnline} online</span>{" "}
          <span className="text-dim">({snap.hidden} not mine to show)</span>
        </p>
        <p className="sm:text-right">
          host cpu: <span className="text-fg">{snap.host_cpu.split(" (")[0]}</span>
          <span className="hidden text-dim md:inline"> ({snap.host_cpu.split(" (")[1]}</span>
        </p>
        <p>
          app usage: <span className="text-fg">{snap.appUsage.cpu} cpu</span>,{" "}
          <span className="font-semibold text-fg">{snap.appUsage.mem} mem</span>
        </p>
        <p className="sm:text-right">
          host mem: <MemBar pct={snap.host_mem.pct} />{" "}
          <span className="text-fg">{snap.host_mem.label}</span>
        </p>
      </div>
    </div>
  );
}

function MemBar({ pct }: { pct: number }) {
  const filled = Math.round(pct / 10);
  return (
    <span aria-hidden="true" className="hidden whitespace-pre min-[420px]:inline">
      <span className="text-dim">[</span>
      <span className="text-accent">{"■".repeat(filled)}</span>
      <span className="text-dim">{"□".repeat(10 - filled)}</span>
      <span className="text-dim">]</span>
    </span>
  );
}

function Cursor() {
  return <span aria-hidden="true" className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-fg motion-safe:animate-pulse" />;
}
