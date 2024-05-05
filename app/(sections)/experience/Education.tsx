"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import NextImage from "@/components/NextImage";

const Education = () => {
  return (
    <div className="flex flex-col items-center my-20">
      <div className="max-w-3xl mx-auto">
        <ol className="relative border-l-2 border-gray-200 dark:border-gray-700">
          {Data.map((data) => (
            <li className="mb-10 ml-6 " key={data.name}>
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
                  <p className="text-base flex flex-wrap gap-1 mt-2 font-medium text-gray-600 dark:text-gray-400">
                    {data.department}
                     <span className="text-base font-mono text-gray-600 dark:text-gray-400">
                    ({data.course})
                  </span>
                  </p>
                 
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Education;

const Data = [
  {
    name: "Marwadi University",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbKRZ3cXcWn67pqykFC3pBO7F-ESU96o5wLVWy7QrlDHslvAe9ifAE&s",
    timeSpan: "2020 - 2024",
    department: "Computer Engineering",
    course: "Bachelor of Engineering",
  },
  {
    name: "Samastipur College Samastipur",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/BSEB_LOGO.svg/100px-BSEB_LOGO.svg.png",
    timeSpan: "2018 - 2020",
    department: "Science",
    course: "Intermediate",
  },
];