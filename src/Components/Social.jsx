import React from "react";
import { FaGithub, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Social = () => {
  return (
    <section
      id="socials"
      className="fixed xl:bottom-4 xl:left-4 2xl:bottom-20 2xl:left-10 hidden lg:flex flex-col gap-3 z-20"
    >
      <a
        href=""
        target="_blank"
        rel="noreferrer"
        className="rounded-full text-2xl bg-blue-300 w-10 h-10 flex items-center justify-center"
      >
        <FaGithub />
      </a>
      <a
        href=""
        target="_blank"
        rel="noreferrer"
        className="rounded-full text-2xl bg-blue-300 w-10 h-10 flex items-center justify-center"
      >
        <FaLinkedinIn />
      </a>
      <a
        href=""
        target="_blank"
        rel="noreferrer"
        className="rounded-full text-2xl bg-blue-300 w-10 h-10 flex items-center justify-center"
      >
        <FaTwitter />
      </a>
      <a
        href=""
        target="_blank"
        rel="noreferrer"
        className="rounded-full text-2xl bg-blue-300 w-10 h-10 flex items-center justify-center"
      >
        <FaInstagram />
      </a>
    </section>
  );
};

export default Social;
