import Skills from "@/components/Skills";
import Particles from "@/components/ui/particles";
import ProjectsPage from "@/components/Projects";
import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import Footer from "@/components/Footer";
import Combined from "@/components/Combined";

export default function Home() {
  return (
    <div className="relative mx-auto md:max-w-[70%] lg:max-w-[40%] px-3 pt-10">
      <Particles
        className="absolute inset-0 pointer-events-none -z-10"
        quantity={100}
        ease={80}
        refresh
      />
      <main>
        <Intro />
        <Skills />
        <Combined />
        <ProjectsPage />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}