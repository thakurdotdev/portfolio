import React from "react";
import PPic from "../assets/profile-pic.png";

const About = () => {
  return (
    <section className="w-full md:min-h-[82vh]">
      <h1 className="text-3xl font-sans text-center my-5">About Me</h1>

      <div className="flex flex-col md:flex-row items-center justify-around lg:mx-52 md:mt-20">
        <div>
          <img
            src={PPic}
            alt="Image"
            className="h-40 w-40 md:h-80 md:w-80 z-10 grayscale hover:grayscale-0 duration-300"
          />
        </div>
        <p className="text-base p-3 md:w-1/2 text-justify">
          I am a passionate full-stack web developer with experience in building
          innovative and scalable web applications. My educational background
          includes a Bachelor of Engineering degree in Computer Engineering from
          Gujarat Technological University.
          <br />
          <br />I have experience working as a
          <span className=" underline font-semibold mx-2 decoration-light-blue-600">
            Full Stack Web Developer Intern
          </span>
          at Innomatics Research Labs where I developed web applications using
          React.JS, Node.JS, Express JS, and MongoDB. During my time at
          Innomatics, I also used Redux to develop scalable applications. My
          skills include proficiency in HTML, CSS, JavaScript, React, Redux,
          Tailwind CSS, Node.JS, Express.JS, MongoDB, Git, Github, Visual Studio
          Code, Netlify, and Vercel.
          <br />
          <br />I have completed various projects, including{" "}
          <span className=" underline font-semibold mx-2 decoration-light-blue-600">
            {" "}
            a job portal, article summarizer, and notes web application,
          </span>{" "}
          which demonstrate my technical expertise and attention to detail. I
          believe in continuous learning and strive to keep myself updated with
          the latest trends and technologies in the industry. My goal is to
          provide clients with web applications that are user-friendly, secure,
          and scalable.
          <br />
          If you are looking for a dedicated developer to build your next web
          application, I would be honored to work with you. Contact me today to
          discuss your project requirements.
        </p>
      </div>
    </section>
  );
};

export default About;
