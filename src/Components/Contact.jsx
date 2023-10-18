import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import contactimg from "../assets/contact-img.svg";

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
    <div className="min-h-[84vh] w-full flex flex-col justify-center items-center">
      <div className="flex flex-col md:flex-row lg:w-[70%] items-center justify-around">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[100vw] p-5 lg:w-[500px]"
        >
          <div className="relative rounded-lg bg-white bg-opacity-40 backdrop-blur-sm p-8  sm:p-12">
            <form onSubmit={sendEmail}>
              <div className="mb-6">
                <Input
                  type="text"
                  name="name"
                  label="Enter Your Name"
                  required
                />
              </div>
              <div className="mb-6">
                <Input
                  type="email"
                  name="email"
                  label="Enter Your Email"
                  required
                />
              </div>
              <div className="mb-6">
                <Textarea
                  rows="6"
                  name="message"
                  label="Enter Message"
                  required
                />
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-[500px] lg-max:hidden"
        >
          <img src={contactimg} alt="contactimg" />
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
