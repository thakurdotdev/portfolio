import React from "react";
import { FaGithub } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MernProjectData } from "./ProjectData";

const MernProjects = () => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {MernProjectData.map(({ title, img, live, github, techstack }) => (
        <div className="flex flex-col w-96 gap-2 bg-gray-50 drop-shadow-xl dark:bg-grey-800 rounded-lg p-4">
          <div className="relative group rounded-lg bg-violet-50">
            <img
              alt="Project Image"
              width={1000}
              height={1000}
              className="max-w-full h-48 max-h-full object-cover object-top rounded-lg"
              src={img}
            />
            <div className="absolute top-0 scale-x-0 group-hover:scale-100 transition-transform origin-left duration-200 ease-linear bg-gray-800 bg-opacity-60 w-full h-full rounded-lg flex items-center gap-4 justify-center">
              <Link
                to={live}
                target="_blank"
                className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all"
              >
                <BiLinkExternal size={20} />
              </Link>

              <Link
                to={github}
                target="_blank"
                className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all"
              >
                <FaGithub size={20} />
              </Link>
            </div>
            ;
          </div>

          <div className="my-2 flex flex-col gap-3">
            <h3 className="text-xl text-black font-medium">{title}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tech Stack:</span>
              {techstack}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MernProjects;
