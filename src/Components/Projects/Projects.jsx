import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import MernProjects from "./MernProjects";
import BasicProjects from "./BasicProjects";
import { motion } from "framer-motion";

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
    <div className="min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl text-center my-10">Projects</h1>
        <Tabs
          value={data[0].value}
          className="w-full flex items-center flex-col my-10"
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
      </motion.div>
    </div>
  );
};

export default Projects;
