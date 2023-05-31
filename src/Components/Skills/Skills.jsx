import React from "react";
import Frontend from "./Frontend";
import Backend from "./Backend";
import Tools from "./Tools";
import { motion } from "framer-motion";
import { FaLaptopCode, FaCodeBranch, FaNodeJs } from "react-icons/fa";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const Skills = () => {
  const data = [
    {
      label: "Frontend",
      value: Frontend,
      icon: FaLaptopCode,
      desc: <Frontend />,
    },
    {
      label: "Backend",
      value: "Backend",
      icon: FaNodeJs,
      desc: <Backend />,
    },
    {
      label: "Tools",
      value: "Tools",
      icon: FaCodeBranch,
      desc: <Tools />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs
        value={data[0].value}
        className="w-full flex items-center flex-col my-10 min-h-[75vh]"
      >
        <TabsHeader className="w-96 flex items-center">
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          className="flex items-center"
          animate={{
            initial: { y: 50 },
            mount: { y: 0 },
            unmount: { y: 50 },
          }}
        >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </motion.div>
  );
};

export default Skills;
