import { Button } from "@/components/ui/button";

const Education = () => {
  return (
    <div className="flex flex-col my-20 ">
      <div className="max-w-[32rem] flex justify-center items-center mx-auto">
        <ol className="relative border-s  border-gray-200 dark:border-gray-700">
          {Data.map((data) => (
            <li className="mb-10 ms-6" key={data.name}>
              <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -start-5 md:-start-6  ring-2">
                <img src={data.logo} className="rounded-full" alt={data.name} />
              </span>
              <h3 className="flex flex-col md:flex-row mb-2 ml-3 text-lg font-semibold">
                {data.name}
                <Button
                  size="sm"
                  variant="outline"
                  className=" max-w-fit md:ms-3"
                >
                  {data.timeSpan}
                </Button>
              </h3>
              <time className="block ml-3 mb-2 text-base font-normal leading-none text-blue-400-200 ">
                {data.course}
              </time>
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
    course: "Bachelor of Engineering in Computer Science",
  },
  {
    name: "Samastipur College Samastipur",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/BSEB_LOGO.svg/100px-BSEB_LOGO.svg.png",
    timeSpan: "2018 - 2020",
    course: "Intermediate",
  },
];
