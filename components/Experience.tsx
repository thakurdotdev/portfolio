const Experience = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {Data.map((experience) => (
        <div key={experience.company} className="mb-6 last:mb-0">
          <h3 className="text-md mb-2">{experience.company}</h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">{experience.role}</p>
          <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">{experience.duration}</p>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-neutral-400">
            {experience.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Experience;

const Data = [
  {
    company: "Netclues Technologies Pvt. Ltd.",
    role: "Software Developer Trainee",
    duration: "Feb 2024 - May 2024",
    responsibilities: [
      "Worked on various projects using React and Node.js",
      "Contributed to fullstack project development"
    ]
  },
  {
    company: "Innomatics Research Labs",
    role: "Full Stack Web Developer Intern",
    duration: "Feb 2023 - April 2023",
    responsibilities: [
      "Worked on various projects using MERN stack",
      "Developed a website for a startup using MERN stack"
    ]
  }
];