import { experiences } from "@/constants";
import { Calendar, MapPin } from "lucide-react";

const Experience = () => {
  return (
    <div className="bg-white border-2 border-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {experiences.map((job, index) => (
            <article
              key={index}
              className={`border-2 p-4 sm:p-6 transition-all relative ${
                job.isCurrent
                  ? "border-black bg-gray-50 shadow-md"
                  : "border-gray-300 hover:border-black transition-colors"
              }`}
            >
              {job.isCurrent && (
                <div className="absolute -top-2 -right-2 bg-yellow-200 border-2 border-black px-2 py-1 text-xs font-bold uppercase tracking-wider transform rotate-12 shadow-sm">
                  CURRENT
                </div>
              )}
              <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                <div className="flex flex-col gap-2">
                  {/* Job Title and Company in same row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold">
                      {job.title}
                    </h3>
                    <span className="text-gray-400">@</span>
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-black hover:underline"
                    >
                      {job.company}
                    </a>
                  </div>

                  {/* Period and Location in same row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="sm:w-3 sm:h-3" />
                      <span className="font-medium">{job.period}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="sm:w-3 sm:h-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-black pl-4 sm:pl-6 mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4">
                <div className="border-b border-gray-300 pb-2 mb-3">
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    Role Overview
                  </h4>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-100 p-3 sm:p-4 border-l-4 border-black">
                  <div className="border-b border-gray-300 pb-2 mb-3">
                    <h4 className="font-bold text-sm uppercase tracking-wide">
                      Technologies Used
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-white px-2 py-1 text-xs border border-gray-300 hover:border-black transition-colors"
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
