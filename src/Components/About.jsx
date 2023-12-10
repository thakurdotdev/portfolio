import React from "react";

const About = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center pt-2 pb-10">
      <div className="text-justify p-6 md:w-1/2">
        <h1 className="text-2xl font-bold text-center mt-2 mb-5 border-b-2 border-light-blue-500">
          About Me
        </h1>
        <p className="text-lg md:text-xl">
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
        </p>
      </div>
    </div>
  );
};

export default About;
