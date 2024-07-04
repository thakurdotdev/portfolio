import React from "react";
import Image from "next/image";
import NextImage from "./NextImage";

const Education = () => {
  return (
    <section className="mt-14 flex flex-col gap-4">

      {Data.map((education, index) => (
        <div key={education.name} className="flex gap-x-3">
          <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
            <div className="relative z-10 size-7 flex justify-center items-center">
              <NextImage
                src={education.logo}
                width={28}
                height={28}
                className="rounded-full"
                alt={education.name}
              />
            </div>
          </div>

          <div className="grow pt-0.5 pb-8">
            <p className="flex gap-x-1.5 text-sm">
              <span>{education.name}</span>
              <span>•</span>
              <span>{education.timeSpan}</span>
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
              {education.department}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
              {education.course}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Education;

const Data = [
  {
    name: "Marwadi University",
    logo: "https://example.com/marwadi-logo.png",
    timeSpan: "2020 - 2024",
    department: "Computer Engineering",
    course: "Bachelor of Engineering",
  },
  {
    name: "Samastipur College Samastipur",
    logo: "https://example.com/samastipur-logo.png",
    timeSpan: "2018 - 2020",
    department: "Science",
    course: "Intermediate",
  },
];