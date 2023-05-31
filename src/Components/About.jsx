import React from "react";
import PPic from "../assets/profile-pic.webp";
import { motion } from "framer-motion";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  MdContactMail,
  MdContactPage,
  MdContactSupport,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import { RxTriangleLeft } from "react-icons/rx";

const About = () => {
  return (
    <section className="w-full md:min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center justify-center lg:mx-52 md:mt-20"
        staggerChildren={0.2}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center md:w-1/2"
        >
          <img
            src={PPic}
            alt="Image"
            className="h-32 w-32 md:h-72 md:w-72 z-10 grayscale hover:grayscale-0 duration-500 shadow-xl shadow-blue-gray-900/50 rounded-full"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-base p-6 mt-5 md:w-3/4 bg-white shadow-2xl drop-shadow-lg"
        >
          <RxTriangleLeft className="absolute top-1 -left-14 text-white text-[100px]" />
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
          <div className="flex items-center justify-center gap-5">
            <Link
              to="https://drive.google.com/file/d/1yTeKCqBeug2-hVaTQFMmP4oushxQ7vZE/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="gradient"
                color="light-blue"
                className="mt-5 flex items-center gap-2"
              >
                <MdOutlineDocumentScanner className="text-white text-lg" />
                Resume
              </Button>
            </Link>
            <Link to={"/contact"}>
              <Button
                variant="gradient"
                color="light-blue"
                className="mt-5 flex items-center gap-2"
              >
                <MdContactMail className="text-white text-lg" />
                Contact
              </Button>
            </Link>
          </div>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default About;
