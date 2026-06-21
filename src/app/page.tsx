"use client";

import { ExpandableText } from "@/components/expandable-text";
import { SocialIcons } from "@/components/social-icons";
import ThemeIsland from "@/components/theme-island";
import { VideoDialog } from "@/components/video-dialog";
import {
  categorizedSkills,
  engineeringWins,
  personalInfo,
  projects,
  socialLinks,
  workExperience
} from "@/constants";
import { useState } from "react";

function getExperienceText(startDateStr: string) {
  const start = new Date(startDateStr);
  const now = new Date();

  const startYear = start.getUTCFullYear();
  const startMonth = start.getUTCMonth();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();

  const totalMonths = (nowYear - startYear) * 12 + (nowMonth - startMonth);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [];
  if (years > 0) {
    parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  }
  if (months > 0) {
    parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  }

  return parts.length > 0 ? parts.join(" ") : "0 mos";
}

function getFixedDurationText(startDateStr: string, endDateStr: string) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const startYear = start.getUTCFullYear();
  const startMonth = start.getUTCMonth();

  const endYear = end.getUTCFullYear();
  const endMonth = end.getUTCMonth();

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [];
  if (years > 0) {
    parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  }
  if (months > 0) {
    parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  }

  return parts.length > 0 ? parts.join(" ") : "0 mos";
}

function getStartMonthYearText(startDateStr: string) {
  const start = new Date(startDateStr);
  const monthsList = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${monthsList[start.getUTCMonth()]} ${start.getUTCFullYear()}`;
}

export default function Page() {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [copiedNpx, setCopiedNpx] = useState(false);

  const start = new Date(personalInfo.careerStartDate);
  const now = new Date();
  const totalMonths = (now.getFullYear() - start.getUTCFullYear()) * 12 + (now.getMonth() - start.getUTCMonth());
  const expYears = (totalMonths / 12).toFixed(1);

  const copyNpx = () => {
    navigator.clipboard.writeText("npx thakurdotdev");
    setCopiedNpx(true);
    setTimeout(() => setCopiedNpx(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-fg selection:bg-accent-soft transition-colors duration-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="border border-border rounded-lg overflow-hidden bg-card shadow-xs">

          <div>
            <div className="p-4 sm:p-6 flex items-start justify-between gap-4 border-b border-border">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {personalInfo.name}
                </h1>
                <p className="text-xs font-mono text-muted uppercase tracking-wider mt-0.5">{personalInfo.role}</p>
              </div>
              <div className="shrink-0 pt-1">
                <ThemeIsland />
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-card-alt/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
              <div>
                <SocialIcons links={socialLinks} />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-muted uppercase tracking-wider">Available for Roles</span>
                </div>
                <span className="text-border">|</span>
                <a
                  href="https://cdn.thakur.dev/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-accent text-bg hover:bg-fg hover:text-bg transition-colors duration-150 font-bold uppercase tracking-wider text-[10px] inline-flex items-center gap-1 shrink-0"
                >
                  <span>Get Resume</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-border bg-card-alt/30 font-mono text-xs">
            <div className="p-4 border-r border-border text-center md:text-left">
              <span className="text-muted block uppercase tracking-wider text-[10px]">Experience</span>
              <span className="font-bold text-sm block mt-0.5">{expYears}+ Years</span>
            </div>
            <div className="p-4 border-r border-border text-center md:text-left">
              <span className="text-muted block uppercase tracking-wider text-[10px]">Shipped</span>
              <span className="font-bold text-sm block mt-0.5">{projects.length} Platforms</span>
            </div>
            <div className="p-4 text-center md:text-left">
              <span className="text-muted block uppercase tracking-wider text-[10px]">Location</span>
              <span className="font-bold text-sm block mt-0.5">India / Remote</span>
            </div>
          </div>

          <div className="p-6 border-b border-border bg-card-alt/10">
            <p className="text-base leading-relaxed font-medium mb-1 text-fg">
              {personalInfo.bio}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {personalInfo.aboutLong.join(" ")}
            </p>
          </div>

          <div className="border-b border-border">
            <div className="px-6 py-2.5 border-b border-border bg-card-alt/50">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Featured Projects
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className={`p-6 hover:bg-card-alt transition-colors duration-150 flex flex-col justify-between ${index === 0 ? "border-b md:border-b-0 md:border-r border-border" : ""
                    }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-fg">{project.title}</h3>
                        <p className="text-xs font-mono text-muted tracking-wider uppercase mt-0.5">{project.subtitle}</p>
                      </div>

                      <div className="flex gap-2.5 text-[11px] font-mono shrink-0">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg hover:underline"
                          >
                            Live ↗
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (project.demo.endsWith(".mp4")) {
                                e.preventDefault();
                                setActiveVideo({ url: project.demo, title: project.title });
                              }
                            }}
                            className="text-fg hover:underline cursor-pointer"
                          >
                            Demo ↗
                          </a>
                        )}
                        {project.repo && (
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg hover:underline"
                          >
                            Code ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 text-xs text-muted leading-relaxed">
                      <ExpandableText text={project.desc} maxLines={3} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-accent-soft border border-border text-fg font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-border">
            <div className="px-6 py-2.5 border-b border-border bg-card-alt/50">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Selected Engineering Wins
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {engineeringWins.map((win) => (
                <div key={win.title} className="p-6 hover:bg-card-alt/30 transition-colors duration-150 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="font-bold text-sm text-fg uppercase tracking-wide">{win.title}</h3>
                        <p className="text-[10px] font-mono text-muted tracking-wider uppercase mt-0.5">{win.focus}</p>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm shrink-0">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                          {win.metric}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted leading-relaxed mt-3">
                      {win.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-border">
            <div className="px-6 py-2.5 border-b border-border bg-card-alt/50">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Work Experience
              </span>
            </div>

            <div className="p-6 space-y-8">
              {workExperience.map((org) => (
                <div key={org.organization} className="space-y-6">

                  <div className="flex items-center gap-3 border-b border-border/60 pb-2">
                    <h3 className="font-bold text-base text-fg tracking-tight uppercase font-mono">{org.organization}</h3>
                  </div>

                  <div className="relative border-l border-border/70 ml-3.5 pl-6 sm:pl-8 space-y-10">
                    {org.roles.map((role) => {
                      const isCurrent = role.endDate === "Present";
                      const duration = isCurrent
                        ? getExperienceText(role.startDate)
                        : getFixedDurationText(role.startDate, role.endDate);
                      const timeline = `${getStartMonthYearText(role.startDate)} – ${isCurrent ? "Present" : getStartMonthYearText(role.endDate)
                        }`;

                      return (
                        <div
                          key={role.title}
                          className={`relative group transition-opacity duration-150 ${isCurrent ? "opacity-100" : "opacity-75 hover:opacity-100"
                            }`}
                        >
                          <div className={`absolute -left-[30px] sm:-left-[38px] top-1 w-2.5 h-2.5 rounded-full border bg-bg ring-4 ring-bg transition-colors duration-150 ${isCurrent ? "bg-accent border-accent" : "bg-muted/40 border-border group-hover:bg-accent group-hover:border-accent"
                            }`} />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <p className="text-xs font-mono text-fg uppercase tracking-widest font-bold">
                                {role.title}
                              </p>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent-soft border border-border text-fg text-[10px] font-mono w-fit h-fit shrink-0">
                              {isCurrent && <span className="w-1.5 h-1.5 bg-fg rounded-full animate-pulse" />}
                              <span>{timeline} · {duration}</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {role.highlights.map((work) => (
                              <div
                                key={work.title}
                                className="group/highlight relative pl-4 border-l border-border/40 hover:border-accent transition-all duration-150 py-0.5"
                              >
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className="text-xs font-mono font-bold text-fg uppercase tracking-wider group-hover/highlight:text-accent transition-colors duration-150">
                                    {work.title}
                                  </h4>
                                  {work.testimonial && (
                                    <a
                                      href={work.testimonial}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[9px] px-1.5 py-0.5 font-mono bg-accent-soft border border-border text-accent hover:underline hover:border-accent/50 tracking-wider uppercase font-bold rounded-sm inline-flex items-center gap-0.5 shrink-0"
                                    >
                                      Testimonial ↗
                                    </a>
                                  )}
                                </div>
                                <p className="text-xs text-muted leading-relaxed max-w-3xl">
                                  {work.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-border space-y-4">
              <span className="text-xs font-mono text-muted uppercase tracking-wider block">
                Core Stack
              </span>

              <div className="space-y-3.5">
                {categorizedSkills.map((cat) => (
                  <div key={cat.category}>
                    <span className="text-[9px] font-mono text-muted uppercase tracking-widest block mb-1.5">
                      {cat.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2.5 py-0.5 rounded bg-card-alt border border-border text-fg font-mono hover:border-accent transition-colors duration-150 cursor-default"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 flex items-center justify-between gap-4 bg-card-alt/10">
              <div>
                <span className="text-xs font-mono text-muted uppercase tracking-wider block">
                  Contact
                </span>
                <p className="text-xs text-muted mt-0.5">
                  Let&apos;s build something together.
                </p>
              </div>
              <a
                href={`mailto:${personalInfo.email}`}
                className="px-4 py-2 bg-accent text-bg hover:bg-fg hover:text-bg transition-colors duration-150 text-xs font-mono font-bold rounded shrink-0"
              >
                Get in touch →
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-muted font-mono flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} {personalInfo.name} — Standard of Build.</p>
          <p className="text-[10px] opacity-75">Obtaining modern scaling and architectural elegance.</p>
        </footer>
      </div>

      <VideoDialog
        isOpen={activeVideo !== null}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url || ""}
        title={activeVideo?.title || ""}
      />
    </div>
  );
}
