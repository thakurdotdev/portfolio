"use client";

import { Experience } from "@/components/experience-card";
import { ProjectCard, ProjectGrid } from "@/components/project-card";
import { SocialIcons } from "@/components/social-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { VideoDialog } from "@/components/video-dialog";
import {
  categorizedSkills,
  personalInfo,
  projects,
  socialLinks,
  workExperience
} from "@/constants";
import { useState } from "react";

export default function Page() {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-fg selection:bg-accent-soft selection:text-fg transition-colors duration-150 py-12 sm:py-20 px-5 sm:px-8">
      <main className="max-w-2xl mx-auto space-y-16 sm:space-y-20">

        {/* Hero & Intro */}
        <header className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">
                {personalInfo.name}
              </h1>
              <p className="text-sm text-muted mt-0.5 font-medium">
                {personalInfo.role} · {personalInfo.company}
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-muted">
            <p className="text-fg font-medium">
              {personalInfo.bio}
            </p>
            <p>
              {personalInfo.aboutLong.join(" ")}
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-border">
            <div className="flex items-center gap-3">
              <a
                href="https://cdn.thakur.dev/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume PDF (opens in new tab)"
                className="px-3 py-1 rounded bg-accent text-bg hover:opacity-90 active:scale-95 transition-all text-xs font-semibold inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span>Get resume</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </a>

              <nav aria-label="Social profiles">
                <SocialIcons links={socialLinks} />
              </nav>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" aria-hidden="true" />
              <span>Available for roles</span>
            </div>
          </div>
        </header>

        {/* Featured Systems */}
        <section aria-labelledby="heading-featured-systems" className="space-y-6">
          <div>
            <h2 id="heading-featured-systems" className="text-lg font-bold tracking-tight text-fg">
              Featured systems
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Production platforms, tunneling tools, and developer infrastructure.
            </p>
          </div>

          <ProjectGrid>
            {projects.map((project) => {
              const isVideo = Boolean(project.demo && !project.live);

              return (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.blurb}
                  href={project.live || project.repo || project.demo || "#"}
                  image={project.image}
                  screens={project.screens}
                  accent={project.accent}
                  zoom={project.zoom}
                  tags={project.tech}
                  isVideo={isVideo}
                  onClick={
                    isVideo
                      ? () => setActiveVideo({ url: project.demo!, title: project.title })
                      : undefined
                  }
                />
              );
            })}
          </ProjectGrid>
        </section>

        {/* Work Experience */}
        {/* Work Experience */}
        <section aria-labelledby="heading-experience" className="space-y-6">
          <div>
            <h2 id="heading-experience" className="text-lg font-bold tracking-tight text-fg">
              Experience
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Career history and software engineering engagements.
            </p>
          </div>

          <Experience data={workExperience} />
        </section>

        {/* Core Capabilities */}
        <section aria-labelledby="heading-capabilities" className="space-y-4">
          <div>
            <h2 id="heading-capabilities" className="text-lg font-bold tracking-tight text-fg">
              Core capabilities
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Technologies, architectures, and protocols used in production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {categorizedSkills.map((cat) => (
              <div key={cat.category} className="space-y-2.5">
                <h3 className="text-xs font-mono font-semibold text-fg uppercase tracking-wider">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-1.5" aria-label={cat.category}>
                  {cat.items.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-accent-soft text-muted font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Connect */}
        <section aria-labelledby="heading-contact" className="space-y-3 pt-6 border-t border-border">
          <div>
            <h2 id="heading-contact" className="text-lg font-bold tracking-tight text-fg">
              Let&apos;s build something together
            </h2>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Open to full-stack engineering roles, systems architecture discussions, and developer platform collaboration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={`mailto:${personalInfo.email}`}
              className="px-3.5 py-1.5 bg-accent text-bg hover:opacity-90 active:scale-95 transition-all text-xs font-semibold rounded inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span>Email me</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3.5 py-1.5 bg-accent-soft border border-border hover:opacity-80 active:scale-95 transition-all text-xs font-mono text-fg font-medium rounded cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {copiedEmail ? "✓ Copied to clipboard" : `Copy ${personalInfo.email}`}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-border flex justify-between items-center text-xs text-muted font-mono">
          <p>© {new Date().getFullYear()} {personalInfo.name} · {personalInfo.email}</p>
        </footer>

      </main>

      <VideoDialog
        isOpen={activeVideo !== null}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url || ""}
        title={activeVideo?.title || ""}
      />
    </div>
  );
}
