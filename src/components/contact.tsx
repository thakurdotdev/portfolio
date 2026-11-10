"use client";

import { useEffect, useState } from "react";
import { SocialIcon } from "@/components/social-icons";
import { personalInfo, socialLinks } from "@/constants";
import { scrollToY } from "@/lib/smooth-scroll";

const btn = "btn hover:bg-bg hover:text-fg";

/** The time where I am, so you know whether I am awake. */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex items-baseline gap-2">
      <span className="font-mono">{time ?? "--:--"}</span> in India
    </p>
  );
}

/*
 * The page ends inverted. The dots fold back into a single dot, the one used for "online"
 * everywhere above, and it beats.
 */
export function Contact() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

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
      data-scene="sphere"
      data-stage="#stage-contact"
      data-label="Contact"
      className="relative mt-24 scroll-mt-16 bg-fg px-5 pt-20 pb-8 text-bg sm:mt-36 sm:px-8 sm:pt-28 lg:px-12"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-current/30 pb-4">
        <h2 id="contact-title" className="flex items-baseline gap-3 text-lg font-semibold tracking-[-0.01em]">
          <span className="font-mono text-[12px] font-normal opacity-60">04</span>
          Contact
        </h2>
        <LocalTime />
      </div>

      <div className="grid items-center gap-x-12 lg:grid-cols-12">
        <div className="pt-10 lg:col-span-6 lg:pt-0">
          <p data-reveal="" className="display display-xl -ml-[0.05em]">
            Say hello.
          </p>
          <p data-reveal="" className="lead mt-6 max-w-[40ch] opacity-80">
            Open to full-stack engineering roles, architecture conversations and work on developer tools. Email is
            the fastest way to reach me.
          </p>

          <div data-reveal="" className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copy} className={btn}>
              {copied === "done" ? "Address copied" : copied === "failed" ? "Copy failed" : "Copy address"}
            </button>
            <a
              href="https://cdn.thakur.dev/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={btn}
              aria-label="Resume PDF (opens in new tab)"
            >
              Resume
            </a>
            <span className="flex gap-3">
              {socialLinks.map((l) => (
                <a
                  key={l.name}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn} btn-icon`}
                  aria-label={`${l.name} profile (opens in new tab)`}
                  title={l.name}
                >
                  <SocialIcon name={l.name} />
                </a>
              ))}
            </span>
            <span className="sr-only" aria-live="polite">
              {copied === "done" ? "Email address copied" : ""}
            </span>
          </div>
        </div>

        <div id="stage-contact" data-drag="" className="stage mx-auto mt-6 aspect-square w-full max-w-[34rem] lg:col-span-6 lg:mt-0" />
      </div>

      <a
        href={`mailto:${personalInfo.email}`}
        className="mail display mt-6 -ml-[0.04em] block w-fit text-[clamp(2.1rem,12.4vw,17.5rem)] sm:mt-10"
      >
        {personalInfo.email}
      </a>

      <footer className="mt-20 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-current/25 pt-6 text-[15px] sm:mt-28">
        <p>© {new Date().getFullYear()} Pankaj Thakur</p>
        <button type="button" onClick={() => scrollToY(0)} className="cursor-pointer underline-offset-4 hover:underline">
          Back to the top
        </button>
      </footer>
    </section>
  );
}
