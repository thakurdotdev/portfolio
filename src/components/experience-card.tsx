"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface Highlight {
  title: string;
  desc: string;
  /** Optional link to a client testimonial. */
  testimonial?: string;
}

export interface Role {
  title: string;
  /** ISO date, e.g. "2024-09-01". */
  startDate: string;
  /** ISO date, or "Present". */
  endDate: string;
  highlights: Highlight[];
}

export interface Organization {
  organization: string;
  /** Shown on the right of the company heading, e.g. "India, on-site and hybrid". */
  location?: string;
  roles: Role[];
}

export interface ExperienceProps {
  data: Organization[];
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Date helpers (fixed month names so server and client always match)         */
/* -------------------------------------------------------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parse = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d || 1));
};

const formatMonth = (date: string) => {
  const d = parse(date);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** "2 yrs 1 mo". The end date counts as a full day, so Feb 1 to Aug 31 is 7 mos. */
function duration(start: string, end: string) {
  const s = parse(start);
  const e = end === "Present" ? new Date() : parse(end);
  const endExclusive = new Date(
    Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate() + 1),
  );

  let months =
    (endExclusive.getUTCFullYear() - s.getUTCFullYear()) * 12 +
    (endExclusive.getUTCMonth() - s.getUTCMonth());
  if (endExclusive.getUTCDate() < s.getUTCDate()) months -= 1;
  months = Math.max(months, 1);

  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [
    years ? `${years} ${years === 1 ? "yr" : "yrs"}` : "",
    rest ? `${rest} ${rest === 1 ? "mo" : "mos"}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/* -------------------------------------------------------------------------- */
/*  Experience                                                                 */
/* -------------------------------------------------------------------------- */

export function Experience({ data, className }: ExperienceProps) {
  return (
    <div className={cx("space-y-12", className)}>
      {data.map((org) => (
        <OrganizationTimeline key={org.organization} org={org} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  One organization = one timeline                                            */
/* -------------------------------------------------------------------------- */

function OrganizationTimeline({ org }: { org: Organization }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // The spine fills as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
        <h3 className="text-base font-bold tracking-tight text-fg">{org.organization}</h3>
        {org.location && <span className="text-xs font-mono text-muted">{org.location}</span>}
      </div>

      {/* --spine is where the vertical line sits: left edge on mobile, between the columns from sm up */}
      <div ref={ref} className="relative [--spine:0.5rem] sm:[--spine:11.5rem]">
        <div
          aria-hidden="true"
          className="absolute bottom-3 top-3 w-px bg-border"
          style={{ left: "calc(var(--spine) - 0.5px)" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-3 top-3 w-px bg-success"
          style={{
            left: "calc(var(--spine) - 0.5px)",
            scaleY: reduceMotion ? 1 : fill,
            transformOrigin: "top",
          }}
        />

        <ol className="space-y-10 pl-2 sm:pl-0">
          {org.roles.map((role) => (
            <RoleItem key={`${role.title}-${role.startDate}`} role={role} />
          ))}
        </ol>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  One role                                                                   */
/* -------------------------------------------------------------------------- */

function RoleItem({ role }: { role: Role }) {
  const isCurrent = role.endDate === "Present";

  return (
    <li className="grid gap-y-1 sm:grid-cols-[9.5rem_1fr] sm:gap-x-8">
      {/* Dates stay in view while you read a long role */}
      <div className="whitespace-nowrap pl-8 font-mono text-xs text-muted sm:sticky sm:top-6 sm:self-start sm:pl-0 sm:text-right">
        <p className="leading-7">
          {formatMonth(role.startDate)} – {isCurrent ? "Present" : formatMonth(role.endDate)}
        </p>
        <p suppressHydrationWarning>{duration(role.startDate, role.endDate)}</p>
      </div>

      <div className="relative pl-8">
        {/* Marker on the spine */}
        <span
          aria-hidden="true"
          className={cx(
            "absolute left-0 top-[9px] h-2.5 w-2.5 -translate-x-1/2 rounded-full",
            isCurrent ? "bg-success" : "bg-muted",
          )}
        />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="text-sm font-bold leading-7 text-fg">{role.title}</h4>
          {isCurrent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Current
            </span>
          )}
        </div>

        <ul className="mt-2 divide-y divide-border">
          {role.highlights.map((work) => (
            <li key={work.title} className="space-y-1 py-3 first:pt-1 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="text-sm font-semibold text-fg">{work.title}</h5>
                {work.testimonial && (
                  <a
                    href={work.testimonial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[11px] text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Read client testimonial for ${work.title} on LinkedIn (opens in new tab)`}
                  >
                    <span>Read testimonial</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              <p className="max-w-[62ch] text-xs leading-relaxed text-muted sm:text-sm">
                {work.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}