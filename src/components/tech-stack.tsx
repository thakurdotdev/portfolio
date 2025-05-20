import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

interface TechItem {
  name: string;
  category: string;
}

interface TechCategory {
  name: string;
  items: TechItem[];
}

const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: [
      { name: "React", category: "Framework" },
      { name: "Next.js", category: "Framework" },
      { name: "React Native", category: "Mobile" },
      { name: "TypeScript", category: "Language" },
      { name: "Tailwind", category: "Styling" },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", category: "Runtime" },
      { name: "PostgreSQL", category: "Database" },
      { name: "Express", category: "Framework" },
      { name: "MongoDB", category: "Database" },
      { name: "Sequelize", category: "ORM" },
      { name: "Socket.IO", category: "Real-time" },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Git", category: "Version Control" },
      { name: "VS Code", category: "Editor" },
    ],
  },
];

export default function TechStack() {
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
      id="tech-stack"
      ref={sectionRef}
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none -z-10">
        <div className="col-span-full row-start-3 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block"></div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isInView ? 0.7 : 0, x: isInView ? 0 : -50 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute top-20 left-8 pointer-events-none hidden md:block"
        >
          <span
            className={`text-[8rem] font-thin tracking-tighter select-none
            text-neutral-200 dark:text-neutral-800`}
          >
            02
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
          /T
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header - Deconstructed and asymmetric */}
        <div className="relative mb-20 md:mb-24 px-4 sm:px-6 lg:px-8">
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
              <span className="block">Tech Stack</span>
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400">
              Technologies and tools I use to bring ideas to life.
            </p>
          </motion.div>
        </div>

        {/* Main content container */}
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className={`relative p-6 md:p-12 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm`}
          >
            {/* Main grid layout for all tech categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 relative">
              {techStack.map((category, index) => (
                <CategoryCard
                  key={category.name}
                  category={category}
                  index={index}
                  isDark={isDark}
                  isInView={isInView}
                />
              ))}
            </div>

            {/* Decorative corner elements */}
            <div className="absolute -bottom-3 -left-3 w-12 h-12 md:w-16 md:h-16 border-l-2 border-b-2 border-neutral-400 opacity-20" />
            <div className="absolute -top-3 -right-3 w-12 h-12 md:w-16 md:h-16 border-r-2 border-t-2 border-neutral-400 opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  index,
  isDark,
  isInView,
}: {
  category: TechCategory;
  index: number;
  isDark: boolean;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className="relative"
    >
      {/* Category header with number */}
      <div className="mb-6 flex items-center gap-4">
        <span
          className={`text-5xl font-thin text-neutral-800 dark:text-neutral-200`}
        >
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <div className="flex flex-col">
          <h3 className="text-2xl font-light tracking-tight">
            {category.name}
          </h3>
          <div className="h-px w-full bg-neutral-400 opacity-20 mt-1"></div>
        </div>
      </div>

      {/* Technology list with enhanced hover effects */}
      <div
        className={`p-6 ${
          isDark ? "bg-neutral-900/60" : "bg-white/60"
        } backdrop-blur-sm relative overflow-hidden`}
      >
        <div className="space-y-2 relative z-10">
          {category.items.map((tech, techIndex) => (
            <TechItem
              key={tech.name}
              tech={tech}
              index={techIndex}
              isDark={isDark}
              isInView={isInView}
            />
          ))}
        </div>
      </div>

      {/* Side accent line with enhanced animation */}
      <div className="absolute left-0 top-[70px] bottom-6 w-[2px]">
        <motion.div
          className="h-full w-full opacity-20"
          style={{
            background: `linear-gradient(to bottom, ${
              isDark ? "#404040" : "#d4d4d4"
            } 30%, transparent)`,
          }}
          animate={{
            opacity: 0.2,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Extra decorative element */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          scale: isInView ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute -bottom-2 -right-2 w-8 h-8 border-r border-b ${
          isDark ? "border-neutral-700" : "border-neutral-300"
        }`}
      />
    </motion.div>
  );
}

function TechItem({
  tech,
  index,
  isDark,
  isInView,
}: {
  tech: TechItem;
  index: number;
  isDark: boolean;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : -10,
      }}
      transition={{
        duration: 0.3,
        delay: 0.1 + index * 0.05,
        y: { duration: 0.2 },
      }}
      className={`
        flex items-center justify-between group py-2 px-1 relative
      `}
    >
      <div className="flex items-center gap-3 z-10 relative">
        <motion.span
          className={`inline-block h-2 w-2 rounded-full bg-neutral-400 opacity-40`}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
        <span
          className={`font-light ${
            isDark ? "text-neutral-300" : "text-neutral-700"
          }`}
        >
          {tech.name}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-neutral-500 z-10 relative">
        {tech.category}
      </span>
    </motion.div>
  );
}
