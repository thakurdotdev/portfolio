import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { motion } from "framer-motion";
import WorkExp from "./WorkExp";
import Education from "./Education";

const Experience = () => {
  const data = [
    {
      label: "Work Experience",
      value: "Work Experience",
      desc: <WorkExp />,
    },
    {
      label: "Education",
      value: "Education",
      desc: <Education />,
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
          className="w-full flex items-center flex-col my-10"
        >
          <TabsHeader className="w-96 flex items-center mb-5 drop-shadow-2xl">
            {data.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody
            animate={{
              initial: { y: 550 },
              mount: { y: 0 },
              unmount: { y: 550 },
            }}
            className="flex justify-center"
          >
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

export default Experience;
