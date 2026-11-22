"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { ProjectsFlow } from "@/components/projects";
import { SceneRail } from "@/components/scene-rail";
import { Section } from "@/components/section";
import { SiteNav } from "@/components/site-nav";
import { VideoDialog } from "@/components/video-dialog";
import { World } from "@/components/world/world";
import { startSmoothScroll } from "@/lib/smooth-scroll";

/** Marks `[data-reveal]` elements as they scroll into view; the CSS does the rest. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Page() {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  useReveal();
  useEffect(() => startSmoothScroll(), []);

  return (
    <>
      {/* First visit: covers the page while the boot sequence plays on the canvas above it. */}
      <div className="boot-cover" aria-hidden="true">
        <span className="boot-caret" />
      </div>
      <World />
      <div id="top" className="min-h-screen overflow-x-clip bg-bg text-fg">
        <SiteNav />
        <SceneRail />

        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />

          <Section id="work" label="Projects" note="Designed, built and deployed by me.">
            <ProjectsFlow onWatch={setActiveVideo} />
          </Section>

          <Section id="experience" label="Experience" note="In India, since February 2024.">
            <Experience />
          </Section>

          <Contact />
        </main>

        <VideoDialog
          isOpen={activeVideo !== null}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo?.url || ""}
          title={activeVideo?.title || ""}
        />
      </div>
    </>
  );
}
