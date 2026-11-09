"use client";

import { Experience } from "@/components/experience-card";
import { ServerTerminal } from "@/components/hero-terminal";
import { projectSlug, serverSnapshot } from "@/constants/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SocialIcon, SocialIcons } from "@/components/social-icons";
import { VideoDialog } from "@/components/video-dialog";
import { WorkBento } from "@/components/work-bento";
import {
  categorizedSkills,
  engineeringWins,
  personalInfo,
  projects,
  socialLinks,
  workExperience,
} from "@/constants";
import { MotionConfig } from "motion/react";
import Image from "next/image";
import { useState, type CSSProperties } from "react";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Page() {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const [serverOpen, setServerOpen] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 2000);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen overflow-x-clip bg-bg pt-3 text-fg">
        <SiteNav />

        <main>
          {/* ------------------------------- Intro ------------------------------ */}
          <section aria-labelledby="intro-title" className="relative px-4 pt-16 pb-20 sm:px-6 sm:pt-28 sm:pb-28">
            <div className="relative mx-auto max-w-[1180px]">
              <h1
                id="intro-title"
                className="display rise flex items-center gap-[0.22em] whitespace-nowrap text-[clamp(2.4rem,10.5vw,7rem)] leading-none tracking-[-0.045em]"
                style={delay(0)}
              >
                <Image
                  src="/pankaj.webp"
                  alt="Portrait of Pankaj Thakur"
                  width={240}
                  height={240}
                  priority
                  className="h-[0.82em] w-[0.82em] shrink-0 rounded-[0.2em] object-cover ring-1 ring-line"
                />
                <span>Pankaj Thakur</span>
              </h1>

              <p
                className="rise mt-6 text-[clamp(1.25rem,2.6vw,2rem)] leading-snug tracking-[-0.02em] text-muted sm:mt-8"
                style={delay(100)}
              >
                I build software and <span className="whitespace-nowrap">keep it running.</span>
              </p>

              {/* Credits row: plain facts instead of a pitch. */}
              <dl
                className="rise mt-14 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-line pt-7 min-[480px]:grid-cols-2 sm:mt-20 lg:grid-cols-4"
                style={delay(220)}
              >
                <div>
                  <dt className="text-sm text-muted-dim">Now</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed">
                    {personalInfo.role}
                    <br />
                    at {personalInfo.company}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-dim">Building</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed">
                    {projects.map((p, i) => (
                      <span key={p.title}>
                        <a
                          href={`#${projectSlug(p.title)}`}
                          className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
                        >
                          {p.title}
                        </a>
                        {i < projects.length - 2 ? ", " : i === projects.length - 2 ? " and " : ""}
                      </span>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-dim">Running</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed">
                    {serverSnapshot.totalOnline} apps on my own server
                    <button
                      type="button"
                      onClick={() => setServerOpen((o) => !o)}
                      aria-expanded={serverOpen}
                      aria-controls="server-terminal"
                      className="relative mt-1 flex cursor-pointer items-center gap-1.5 font-mono text-[13px] text-muted transition-colors before:absolute before:-inset-2 hover:text-fg"
                    >
                      <span className="text-success" aria-hidden="true">$</span> pm0 ls
                      <span className="sr-only">{serverOpen ? " (hide)" : " (show)"}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-300 ${serverOpen ? "rotate-180" : ""}`}>
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-dim">Contact</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
                    >
                      {personalInfo.email}
                    </a>
                    <span className="mt-1 flex items-center gap-4 text-muted">
                      {socialLinks.map((l) => (
                        <a
                          key={l.name}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${l.name} profile (opens in new tab)`}
                          className="relative transition-colors before:absolute before:-inset-2 hover:text-fg [&_svg]:h-[15px] [&_svg]:w-[15px]"
                        >
                          <SocialIcon name={l.name} />
                        </a>
                      ))}
                      <a
                        href="https://cdn.thakur.dev/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative text-sm transition-colors before:absolute before:-inset-2 hover:text-fg"
                      >
                        Resume ↗
                      </a>
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Full `pm0 ls`, unfolded from the Running column. */}
            <div
              id="server-terminal"
              className={`relative mx-auto grid max-w-[1180px] transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
                serverOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              inert={!serverOpen}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pt-10">
                  <ServerTerminal active={serverOpen} />
                  <p className="mt-3 px-2 text-xs text-muted-dim">
                    Snapshot from {serverSnapshot.capturedOn}, my own apps only. Click a process to jump to its project.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------ Projects ---------------------------- */}
          <Section id="work" label="Projects" note="Designed, built and deployed by me.">
            <WorkBento projects={projects} onWatch={setActiveVideo} />
          </Section>

          {/* ---------------------------- Experience ---------------------------- */}
          <Section
            id="experience"
            label="Experience"
            note="Client portals and backends for a central bank and a credit union."
          >
            <div className="bezel">
              <div className="grid gap-1.5 sm:grid-cols-2">
                {engineeringWins.map((w) => (
                  <div key={w.title} className="tile p-6 sm:p-7">
                    <p className="text-sm text-muted">{w.title}</p>
                    <p className="mt-5 text-[clamp(1.5rem,2.8vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">
                      {w.metric}
                    </p>
                    <p className="mt-2 text-sm text-muted-dim">{w.focus}</p>
                  </div>
                ))}
                <div className="tile px-5 py-8 sm:col-span-2 sm:px-9 sm:py-9">
                  <Experience data={workExperience} />
                </div>
              </div>
            </div>
          </Section>

          {/* ------------------------------- Stack ------------------------------ */}
          <Section id="stack" label="Stack" note="What I use in production.">
            <div className="bezel">
              <div className="tile grid gap-8 p-6 sm:p-8 md:grid-cols-3 md:gap-6">
                {categorizedSkills.map((cat) => (
                  <div key={cat.category}>
                    <h3 className="text-sm font-medium text-muted">{cat.category}</h3>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label={cat.category}>
                      {cat.items.map((t) => (
                        <li key={t} className="surface-card rounded-lg px-3 py-1.5 text-sm">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ------------------------------ Contact ----------------------------- */}
          <Section id="contact" label="Contact" note="Roles, architecture chats, or developer tools.">
            <div className="pt-1">
              <p className="max-w-[44ch] text-[15px] leading-relaxed text-muted">
                Open to full-stack engineering roles, systems architecture discussions and developer
                platform collaboration. Email is the fastest way to reach me.
              </p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="display mt-6 inline-block break-all text-[clamp(2rem,6vw,4rem)] underline decoration-line-strong decoration-2 underline-offset-[0.18em] transition-colors hover:decoration-fg"
              >
                {personalInfo.email}
              </a>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button type="button" onClick={handleCopyEmail} className="btn btn-surface h-11 cursor-pointer px-5">
                  {copied === "done" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy address"}
                </button>
                <SocialIcons links={socialLinks} />
                <span className="sr-only" aria-live="polite">
                  {copied === "done" ? "Email address copied" : ""}
                </span>
              </div>
            </div>
          </Section>
        </main>

        <SiteFooter />

        <VideoDialog
          isOpen={activeVideo !== null}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo?.url || ""}
          title={activeVideo?.title || ""}
        />
      </div>
    </MotionConfig>
  );
}

/** CV-style section: a sticky label on the left, the content on the right. */
function Section({
  id,
  label,
  note,
  children,
}: {
  id: string;
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto grid max-w-[1180px] gap-6 border-t border-line pt-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 lg:pt-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id={`${id}-title`} className="text-lg font-semibold tracking-[-0.02em]">
            {label}
          </h2>
          {note && <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed text-muted">{note}</p>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
