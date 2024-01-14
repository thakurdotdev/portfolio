import { Github, LucideExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { ProjectData } from "./constant";

function page() {
  return (
    <div className="flex flex-col justify-center items-center px-3">
      <h1 className="text-3xl font-bold text-center border-spacing-2 border-b-2 border-b-blue-600 my-10">
        Projects
      </h1>
      <div className="flex flex-wrap justify-center gap-10">
        {ProjectData.map(({ title, img, live, github, techstack }, index) => (
          <Card key={index} className="flex flex-col w-96 gap-2 rounded-lg p-4">
            <div className="relative group rounded-lg">
              <Image
                src={img}
                width={500}
                height={500}
                quality={100}
                loading="lazy"
                alt={title}
                className="min-w-full h-48 object-fill object-top"
              />
              <div className="absolute top-0 scale-x-0 group-hover:scale-100 transition-transform duration-200 ease-linear bg-gray-800 bg-opacity-60 w-full h-full flex items-center gap-4 justify-center">
                <Link
                  href={live}
                  target="_blank"
                  className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  <LucideExternalLink size={20} />
                </Link>

                <Link
                  href={github}
                  target="_blank"
                  className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  <Github size={20} />
                </Link>
              </div>
            </div>

            <div className="my-2 flex flex-col gap-3">
              <h3 className="text-xl text-center font-medium">{title}</h3>
              <p className="text-sm">
                <span className="font-medium">Tech Stack:</span>
                {techstack}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default page;
