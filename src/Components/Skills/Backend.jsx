import { Tooltip } from "@material-tailwind/react";
import React from "react";
import { motion } from "framer-motion";

const Backend = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="my-10 flex gap-10 flex-wrap justify-center items-center"
    >
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="NODE JS"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="EXPRESS JS"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="MONGO DB"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
    </motion.div>
  );
};

export default Backend;
