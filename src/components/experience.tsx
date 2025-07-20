import { experiences } from "@/constants";
import { Calendar, MapPin } from "lucide-react";

const Experience = () => {
  return (
    <div className="border-2 border-black dark:border-zinc-800">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {experiences.map((job, index) => (
            <article
              key={index}
              className={`border-2 p-4 sm:p-6 transition-all relative ${
                job.isCurrent
                  ? "border-black dark:border-zinc-600 bg-gray-50 dark:bg-zinc-950 shadow-md"
                  : "border-gray-300 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-colors"
              }`}
            >
              {job.isCurrent && (
                <div className="absolute -top-2 -right-2 bg-yellow-200 dark:bg-yellow-500 border-2 border-black dark:border-zinc-900 px-2 py-1 text-xs font-bold uppercase tracking-wider transform rotate-12 shadow-sm dark:text-black">
                  CURRENT
                </div>
              )}
              <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                <div className="flex flex-col gap-2">
                  {/* Job Title and Company in same row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold dark:text-white">
                      {job.title}
                    </h3>
                    <span className="text-gray-400 dark:text-zinc-600">@</span>
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-black dark:text-white hover:underline"
                    >
                      {job.company}
                    </a>
                  </div>

                  {/* Period and Location in same row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="sm:w-3 sm:h-3" />
                      <span className="font-medium">{job.period}</span>
                    </div>
                    <span className="text-gray-400 dark:text-zinc-600">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="sm:w-3 sm:h-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-black dark:border-zinc-600 pl-4 sm:pl-6 mb-4 sm:mb-6 bg-gray-50 dark:bg-zinc-900 p-3 sm:p-4">
                <div className="border-b border-gray-300 dark:border-zinc-800 pb-2 mb-3">
                  <h4 className="font-bold text-sm uppercase tracking-wide dark:text-white">
                    Role Overview
                  </h4>
                </div>
                <p className="text-sm sm:text-base leading-relaxed dark:text-zinc-300">
                  {job.description}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-100 dark:bg-zinc-900 p-3 sm:p-4 border-l-4 border-black dark:border-zinc-600">
                  <div className="border-b border-gray-300 dark:border-zinc-800 pb-2 mb-3">
                    <h4 className="font-bold text-sm uppercase tracking-wide dark:text-white">
                      Technologies Used
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-white dark:bg-black px-2 py-1 text-xs border border-gray-300 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-colors dark:text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
