"use client";

import About from "@/components/about";
import ContactForm from "@/components/contact";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

const Page = () => {
  const [activeSection, setActiveSection] = useState("about");

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <header className="">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-row justify-between items-center text-xs uppercase tracking-wide border-b border-gray-300 dark:border-zinc-800 pb-3 mb-6 gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="font-bold dark:text-white">Est. 2020</span>
                <span className="dark:text-zinc-600">•</span>
                <span className="hidden sm:inline dark:text-white">
                  Thakur Edition
                </span>
                <span className="sm:hidden dark:text-white">AHM Edition</span>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="text-center sm:text-right">
                  <div className="font-bold text-xs sm:text-sm dark:text-white">
                    {getCurrentDate()}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-2 leading-tight font-serif dark:text-white">
                PANKAJ THAKUR
              </h1>
              <div className="mx-auto max-w-2xl">
                <p className="text-sm sm:text-base font-bold uppercase tracking-wider dark:text-zinc-400">
                  Software Engineer • Ahmedabad, India
                </p>
              </div>
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-10 bg-white dark:bg-black py-4 sm:static sm:bg-transparent dark:sm:bg-transparent sm:py-0 sm:shadow-none sm:mb-5">
          <div className="max-w-6xl mx-auto flex justify-center w-full">
            <div className="flex flex-wrap justify-center gap-1 text-sm font-bold uppercase tracking-wide bg-gray-100 dark:bg-zinc-900 p-1">
              {["About", "Experience", "Projects", "Contact"].map((item) => {
                return (
                  <button
                    key={item}
                    onClick={() => setActiveSection(item.toLowerCase())}
                    className={`flex items-center justify-center gap-2 py-2 px-4 sm:px-6 transition-all min-w-0 cursor-pointer ${
                      activeSection === item.toLowerCase()
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                        : "bg-transparent text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className={activeSection === "about" ? "" : "hidden"}>
            <About />
          </div>

          <div className={activeSection === "experience" ? "" : "hidden"}>
            <Experience />
          </div>

          <div className={activeSection === "projects" ? "" : "hidden"}>
            <Projects />
          </div>

          <div className={activeSection === "contact" ? "" : "hidden"}>
            <ContactForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
