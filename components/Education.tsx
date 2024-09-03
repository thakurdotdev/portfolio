import React from "react";
import { educationData } from "@/lib/Constant";
import { Card } from "./ui/card";

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
  <Card className="mb-6 p-4">
    <div>
      <h1 className="font-medium text-gray-700 dark:text-neutral-300">
        {institution}
        <span className="text-xs text-gray-600 dark:text-neutral-400 ml-2">
          ( {duration})
        </span>
      </h1>
      <div className="flex items-center gap-2">
        <h3 className="text-sm text-gray-600 dark:text-neutral-400">
          {degree}
        </h3>
        {stream && (
          <span className="text-xs text-gray-600 dark:text-neutral-400">
            ({stream})
          </span>
        )}
      </div>
    </div>
  </Card>
);

const Education: React.FC = () => (
  <div>
    <h4 className="text-lg font-medium my-4">Education</h4>
    <div className="">
      {educationData.map((education, index) => (
        <EducationItem key={index} {...education} />
      ))}
    </div>
  </div>
);

export default Education;
