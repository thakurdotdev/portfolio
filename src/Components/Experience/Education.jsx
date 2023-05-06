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

const Education = () => {
  return (
    <div className="max-w-[32rem] flex justify-center items-center mx-auto">
      <Timeline>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-0">
              <Avatar
                size="lg"
                src="https://upload.wikimedia.org/wikipedia/en/1/14/Marwadi_University_logo.png"
                alt="user 1"
                withBorder
              />
            </TimelineIcon>
            <Typography variant="h5" color="blue-gray">
              Marwadi Education Foundation's Group of Institutions
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-14">
            <Typography color="gray" className="font-semibold text-gray-600">
              Computer Science and Engineering
              <br />
              Bachelor of Engineering - BE, <br /> 2020 - Present
            </Typography>
          </TimelineBody>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-0">
              <Avatar
                size="lg"
                src="https://yt3.googleusercontent.com/ytc/AGIKgqPH81zkbo4ZGDvdP3jgPo56PgO9-tJq-B6mGPanEA=s900-c-k-c0x00ffffff-no-rj"
                alt="user 2"
                withBorder
              />
            </TimelineIcon>
            <Typography variant="h5" color="blue-gray">
              Bihar State Education Board
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <Typography color="gray" className="font-semibold text-gray-600">
              Higher Secondary School, Science <br /> 2018 - 2020
            </Typography>
          </TimelineBody>
        </TimelineItem>
      </Timeline>
    </div>
  );
};

export default Education;
