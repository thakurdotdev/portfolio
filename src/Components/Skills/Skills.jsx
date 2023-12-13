import React from "react";
import { Frontend, Backend, Tools } from "./AllSkills.jsx";

const skillComponents = {
  Frontend,
  Backend,
  Tools,
};

const Skills = () => {
  const data = [
    {
      label: "Frontend",
    },
    {
      label: "Backend",
    },
    {
      label: "Tools",
    },
  ];

  return (
    <div className="md:py-10">
      <div className="flex flex-col items-center justify-center py-5">
        <p className="text-gray-900 font-bold text-3xl">Skills</p>
        <div className="h-[2px] w-20 bg-blue-500 rounded-full my-1"></div>
      </div>
      <div className="flex flex-col justify-center items-center px-3">
        {data.map(({ label }) => (
          <div key={label} className="flex flex-col m-1">
            <div className="flex flex-col">
              <span className="text-xl mt-1">{label}</span>
              <div className="w-16 h-[1px] bg-blue-500 rounded-full my-1"></div>
            </div>
            {skillComponents[label] &&
              React.createElement(skillComponents[label])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
