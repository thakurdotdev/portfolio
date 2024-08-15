import React from "react";
import { companiesData } from "@/lib/Constant";
import NextImage from "./NextImage";

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
  <div className="relative">
    <div
      className={`ml-10 ${
        isCurrent ? "font-medium text-teal-200 dark:text-teal-400" : ""
      }`}
    >
      <h3 className="text-gray-600 dark:text-neutral-400">{position}</h3>
      <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
        {duration}
      </p>
    </div>
  </div>
);

interface CompanyExperienceProps {
  company: string;
  companyLogo: string;
  location: string;
  jobs: JobHistoryItemProps[];
}

const CompanyExperience: React.FC<CompanyExperienceProps> = ({
  company,
  companyLogo,
  location,
  jobs,
}) => (
  <div className="relative mb-12">
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
    <div className="absolute -left-5 top-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
      <NextImage src={companyLogo} className="w-11 h-11 rounded-full" />
    </div>
    <div className="ml-10">
      <h1 className="font-semibold text-gray-600 dark:text-neutral-300">
        {company}
      </h1>
      <h3 className="text-sm text-gray-600 dark:text-neutral-400">
        {location}
      </h3>
    </div>
    {jobs.map((job, index) => (
      <JobHistoryItem key={index} {...job} />
    ))}
  </div>
);

const Experience: React.FC = () => (
  <>
    <div className="mt-5">
      <hr />
      <h4 className="text-md md:text-xl font-medium my-4">Experience</h4>
      <div className="p-6">
        {companiesData.map((companyData, index) => (
          <CompanyExperience key={index} {...companyData} />
        ))}
      </div>
    </div>
  </>
);

export default Experience;
