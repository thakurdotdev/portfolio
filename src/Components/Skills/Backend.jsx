import React from "react";
import { BackendSkills } from "./SkillsData";

const Backend = () => {
  return (
    <div className="my-5 flex flex-wrap gap-5 md:w-[700px]">
      {BackendSkills.map((skill, index) => (
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

export default Backend;
