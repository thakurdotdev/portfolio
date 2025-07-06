"use client";

import { ArrowUpRight, Building2, Calendar } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Experience {
  title: string;
  company: string;
  companyUrl: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  isCurrent: boolean;
}

const experiences: Experience[] = [
  {
    title: "Junior Software Engineer",
    company: "Netclues India",
    companyUrl: "https://netclues.com",
    period: "Sep 2024 - Present",
    description:
      "Created a workflow creation system using React Flow that allows users to build step-by-step workflows with department-specific services, dynamic actions, and role-based agent assignment. Also developed a dynamic admin dashboard with customizable widgets.",
    achievements: [
      "Built dynamic workflow builder with React Flow enabling customizable actions and role-based assignment",
      "Developed customizable admin dashboard with resizable widgets and configurable visualization options",
    ],
    skills: [
      "Node.js",
      "React",
      "React Flow",
      "Dashboard Design",
      "Sequelize",
      "MySQL",
      "Microservices",
    ],
    isCurrent: true,
  },
  {
    title: "Software Engineer Intern",
    company: "Netclues India",
    companyUrl: "https://netclues.com",
    period: "Feb 2024 - Sep 2024",
    description:
      "Learned and applied modern web technologies including React.js, Node.js, and WebSockets. Implemented a real-time chat system in microservice architecture for the admin portal with department-based automatic groups.",
    achievements: [
      "Implemented real-time chat system with WebSockets, improving internal communication efficiency",
      "Created department-based automatic chat groups with role-based access control",
    ],
    skills: [
      "React.js",
      "Node.js",
      "Express",
      "WebSockets",
      "Sequelize",
      "MySQL",
      "Microservices",
    ],
    isCurrent: false,
  },
];

export default function Experience() {
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
      id="experience"
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
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96 border border-neutral-300 dark:border-neutral-700 rotate-45"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - matching Hero style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tighter">
              <span className="text-neutral-900 dark:text-neutral-100">
                EXPERIENCE
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
                Professional Journey
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
            My professional journey and the impact I've made building scalable
            solutions and meaningful user experiences.
          </motion.p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-12 md:space-y-16">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={index}
              experience={exp}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Timeline indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-4 mt-16 md:mt-20"
        >
          <div className="w-12 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            Journey Continues
          </span>
          <div className="w-12 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceCard({
  experience,
  index,
  isInView,
}: {
  experience: Experience;
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
      {/* Current position indicator */}
      {experience.isCurrent && (
        <div className="absolute -top-3 left-4 md:left-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">
              Current
            </span>
          </div>
        </div>
      )}

      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-neutral-200/30 dark:border-neutral-800/30 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-neutral-300/50 dark:group-hover:border-neutral-700/50">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Role Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                {experience.title}
              </h3>

              <Link
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 text-lg"
              >
                <Building2 size={18} className="text-neutral-500" />
                <span className="relative font-medium text-neutral-700 dark:text-neutral-300 group-hover/link:text-neutral-900 dark:group-hover/link:text-neutral-100 transition-colors duration-300">
                  {experience.company}
                  <span className="absolute -bottom-px left-0 h-px w-full bg-current transform origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300"></span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-neutral-500 transform transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                />
              </Link>

              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Calendar size={16} />
                <span className="font-light">{experience.period}</span>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {experience.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {experience.skills.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                  className="px-3 py-1 text-xs uppercase tracking-wider border border-neutral-300/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-400 rounded-full bg-neutral-50/50 dark:bg-neutral-800/50"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-neutral-400"></span>
                Key Achievements
              </h4>
              <ul className="space-y-4">
                {experience.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + i * 0.1,
                    }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {achievement}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-neutral-300/30 dark:border-neutral-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-neutral-300/30 dark:border-neutral-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}
