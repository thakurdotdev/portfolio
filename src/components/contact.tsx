"use client";

import { useEffect, useState } from "react";
import { DotField } from "@/components/dot-field";
import { SocialIcon } from "@/components/social-icons";
import { personalInfo, socialLinks } from "@/constants";

const btn = "btn hover:bg-accent-fg hover:text-accent";

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
      className="relative isolate mt-24 scroll-mt-16 overflow-clip bg-accent px-5 pt-20 pb-8 text-accent-fg sm:mt-36 sm:px-8 sm:pt-32 lg:px-12"
    >
      <DotField
        cell={11}
        className="absolute inset-0 -z-10 h-full w-full [--dot-accent:var(--accent-fg)] [--dot-alpha:0.22] [--dot-ink:var(--accent-fg)]"
      />

      {/* Same header as every other section, in the inverted colours. */}
      <div className="border-b border-current/30 pb-4">
        <h2 id="contact-title" className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.01em]">
          <span className="dot bg-accent-fg" aria-hidden="true" />
          Contact
        </h2>
      </div>
      <p className="lead mt-8 max-w-[46ch]">
        Open to full-stack engineering roles, architecture conversations and work on developer tools. Email is the
        fastest way to reach me.
      </p>

      <a
        href={`mailto:${personalInfo.email}`}
        className="display mt-10 -ml-[0.04em] block w-fit text-[clamp(2rem,13vw,19rem)] underline decoration-transparent decoration-[0.045em] underline-offset-[0.12em] transition-[text-decoration-color] duration-300 hover:decoration-current sm:mt-16"
      >
        {personalInfo.email}
      </a>

      <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-12">
        <button type="button" onClick={copy} className={btn}>
          {copied === "done" ? "Address copied" : copied === "failed" ? "Copy failed" : "Copy address"}
        </button>
        <a href="https://cdn.thakur.dev/resume.pdf" target="_blank" rel="noopener noreferrer" className={btn} aria-label="Resume PDF (opens in new tab)">
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

      <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-current/25 pt-6 text-[15px] sm:mt-36">
        <p>© {new Date().getFullYear()} Pankaj Thakur</p>
        <LocalTime />
      </footer>
    </section>
  );
}
