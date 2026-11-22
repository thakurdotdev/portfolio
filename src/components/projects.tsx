"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/constants";
import { projectSlug, serverSnapshot } from "@/constants/server";
import { registerSteps } from "@/lib/smooth-scroll";
import { Facts, Specs } from "./facts";
import { StageHead } from "./stage-head";

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
        <div className="stage-col sticky top-0 flex h-[100svh] flex-col pt-24 pb-10">
          <StageHead
            key={current.title}
            index={active}
            count={projects.length}
            title={current.title}
            sub={current.subtitle}
            href={current.live ?? current.repo}
            large
          />
          <div id="stage-work" data-drag="" className="stage relative mt-4 min-h-0 flex-1">
            {/* Without WebGL there is no shape to draw, so the stage shows the screenshot. */}
            <div key={current.title} className="stage-fallback swap absolute inset-0 place-items-center" aria-hidden="true">
              <Image
                src={current.image}
                alt=""
                sizes="(min-width: 1600px) 900px, 55vw"
                className="h-auto max-h-full w-auto max-w-full rounded-[14px] shadow-[0_0_0_1px_var(--color-line)]"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-6">
            <nav aria-label="Projects" className="flex items-center gap-3">
              {projects.map((p, i) => (
                <a
                  key={p.title}
                  href={`#${projectSlug(p.title)}`}
                  aria-label={p.title}
                  aria-current={i === active ? "true" : undefined}
                  className="relative before:absolute before:-inset-[6px]"
                >
                  <span className={`pip transition-colors duration-300 ${i === active ? "" : "pip-dim"}`} />
                </a>
              ))}
            </nav>
            <p className="text-label font-mono text-dim">
              <span className="sr-only" aria-live="polite">
                {current.title}.{" "}
              </span>
              {hostOf(current.live) ?? "self-hosted"}
              <span className="stage-hint"> · drag to turn</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The screenshot: grey until you look at it. Beside the stage it fills what the chapter leaves. */
function Shot({ project }: { project: Project }) {
  return (
    <>
      <div className="shot relative mt-8 aspect-[16/10] lg:hidden">
        <Image
          src={project.image}
          alt={`${project.title} home page`}
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="shot-slot mt-8 hidden min-h-0 flex-1 lg:block">
        <div className="flex h-full items-end">
          <div className="shot relative aspect-[16/10] h-full max-h-[22rem] max-w-full">
            <Image
              src={project.image}
              alt={`${project.title} home page`}
              fill
              sizes="(min-width: 1600px) 560px, 36vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </>
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
      className="border-b border-line py-16 transition-opacity duration-500 last:border-b-0 sm:py-24 lg:flex lg:h-[100svh] lg:flex-col lg:border-b-0 lg:pt-24 lg:pb-10 lg:data-[active=false]:opacity-25"
    >
      {/* Phones: the count, name and subtitle open the chapter. On wide screens they sit above
          the stage, where the eye is, and this column opens on the same line as the count. */}
      <p className="text-label font-mono text-dim lg:hidden">
        {pad(index + 1)} / {pad(projects.length)}
      </p>
      <h3 id={`${slug}-title`} className="project-title display display-xl mt-3 -ml-[0.05em] lg:sr-only">
        {project.title}
      </h3>
      <p className="mt-3 text-body text-muted lg:hidden">{project.subtitle}</p>
      <p className="hidden text-meta leading-5 text-muted lg:block">{project.architecture}</p>

      {/* The phone layout's stage. Hidden on wide screens, where the shared one takes over. */}
      <div id={`stage-${slug}`} data-drag="" className="stage -mx-5 mt-6 aspect-[5/4] sm:-mx-8 lg:hidden" aria-hidden="true" />

      <p className="lead mt-6 max-w-[34ch] lg:mt-5">{project.blurb}</p>

      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-body">
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

      <Facts items={project.facts} className="mt-8 lg:mt-7" />

      <p className="project-desc mt-6 max-w-[62ch] text-body text-muted lg:mt-5">{project.desc}</p>

      <Specs
        className="mt-6 lg:mt-5"
        rows={[
          { term: "Built with", value: list(project.tech) },
          ...(processes.length
            ? [
                {
                  term: "Running now",
                  value: (
                    <span className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-label leading-[inherit] text-fg">
                      {processes.map((p) => (
                        <span key={p.id} className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="dot" aria-hidden="true" />
                          {p.app}
                          <span className="text-dim">up {p.uptime}</span>
                        </span>
                      ))}
                    </span>
                  ),
                },
              ]
            : []),
        ]}
      />

      <Shot project={project} />
    </article>
  );
}
