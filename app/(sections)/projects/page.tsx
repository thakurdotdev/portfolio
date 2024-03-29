"use client";

import { Github, LucideExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { ProjectData } from "./constant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ProjectsPage() {
  return (
    <div className="flex flex-col justify-center items-center px-3">
      <h1 className="text-3xl font-bold text-center border-spacing-2 border-b-2 border-b-blue-600 my-10">
        Projects
      </h1>
      <div className="flex  lg:max-w-[80%] flex-wrap justify-center gap-10">
        {ProjectData.map(({ title, live, github, techstack }, index) => (
          <Card
            key={index}
            className="flex flex-col max-md:w-[95%] gap-2 rounded-lg p-4 hover:outline-1 hover:outline-dashed "
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-4 justify-center"
            >
              <h3 className="text-xl text-center font-medium">{title}</h3>
              <div className="flex gap-2">
                <Link href={live} target="_blank">
                  <Button variant="outline">
                    <LucideExternalLink size={15} />
                  </Button>
                </Link>

                <Link href={github} target="_blank">
                  <Button variant="secondary">
                    <Github size={15} />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm"
            >
              {techstack.map((tech, index) => (
                <Button key={index} variant="outline" className="ml-2">
                  {tech}
                </Button>
              ))}
            </motion.p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
