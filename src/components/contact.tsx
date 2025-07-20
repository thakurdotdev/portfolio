"use client";

import { socialLinks } from "@/constants";
import {
  CalendarIcon,
  LoaderIcon,
  MailIcon,
  MapPinIcon,
  SendIcon,
} from "lucide-react";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { name, email, message } = formData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="border-2 border-black dark:border-zinc-800">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="border-2 border-gray-300 dark:border-zinc-800 p-4 sm:p-6">
            <div className="border-b-2 border-black dark:border-zinc-600 pb-3 mb-4">
              <h3 className="text-lg sm:text-xl font-bold dark:text-white">
                Contact Form
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-serif font-bold mb-2 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-zinc-800 focus:border-black dark:focus:border-zinc-600 font-serif text-sm bg-white dark:bg-zinc-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-bold mb-2 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-zinc-800 focus:border-black dark:focus:border-zinc-600 font-serif text-sm bg-white dark:bg-zinc-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-bold mb-2 dark:text-white">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-zinc-800 focus:border-black dark:focus:border-zinc-600 font-serif text-sm resize-none bg-white dark:bg-zinc-950 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 font-serif font-bold text-sm hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="animate-spin" size={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    <SendIcon size={16} />
                    Send Message
                  </>
                )}
              </button>
              {submitStatus === "success" && (
                <div className="text-green-600 dark:text-green-400 text-sm font-serif">
                  Message sent successfully!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-600 dark:text-red-400 text-sm font-serif">
                  There was an error sending your message. Please try again
                  later.
                </div>
              )}
            </form>
          </div>
          <div className="space-y-6">
            <div className="border-2 border-gray-300 dark:border-zinc-800 p-4 sm:p-6">
              <div className="border-b-2 border-black dark:border-zinc-600 pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold dark:text-white">
                  Social Links
                </h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border border-gray-300 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-colors dark:text-white"
                  >
                    <span className="dark:text-white">{link.icon}</span>
                    <span className="text-sm">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="border-2 border-gray-300 dark:border-zinc-800 p-4 sm:p-6">
              <div className="border-b-2 border-black dark:border-zinc-600 pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold dark:text-white">
                  Direct Contact
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MailIcon
                    size={18}
                    className="sm:w-5 sm:h-5 dark:text-white"
                  />
                  <div>
                    <div className="font-bold text-sm sm:text-base dark:text-white">
                      Email
                    </div>
                    <a
                      href="mailto:pankaj@thakur.dev"
                      className="hover:underline text-sm break-all dark:text-zinc-300"
                    >
                      pankaj@thakur.dev
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon
                    size={18}
                    className="sm:w-5 sm:h-5 dark:text-white"
                  />
                  <div>
                    <div className="font-bold text-sm sm:text-base dark:text-white">
                      Location
                    </div>
                    <span className="text-sm dark:text-zinc-300">
                      Ahmedabad, Gujarat, India
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon
                    size={18}
                    className="sm:w-5 sm:h-5 dark:text-white"
                  />
                  <div>
                    <div className="font-bold text-sm sm:text-base dark:text-white">
                      Response Time
                    </div>
                    <span className="text-sm dark:text-zinc-300">
                      Within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
