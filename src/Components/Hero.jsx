import React from "react";

import wHand from "../assets/waving-hand.png";
import PPic from "../assets/profile-pic.png";

const Hero = () => {
  return (
    <div className="py-16 lg:py-48 flex items-center flex-col-reverse lg:flex-row justify-around gap-10 lg:gap-0">
      <div className="flex flex-col gap-4 md:gap-6 text-left lg:w-1/2 2xl:w-1/3 mx-4 md:mx-6 xl:mx-0 ">
        <div className="flex items-center">
          <img src={wHand} alt="Hello" className="w-14" />
          <p>Hey,</p>
        </div>
        <p className="text-4xl md:text-6xl font-bold relative">
          I'm Pankaj Kumar
        </p>
        <p className="text-2xl md:text-4xl font-bold relative">
          Full Stack Developer
        </p>
        <p className="text-lg md:text-2xl">
          I am a Full Stack Developer with 2+ years of experience in building
          web applications. I specialize in JavaScript and have professional
          experience working with React, Node, Express, and MongoDB.
        </p>
        <div className="flex gap-4">
          <a
            href="https://drive.google.com/file/d/1Z3Z3Z2Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Resume
          </a>
          <a
            href="https://www.linkedin.com/in/pankaj-kumar-2a1b3a1a0/"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div>
        <img src={PPic} alt="Pankaj Kumar" className="w-80 z-10" />
      </div>
    </div>
  );
};

export default Hero;
