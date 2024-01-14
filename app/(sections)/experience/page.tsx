import React from "react";

const Data = [
  {
    name: "Netclues Technologies Pvt. Ltd.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSCNPWXMttPr62alzxZXj7NzXn4XeI5n6EJeZYQdiyBPyorfzl_6L8uXCCX5E-f65rtSE",
    timeSpan: "Feb 2024 - Current",
    role: "Full Stack Web Developer Intern",
    about1: "Worked on various projects using MERN stack.",
    about2: "Worked on various projects using MERN stack.",
  },
  {
    name: "Innomatics Research Labs",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSCNPWXMttPr62alzxZXj7NzXn4XeI5n6EJeZYQdiyBPyorfzl_6L8uXCCX5E-f65rtSE",
    timeSpan: "Feb 2023 - April 2023",
    role: "Full Stack Web Developer Intern",
    about1: "Worked on various projects using MERN stack.",
    about2: "Developed a website for a startup using MERN stack.",
  },
];

function page() {
  return (
    <div className="flex flex-col my-20 gap-10">
      <h1 className="text-center text-3xl font-bold">Experience</h1>
      <div className="max-w-[32rem] flex justify-center items-center mx-auto">
        <ol className="relative border-s  border-gray-200 dark:border-gray-700">
          {Data.map((data) => (
            <li className="mb-10 ms-6" key={data.name}>
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-5 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <img
                  src={data.logo}
                  className="rounded-full"
                  alt="Netclues Logo"
                />
              </span>
              <h3 className="flex flex-col md:flex-row mb-1 text-lg font-semibold">
                {data.name}
                <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
                  {data.timeSpan}
                </span>
              </h3>
              <time className="block mb-2 text-base font-normal leading-none text-blue-400-200 ">
                {data.role}
                <ul
                  color="gary"
                  className="list-disc font-sans text-sm mt-3 ml-5 "
                >
                  <li className="my-1">{data.about1}</li>
                  <li className="my-1">{data.about2}</li>
                </ul>
              </time>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default page;
