import React from "react";
import MernProjects from "./MernProjects";
import { FaReact } from "react-icons/fa";

const Projects = () => {
  const data = [
    {
      value: "Projects",
      icon: FaReact,
      desc: <MernProjects />,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center px-3">
      <h1 className="text-3xl font-bold text-center border-spacing-2 border-b-2 border-b-blue-600 my-10">
        Projects
      </h1>
      {data.map(({ value, desc }) => (
        <div key={value} className="mb-20">
          {desc}
        </div>
      ))}
    </div>
  );
};

export default Projects;
