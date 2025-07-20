"use client";

import { GithubSVG, projects } from "@/constants";
import { ExternalLink } from "lucide-react";

const Projects = () => {
  return (
    <div className="bg-white border-2 border-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <article
              key={index}
              className="border-2 border-gray-300 p-4 sm:p-6 hover:border-black transition-colors"
            >
              <div className="flex flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-lg sm:text-xl font-bold">
                  {project.title}
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubSVG />
                  </a>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="border-l-4 border-black pl-3 sm:pl-4 mb-4 bg-gray-50 p-3">
                <p className="text-sm leading-relaxed">{project.description}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {project.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-100 p-3 border-l-4 border-black">
                <h4 className="font-bold text-sm mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-white px-2 py-1 text-xs border border-gray-300 hover:border-black transition-colors"
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
