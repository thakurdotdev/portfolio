import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import MernProjects from "./MernProjects";
import BasicProjects from "./BasicProjects";

const Projects = () => {
  const data = [
    {
      label: "MERN Stack",
      value: "MERN Stack",
      desc: <MernProjects />,
    },
    {
      label: "Basic Projects",
      value: "Basic Projects",
      desc: <BasicProjects />,
    },
  ];

  return (
    <div className="md:min-h-[80vh]">
      <h1 className="text-3xl text-center my-10">Projects</h1>
      <Tabs
        value={data[0].value}
        className="w-full flex items-center flex-col my-10 "
      >
        <TabsHeader className="w-96 flex items-center mb-5 drop-shadow-2xl">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="flex justify-center">
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
