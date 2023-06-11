import React from "react";
import { Tooltip } from "@material-tailwind/react";
import { FrontendSkills } from "./SkillsData";

const Frontend = () => {
  return (
    <div className=" my-10 flex gap-10 flex-wrap justify-center items-center ">
      <div className="flex flex-wrap gap-10 justify-center items-center">
        {FrontendSkills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40"
          >
            <Tooltip content={skill?.name}>
              <img
                src={skill?.icon}
                alt={skill?.name}
                className="w-24 h-w-24 p-5 "
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frontend;
