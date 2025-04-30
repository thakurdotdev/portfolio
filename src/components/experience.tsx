import { ArrowUpRight, Building2, Calendar } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

interface Experience {
  title: string;
  company: string;
  companyUrl: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  color: string;
  isCurrent: boolean;
}

const experiences: Experience[] = [
  {
    title: "Junior Software Engineer",
    company: "Netclues India",
    companyUrl: "https://netclues.com",
    period: "Sep 2024 - Present",
    description:
      "Created a workflow creation system using React Flow that allows users to build step-by-step workflows with department-specific services, dynamic actions (approve/reject/payment), and role-based agent assignment. Users can rearrange agents, reorder actions, and create workflows based on departments and services. Also developed a dynamic admin dashboard with customizable widgets where users can enable/disable, resize, rearrange, and customize widgets including name, colors, and graph types (bar, pie, line).",
    achievements: [
      "Created a dynamic workflow builder with React Flow enabling step-by-step workflow creation with customizable actions and role-based agent assignment",
      "Developed a customizable admin dashboard with resizable and draggable widgets featuring configurable visualization options",
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
    color: "#10B981", // emerald
    isCurrent: true,
  },
  {
    title: "Software Engineer Intern",
    company: "Netclues India",
    companyUrl: "https://netclues.com",
    period: "Feb 2024 - Sep 2024",
    description:
      "Learned and applied React.js, Node.js, Express, WebSockets, Sequelize, and MySQL. Implemented a real-time chat system in a microservice architecture for the admin portal, enabling user-to-user communication and department-based automatic groups that display based on user roles and departments.",
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
    color: "#3B82F6", // blue
    isCurrent: false,
  },
];

export default function Experience() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="py-16 md:py-20">
      <div className="max-w-[1300px] mx-auto px-3 md:px-10">
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 relative">
            <span className="relative z-10">Experience</span>
            <span
              className="absolute -bottom-2 left-0 h-1 w-36 md:w-44 rounded-full opacity-20 -z-10"
              style={{ backgroundColor: experiences[0].color }}
            ></span>
          </h2>
          <p
            className={`text-base sm:text-lg md:text-xl max-w-2xl ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            My professional journey and the impact I've made along the way
          </p>

          <div
            className="h-1 w-full rounded-full opacity-20"
            style={{
              background: isDark
                ? `linear-gradient(to right, ${experiences[0].color}10, ${experiences[0].color}20, ${experiences[0].color}10)`
                : `linear-gradient(to right, ${experiences[0].color}10, ${experiences[0].color}20, ${experiences[0].color}10)`,
            }}
          />
        </div>

        <div className="relative">
          {/* Timeline line for tablet and desktop */}
          <div
            className="absolute left-0 md:left-8 top-0 bottom-0 w-px"
            style={{
              background: isDark
                ? `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.01))`
                : `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.05), rgba(0,0,0,0.01))`,
            }}
          >
            {/* Animated gradient line */}
            <div
              className="absolute w-px h-24 top-0 animate-timeline-pulse"
              style={{
                background: `linear-gradient(to bottom, ${experiences[0].color}10, ${experiences[0].color}, ${experiences[0].color}10)`,
              }}
            />
          </div>

          <div className="space-y-16 md:space-y-24 relative">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  background: "transparent",
                }}
              >
                {/* Mobile timeline indicator */}
                <div
                  className="absolute left-0 top-0 h-full w-px md:hidden"
                  style={{
                    background: `linear-gradient(to bottom, ${exp.color}60, transparent)`,
                  }}
                />

                {/* Timeline dot - tablet and desktop */}
                <div className="absolute left-8 top-8 transform -translate-x-1/2 hidden md:block">
                  <div className="relative">
                    <div
                      className={`w-4 h-4 rounded-full border-[3px] bg-background transition-all duration-500 group-hover:scale-125 ${
                        exp.isCurrent ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={
                        {
                          borderColor: exp.color,
                          "--ring-color": exp.isCurrent ? exp.color : undefined,
                          "--ring-offset-color": isDark
                            ? "rgba(15, 15, 25, 1)"
                            : "rgba(255, 255, 255, 1)",
                        } as React.CSSProperties
                      }
                    />
                    {/* Pulse effect */}
                    <div
                      className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                        exp.isCurrent
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{
                        boxShadow: `0 0 0 10px ${exp.color}20`,
                        animation: exp.isCurrent
                          ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                          : undefined,
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="ml-4 md:ml-16 lg:ml-32 transition-all duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                    {/* Left Column - Title & Company */}
                    <div className="lg:col-span-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-xl font-bold tracking-tight relative inline-block"
                            style={{ color: exp.color }}
                          >
                            {exp.title}
                          </h3>
                        </div>

                        <div className="flex flex-col gap-2">
                          {/* Company link with indicator */}
                          <div className="flex items-center gap-2">
                            <Link
                              href={exp.companyUrl}
                              target="_blank"
                              className="group/company inline-flex items-center gap-2 text-base sm:text-lg transition-colors"
                            >
                              <Building2
                                className="size-4 transition-transform duration-300 group-hover/company:text-blue-500"
                                style={{ color: exp.color }}
                              />
                              <span className="relative">
                                {exp.company}
                                <span
                                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover/company:w-full transition-all duration-300 ease-in-out"
                                  style={{ backgroundColor: exp.color }}
                                />
                              </span>
                              <ArrowUpRight
                                className="size-4 transition-transform duration-300 
                                group-hover/company:translate-x-1 group-hover/company:-translate-y-1"
                              />
                            </Link>
                          </div>

                          <div className="flex items-center gap-2 text-sm sm:text-base">
                            <Calendar
                              className="size-4"
                              style={{ color: exp.color }}
                            />
                            <span
                              className={
                                isDark ? "text-gray-400" : "text-gray-600"
                              }
                            >
                              {exp.period}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Description & Skills */}
                    <div className="lg:col-span-8">
                      <div
                        className={`p-6 rounded-lg relative transition-all duration-500 group-hover:shadow-lg ${
                          exp.isCurrent ? "border-l-2" : ""
                        }`}
                        style={{
                          backgroundColor: isDark
                            ? "rgba(25, 25, 35, 0.5)"
                            : "rgba(250, 250, 255, 0.5)",
                          backdropFilter: "blur(8px)",
                          border: `1px solid ${exp.color}15`,
                          borderLeftColor: exp.isCurrent
                            ? exp.color
                            : `${exp.color}15`,
                          boxShadow: exp.isCurrent
                            ? `0 0 20px ${exp.color}10`
                            : "none",
                        }}
                      >
                        {/* Current position top indicator */}
                        {exp.isCurrent && (
                          <div
                            className="absolute -top-3 left-6 px-4 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: isDark
                                ? "rgba(25, 25, 35, 0.8)"
                                : "rgba(255, 255, 255, 0.9)",
                              border: `1px solid ${exp.color}30`,
                              color: exp.color,
                            }}
                          >
                            <span className="flex items-center gap-1">
                              <span className="relative flex h-2 w-2">
                                <span
                                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                  style={{ backgroundColor: exp.color }}
                                ></span>
                                <span
                                  className="relative inline-flex rounded-full h-2 w-2"
                                  style={{ backgroundColor: exp.color }}
                                ></span>
                              </span>
                              Present
                            </span>
                          </div>
                        )}

                        {/* Subtle corner accent */}
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-br-lg opacity-20" />

                        <p
                          className={`text-base sm:text-lg mb-6 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {exp.description}
                        </p>

                        {/* Key Achievements - new section */}
                        <div className="mb-6">
                          <h4
                            className="text-sm font-semibold mb-3"
                            style={{ color: exp.color }}
                          >
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span
                                  className="mt-1.5 min-w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: exp.color }}
                                />
                                <span className="text-sm">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 text-xs rounded-full transition-all duration-300 hover:shadow-sm ${
                                exp.isCurrent ? "hover:scale-105" : ""
                              }`}
                              style={{
                                backgroundColor: isDark
                                  ? "rgba(35, 35, 45, 0.5)"
                                  : "rgba(245, 245, 250, 0.5)",
                                border: `1px solid ${exp.color}25`,
                                color: exp.color,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
