import Frontend from "./Frontend";
import Backend from "./Backend";
import Tools from "./Tools";
import { motion } from "framer-motion";
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
      desc: <Frontend />,
    },
    {
      label: "Backend",
      value: "Backend",
      desc: <Backend />,
    },
    {
      label: "Tools",
      value: "Tools",
      desc: <Tools />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl text-center my-10">Tech Stack</h1>
      <Tabs
        value={data[0].value}
        className="w-full flex items-center flex-col my-10 min-h-[65vh]"
      >
        <TabsHeader className="w-96 flex items-center">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          className="flex items-center"
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
    </motion.div>
  );
};

export default Skills;
