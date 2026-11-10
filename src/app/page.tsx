"use client";

import { MotionConfig } from "motion/react";
import { useState } from "react";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { ProjectsFlow } from "@/components/projects";
import { Section } from "@/components/section";
import { ServerTerminal } from "@/components/server-terminal";
import { SiteNav } from "@/components/site-nav";
import { VideoDialog } from "@/components/video-dialog";
import { serverSnapshot } from "@/constants/server";

export default function Page() {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <div id="top" className="min-h-screen overflow-x-clip bg-bg text-fg">
        <SiteNav />

        <main>
          <Hero />

          <Section id="work" label="Projects" note="Designed, built and deployed by me.">
            <ProjectsFlow onWatch={setActiveVideo} />
          </Section>

          <Section id="experience" label="Experience">
            <Experience />
          </Section>

          <Section id="server" label="Server" note={`Snapshot from ${serverSnapshot.capturedOn}.`}>
            <div className="grid gap-x-12 gap-y-6 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-end">
              <p className="display display-l -ml-[0.04em] lg:col-span-5">{serverSnapshot.totalOnline} online</p>
              <p className="lead max-w-[40ch] lg:col-span-7 lg:pb-2">
                Every project above runs on one 2-core server that I look after, supervised by pm0. This is its
                process table. Pick an app to jump to its project.
              </p>
            </div>
            <div className="mt-10 sm:mt-14">
              <ServerTerminal />
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
