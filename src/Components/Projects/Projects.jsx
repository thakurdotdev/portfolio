import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const data = [
    {
      label: "Frontend",
      value: "Frontend",
      desc: <ProjectCard />,
    },
    {
      label: "Backend",
      value: "Backend",
      desc: <ProjectCard />,
    },
    {
      label: "Tools",
      value: "Tools",
      desc: <ProjectCard />,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl text-center my-10">Tech Stack</h1>
      <Tabs
        value={data[0].value}
        className="w-full flex items-center flex-col my-10"
      >
        <TabsHeader className="w-96 flex items-center">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          className="overflow-x-auto scroll-hide md:w-full max-w-screen-sm mx-auto mt-6 flex justify-between items-center gap-2 md:gap-3 bg-white dark:bg-grey-800 p-2 rounded-md"
          animate={{
            initial: { y: 550 },
            mount: { y: 0 },
            unmount: { y: 550 },
          }}
        >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default Projects;
