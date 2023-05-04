import React from "react";
import PPic from "../assets/profile-pic.png";

const About = () => {
  return (
    <section className="w-full">
      <h1 className="text-3xl font-sans text-center my-5">About Me</h1>

      <div className="flex flex-col md:flex-row items-center justify-around lg:mx-52 md:mt-20">
        <div>
          <img
            src={PPic}
            alt="Image"
            className="h-40 w-40 md:h-80 md:w-80 z-10 grayscale hover:grayscale-0 duration-300"
          />
        </div>
        <p className="text-lg p-3 md:w-1/2 text-justify">
          I am a Full Stack Developer with 2+ years of experience in building
          web applications. I specialize in JavaScript and have professional
          experience working with React, Node, Express, and MongoDB.
        </p>
      </div>
    </section>
  );
};

export default About;
