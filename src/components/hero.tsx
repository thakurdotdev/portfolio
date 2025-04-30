"use client";

import { Button } from "@/components/ui/button";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { socialLinks } from "@/constants";
import { Code2, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const highlightColor = "#3B82F6";

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative min-h-[100vh] flex max-md:pt-10 md:items-center overflow-hidden">
      <div
        className="absolute -z-10 top-20 right-10 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: highlightColor }}
      />
      <div
        className="absolute -z-10 bottom-10 left-10 w-40 h-40 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
        style={{ background: highlightColor }}
      />

      <div className="w-full max-w-[1300px] mx-auto px-3 md:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:items-center">
          {/* Left side - Text content */}
          <div className="lg:col-span-7 relative z-10">
            {/* Main headline */}
            <div className="space-y-6 mb-12 relative">
              <h1 className="flex items-center gap-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ">
                <span>Software</span>
                <ContainerTextFlip
                  words={["Engineer", "Developer", "Creator"]}
                  className="flex justify-center items-center"
                  textClassName="text-4xl md:text-6xl"
                />
              </h1>

              <p
                className={`text-lg md:text-xl leading-relaxed max-w-2xl transition-opacity duration-1000`}
              >
                I'm a Full Stack Developer with experience in React, Node.js,
                and mobile app development.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "1+", label: "Year of Experience" },
                { value: "4+", label: "Projects Completed" },
                { value: "10+", label: "Tech Stack" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden p-4 rounded-lg text-center group bg-background/60 backdrop-blur-sm border border-background/20"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <p
                      className="text-3xl font-bold mb-1 transition-all duration-500"
                      style={{ color: highlightColor }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(120deg, transparent, ${highlightColor}08, transparent)`,
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              className="w-1/3 h-px opacity-20 my-5"
              style={{
                background: `linear-gradient(to right, transparent, ${highlightColor}, transparent)`,
              }}
            />

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="mailto:pankaj@thakur.dev" target="_blank">
                <Button
                  aria-label="Contact me via email"
                  className="relative overflow-hidden group"
                  variant="secondary"
                >
                  <span className="flex items-center gap-2 relative z-10">
                    <Mail className="transition-all duration-300 group-hover:scale-110" />
                    Contact Me
                  </span>
                </Button>
              </Link>

              {/* Social Links */}
              <div className="space-x-2">
                {socialLinks.map((social) => (
                  <Link key={social.name} href={social.href} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`${social.name} Profile`}
                      className="relative overflow-hidden border  transition-all duration-300"
                    >
                      <span className="relative z-10">{social.icon}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Visual content */}
          <div className="lg:col-span-5 relative block">
            <div className={`relative transition-all duration-700 opacity-100`}>
              {/* Main code card */}
              <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/5">
                <div className="h-10 flex items-center px-6 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Code2 size={12} className="opacity-50" />
                    <span className="text-xs opacity-50">developer.tsx</span>
                  </div>
                </div>
                <div className="p-8 font-mono text-sm bg-background/60 backdrop-blur-sm border border-background/20">
                  <div className="space-y-2.5">
                    <div className="opacity-95">
                      <span className="text-blue-500">const</span>{" "}
                      <span className="text-yellow-500">developer</span>{" "}
                      <span className="text-blue-500">=</span> {"{"}
                    </div>
                    <div className="pl-6 opacity-95">
                      <span className="text-purple-500">name</span>:{" "}
                      <span className="text-green-500">'Pankaj Thakur'</span>,
                    </div>
                    <div className="pl-6 opacity-95">
                      <span className="text-purple-500">role</span>:{" "}
                      <span className="text-green-500">
                        'Software Engineer'
                      </span>
                      ,
                    </div>
                    <div className="pl-6 opacity-95">
                      <span className="text-purple-500">experience</span>:{" "}
                      <span className="text-orange-400">'1 year'</span>,
                    </div>
                    <div className="pl-6 opacity-95">
                      <span className="text-purple-500">expertise</span>: [
                      <span className="text-green-500">'React'</span>,{" "}
                      <span className="text-green-500">'Node.js'</span>,{" "}
                      <span className="text-green-500">'Full Stack'</span>],
                    </div>
                    <div className="pl-6 opacity-95">
                      <span className="text-purple-500">passion</span>:{" "}
                      <span className="text-green-500">
                        'Building web applications'
                      </span>
                      ,
                    </div>
                    <div className="opacity-95">{"}"}</div>
                    <div className="mt-4 opacity-95">
                      <span className="text-blue-500">function</span>{" "}
                      <span className="text-yellow-500">createWebApp</span>
                      <span className="text-blue-500">()</span> {"{"}
                    </div>
                    <div className="pl-6 opacity-95">
                      <span className="text-blue-500">return</span>{" "}
                      <span className="text-green-500">
                        'Exceptional UI/UX'
                      </span>
                      ;
                    </div>
                    <div className="opacity-95">{"}"}</div>
                  </div>
                  <div className="mt-3 text-blue-400">
                    <span className="inline-block h-5 w-0.5 bg-current animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
