import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import contactimg from "../assets/contact-img.svg";

const Contact = () => {
  const [message, showMessage] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ldx72vg",
        "template_tionfoh",
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
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center border-spacing-2 border-b-2 border-b-blue-600 my-10">
        Contact
      </h1>
      <div className="flex flex-col md:flex-row lg:w-[70%] items-center justify-around">
        <div className="w-[100vw] p-5 lg:w-[500px]">
          <div className="relative rounded-lg bg-white bg-opacity-60 backdrop-blur-sm p-8  sm:p-12">
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
        </div>
        <div className="lg:w-[500px] lg-max:hidden">
          <img
            className="h-[300px] w-[300px] lg:h-[500px] lg:w-[500px]"
            src={contactimg}
            alt="contactimg"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
