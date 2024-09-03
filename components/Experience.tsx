import React from "react";
import { companiesData } from "@/lib/Constant";
import { Card } from "./ui/card";

interface JobHistoryItemProps {
  position: string;
  duration: string;
  isCurrent?: boolean;
}

const JobHistoryItem: React.FC<JobHistoryItemProps> = ({
  position,
  duration,
  isCurrent,
}) => (
  <div className="">
    <h3
      className={`text-gray-700 dark:text-neutral-300 ${
        isCurrent ? "font-medium text-teal-200 dark:text-teal-400" : ""
      }`}
    >
      {position}
    </h3>
    <p className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
      {duration}
    </p>
  </div>
);

interface CompanyExperienceProps {
  company: string;
  location: string;
  jobs: JobHistoryItemProps[];
}

const CompanyExperience: React.FC<CompanyExperienceProps> = ({
  company,
  location,
  jobs,
}) => (
  <Card>
    <div className="p-4">
      <h1 className="font-semibold text-gray-700 dark:text-neutral-300">
        {company}
      </h1>
      <h3 className="text-sm text-gray-600 dark:text-neutral-400">
        {location}
      </h3>
      {jobs.map((job, index) => (
        <JobHistoryItem key={index} {...job} />
      ))}
    </div>
  </Card>
);

const Experience: React.FC = () => (
  <div className="mt-5">
    <hr />
    <h4 className="text-lg font-medium my-4">Experience</h4>
    <div className="flex flex-col gap-3">
      {companiesData.map((companyData, index) => (
        <CompanyExperience key={index} {...companyData} />
      ))}
    </div>
  </div>
);

export default Experience;
