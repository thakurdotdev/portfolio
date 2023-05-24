import React from "react";
import { motion } from "framer-motion";

import PPic from "../assets/profile-pic.webp";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import wavingHand from "../assets/waving-hand.gif";

const Hero = () => {
  return (
    <div className="py-16 md:min-h-[83vh] flex items-center flex-col-reverse lg:flex-row gap-10 justify-center">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col gap-4 md:gap-6 text-left lg:w-1/2 2xl:w-1/3 mx-4 md:mx-6 xl:mx-0 "
      >
        <div className="flex items-center">
          <img
            src={wavingHand}
            alt="waving hand"
            className="w-10 h-10 mr-2 animate-bounce"
          />
          <p className="text-xl">Hey,</p>
        </div>
        <p className="text-4xl md:text-5xl font-bold relative">
          I'm <span className="text-blue-900">Pankaj Kumar</span>
        </p>
        <p className="text-2xl font-bold relative">MERN Stack Web Developer</p>
        <p className="text-lg md:text-xl font-medium relative">
          I'm a Full Stack Developer based in India. I have a passion for web
          development and love to create for web apps.
        </p>

        <div className="flex flex-row justify-center md:justify-normal gap-4 md:gap-6">
          <Link to={"/about"}>
            <Button variant="gradient" color="light-blue">
              About Me
            </Button>
          </Link>
          <Link
            to="https://drive.google.com/file/d/1yTeKCqBeug2-hVaTQFMmP4oushxQ7vZE/view?usp=sharing"
            target="_blank"
          >
            <Button variant="gradient" color="deep-purple">
              Resume
            </Button>
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={PPic} alt="Pankaj Kumar" className="w-44 md:w-80 z-10" />
      </motion.div>
    </div>
  );
};

export default Hero;
