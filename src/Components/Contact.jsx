import { Button, Input, Textarea } from "@material-tailwind/react";
import React from "react";
import { FaHome, FaMailBulk } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="container mx-auto md:my-32 md:min-h-[53vh]">
      <div className="flex flex-wrap items-center justify-center lg:justify-between">
        <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
          <div className="mb-12 max-w-[570px] lg:mb-0 flex flex-col items-center justify-center">
            <h2 className="mb-6 text-[32px] font-bold uppercase text-dark sm:text-[40px] lg:text-[36px] xl:text-[40px]">
              GET IN TOUCH
            </h2>
            <p className="mb-9 text-base leading-relaxed text-body-color"></p>

            <div className="mb-8 flex w-full max-w-[370px]">
              <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary bg-opacity-5 text-primary sm:h-[70px] sm:max-w-[70px]">
                <FaHome className="h-10 w-10" />
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-xl font-bold text-dark">Location</h4>
                <p className="text-base text-body-color">Rajkot, Gujarat</p>
              </div>
            </div>

            <div className="mb-8 flex w-full max-w-[370px]">
              <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary bg-opacity-5 text-primary sm:h-[70px] sm:max-w-[70px]">
                <FaMailBulk className="h-10 w-10" />
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-xl font-bold text-dark">
                  Email Address
                </h4>
                <p className="text-base text-body-color">
                  pankajkatech@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
          <div className="relative rounded-lg bg-white p-8 shadow-lg sm:p-12">
            <form>
              <div className="mb-6">
                <Input type="text" label="Enter Your Name" />
              </div>
              <div className="mb-6">
                <Input type="email" label="Enter Your Email" />
              </div>
              <div className="mb-6">
                <Textarea rows="6" label="Enter Message" />
              </div>
              <div>
                <Button variant="gradient" fullWidth>
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
