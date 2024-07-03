import NextImage from "@/components/NextImage";
import { Button } from "@/components/ui/button";

const Education = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-16">
        {Data.map((education) => (
          <div key={education.name} className="relative pl-8 sm:pl-12 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4">
              <div className="absolute left-0 w-10 h-10 sm:w-12 sm:h-12 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <NextImage
                  src={education.logo}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt={education.name}
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold ml-4">{education.name}</h3>
            </div>
            <div className="mb-8 last:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h4 className="text-base sm:text-lg font-medium">{education.department}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="max-w-fit mt-2 sm:mt-0 text-sm"
                >
                  {education.timeSpan}
                </Button>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{education.course}</p>
            </div>
          </div>
        ))}
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