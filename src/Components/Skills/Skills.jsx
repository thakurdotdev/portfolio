import React from "react";
import Frontend from "./Frontend";
import Backend from "./Backend";
import Tools from "./Tools";
import { motion } from "framer-motion";

const Skills = () => {
  const data = [
    {
      label: "Frontend",
      value: Frontend,
      desc: <Frontend />,
    },
    {
      label: "Backend",
      value: "Backend",
      desc: <Backend />,
    },
    {
      label: "Tools",
      value: "Tools",
      desc: <Tools />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center py-5">
        <p className="text-gray-600 text-xl">I can do these things</p>
        <div className="w-20 h-[1px] bg-blue-500 rounded-full my-1"></div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {data.map(({ label, value, desc }) => (
            <div
              key={value}
              className="flex flex-col items-center justify-center m-1"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl mt-1">{label}</span>
                <div className="w-16 h-[1px] bg-blue-500 rounded-full my-1"></div>
              </div>
              {desc}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Skills;
