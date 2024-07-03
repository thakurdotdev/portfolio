import NextImage from "@/components/NextImage";
import { Button } from "@/components/ui/button";

const Experience = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="space-y-12 sm:space-y-16">
        {Data.map((company) => (
          <div key={company.name} className="relative pl-6 sm:pl-8 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="absolute left-0 w-10 h-10 sm:w-12 sm:h-12 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <NextImage
                  src={company.logo}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt={company.name}
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold ml-4">{company.name}</h3>
            </div>
            {company.roles.map((role, index) => (
              <div key={index} className="mb-6 sm:mb-8 last:mb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h4 className="text-base sm:text-lg font-medium">{role.title}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="max-w-fit mt-1 sm:mt-0 text-xs sm:text-sm"
                  >
                    {role.timeSpan}
                  </Button>
                </div>
                <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {role.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;

const Data = [
  {
    name: "Netclues Technologies Pvt. Ltd.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSCNPWXMttPr62alzxZXj7NzXn4XeI5n6EJeZYQdiyBPyorfzl_6L8uXCCX5E-f65rtSE",
    roles: [
      // {
      //   title: "Software Developer",
      //   timeSpan: "Jun 2024 - Current",
      //   responsibilities: [
      //     "Lead development of key features using React and Node.js",
      //     "Mentor junior developers and conduct code reviews"
      //   ]
      // },
      {
        title: "Software Developer Trainee",
        timeSpan: "Feb 2024 - May 2024",
        responsibilities: [
          "Worked on various projects using React and Node.js",
          "Contributed to fullstack project development"
        ]
      }
    ]
  },
  {
    name: "Innomatics Research Labs",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_v25Y6MzeoaGAjHvs-TU7add6exI4EDucTLytmlJWUg&s",
    roles: [
      {
        title: "Full Stack Web Developer Intern",
        timeSpan: "Feb 2023 - April 2023",
        responsibilities: [
          "Worked on various projects using MERN stack",
          "Developed a website for a startup using MERN stack"
        ]
      }
    ]
  }
];