"use client";
import { projects } from "@/constants";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      id="projects"
      ref={sectionRef}
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none -z-10">
        {/* Horizontal guide lines with varying opacity */}
        <div className="col-span-full row-start-1 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block"></div>
        <div className="col-span-full row-start-2 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block"></div>
        <div className="col-span-full row-start-9 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block"></div>
      </div>

      {/* Minimal geometric background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Section indicator overlay */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isInView ? 0.7 : 0, x: isInView ? 0 : -50 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute top-20 left-8 pointer-events-none"
        >
          <span
            className={`text-[8rem] font-thin tracking-tighter select-none
            ${isDark ? "text-neutral-800" : "text-neutral-200"}`}
          >
            04
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: 90, x: 50 }}
        animate={{ opacity: 0.07, rotate: 90, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute right-[100px] top-0 -translate-y-1/2 select-none pointer-events-none hidden md:block"
      >
        <span className="text-[120px] md:text-[180px] font-bold tracking-tight opacity-50 text-neutral-900 dark:text-neutral-100">
          /P
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header - Deconstructed and asymmetric */}
        <div className="relative mb-20 md:mb-32 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute -left-2 md:left-4 top-0 hidden md:block"
          >
            <div className="flex flex-col items-start space-y-1">
              <div className="h-[1px] w-8 bg-neutral-400"></div>
              <div className="h-[1px] w-16 bg-neutral-400"></div>
              <div className="h-[1px] w-4 bg-neutral-400"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="ml-0 md:ml-20"
          >
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-8">
              <span className="block">Work</span>
            </h2>
            <p
              className={`text-base max-w-lg ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Selected projects that represent my approach to problem-solving
              and technical implementation.
            </p>
          </motion.div>
        </div>

        {/* Projects Container */}
        <div className="relative space-y-32 sm:space-y-40 md:space-y-56 px-4 sm:px-6 lg:px-8">
          {projects.map((project, index) => (
            <ProjectDisplay
              key={index}
              project={project}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectDisplay({
  project,
  index,
  isDark,
}: {
  project: Project;
  index: number;
  isDark: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);

  // Track when element is in view for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    if (projectRef.current) {
      observer.observe(projectRef.current);
    }

    return () => {
      if (projectRef.current) {
        observer.unobserve(projectRef.current);
      }
    };
  }, []);

  return (
    <motion.article
      ref={projectRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="relative"
    >
      {/* Project Number */}
      <div className="absolute top-0 left-0 md:-left-8 z-10 transform -translate-y-1/2">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isInView ? 0.7 : 0,
            y: isInView ? 0 : -20,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-[4rem] md:text-[6rem] font-thin ${
            isDark ? "text-neutral-800" : "text-neutral-200"
          }`}
        >
          {(index + 1).toString().padStart(2, "0")}
        </motion.span>
      </div>

      {/* The main grid layout for each project */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 relative">
        <div
          className={`md:col-span-7 ${
            isEven ? "md:col-start-1" : "md:col-start-6"
          } row-start-1 relative order-1`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={cardRef}
        >
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
        </div>

        {/* Project Details - overlaps with image in a consistent way */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`md:col-span-6 ${
            isEven ? "md:col-start-7" : "md:col-start-1"
          } md:row-start-1 md:mt-[25%] relative z-10 order-2`}
        >
          <div
            className={`p-6 md:p-8 ${
              isDark ? "bg-neutral-900/90" : "bg-white/90"
            } backdrop-blur-md shadow-lg relative overflow-hidden`}
          >
            {/* Interactive background pattern */}
            <motion.div className="absolute inset-0 opacity-5 pointer-events-none" />

            <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-4 relative">
              {project.title}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 h-[1px] w-16 bg-neutral-500 dark:bg-neutral-400 origin-left"
              />
            </h3>

            <p
              className={`mb-6 text-sm md:text-base font-light ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {project.description}
            </p>

            <div className="space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Key Features
                </h4>
                <ul className="grid grid-cols-1 gap-1.5">
                  {project.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: isInView ? 1 : 0,
                        x: isInView ? 0 : -10,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: 0.6 + i * 0.1,
                      }}
                      className={`text-xs flex items-start ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      <span className="inline-block h-3 w-[2px] bg-neutral-400 mr-2 flex-shrink-0 translate-y-1" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center"
                >
                  <span className="relative font-light text-sm underline-offset-4 decoration-1 decoration-neutral-500 underline group-hover:decoration-transparent transition-all duration-300">
                    Visit Project
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <span className="text-neutral-400 hidden sm:inline">|</span>

                <Link
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center"
                >
                  <span className="relative font-light text-sm text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
                    Code
                  </span>
                  <svg
                    viewBox="0 0 438.549 438.549"
                    className="ml-1 w-3 h-3 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300"
                  >
                    <path
                      fill="currentColor"
                      d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`absolute ${
              isEven ? "right-0" : "left-0"
            } -top-16 w-[1px] h-16 bg-neutral-400 opacity-30 hidden md:block`}
          />
        </motion.div>
      </div>

      {index < projects.length - 1 && (
        <div className="relative mt-24 md:mt-40">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
            className="absolute left-1/4 right-1/4 h-[1px] bg-neutral-300 dark:bg-neutral-700 opacity-20"
          />
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{
              opacity: isInView ? 0.3 : 0,
              rotate: isInView ? 45 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 border border-neutral-400 dark:border-neutral-600 transform"
          />
        </div>
      )}
    </motion.article>
  );
}
