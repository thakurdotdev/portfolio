import React from "react";
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
import { FaReact } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const Projects = () => {
  const data = [
    {
      label: "MERN Stack",
      value: "MERN Stack",
      icon: FaReact,
      desc: (
        <LazyLoadComponent>
          <MernProjects />
        </LazyLoadComponent>
      ),
    },
    {
      label: "Basic Projects",
      value: "Basic Projects",
      icon: SiJavascript,
      desc: (
        <LazyLoadComponent>
          <BasicProjects />
        </LazyLoadComponent>
      ),
    },
  ];

  return (
    <div className="min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs
          value={data[0].value}
          className="w-full flex items-center flex-col px-5 py-10"
        >
          <TabsHeader className="w-96 flex items-center mb-5 drop-shadow-2xl">
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
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
