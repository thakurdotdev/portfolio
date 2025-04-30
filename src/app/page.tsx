"use client";

import { Particles } from "@/components/magicui/particles";
import ProjectCard from "@/components/project-card";
import ContactSection from "../components/contact-section";
import Experience from "../components/experience";
import HeroSection from "../components/hero";
import TechStack from "../components/tech-stack";

const highlightColor = "#3B82F6";

export default function Page() {
  return (
    <main className="relative">
      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        ease={80}
        color={highlightColor}
        refresh
      />

      <section id="about" className="px-4">
        <HeroSection />
      </section>

      <section className="px-4">
        <TechStack />
      </section>

      <section id="experience" className="px-4">
        <Experience />
      </section>

      <section id="projects" className="px-4">
        <ProjectCard />
      </section>

      <section id="contact" className="px-4">
        <ContactSection />
      </section>
    </main>
  );
}
