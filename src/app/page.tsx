"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { projects, socialLinks } from "@/constants";

const Page = () => {
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full md:max-w-5xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <header className="relative py-8 sm:py-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-mono">
                  Pankaj Thakur
                </h1>
                <ThemeToggle />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed md:max-w-2xl">
                Full-stack developer who turns chai into code and bugs into
                features. Currently making things work at{" "}
                <span className="font-medium text-foreground">
                  Netclues India
                </span>
                .
              </p>

              {/* Social links with proper schema */}
              <nav
                className="flex flex-wrap gap-6 pt-2"
                aria-label="Social media links"
                role="navigation"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.name !== "Email" ? "_blank" : undefined}
                    rel={
                      link.name !== "Email" ? "noopener noreferrer" : undefined
                    }
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={`Visit my ${link.name} profile`}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="pb-16 sm:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* About section */}
              <section
                className="lg:col-span-3 space-y-6"
                aria-labelledby="about-heading"
              >
                <h2
                  id="about-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  What I Do
                </h2>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I build web applications with{" "}
                    <span className="font-semibold text-foreground">
                      React, Node.js, Express, MySQL, and whatever else gets the
                      job done
                    </span>
                    . One year into professional development at Netclues India,
                    specializing in microservices and making things work (mostly
                    on the third try).
                  </p>

                  <p>
                    When not wrestling with{" "}
                    <span className="font-medium text-foreground">
                      Socket.IO
                    </span>{" "}
                    or explaining why staging is "definitely" the same as
                    production, I'm building music apps that nobody asked for
                    but everybody secretly needs.
                  </p>

                  <p>
                    I like keeping things simple — why hide behind flashy
                    animations when the real flex is shipping code that actually
                    works? Your browser's GPU deserves a break anyway.
                  </p>

                  {/* Debug workflow */}
                  <aside
                    className="mt-6 p-4 border-l-2 border-muted bg-muted/20 rounded-r-lg"
                    role="complementary"
                  >
                    <p className="text-xs font-mono leading-relaxed text-muted-foreground">
                      <span className="text-foreground font-medium">
                        Debug workflow →
                      </span>
                      <br />
                      35% console.log • 25% Google archaeology • 25% AI copilots
                      (ChatGPT, Claude, Cursor) • 15% chai + crying
                    </p>
                  </aside>
                </div>
              </section>

              {/* Projects section */}
              <section
                className="lg:col-span-2 space-y-8"
                aria-labelledby="projects-heading"
              >
                <h2
                  id="projects-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  Things I've Built
                </h2>

                <div className="space-y-8">
                  {projects.map((project, index) => (
                    <article
                      key={index}
                      className="group space-y-3 pb-6 border-b border-muted/30 last:border-b-0 last:pb-0"
                      itemScope
                      itemType="https://schema.org/CreativeWork"
                    >
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg" itemProp="name">
                          {project.title}
                        </h3>

                        <p
                          className="text-sm text-muted-foreground leading-relaxed"
                          itemProp="description"
                        >
                          {project.desc}
                        </p>

                        {/* Tech stack */}
                        <div
                          className="flex flex-wrap gap-1.5"
                          role="list"
                          aria-label="Technologies used"
                        >
                          {project.tech.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs font-medium border border-muted text-muted-foreground rounded-md"
                              role="listitem"
                              itemProp="keywords"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project links */}
                      <nav
                        className="flex gap-4 text-sm font-medium"
                        aria-label={`${project.title} links`}
                      >
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                            aria-label={`View live demo of ${project.title}`}
                            itemProp="url"
                          >
                            Live
                            <span
                              className="inline-block transform rotate-12"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </a>
                        )}
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                          aria-label={`View source code of ${project.title} on GitHub`}
                          itemProp="codeRepository"
                        >
                          Code
                          <span
                            className="inline-block transform rotate-12"
                            aria-hidden="true"
                          >
                            ↗
                          </span>
                        </a>
                      </nav>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-8" role="contentinfo">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © {getCurrentYear()} Pankaj Thakur — fueled by chai, sarcasm &
                Ctrl+Z
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Page;
