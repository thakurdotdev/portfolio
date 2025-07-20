import { skills } from "@/constants";
import React from "react";

const About = () => {
  return (
    <div className="border-2 border-black dark:border-zinc-800">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <article className="border-2 border-gray-300 dark:border-zinc-800 p-4 sm:p-6">
              <div className="pb-3 sm:pb-4 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 dark:text-white">
                  About Me
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-500 uppercase tracking-wide">
                  Software Engineer
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base leading-relaxed dark:text-zinc-300">
                <p>
                  <span className="font-bold text-3xl sm:text-4xl float-left mr-2 sm:mr-3 leading-none dark:text-white">
                    H
                  </span>
                  i, I'm Pankaj Thakur, a passionate software engineer based in
                  Ahmedabad, India. I specialize in full-stack development with
                  a focus on creating scalable, user-centric applications that
                  solve real-world problems.
                </p>

                <p>
                  Currently, I work as a Junior Software Engineer at Netclues
                  India, where I've developed innovative workflow management
                  systems using React Flow. These systems enable organizations
                  to design, monitor, and optimize their business processes with
                  unprecedented efficiency.
                </p>

                <div className="bg-gray-100 dark:bg-zinc-900 p-3 sm:p-4 border-l-4 border-black dark:border-zinc-600 italic">
                  <p className="text-sm sm:text-base dark:text-zinc-300">
                    "My journey in software development started with a curiosity
                    about how things work under the hood. Today, I'm proficient
                    in modern technologies including React.js, Node.js,
                    TypeScript, and various databases. I enjoy working on both
                    frontend interfaces and backend systems, always striving to
                    create seamless user experiences."
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-gray-300 dark:border-zinc-800 p-4 sm:p-6 transition-colors">
              <div className="pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold dark:text-white">
                  Technical Skills
                </h3>
                <p className="text-xs text-gray-600 dark:text-zinc-500 uppercase tracking-wide">
                  Technology Stack & Expertise
                </p>
              </div>
              <div className="space-y-4">
                {skills.map((skillCategory, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-zinc-900 p-2 border-l-4 border-black dark:border-zinc-600"
                  >
                    <div className="border-b border-gray-300 dark:border-zinc-800 pb-2 mb-3">
                      <h4 className="font-bold text-sm uppercase tracking-wide dark:text-white">
                        {skillCategory.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skillCategory.items.map((skill) => (
                        <span
                          key={skill}
                          className="bg-white dark:bg-black px-2 py-1 text-xs border border-gray-300 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-colors dark:text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
