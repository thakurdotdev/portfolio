"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Experience = () => {
  return (
    <div className="flex flex-col my-20 gap-10">
      <div className="max-w-[32rem] flex justify-center items-center mx-auto">
        <motion.ol
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative border-s  border-gray-200 dark:border-gray-700"
        >
          {Data.map((data) => (
            <li className="mb-10 ms-6" key={data.name}>
              <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -start-4 md:-start-6  ring-2">
                <img src={data.logo} className="rounded-full" alt={data.name} />
              </span>
              <h3 className="flex flex-col md:flex-row mb-2 ml-3 text-lg font-semibold">
                {data.name}
                <Button
                  size="sm"
                  variant="outline"
                  className="max-w-fit md:ms-3"
                >
                  {data.timeSpan}
                </Button>
              </h3>
              <time className="block mb-2 ml-3 text-base font-normal leading-none text-blue-400-200 ">
                {data.role}
                <ul className="list-disc font-sans text-sm mt-3 ml-5 ">
                  <li className="my-1">{data?.about1}</li>
                  <li className="my-1">{data?.about2}</li>
                </ul>
              </time>
            </li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
};

export default Experience;

const Data = [
  {
    name: "Netclues Technologies Pvt. Ltd.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSCNPWXMttPr62alzxZXj7NzXn4XeI5n6EJeZYQdiyBPyorfzl_6L8uXCCX5E-f65rtSE",
    timeSpan: "Feb 2024 - Current",
    role: "Full Stack Web Developer Intern",
    about1: "Worked on various projects using MERN stack.",
    about2: "Worked On Fullstack Project",
  },
  {
    name: "Innomatics Research Labs",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_v25Y6MzeoaGAjHvs-TU7add6exI4EDucTLytmlJWUg&s",
    timeSpan: "Feb 2023 - April 2023",
    role: "Full Stack Web Developer Intern",
    about1: "Worked on various projects using MERN stack.",
    about2: "Developed a website for a startup using MERN stack.",
  },
];
