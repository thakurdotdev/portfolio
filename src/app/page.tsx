"use client";

import AnimatedFlower from "@/components/AnimatedFlower";
import ProjectCard from "@/components/project-card";
import ContactSection from "../components/contact-section";
import Experience from "../components/experience";
import HeroSection from "../components/hero";
import TechStack from "../components/tech-stack";
import ScrollToTop from "../components/ScrollToTop";

export default function Page() {
  return (
    <main className="relative overflow-hidden">
      <AnimatedFlower right={0} top={50} />
      <AnimatedFlower left={0} bottom={50} />
      <HeroSection />
      <TechStack />
      <Experience />
      <ProjectCard />
      <ContactSection />
      <ScrollToTop />
    </main>
  );
}
