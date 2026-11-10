"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { categorizedSkills, engineeringWins, workExperience } from "@/constants";

const monthFmt = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });
const fmt = (iso: string) => (iso === "Present" ? "now" : monthFmt.format(new Date(iso)));
const monthIndex = (d: Date) => d.getUTCFullYear() * 12 + d.getUTCMonth();

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
    <div ref={ref} className={`mt-10 ${on ? "months-on" : ""}`}>
      <div
        role="img"
        aria-label={`${months.length} months at Netclues: ${internCount} as an intern, ${months.length - internCount} as an engineer`}
        className="space-y-2.5"
      >
        {years.map((y) => {
          const row = months.filter((m) => m.date.getUTCFullYear() === y);
          return (
            <div key={y} className="flex items-center gap-4">
              <span className="w-10 text-sm text-dim">{y}</span>
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
        <p className="flex gap-5 text-sm text-muted">
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

export function Experience() {
  const org = workExperience[0];

  return (
    <div className="grid gap-x-12 gap-y-16 pt-14 sm:pt-20 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h3 className="display display-xl -ml-[0.05em]">{org.organization}</h3>
          <p className="lead mt-5 max-w-[34ch]">
            Client portals and backends for a central bank and a credit union. {org.location}.
          </p>
          <Tenure />
        </div>
      </div>

      <div className="lg:col-span-7">
        {/* Two results worth their own line. */}
        <div className="space-y-12">
          {engineeringWins.map((w) => (
            <div key={w.title} data-reveal="" className="border-t border-line-strong pt-5">
              <p className="display display-m">{w.metric}</p>
              <h4 className="mt-4 text-lg font-semibold tracking-[-0.01em]">{w.title}</h4>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{w.desc}</p>
            </div>
          ))}
        </div>

        {org.roles.map((role) => (
          <div key={role.title} data-reveal="" className="mt-16 sm:mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h4 className="text-[clamp(1.375rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.02em]">
                {role.title}
              </h4>
              <p className="text-muted">
                {fmt(role.startDate)} to {fmt(role.endDate)}
              </p>
            </div>
            <dl className="mt-4">
              {role.highlights.map((h) => (
                <div key={h.title} className="grid gap-x-8 gap-y-1 border-t border-line py-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <dt className="font-medium">{h.title}</dt>
                  <dd className="max-w-[62ch] leading-relaxed text-muted">
                    {h.desc}
                    {"testimonial" in h && h.testimonial && (
                      <>
                        {" "}
                        <a href={h.testimonial} target="_blank" rel="noopener noreferrer" className="link text-fg">
                          Read the client&rsquo;s note on LinkedIn
                        </a>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div data-reveal="" className="mt-16 sm:mt-20">
          <h4 className="text-[clamp(1.375rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.02em]">
            Works with
          </h4>
          <dl className="mt-4">
            {categorizedSkills.map((cat) => (
              <div key={cat.category} className="grid gap-x-8 gap-y-1 border-t border-line py-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                <dt className="font-medium">{cat.category}</dt>
                <dd className="leading-relaxed text-muted">{cat.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
