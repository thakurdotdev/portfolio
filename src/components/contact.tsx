"use client";

import { useEffect, useRef, useState } from "react";
import { personalInfo, socialLinks } from "@/constants";
import { scrollToY } from "@/lib/smooth-scroll";
import { Section } from "./section";

const updatedFmt = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });
// The build date, so "Updated" is always true and server and client agree.
const built = new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? Date.now());

const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" });

/** The time where I am, and whether I am likely to be up. */
function useLocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Ticks on the minute, so the printed time turns with the dot clock above it.
    let id = 0;
    const tick = () => {
      const d = new Date();
      setNow(d);
      id = window.setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(id);
  }, []);
  if (!now) return { time: "--:--", status: "" };
  const h = Number(hourFmt.format(now)) % 24;
  return {
    time: timeFmt.format(now),
    status: h >= 8 && h < 23 ? "probably awake" : "probably asleep",
  };
}

/*
 * The end of the page: the address first, so a jump to #contact lands on it, with a small
 * dot-matrix clock beside it showing the time in India. Then a one-line footer.
 * The email, its copy button and the links sit on the same hairlines as the clock's caption.
 */
export function Contact() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const reset = useRef(0);
  const { time, status } = useLocalTime();

  useEffect(() => () => clearTimeout(reset.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setCopied("idle"), 2000);
  };

  return (
    <Section id="contact" label="Contact" scene="clock" stage="#stage-clock" className="pb-8">
      <div className="mt-12 grid gap-x-12 gap-y-12 sm:mt-16 lg:grid-cols-12 lg:items-end">
        <div data-reveal="" className="lg:col-span-7">
          <p className="display display-xl -ml-[0.05em]">Say hello.</p>
          <p className="lead mt-5 max-w-[34ch] text-muted">Email is the quickest way to reach me.</p>
          <p className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-3">
            <a href={`mailto:${personalInfo.email}`} className="mail display display-l -ml-[0.04em] block w-fit text-[clamp(2.25rem,10.5vw,4.75rem)]">
              {personalInfo.email}
            </a>
            <button type="button" onClick={copy} className="link cursor-pointer text-body">
              {copied === "done" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied === "done" ? "Email address copied" : copied === "failed" ? "Could not copy. The address is " + personalInfo.email : ""}
            </span>
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-5 text-body">
            {[...socialLinks, { name: "Resume", url: "https://cdn.thakur.dev/resume.pdf" }].map((l) => (
              <li key={l.name}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="link group">
                  {l.name}
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block text-dim transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* A small clock beside the address: is it a good time to write? Without WebGL, the
            time is printed instead. */}
        <div className="lg:col-span-5">
          <div id="stage-clock" data-drag="" className="stage relative aspect-[3/1] w-full max-w-[24rem] lg:max-w-none" aria-hidden="true">
            <p className="clock-fallback display absolute inset-0 grid place-items-center text-[clamp(2.5rem,9vw,5rem)] tabular-nums opacity-0">
              {time}
            </p>
          </div>
          <p className="mt-4 border-t border-line pt-5 text-body text-muted">
            <span className="text-fg tabular-nums">{time}</span> in India{status && `, ${status}`}
          </p>
        </div>
      </div>

      <footer className="mt-20 flex items-center justify-between gap-6 border-t border-line-strong pt-5 text-meta text-muted sm:mt-28">
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <span>© {built.getUTCFullYear()} {personalInfo.name}</span>
          <span className="text-dim">Updated {updatedFmt.format(built)}</span>
        </p>
        <button
          type="button"
          onClick={() => scrollToY(0)}
          aria-label="Back to the top"
          title="Back to the top"
          className="to-top grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-full bg-fg text-bg"
        >
          <span aria-hidden="true" className="text-body leading-none">↑</span>
        </button>
      </footer>
    </Section>
  );
}
