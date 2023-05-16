import emailjs from "@emailjs/browser";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaHome, FaMailBulk } from "react-icons/fa";

const Contact = () => {
  const [message, showMessage] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_iybp9sm",
        "template_1dnr4w1",
        e.target,
        "4i6NhRQVTAgwoBcc9"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
    showMessage(true);
  };

  return (
    <div className="container mx-auto md:my-32 md:min-h-[53vh]">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-center lg:justify-between"
      >
        <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
          <div className="mb-12 max-w-[570px] lg:mb-0 flex flex-col items-center justify-center lg:mx-32">
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
            <form onSubmit={sendEmail}>
              <div className="mb-6">
                <Input type="text" name="name" label="Enter Your Name" />
              </div>
              <div className="mb-6">
                <Input type="email" name="email" label="Enter Your Email" />
              </div>
              <div className="mb-6">
                <Textarea rows="6" name="message" label="Enter Message" />
              </div>
              <div>
                <Button variant="gradient" fullWidth type="submit">
                  Send Message
                </Button>
                <div>
                  {message ? (
                    <p className="text-green-500 text-center mt-2">
                      Message Sent Successfully
                    </p>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
