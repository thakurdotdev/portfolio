"use client";
import NextImage from "@/components/NextImage";
import { Button } from "@/components/ui/button";

const Experience = () => {
  return (
    <div className="flex flex-col items-center my-20">
      <div className="max-w-3xl mx-auto">
        <ol className="relative border-l-2 border-gray-200 dark:border-gray-700">
          {Data.map((data) => (
            <li
              className="mb-10 ml-6"
              key={data.name}
            >
              <div className="flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 ring-2 ring-white dark:ring-gray-800 shadow-md">
                  <NextImage
                    src={data.logo}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt={data.name}
                  />
                </span>
                <div className="ml-4 animate_in">
                  <h3 className="flex flex-col lg:flex-row text-lg font-semibold">
                    {data.name}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="max-w-fit max-md:my-1 md:ml-3 px-3 py-1 rounded-full"
                    >
                      {data.timeSpan}
                    </Button>
                  </h3>
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400">
                    {data.role}
                  </p>
                  <ul className="list-disc font-sans text-sm mt-2 ml-5">
                    <li className="my-1 text-gray-700 dark:text-gray-300">
                      {data?.about1}
                    </li>
                    <li className="my-1 text-gray-700 dark:text-gray-300">
                      {data?.about2}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
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