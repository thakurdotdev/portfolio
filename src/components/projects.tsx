"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProjectScreen } from "@/components/project-screen";
import { projects, type Project } from "@/constants";
import { projectSlug, serverSnapshot } from "@/constants/server";

type Watch = (video: { url: string; title: string }) => void;

const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const hostOf = (url?: string) => (url ? new URL(url).host : null);

// Stable references: the screen sets up WebGL once per list of images.
const screenImages = projects.map((p) => p.image);
const screenAlts = projects.map((p) => `${p.title} home page`);

/*
 * Wide screens: the text scrolls on the left while one screen stays on the right and changes
 * to the project in the middle of the viewport. The project in view is full strength; the
 * others step back. Phones: a plain list, each project with its own screenshot.
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
      // A line across the middle of the viewport.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
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
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center pt-16">
          <ProjectScreen
            images={screenImages}
            alts={screenAlts}
            active={active}
          />
          <div className="mt-5 flex items-center justify-between gap-6 text-[15px]">
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
            </p>
          </div>
        </div>
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
      aria-labelledby={`${slug}-title`}
      className="border-b border-line py-14 transition-opacity duration-500 last:border-b-0 sm:py-20 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:border-b-0 lg:py-0 lg:pt-16 lg:data-[active=false]:opacity-25"
    >
      <h3 id={`${slug}-title`} className="project-title display display-l -ml-[0.04em]">
        {project.title}
      </h3>
      <p className="lead mt-5 max-w-[34ch]">{project.blurb}</p>

      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
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

      <div className="relative mt-8 aspect-[7/5] overflow-hidden rounded-[14px] bg-surface lg:hidden">
        <Image
          src={project.image}
          alt={`${project.title} home page`}
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <ul className="mt-8 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-3 lg:mt-10">
        {project.facts.map((f) => (
          <li key={f} className="border-t border-line pt-3 font-medium">
            {f}
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-[48ch] text-[15px] text-muted">Built with {list(project.tech)}.</p>

      {processes.length > 0 && (
        <div className="mt-6">
          <p className="text-[15px] text-dim">On my server now</p>
          <ul className="mt-2 font-mono text-[13px]">
            {processes.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-1">
                <span className="dot" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{p.app}</span>
                <span className="hidden text-dim min-[420px]:inline">{p.port.split(" ")[0]}</span>
                <span className="w-14 text-right text-muted">up {p.uptime}</span>
                <span className="w-[4.5rem] text-right text-muted">{p.mem.replace("mb", " MB")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
