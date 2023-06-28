import React from "react";
import PPic from "../assets/about.webp";
import { motion } from "framer-motion";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { MdContactMail, MdOutlineDocumentScanner } from "react-icons/md";

const About = () => {
  return (
    <section className="w-full md:min-h-[75vh]">
      <div className="flex flex-col md:flex-row items-center justify-center lg:mx-52 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center md:h-60"
        >
          <img
            src={PPic}
            alt="Image"
            className="h-40 md:h-72 md:-mt-20 z-10 shadow-xl drop-shadow rounded-full my-5"
          />
          <div className="flex items-center justify-center gap-2">
            <Link
              to="https://drive.google.com/file/d/1hPe1bzNMlVOE1V5zbJ0Npi2o42a9Wj7l/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="gradient"
                color="light-blue"
                fullWidth
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
                fullWidth
                className="mt-5 flex items-center gap-2"
              >
                <MdContactMail className="text-white text-lg" />
                Contact
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.Typography
          initial={{ opacity: 0, y: 100 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className=" text-justify font-serif m-5 md:m-0 p-6 md:ml-5 mt-5 md:w-1/2 bg-white rounded-md shadow-2xl drop-shadow-sm backdrop-blur-md bg-opacity-20"
        >
          <Typography className="text-xl text-center mt-2 mb-5 border-b-2 border-light-blue-500">
            About Me
          </Typography>
          {/* <RxTriangleLeft className="absolute top-10 -left-10 text-white text-[70px] lg-max:hidden" /> */}
          I am a passionate full-stack web developer with experience in building
          innovative and scalable web applications.
          <br />
          <br />
          My educational background includes a Bachelor of Engineering degree in
          Computer Engineering from Marwadi Education Foundation's Group of
          Institutions, Rajkot.
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
        </motion.Typography>
      </div>
    </section>
  );
};

export default About;
