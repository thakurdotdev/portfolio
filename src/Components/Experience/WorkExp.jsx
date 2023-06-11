import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";

const WorkExp = () => {
  return (
    <div className="max-w-[32rem] flex justify-center items-center mx-auto">
      <Timeline>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-0 hover:scale-105 duration-200">
              <a href="https://gssoc.girlscript.tech/" target="_blank">
                <Avatar
                  size="lg"
                  src="https://cdn-images-1.medium.com/v2/resize:fit:1200/1*ZfYWXN0zA6TqQQ7wGNJUOg.jpeg"
                  alt="GSSOC Logo"
                />
              </a>
            </TimelineIcon>
            <div className="flex flex-col">
              <Typography variant="h5" color="blue-gray">
                GirlScript Summer of Code 2023
              </Typography>
              <Typography className=" my-2" color="gray">
                Open Source Contributor <br /> May 2023 - Present
              </Typography>
            </div>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <ul color="gary" className="list-disc font-sans ml-5 text-gray-800">
              <li>Contributed to various open source projects.</li>
              <li>Coded in React, Node.js, Express.js, MongoDB.</li>
              <li>Connected with mentors and other contributors</li>
            </ul>
          </TimelineBody>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-0 hover:scale-105 duration-200">
              <a href="https://www.innomatics.in/" target="_blank">
                <Avatar
                  size="lg"
                  src="https://yt3.googleusercontent.com/ytc/AGIKgqPpF2a_tyfJxju1aUCarmdrPPQ-dpgour4fzgfz=s900-c-k-c0x00ffffff-no-rj"
                  alt="user 1"
                />
              </a>
            </TimelineIcon>
            <div className="flex flex-col">
              <Typography variant="h5" color="blue-gray">
                Innomatics Research Labs
              </Typography>
              <Typography className=" my-2" color="gray">
                Full Stack Web Developer Intern <br /> Feb 2023 - April 2023
              </Typography>
            </div>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <ul color="gary" className="list-disc font-sans ml-5 text-gray-800">
              <li>Worked on various projects using MERN stack.</li>
              <li>Developed Application Using Redux.</li>
            </ul>
          </TimelineBody>
        </TimelineItem>
      </Timeline>
    </div>
  );
};

export default WorkExp;
