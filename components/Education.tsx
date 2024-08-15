import React from "react";
import NextImage from "./NextImage";
import { educationData } from "@/lib/Constant";

interface EducationItemProps {
  institution: string;
  degree: string;
  stream?: string;
  duration: string;
  logo: string;
}

const EducationItem: React.FC<EducationItemProps> = ({
  institution,
  degree,
  stream,
  duration,
  logo,
}) => (
  <div className="relative mb-12">
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
    <div className="absolute -left-5 top-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
      <NextImage src={logo} className="w-11 h-11 rounded-full" />
    </div>
    <div className="ml-10">
      <h1 className="font-medium text-gray-600 dark:text-neutral-300">
        {institution}
      </h1>
      <h3 className="text-base text-gray-600 dark:text-neutral-400">
        {degree}
      </h3>
      {stream && (
        <h3 className="text-sm text-gray-600 dark:text-neutral-400">
          {stream}
        </h3>
      )}
      <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
        {duration}
      </p>
    </div>
  </div>
);

const Education: React.FC = () => (
  <div className="">
    <hr />
    <h4 className="text-md md:text-xl font-medium my-4">Education</h4>
    <div className="p-6">
      {educationData.map((education, index) => (
        <EducationItem key={index} {...education} />
      ))}
    </div>
  </div>
);

export default Education;
