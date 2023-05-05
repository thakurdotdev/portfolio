import React from "react";

import wHand from "../assets/waving-hand.png";
import PPic from "../assets/profile-pic.webp";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="py-16 min-h-[83vh] flex items-center flex-col-reverse lg:flex-row gap-10 justify-center">
      <div className="flex flex-col gap-4 md:gap-6 text-left lg:w-1/2 2xl:w-1/3 mx-4 md:mx-6 xl:mx-0 ">
        <div className="flex items-center">
          <img src={wHand} alt="Hello" className="w-14" />
          <p className="text-xl">Hey,</p>
        </div>
        <p className="text-4xl md:text-6xl font-bold relative">
          I'm Pankaj Kumar
        </p>
        <p className="text-2xl md:text-3xl font-bold relative">
          Full Stack Web Developer
        </p>
        <p className="text-lg md:text-xl font-medium relative">
          I'm a Full Stack Developer based in India. I have a passion for web
          development and love to create for web apps.
        </p>

        <Link to={"/about"}>
          <Button variant="gradient" color="light-blue">
            About Me
          </Button>
        </Link>
      </div>
      <div>
        <img src={PPic} alt="Pankaj Kumar" className="w-52 md:w-80 z-10" />
      </div>
    </div>
  );
};

export default Hero;
