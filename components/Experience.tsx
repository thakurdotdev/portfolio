import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconBuilding, 
  IconMapPin, 
  IconCalendar,
} from '@tabler/icons-react';

interface JobHistoryItemProps {
  position: string;
  duration: string;
  isCurrent?: boolean;
}

interface CompanyExperienceProps {
  company: string;
  location: string;
  jobs: JobHistoryItemProps[];
}

const JobHistoryItem: React.FC<JobHistoryItemProps> = ({
  position,
  duration,
  isCurrent,
}) => (
  <div className="relative pl-8 pb-8 group">
    {/* Timeline dot and line */}
    <div className="absolute left-0 top-2">
      <div className="w-3 h-3 bg-teal-500 rounded-full ring-4 ring-white dark:ring-gray-800" />
      <div className="absolute top-3 left-1.5 w-px h-full bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className={`font-medium ${
          isCurrent ? "text-teal-500 dark:text-teal-400" : "text-gray-900 dark:text-gray-100"
        }`}>
          {position}
        </h3>
        {isCurrent && (
          <Badge variant="secondary" className="bg-teal-500/10 text-teal-500 hover:bg-teal-500/20">
            Current
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <IconCalendar size={16} className="stroke-[1.5]" />
        <span>{duration}</span>
      </div>
    </div>
  </div>
);

const CompanyExperience: React.FC<CompanyExperienceProps> = ({
  company,
  location,
  jobs,
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <IconBuilding size={20} className="text-teal-500 stroke-[1.5]" />
          <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
            {company}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <IconMapPin size={16} className="stroke-[1.5]" />
          <span>{location}</span>
        </div>
      </div>

      <div className="relative">
        {jobs.map((job, index) => (
          <JobHistoryItem 
            key={index} 
            {...job} 
          />
        ))}
      </div>
    </div>
  </Card>
);

const Experience: React.FC = () => (
  <div className="mt-8">
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Experience
      </h2>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
    
    <div className="space-y-6">
      {companiesData.map((companyData, index) => (
        <CompanyExperience key={index} {...companyData} />
      ))}
    </div>
  </div>
);

export default Experience;
