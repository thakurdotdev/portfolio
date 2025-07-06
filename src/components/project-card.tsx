"use client";

import { projects } from "@/constants";
import { ArrowUpRight, ExternalLink, Github, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

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
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      className="py-16 md:py-20 relative overflow-hidden"
      id="projects"
      ref={sectionRef}
    >
      {/* Minimal background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isInView ? 0.03 : 0,
            scale: isInView ? 1 : 0.8,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-96 h-96 border border-neutral-300 dark:border-neutral-700 rotate-45"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - matching Hero & Experience style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tighter">
              <span className="text-neutral-900 dark:text-neutral-100">
                PROJECTS
              </span>
            </h2>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mx-auto h-[2px] w-16 bg-gradient-to-r from-transparent via-neutral-600 dark:via-neutral-400 to-transparent"
            />

            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
              <span className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light tracking-wide">
                Featured Work
              </span>
              <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="max-w-2xl mx-auto mt-8 text-neutral-600 dark:text-neutral-400 font-light leading-relaxed"
          >
            A collection of projects that showcase my technical skills and
            passion for creating meaningful digital experiences.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-16 md:space-y-20">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* End indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-4 mt-16 md:mt-20"
        >
          <div className="w-12 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            More Coming Soon
          </span>
          <div className="w-12 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: Project;
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-neutral-200/30 dark:border-neutral-800/30 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-neutral-300/50 dark:group-hover:border-neutral-700/50 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Project Image */}
          <div className="relative order-2 lg:order-1 overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: isInView ? 1 : 1.1 }}
              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
              className="aspect-[16/10] lg:aspect-square relative"
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>

            {/* Project number overlay */}
            <div className="absolute top-4 left-4">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isInView ? 1 : 0,
                  scale: isInView ? 1 : 0.8,
                }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
                className="inline-flex items-center justify-center w-8 h-8 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-900 dark:text-neutral-100"
              >
                {(index + 1).toString().padStart(2, "0")}
              </motion.span>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6 md:p-8 lg:p-10 space-y-6 order-1 lg:order-2">
            <div className="space-y-4">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100"
              >
                {project.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed"
              >
                {project.description}
              </motion.p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <motion.h4
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
                className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2"
              >
                <Zap size={16} className="text-neutral-500" />
                Key Features
              </motion.h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.features.slice(0, 4).map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      x: isInView ? 0 : -10,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.7 + index * 0.2 + i * 0.05,
                    }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <motion.h4
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
              >
                Built With
              </motion.h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      scale: isInView ? 1 : 0.8,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: 0.9 + index * 0.2 + i * 0.05,
                    }}
                    className="px-3 py-1 text-xs uppercase tracking-wider border border-neutral-300/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-400 rounded-full bg-neutral-50/50 dark:bg-neutral-800/50"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Action Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
              className="flex items-center gap-6 pt-4"
            >
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2"
              >
                <ExternalLink size={16} className="text-neutral-500" />
                <span className="relative font-medium text-neutral-700 dark:text-neutral-300 group-hover/link:text-neutral-900 dark:group-hover/link:text-neutral-100 transition-colors duration-300">
                  Live Demo
                  <span className="absolute -bottom-px left-0 h-px w-full bg-current transform origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300"></span>
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-neutral-500 transform transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                />
              </Link>

              <Link
                href={project.sourceCode}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 438.549 438.549"
                  className="size-4"
                  height="23"
                  width="23"
                >
                  <path
                    fill="currentColor"
                    d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                  ></path>
                </svg>
                <span className="relative text-neutral-600 dark:text-neutral-400 group-hover/link:text-neutral-900 dark:group-hover/link:text-neutral-100 transition-colors duration-300">
                  Source Code
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-neutral-300/30 dark:border-neutral-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-neutral-300/30 dark:border-neutral-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}
