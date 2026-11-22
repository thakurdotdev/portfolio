"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { registerSteps } from "@/lib/smooth-scroll";
import { Facts } from "./facts";
import { StageHead } from "./stage-head";
import { categorizedSkills, experienceChapters, workExperience, type ExperienceChapter } from "@/constants";

const monthFmt = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });
const fmt = (iso: string) => (iso === "Present" ? "now" : monthFmt.format(new Date(iso)));
const monthIndex = (d: Date) => d.getUTCFullYear() * 12 + d.getUTCMonth();
const pad = (n: number) => String(n).padStart(2, "0");

/** One entry per month of the job, tagged with the role held that month. */
function buildMonths() {
  const roles = workExperience[0].roles;
  const first = new Date(roles[roles.length - 1].startDate);
  const internEnd = new Date(roles[roles.length - 1].endDate);
  // Counted up to the build date, so server and client render the same pips.
  const total = monthIndex(new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? Date.now())) - monthIndex(first) + 1;
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + i, 1));
    return { date, i, intern: monthIndex(date) <= monthIndex(internEnd) };
  });
}

/** A calendar of pips: one per month, a row per year. Lights up in order on first view. */
function Tenure() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const months = buildMonths();
  const internCount = months.filter((m) => m.intern).length;
  const years = [...new Set(months.map((m) => m.date.getUTCFullYear()))];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={on ? "months-on" : ""}>
      <div
        role="img"
        aria-label={`${months.length} months at Netclues: ${internCount} as an intern, ${months.length - internCount} as an engineer`}
        className="space-y-2.5"
      >
        {years.map((y) => {
          const row = months.filter((m) => m.date.getUTCFullYear() === y);
          return (
            <div key={y} className="flex items-center gap-4">
              <span className="w-10 text-meta text-dim tabular-nums">{y}</span>
              {/* Pad the first year so every month sits in its own column. */}
              <span className="flex gap-[7px]" style={{ paddingLeft: `calc(${row[0].date.getUTCMonth()} * (0.75rem + 7px))` }}>
                {row.map((m) => (
                  <span
                    key={m.i}
                    title={monthFmt.format(m.date)}
                    className={`pip month ${m.intern ? "month-intern" : ""}`}
                    style={{ "--i": m.i } as CSSProperties}
                  />
                ))}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="display display-m">{months.length} months</p>
        <p className="flex gap-5 text-meta text-muted">
          <span className="flex items-center gap-2">
            <span className="pip bg-accent/40" aria-hidden="true" />
            Intern
          </span>
          <span className="flex items-center gap-2">
            <span className="pip" aria-hidden="true" />
            Engineer
          </span>
        </p>
      </div>
    </div>
  );
}

/*
 * The work as chapters: a sentence or two each, while the stage beside them runs a small
 * simulation of what was built. Same layout as the projects, so the page reads as one system.
 */
export function Experience() {
  const org = workExperience[0];
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);
  const intro = useRef<HTMLDivElement>(null);

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
    // On desktop, one scroll gesture moves one whole chapter. The section's top (heading,
    // employer, months) is the first step, so momentum never carries past it.
    const section = intro.current?.closest("section");
    const chapters = items.current.filter((el): el is HTMLElement => !!el);
    const unstep = registerSteps(section ? [section, ...chapters] : chapters);
    return () => {
      io.disconnect();
      unstep();
    };
  }, []);

  const current = experienceChapters[active];

  return (
    <>
      <div ref={intro} className="grid gap-x-12 gap-y-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:items-end">
        <div data-reveal="" className="lg:col-span-5">
          <h3 className="display display-xl -ml-[0.05em]">{org.organization}</h3>
          <p className="lead mt-5 max-w-[34ch]">Portals and backends for a central bank and a credit union.</p>
        </div>
        <div data-reveal="" className="lg:col-span-7">
          <Tenure />
        </div>
      </div>

      <div className="mt-10 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          {experienceChapters.map((c, i) => (
            <Chapter
              key={c.id}
              chapter={c}
              index={i}
              active={i === active}
              ref={(el) => {
                items.current[i] = el;
              }}
            />
          ))}
        </div>

        <div className="hidden lg:col-span-7 lg:block">
          <div className="stage-col sticky top-0 flex h-[100svh] flex-col pt-24 pb-10">
            <StageHead
              key={current.id}
              index={active}
              count={experienceChapters.length}
              title={current.context}
              sub={current.role}
            />
            <div id="stage-exp" data-drag="" className="stage relative mt-4 min-h-0 flex-1">
              {/* Without WebGL there is no simulation to run, so the stage carries the facts. */}
              <ul key={current.id} className="stage-fallback swap absolute inset-0 content-center gap-5">
                {current.facts.map((f) => (
                  <li key={f} className="display display-m border-t border-line-strong pt-4">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex items-center justify-between gap-6">
              <nav aria-label="Experience" className="flex items-center gap-3">
                {experienceChapters.map((c, i) => (
                  <a
                    key={c.id}
                    href={`#exp-${c.id}`}
                    aria-label={c.headline}
                    aria-current={i === active ? "true" : undefined}
                    className="relative before:absolute before:-inset-[6px]"
                  >
                    <span className={`pip transition-colors duration-300 ${i === active ? "" : "pip-dim"}`} />
                  </a>
                ))}
              </nav>
              <p className="text-label font-mono text-dim">
                <span className="sr-only" aria-live="polite">
                  {current.context}.{" "}
                </span>
                <span className="stage-hint">drag to turn</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-x-12 gap-y-12 sm:mt-20 lg:mt-12 lg:grid-cols-12">
        <div data-reveal="" className="lg:col-span-5">
          <h3 className="text-body font-semibold">Tools I use</h3>
          <dl className="mt-4 border-t border-line-strong">
            {categorizedSkills.map((c) => (
              <div key={c.category} className="grid gap-x-6 gap-y-0.5 border-b border-line py-2.5 text-body sm:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[13rem_minmax(0,1fr)]">
                <dt className="text-muted">{c.category}</dt>
                <dd>{c.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
        <details data-reveal="" className="group lg:col-span-7">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-line-strong pb-4 text-body font-semibold [&::-webkit-details-marker]:hidden">
            Every role and project, in full
            <span className="grid h-6 w-6 place-items-center rounded-full border border-line-strong text-meta font-normal transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          {org.roles.map((role) => (
            <div key={role.title} className="mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h4 className="text-lg font-semibold tracking-[-0.01em]">{role.title}</h4>
                <p className="text-meta text-muted">
                  {fmt(role.startDate)} to {fmt(role.endDate)}
                </p>
              </div>
              <dl className="mt-3">
                {role.highlights.map((h) => (
                  <div key={h.title} className="grid gap-x-8 gap-y-1 border-t border-line py-3 text-body sm:grid-cols-[11rem_minmax(0,1fr)]">
                    <dt className="font-medium">{h.title}</dt>
                    <dd className="text-muted">{h.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </details>
      </div>
    </>
  );
}

function Chapter({
  chapter: c,
  index,
  active,
  ref,
}: {
  chapter: ExperienceChapter;
  index: number;
  active: boolean;
  ref: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={ref}
      id={`exp-${c.id}`}
      data-index={index}
      data-active={active}
      data-scene={c.scene}
      data-stage={`#stage-exp-${c.id}, #stage-exp`}
      data-label={c.label}
      aria-labelledby={`exp-${c.id}-title`}
      className="scroll-mt-16 border-b border-line py-14 transition-opacity duration-500 last:border-b-0 sm:py-20 lg:flex lg:h-[100svh] lg:flex-col lg:border-b-0 lg:pt-24 lg:pb-10 lg:data-[active=false]:opacity-25"
    >
      {/* Opens on the same line as the count above the stage. On phones, the count is here. */}
      <p className="text-label font-mono leading-5 text-dim lg:hidden">
        {pad(index + 1)} / {pad(experienceChapters.length)}
      </p>
      <p className="hidden text-meta leading-5 text-muted lg:block">{c.label}</p>
      <h3 id={`exp-${c.id}-title`} className="chapter-title display display-l mt-3 max-w-[13ch] -ml-[0.04em] lg:mt-5 lg:max-w-[15ch]">
        {c.headline}
      </h3>
      <p className="mt-3 text-body text-muted lg:hidden">{c.context}</p>
      <div id={`stage-exp-${c.id}`} data-drag="" className="stage -mx-5 mt-6 aspect-[5/4] sm:-mx-8 lg:hidden" aria-hidden="true" />
      <p className="lead mt-6 max-w-[38ch] lg:mt-5">{c.body}</p>
      <Facts items={c.facts} className="chapter-facts mt-8 lg:mt-7" />
      {c.link && (
        <p className="mt-5 text-body">
          <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="link">
            {c.link.text}
          </a>
        </p>
      )}
    </article>
  );
}
