import React from "react";
import PPic from "../assets/profile-pic.webp";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="w-full md:min-h-[82vh]">
      <h1 className="text-3xl font-sans text-center my-5">About Me</h1>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-around lg:mx-52 md:mt-20"
      >
        <div className="flex flex-col items-center justify-center md:w-1/2">
          <img
            src={PPic}
            alt="Image"
            className="h-32 w-32 md:h-80 md:w-80 z-10 grayscale hover:grayscale-0 duration-500 shadow-xl shadow-blue-gray-900/50 rounded-full"
          />
        </div>
        <p className="text-base p-6 md:w-1/2 ">
          I am a passionate full-stack web developer with experience in building
          innovative and scalable web applications. My educational background
          includes a Bachelor of Engineering degree in Computer Engineering from
          <span className=" font-semibold mx-2 decoration-light-blue-600">
            Marwadi Education Foundation's Group of Institutions, Rajkot.
          </span>
          <br />
          <br />I have experience working as a
          <span className=" font-semibold mx-2 decoration-light-blue-600">
            Full Stack Web Developer Intern
          </span>
          at Innomatics Research Labs where I developed web applications using
          React.JS, Node.JS, Express JS, and MongoDB. During my time at
          Innomatics, I also used Redux to develop scalable applications. My
          skills include proficiency in HTML, CSS, JavaScript, React, Redux,
          Tailwind CSS, Node.JS, Express.JS, MongoDB, Git, Github, Visual Studio
          Code, Netlify, and Vercel.
          <br />
          <br />I have completed various projects, including
          <span className="font-semibold mx-2 decoration-light-blue-600">
            a job portal, article summarizer, and notes web application,
          </span>
          which demonstrate my technical expertise and attention to detail.
          <br />
          <br />I am a quick learner and a team player who is always ready to
          learn new technologies and frameworks. I am currently looking for a
          full-time opportunity as a Full Stack Web Developer.
        </p>
      </motion.div>
    </section>
  );
};

export default About;
