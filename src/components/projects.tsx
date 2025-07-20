"use client";

import { GithubSVG, projects } from "@/constants";
import { ExternalLink } from "lucide-react";

const Projects = () => {
  return (
    <div className="border-2 border-black dark:border-zinc-800">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <article
              key={index}
              className="border-2 border-gray-300 dark:border-zinc-800 p-4 sm:p-6 hover:border-black dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-lg sm:text-xl font-bold dark:text-white">
                  {project.title}
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark:text-white hover:opacity-75 transition-opacity"
                  >
                    <GithubSVG />
                  </a>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dark:text-white hover:opacity-75 transition-opacity"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="border-l-4 border-black dark:border-zinc-600 pl-3 sm:pl-4 mb-4 bg-gray-50 dark:bg-zinc-900 p-3">
                <p className="text-sm leading-relaxed dark:text-zinc-300">
                  {project.description}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 dark:text-white">
                  Key Features
                </h4>
                <ul className="space-y-1">
                  {project.features.map((feature, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-start gap-2 dark:text-zinc-300"
                    >
                      <span className="font-bold dark:text-white">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-100 dark:bg-zinc-900 p-3 border-l-4 border-black dark:border-zinc-600">
                <h4 className="font-bold text-sm mb-2 dark:text-white">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-white dark:bg-black px-2 py-1 text-xs border border-gray-300 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-colors dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
