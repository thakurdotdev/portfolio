"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { ProjectsFlow } from "@/components/projects";
import { SceneRail } from "@/components/scene-rail";
import { Section } from "@/components/section";
import { ServerTerminal } from "@/components/server-terminal";
import { SiteNav } from "@/components/site-nav";
import { VideoDialog } from "@/components/video-dialog";
import { World } from "@/components/world/world";
import { serverSnapshot } from "@/constants/server";
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
    <MotionConfig reducedMotion="user">
      <World />
      <div id="top" className="min-h-screen overflow-x-clip bg-bg text-fg">
        <SiteNav />
        <SceneRail />

        <main>
          <Hero />

          <Section id="work" index={1} label="Projects" note="Designed, built and deployed by me.">
            <ProjectsFlow onWatch={setActiveVideo} />
          </Section>

          <Section
            id="experience"
            index={2}
            label="Experience"
            scene="terrain"
            stage="viewport"
            alpha={0.55}
          >
            <Experience />
          </Section>

          <Section
            id="server"
            index={3}
            label="Server"
            note={`Snapshot from ${serverSnapshot.capturedOn}.`}
            scene="orbit"
            stage="#stage-server"
          >
            <div className="grid gap-x-12 gap-y-6 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-end">
              <p data-reveal="" className="display display-xl -ml-[0.05em] lg:col-span-5">
                {serverSnapshot.totalOnline} online
              </p>
              <p data-reveal="" className="lead max-w-[40ch] lg:col-span-7 lg:pb-2">
                Every project above runs on one 2-core server that I look after, supervised by pm0. Here it is as a
                core with its processes in orbit, and as its process table. Point at a row to find its satellite.
              </p>
            </div>
            <div className="mt-10 grid items-center gap-x-12 gap-y-8 sm:mt-14 lg:grid-cols-12">
              <div
                id="stage-server"
                data-drag=""
                aria-hidden="true"
                className="stage mx-auto aspect-square w-full max-w-[36rem] lg:col-span-5"
              />
              <div className="lg:col-span-7">
                <ServerTerminal />
              </div>
            </div>
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
    </MotionConfig>
  );
}
