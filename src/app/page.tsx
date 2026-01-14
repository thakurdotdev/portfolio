import { ExpandableText } from "@/components/expandable-text";
import { SocialIcons } from "@/components/social-icons";
import ThemeIsland from "@/components/theme-island";
import {
  personalInfo,
  projects,
  socialLinks,
  workHighlights,
  workTech,
} from "@/constants";

export default function Page() {
  return (
    <div className="min-h-screen bg-bg text-fg dotted-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Full Grid Layout */}
        <div className="border border-dashed border-border-dashed rounded-lg overflow-hidden">
          {/* Row 1: Header */}
          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-border">
            {/* Name & Role */}
            <div className="lg:col-span-2 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border flex justify-between items-center gap-2">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                  {personalInfo.name}
                </h1>
                <p className="text-muted">{personalInfo.role}</p>
              </div>
            </div>
            {/* Status */}
            <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
                <p className="text-sm font-medium">Available for hire</p>
              </div>
              <p className="text-xs text-muted">
                Currently at {personalInfo.company}
              </p>
            </div>
            {/* Links */}
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
              <SocialIcons links={socialLinks} />
              <ThemeIsland />
            </div>
          </div>

          {/* Row 2: About */}
          <div className="p-5 sm:p-6 border-b border-border">
            <p className="text-base sm:text-lg leading-relaxed mb-1">
              {personalInfo.bio}
            </p>
            <p className="text-sm text-muted">
              {personalInfo.aboutLong.join(" ")}
            </p>
          </div>

          {/* Row 3: Projects */}
          <div className="border-b border-border">
            <div className="px-5 sm:px-6 py-3 border-b border-border bg-muted/5">
              <span className="text-xs font-mono text-muted uppercase tracking-widest">
                Projects
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className={`p-5 sm:p-6 
                    ${
                      index < projects.length - 1
                        ? "border-b sm:border-b-0"
                        : ""
                    } 
                    ${index === 0 ? "sm:border-r lg:border-r" : ""}
                    ${index === 1 ? "lg:border-r" : ""}
                    border-border
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-xs text-muted">{project.subtitle}</p>
                    </div>
                    <div className="flex gap-2 text-xs shrink-0">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Live ↗
                        </a>
                      )}
                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Code ↗
                        </a>
                      ) : (
                        project.status
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <ExpandableText text={project.desc} maxLines={2} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs text-muted/70 font-mono">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs text-muted/50">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4: Experience */}
          <div className="border-b border-border">
            <div className="px-5 sm:px-6 py-3 border-b border-border bg-muted/5">
              <span className="text-xs font-mono text-muted uppercase tracking-widest">
                Experience
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4">
              {/* Company Info */}
              <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border">
                <h3 className="font-semibold">{personalInfo.company}</h3>
                <p className="text-xs text-muted">Software Engineer</p>
                <span className="text-xs font-mono text-accent mt-1 inline-block">
                  Present
                </span>
              </div>
              {/* Work Highlights */}
              {workHighlights.map((work, i) => (
                <div
                  key={work.title}
                  className={`p-5 sm:p-6 border-b lg:border-b-0 border-border ${
                    i < 2 ? "lg:border-r" : ""
                  }`}
                >
                  <h4 className="text-sm font-medium mb-1">{work.title}</h4>
                  <ExpandableText text={work.desc} maxLines={2} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Stack + Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Stack */}
            <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border">
              <span className="text-xs font-mono text-muted uppercase tracking-widest">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  ...new Set([...workTech, ...projects.flatMap((p) => p.tech)]),
                ].map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {/* Contact */}
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4 bg-accent/5">
              <div>
                <span className="text-xs font-mono text-muted uppercase tracking-widest">
                  Contact
                </span>
                <p className="text-sm mt-1">
                  Let&apos;s build something together
                </p>
              </div>
              <a
                href={`mailto:${personalInfo.email}`}
                className="px-4 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-accent/90 transition-colors shrink-0"
              >
                Get in touch →
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted">
          © {new Date().getFullYear()} {personalInfo.name} — Building real
          systems, not demos.
        </footer>
      </div>
    </div>
  );
}
