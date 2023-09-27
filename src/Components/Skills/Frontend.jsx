import React from "react";
import { Tooltip } from "@material-tailwind/react";
import { FrontendSkills } from "./SkillsData";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Frontend = () => {
  return (
    <div className=" my-10 flex gap-10 flex-wrap justify-center items-center ">
      <div className="flex flex-wrap gap-10 justify-center items-center">
        {FrontendSkills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-full bg-white backdrop-blur-md bg-opacity-40 hover:bg-opacity-80 shadow-md"
          >
            <Tooltip content={skill?.name}>
              <LazyLoadImage
                effect="blur"
                src={skill?.icon}
                alt={skill?.name}
                className="w-28 h-28 p-5"
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frontend;
