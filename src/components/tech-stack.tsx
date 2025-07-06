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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  const titleLetters = "TECH STACK".split("");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden py-16 md:py-24 flex items-center justify-center"
      id="tech-stack"
    >
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 0.03 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="text-[150px] md:text-[250px] lg:text-[350px] font-extralight text-neutral-900 dark:text-neutral-100 select-none">
          &lt;/&gt;
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12 md:space-y-16">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative inline-block">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tighter">
                <span className="text-neutral-900 dark:text-neutral-100">
                  {titleLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 20,
                      }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                      className="inline-block"
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </span>
              </div>

              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isVisible ? 1 : 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-[1px] w-16 bg-gradient-to-r from-transparent via-neutral-600 dark:via-neutral-400 to-transparent origin-center"
              />
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
              <span className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light tracking-wide">
                Tools & Technologies
              </span>
              <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              A curated collection of technologies I use to build robust,
              scalable, and innovative digital solutions.
            </p>
          </motion.div>

          {/* Tech Stack Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {techStack.map((category, index) => (
                <CategoryCard
                  key={category.name}
                  category={category}
                  index={index}
                  isDark={isDark}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex items-center justify-center gap-2 pt-8"
          >
            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600 opacity-40"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600 opacity-40"></div>
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
  isVisible,
}: {
  category: TechCategory;
  index: number;
  isDark: boolean;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
      className="relative group"
    >
      {/* Category Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
          className="inline-flex items-center gap-3 mb-3"
        >
          <span className="text-2xl font-extralight text-neutral-400 dark:text-neutral-600">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <div className="w-4 h-[1px] bg-neutral-300 dark:bg-neutral-700"></div>
        </motion.div>

        <h3 className="text-xl md:text-2xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
          {category.name}
        </h3>

        <div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-700 mx-auto opacity-60"></div>
      </div>

      {/* Technologies List */}
      <div className="space-y-3">
        {category.items.map((tech, techIndex) => (
          <TechItem
            key={tech.name}
            tech={tech}
            index={techIndex}
            categoryIndex={index}
            isDark={isDark}
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isVisible ? 0.1 : 0, scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
        className="absolute -top-2 -right-2 w-4 h-4 border border-neutral-300 dark:border-neutral-700 rounded-full"
      />
    </motion.div>
  );
}

function TechItem({
  tech,
  index,
  categoryIndex,
  isDark,
  isVisible,
}: {
  tech: TechItem;
  index: number;
  categoryIndex: number;
  isDark: boolean;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
      transition={{
        duration: 0.4,
        delay: 1.4 + categoryIndex * 0.1 + index * 0.05,
      }}
      className="group/tech relative"
    >
      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-transparent hover:border-neutral-200/20 dark:hover:border-neutral-800/30 transition-all duration-300 hover:bg-white/10 dark:hover:bg-black/20">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 opacity-60"
            whileHover={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <span className="font-light text-neutral-700 dark:text-neutral-300 group-hover/tech:text-neutral-900 dark:group-hover/tech:text-neutral-100 transition-colors">
            {tech.name}
          </span>
        </div>
        <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500 opacity-70">
          {tech.category}
        </span>
      </div>
    </motion.div>
  );
}
