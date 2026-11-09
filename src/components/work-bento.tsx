"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/constants";
import { projectSlug, serverSnapshot } from "@/constants/server";

export function WorkBento({
  projects,
  onWatch,
}: {
  projects: Project[];
  onWatch: (p: { url: string; title: string }) => void;
}) {
  return (
    <div className="bezel">
      <ul className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.title} className="min-w-0">
            <WorkTile project={p} onWatch={onWatch} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkTile({
  project: p,
  onWatch,
}: {
  project: Project;
  onWatch: (p: { url: string; title: string }) => void;
}) {
  const videoOnly = Boolean(p.demo && !p.live);
  const openVideo = () => onWatch({ url: p.demo!, title: p.title });
  const processes = serverSnapshot.processes.filter((s) => s.project === p.title);
  const isSupervisor = p.title === "pm0";

  return (
    <article
      id={projectSlug(p.title)}
      className="tile group flex h-full scroll-mt-28 flex-col"
      style={{ "--tile-accent": p.accent } as CSSProperties}
    >
      {/* Stage: the project's colour as ambient light, screenshot rising from the bottom edge. */}
      <div className="relative h-[210px] overflow-hidden border-b border-line px-7 pt-7 sm:h-[250px] sm:px-10 sm:pt-9">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-55 dark:group-hover:opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 80% at 50% 110%, color-mix(in oklab, var(--tile-accent) 34%, transparent), transparent 72%)",
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={videoOnly ? openVideo : () => window.open(p.live ?? p.repo, "_blank", "noopener")}
          className="relative block h-full w-full cursor-pointer overflow-hidden rounded-t-[10px] bg-zinc-900 shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] ring-1 ring-black/10 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none dark:ring-white/12"
        >
          <Image
            src={p.image}
            alt=""
            width={1396}
            height={999}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 560px"
            className="h-full w-full object-cover object-top"
            style={p.zoom && p.zoom !== 1 ? { transform: `scale(${p.zoom})`, transformOrigin: "50% 0%" } : undefined}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
          <div className="flex items-center gap-4 text-sm">
            {p.live && (
              <TextLink href={p.live}>{p.live.replace(/^https:\/\//, "")}</TextLink>
            )}
            {videoOnly && (
              <button
                type="button"
                onClick={openVideo}
                className="relative cursor-pointer text-fg underline decoration-line-strong underline-offset-4 transition-colors before:absolute before:-inset-2 hover:decoration-fg"
              >
                Watch demo
              </button>
            )}
            {p.repo && <TextLink href={p.repo}>Source</TextLink>}
          </div>
        </div>

        <p className="mt-1 text-sm text-muted">{p.subtitle}</p>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-fg/85">{p.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${p.title} highlights`}>
          {p.facts.map((f) => (
            <li key={f} className="surface-card rounded-lg px-2.5 py-1 text-xs text-muted">
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4 font-mono text-[11.5px] text-muted-dim">
            {isSupervisor ? (
              <span>supervises every process on my server</span>
            ) : processes.length > 0 ? (
              <>
                <span>running as</span>
                {processes.map((s) => (
                  <span key={s.app} className="inline-flex items-center gap-1.5 text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                    {s.app}
                  </span>
                ))}
              </>
            ) : (
              <span>{p.tech.slice(0, 4).join(" · ")}</span>
            )}
          </p>
        </div>
      </div>
    </article>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative text-fg underline decoration-line-strong underline-offset-4 transition-colors before:absolute before:-inset-2 hover:decoration-fg"
    >
      {children}
      <span aria-hidden="true" className="ml-0.5 text-muted">↗</span>
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
