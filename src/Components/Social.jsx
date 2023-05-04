import React from "react";

const Social = () => {
  return (
    <section className="fixed xl:bottom-40 xl:left-4 2xl:bottom-80 2xl:left-10 hidden lg:flex flex-col gap-3 z-20">
      <a
        href=""
        target="_blank"
        className="rounded-full text-2xl bg-gray-600 bg-opacity-20 hover:bg-opacity-50 w-10 h-10 flex items-center justify-center"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
          className="p-2"
        />
      </a>
      <a
        href=""
        target="_blank"
        className="rounded-full text-2xl bg-gray-600 bg-opacity-20 hover:bg-opacity-50 w-10 h-10 flex items-center justify-center"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
          className="p-2"
        />
      </a>
      <a
        href=""
        target="_blank"
        className="rounded-full text-2xl bg-gray-600 bg-opacity-20 hover:bg-opacity-50 w-10 h-10 flex items-center justify-center"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg"
          className="p-2"
        />
      </a>
    </section>
  );
};

export default Social;
