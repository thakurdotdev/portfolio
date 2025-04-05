"use client";

import { ExternalLinkIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ProjectData } from "@/lib/Constant";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";

function ProjectsPage() {
  return (
    <section className="py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-8 inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Projects
          <div className="h-1 w-1/3 bg-blue-500 mt-2 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 gap-6">
          {ProjectData.map(
            ({ title, live, description, github, techstack, image }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md md:flex gap-5">
                  {image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="max-md:mt-3">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {title}
                      </h3>
                      <div className="flex space-x-3">
                        <Link
                          href={live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          aria-label="Live demo"
                        >
                          <ExternalLinkIcon height={20} width={20} />
                        </Link>
                        <Link
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          aria-label="GitHub repository"
                        >
                          <GitHubLogoIcon height={20} width={20} />
                        </Link>
                      </div>
                    </div>
                    <p className="text-sm mb-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                      {description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {techstack.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs font-medium py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectsPage;
