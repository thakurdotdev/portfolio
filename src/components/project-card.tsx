"use client";
import { projects } from "@/constants";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState } from "react";

interface Project {
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  link: string;
  sourceCode: string;
  icon?: string;
  image: string;
  color: string;
}

export default function ProjectsShowcase() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="py-16 md:py-20">
      <div className="max-w-[1300px] mx-auto px-3 md:px-10">
        <div className="mb-12 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 relative">
              <span className="relative z-10">Projects</span>
              <span
                className="absolute -bottom-2 left-0 h-1 w-24 md:w-32 rounded-full opacity-20 -z-10"
                style={{ backgroundColor: projects[0].color }}
              ></span>
            </h2>
            <p
              className={`text-base sm:text-lg md:text-xl max-w-2xl ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              A collection of my recent work, showcasing web applications built
              with modern technologies.
            </p>
          </div>
        </div>

        <div className="space-y-32 md:space-y-48">
          {projects.map((project, index) => (
            <ProjectItem key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const togglePlay = () => {
    if (!videoRef.current) return;
    setIsPlaying((prev) => {
      if (videoRef.current) {
        prev ? videoRef.current.pause() : videoRef.current.play();
      }
      return !prev;
    });
  };

  return (
    <div className="relative group/project">
      {/* Project Number */}
      <div
        className="absolute -left-4 md:-left-12 top-0 opacity-5 select-none transition-opacity duration-700 ease-in-out group-hover/project:opacity-10"
        style={{ willChange: "opacity" }}
      >
        <span
          className="text-8xl sm:text-9xl md:text-[12rem] font-bold tracking-tighter"
          style={{ color: project.color }}
        >
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 relative z-10">
        {/* Left Column - Details */}
        <div className="lg:col-span-5 lg:pr-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
                <span
                  style={{ color: project.color }}
                  className="relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:rounded-full after:transition-all after:duration-700 hover:after:w-full after:bg-current"
                >
                  {project.title}
                </span>
              </h3>

              <p
                className={`text-base sm:text-lg ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {project.description}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <button
                  className="flex items-center gap-2 text-sm font-medium mb-4 transition-all
                  group/features"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                >
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform duration-500 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    style={{ color: project.color }}
                  />
                  <span className="relative inline-block">
                    Key Features
                    <span
                      className="absolute -bottom-0.5 left-0 h-px w-0 group-hover/features:w-full transition-all duration-300 ease-in-out"
                      style={{ backgroundColor: project.color }}
                    ></span>
                  </span>
                </button>

                <div
                  className={`pl-6 space-y-3 transition-all duration-500 ease-in-out transform ${
                    isExpanded
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden -translate-y-4"
                  }`}
                  style={{ willChange: "transform, opacity, max-height" }}
                >
                  {project.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 group/feature relative"
                    >
                      <div
                        className="mt-1.5 w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{ backgroundColor: project.color }}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium relative inline-block">
                  Technologies
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-0 group-hover/project:w-full transition-all duration-500 ease-in-out"
                    style={{ backgroundColor: project.color }}
                  ></span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full transition-all duration-300 hover:shadow-sm"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(25, 25, 35, 0.5)"
                          : "rgba(250, 250, 255, 0.5)",
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${project.color}25`,
                        color: project.color,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href={project.link}
              target="_blank"
              className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-md"
              style={{
                backgroundColor: project.color,
              }}
            >
              <span className="relative z-10 font-medium text-white">
                Visit Site
              </span>
              <ArrowUpRight
                className="relative z-10 size-4 text-white transition-transform duration-300 
                group-hover:translate-x-1 group-hover:-translate-y-1"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                  transform: "translateX(-100%)",
                  animation: "shine 3s infinite",
                }}
              />
            </Link>

            <Link
              href={project.sourceCode}
              target="_blank"
              className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-md"
              style={{
                backgroundColor: isDark
                  ? "rgba(25, 25, 35, 0.5)"
                  : "rgba(250, 250, 255, 0.5)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${project.color}25`,
              }}
            >
              <span className="relative z-10" style={{ color: project.color }}>
                Source Code
              </span>
              <svg
                width="1024"
                height="1024"
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 transition-transform duration-300 
                group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                  transform="scale(64)"
                  fill={project.color}
                />
              </svg>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{
                  background: `linear-gradient(120deg, transparent, ${project.color}08, transparent)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </Link>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
            }}
            className="relative z-10 mt-20 rounded-lg border border-neutral-200 bg-neutral-100 p-2 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <img
                src={project.image}
                alt="Landing page preview"
                className="aspect-[16/9] h-auto w-full object-cover"
                height={1000}
                width={1000}
              />
            </div>
          </motion.div>

          {/* Accent decoration */}
          <div
            className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 blur-lg"
            style={{
              background: project.color,
            }}
          />
        </div>
      </div>

      {index < projects.length - 1 && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bottom-[-4rem] md:bottom-[-6rem] w-1/3 h-px opacity-20"
          style={{
            background: `linear-gradient(to right, transparent, ${project.color}, transparent)`,
          }}
        />
      )}
    </div>
  );
}
