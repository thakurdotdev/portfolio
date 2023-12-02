import { Tooltip } from "@material-tailwind/react";
import React from "react";
import { ToolSkills } from "./SkillsData";
import "react-lazy-load-image-component/src/effects/blur.css";

const Tools = () => {
  return (
    <div className="my-10 flex gap-10 flex-wrap justify-center items-center">
      {ToolSkills.map((skill, index) => (
        <div key={index}>
          <h1 className="p-2 flex justify-center items-center gap-2 bg-white rounded-md bg-opacity-30 backdrop-blur-md">
            <img src={skill?.icon} alt={skill?.name} className="w-8" />
            {skill?.name}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default Tools;
