import { Tooltip } from "@material-tailwind/react";
import React from "react";

const Frontend = () => {
  return (
    <div className=" my-10 flex gap-10 flex-wrap justify-center items-center ">
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40">
        <Tooltip
          content="React JS"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40">
        <Tooltip
          content="Redux"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40">
        <Tooltip
          content="HTMl 5"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40">
        <Tooltip
          content="CSS 3"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40">
        <Tooltip
          content="Javascript"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-20 hover:bg-opacity-40">
        <Tooltip
          content="Tailwind CSS"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"
            className="w-24 h-w-24 p-5 "
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Frontend;
