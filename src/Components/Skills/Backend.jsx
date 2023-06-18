import { Tooltip } from "@material-tailwind/react";
import React from "react";
import { motion } from "framer-motion";
import { BackendSkills } from "./SkillsData";

const Backend = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="my-10 flex gap-10 flex-wrap justify-center items-center"
    >
      {BackendSkills.map((skill, index) => (
        <div
          key={index}
          className="flex flex-col items-center rounded-full bg-white backdrop-blur-md bg-opacity-40 hover:bg-opacity-80 shadow-md"
        >
          <Tooltip content={skill?.name}>
            <img
              src={skill?.icon}
              alt={skill?.name}
              className="w-28 h-28 p-5"
            />
          </Tooltip>
        </div>
      ))}
    </motion.div>
  );
};

export default Backend;
