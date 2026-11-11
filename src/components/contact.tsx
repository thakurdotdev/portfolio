"use client";

import { useEffect, useState } from "react";
import { personalInfo, socialLinks } from "@/constants";
import { scrollToY } from "@/lib/smooth-scroll";

const updatedFmt = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });
// The build date, so "Updated" is always true and server and client agree.
const built = new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? Date.now());

const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" });

/** The time where I am, and whether I am likely to be up. */
function useLocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
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
 */
export function Contact() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const { time, status } = useLocalTime();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 2000);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-scene="clock"
      data-stage="#stage-clock"
      data-label="Contact"
      className="page-w scroll-mt-16 px-5 pt-24 pb-8 sm:px-8 sm:pt-36 lg:px-12"
    >
      <div data-reveal="" className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line-strong pb-4">
        <h2 id="contact-title" className="flex items-baseline gap-3 text-lg font-semibold tracking-[-0.01em]">
          <span className="font-mono text-[12px] font-normal text-dim">03</span>
          Contact
        </h2>
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-14 sm:mt-16 lg:grid-cols-12 lg:items-end">
        <div data-reveal="" className="lg:col-span-7">
          <p className="display display-xl -ml-[0.05em]">Say hello.</p>
          <p className="lead mt-5 max-w-[40ch] text-muted">
            Open to full-stack engineering roles, architecture conversations and work on developer tools. Email is
            the fastest way to reach me.
          </p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="mail display mt-10 -ml-[0.04em] block w-fit text-[clamp(2.4rem,11vw,5.25rem)] lg:text-[clamp(2.4rem,4.6vw,5.25rem)]"
          >
            {personalInfo.email}
          </a>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
            <li>
              <button type="button" onClick={copy} className="link cursor-pointer">
                {copied === "done" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy address"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied === "done" ? "Email address copied" : ""}
              </span>
            </li>
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
          <div id="stage-clock" data-drag="" className="stage relative aspect-[3/1] w-full" aria-hidden="true">
            <p className="clock-fallback display absolute inset-0 grid place-items-center text-[clamp(2.5rem,9vw,5rem)] tabular-nums opacity-0">
              {time}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[12px] text-dim">
            <p aria-live="polite">
              <span className="text-fg">{time}</span> in India{status && ` · ${status}`}
            </p>
            <p className="hint hidden sm:block">drag to turn</p>
          </div>
        </div>
      </div>

      <footer className="mt-20 flex items-center justify-between gap-6 border-t border-line pt-5 text-[14px] text-muted sm:mt-28">
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
          <span aria-hidden="true" className="text-[15px] leading-none">↑</span>
        </button>
      </footer>
    </section>
  );
}
