import { Tooltip } from "@material-tailwind/react";
import React from "react";

const Tools = () => {
  return (
    <div className="my-10 flex gap-10 flex-wrap justify-center items-center">
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="VS Code"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
            className="w-24 h-w-24 p-5 "
            alt="logo"
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="Github"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            className="w-24 h-w-24 p-5 "
            alt="logo"
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="Git Version Control"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
            className="w-24 h-w-24 p-5 "
            alt="logo"
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="NPM Package Manager"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
            className="w-24 h-w-24 p-5 "
            alt="logo"
          />
        </Tooltip>
      </div>
      <div className="flex flex-col items-center rounded-full bg-gray-700 bg-opacity-10 hover:bg-opacity-30">
        <Tooltip
          content="Canva"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
            className="w-24 h-w-24 p-5 "
            alt="logo"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Tools;
