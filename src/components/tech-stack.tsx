import React, { useState } from "react";
import { useTheme } from "next-themes";

interface TechItem {
  name: string;
  category: string;
}

interface TechCategory {
  name: string;
  color: string;
  items: TechItem[];
}

const techStack: TechCategory[] = [
  {
    name: "Frontend",
    color: "#3B82F6",
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
    color: "#10B981",
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
    color: "#8B5CF6",
    items: [
      { name: "Git", category: "Version Control" },
      { name: "VS Code", category: "Editor" },
    ],
  },
];

export default function TechStack() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-3 md:px-10">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 relative">
            <span className="relative z-10">Tech Stack</span>
            <span
              className="absolute -bottom-2 left-0 h-1 w-24 md:w-40 rounded-full opacity-20 -z-10"
              style={{ backgroundColor: techStack[0].color }}
            ></span>
          </h2>
          <p
            className={`text-base sm:text-lg md:text-xl max-w-2xl ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {techStack.map((category) => (
            <div
              key={category.name}
              className="relative overflow-hidden rounded-lg transition-all duration-500"
              style={{
                backgroundColor: isDark
                  ? "rgba(25, 25, 35, 0.5)"
                  : "rgba(250, 250, 255, 0.5)",
                backdropFilter: "blur(10px)",
                borderTop: `1px solid ${category.color}15`,
                borderLeft: `1px solid ${category.color}15`,
                borderRight: `1px solid ${category.color}05`,
                borderBottom: `1px solid ${category.color}05`,
                boxShadow:
                  hoveredCategory === category.name
                    ? `0 10px 30px -10px ${category.color}25`
                    : "none",
              }}
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Gradient accent */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none"
                style={{
                  opacity: hoveredCategory === category.name ? 0.05 : 0,
                  background: `radial-gradient(circle at 30% 30%, ${category.color}, transparent 70%)`,
                }}
              />

              <div className="p-6 relative">
                {/* Category Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className="text-xl font-semibold relative inline-block"
                      style={{ color: category.color }}
                    >
                      <span className="relative inline-block after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:rounded-full after:transition-all after:duration-700 hover:after:w-full after:bg-current">
                        {category.name}
                      </span>
                    </h3>
                    <span
                      className="text-sm px-2 py-0.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: `${category.color}15`,
                        color: category.color,
                      }}
                    >
                      {category.items.length}
                    </span>
                  </div>
                  <div
                    className="h-px w-full transition-all duration-500"
                    style={{
                      background: `linear-gradient(to right, ${category.color}30, transparent 80%)`,
                    }}
                  />
                </div>

                {/* Tech Items */}
                <div className="space-y-3">
                  {category.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center justify-between p-2 rounded-md transition-all duration-300"
                      style={{
                        backgroundColor:
                          hoveredItem === tech.name
                            ? isDark
                              ? "rgba(35, 35, 45, 0.5)"
                              : "rgba(245, 245, 250, 0.5)"
                            : "transparent",
                        transform:
                          hoveredItem === tech.name
                            ? "translateX(4px)"
                            : "translateX(0)",
                      }}
                      onMouseEnter={() => setHoveredItem(tech.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: category.color,
                            transform:
                              hoveredItem === tech.name
                                ? "scale(1.3)"
                                : "scale(1)",
                          }}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isDark ? "text-gray-200" : "text-gray-700"
                          } transition-all duration-300`}
                          style={{
                            transform:
                              hoveredItem === tech.name
                                ? "translateX(2px)"
                                : "translateX(0)",
                          }}
                        >
                          {tech.name}
                        </span>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            hoveredItem === tech.name
                              ? `${category.color}20`
                              : `${category.color}10`,
                          color: category.color,
                        }}
                      >
                        {tech.category}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Decorative elements */}
                <div
                  className="absolute -bottom-2 -right-2 w-12 h-12 rounded-tl-xl opacity-10"
                  style={{
                    background: `linear-gradient(135deg, transparent, ${category.color}30)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
