"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/constants";
import { projectSlug, serverSnapshot } from "@/constants/server";
import { registerSteps } from "@/lib/smooth-scroll";

type Watch = (video: { url: string; title: string }) => void;

const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const hostOf = (url?: string) => (url ? new URL(url).host : null);
const pad = (n: number) => String(n).padStart(2, "0");

/*
 * Wide screens: the text scrolls on the left while the right column holds one stage, where
 * the dots take each project's shape as it reaches the middle of the viewport. Phones: each
 * project has its own stage above its text.
 */
export function ProjectsFlow({ onWatch }: { onWatch: Watch }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    // On desktop, one scroll gesture moves one whole project.
    const unstep = registerSteps(items.current.filter((el): el is HTMLElement => !!el));
    return () => {
      io.disconnect();
      unstep();
    };
  }, []);

  const current = projects[active];

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-5">
        {projects.map((p, i) => (
          <ProjectText
            key={p.title}
            project={p}
            index={i}
            active={i === active}
            onWatch={onWatch}
            ref={(el) => {
              items.current[i] = el;
            }}
          />
        ))}
      </div>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-0 flex h-[100svh] flex-col pt-24 pb-10">
          <div id="stage-work" data-drag="" className="stage relative min-h-0 flex-1">
            <p
              key={current.title}
              aria-hidden="true"
              className="swap pointer-events-none absolute top-0 left-0 font-mono text-[11px] text-dim"
            >
              {pad(active + 1)} / {pad(projects.length)} · {current.architecture}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between gap-6 text-[15px]">
            <nav aria-label="Projects" className="flex items-center gap-[7px]">
              {projects.map((p, i) => (
                <a
                  key={p.title}
                  href={`#${projectSlug(p.title)}`}
                  aria-label={p.title}
                  aria-current={i === active ? "true" : undefined}
                  className="relative before:absolute before:-inset-[5px]"
                >
                  <span className={`pip transition-colors duration-300 ${i === active ? "" : "pip-dim"}`} />
                </a>
              ))}
            </nav>
            <p className="text-muted" aria-live="polite">
              {current.title}, {hostOf(current.live) ?? "self-hosted"}
              <span className="text-dim"> · drag to turn</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A screenshot that leans towards the pointer and takes its colour back while you look at it. */
function Shot({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="shot-wrap mt-10 lg:mt-0">
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="shot relative aspect-[16/10]">
        <Image
          src={project.image}
          alt={`${project.title} home page`}
          fill
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function ProjectText({
  project,
  index,
  active,
  onWatch,
  ref,
}: {
  project: Project;
  index: number;
  active: boolean;
  onWatch: Watch;
  ref: (el: HTMLElement | null) => void;
}) {
  const slug = projectSlug(project.title);
  const processes = serverSnapshot.processes.filter((p) => p.project === project.title);
  const host = hostOf(project.live);

  return (
    <article
      ref={ref}
      id={slug}
      data-index={index}
      data-active={active}
      data-scene={project.scene}
      data-stage={`#stage-${slug}, #stage-work`}
      data-label={project.title}
      aria-labelledby={`${slug}-title`}
      className="border-b border-line py-16 transition-opacity duration-500 last:border-b-0 sm:py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:border-b-0 lg:pt-20 lg:pb-8 lg:data-[active=false]:opacity-25"
    >
      <p className="font-mono text-[12px] text-dim">
        {pad(index + 1)} / {pad(projects.length)}
        <span className="lg:hidden"> · {project.architecture}</span>
      </p>
      <h3 id={`${slug}-title`} className="project-title display display-xl mt-4 -ml-[0.05em] lg:text-[clamp(3.25rem,min(6.4vw,11svh),7rem)]">
        {project.title}
      </h3>
      <p className="lead mt-5 max-w-[34ch] lg:mt-4">{project.blurb}</p>

      {/* The phone layout's stage. Hidden on wide screens, where the shared one takes over. */}
      <div id={`stage-${slug}`} data-drag="" className="stage -mx-5 mt-8 aspect-[5/4] sm:-mx-8 lg:hidden" aria-hidden="true" />

      <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] lg:mt-5">
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="link">
            Visit {host}
          </a>
        )}
        {project.demo && (
          <button
            type="button"
            onClick={() => onWatch({ url: project.demo!, title: project.title })}
            className="link cursor-pointer"
          >
            Watch the demo
          </button>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="link">
            Source on GitHub
          </a>
        )}
      </p>

      <ul className="mt-10 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-3 lg:mt-7">
        {project.facts.map((f) => (
          <li key={f} className="border-t border-line-strong pt-3 font-medium">
            {f}
          </li>
        ))}
      </ul>

      {/* On desktop the details and the screenshot share a row, so a project fits one screen. */}
      <div className="lg:mt-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-6">
        <div>
          <p className="mt-6 max-w-[48ch] text-[15px] text-muted lg:mt-0 lg:text-[14px]">Built with {list(project.tech)}.</p>

          {processes.length > 0 && (
            <div className="mt-6 lg:mt-4">
              <p className="text-[15px] text-dim lg:text-[14px]">On my server now</p>
              <ul className="mt-2 font-mono text-[13px] lg:text-[12px]">
                {processes.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-1 lg:py-0.5">
                    <span className="dot" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{p.app}</span>
                    <span className="hidden text-dim min-[420px]:inline lg:hidden">{p.port.split(" ")[0]}</span>
                    <span className="w-14 text-right text-muted">up {p.uptime}</span>
                    <span className="w-[4.5rem] text-right text-muted lg:hidden">{p.mem.replace("mb", " MB")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Shot project={project} />
      </div>
    </article>
  );
}
