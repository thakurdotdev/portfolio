import { Tooltip } from "@material-tailwind/react";
import React from "react";
import { ToolSkills } from "./SkillsData";

const Tools = () => {
  return (
    <div className="my-10 flex gap-10 flex-wrap justify-center items-center">
      {ToolSkills.map((skill, index) => (
        <div
          key={index}
          className="flex flex-col items-center rounded-full bg-white backdrop-blur-md bg-opacity-40 hover:bg-opacity-80 shadow-md"
        >
          <Tooltip content={skill.name}>
            <img
              src={skill?.icon}
              alt={skill?.name}
              className="w-28 h-28 p-5 "
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default Tools;
