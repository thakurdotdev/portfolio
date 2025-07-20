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
    <div className="bg-white border-2 border-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="border-2 border-gray-300 p-4 sm:p-6">
            <div className="border-b-2 border-black pb-3 mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Contact Form</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-serif font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 focus:border-black font-serif text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 focus:border-black font-serif text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-bold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 focus:border-black font-serif text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 font-serif font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
                <div className="text-green-600 text-sm font-serif">
                  Message sent successfully!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-600 text-sm font-serif">
                  There was an error sending your message. Please try again
                  later.
                </div>
              )}
            </form>
          </div>
          <div className="space-y-6">
            <div className="border-2 border-gray-300 p-4 sm:p-6">
              <div className="border-b-2 border-black pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Social Links</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border border-gray-300 hover:border-black transition-colors"
                  >
                    {link.icon}
                    <span className="text-sm">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="border-2 border-gray-300 p-4 sm:p-6">
              <div className="border-b-2 border-black pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Direct Contact</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MailIcon size={18} className="sm:w-5 sm:h-5" />
                  <div>
                    <div className="font-bold text-sm sm:text-base">Email</div>
                    <a
                      href="mailto:pankaj@thakur.dev"
                      className="hover:underline text-sm break-all"
                    >
                      pankaj@thakur.dev
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon size={18} className="sm:w-5 sm:h-5" />
                  <div>
                    <div className="font-bold text-sm sm:text-base">
                      Location
                    </div>
                    <span className="text-sm">Ahmedabad, Gujarat, India</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon size={18} className="sm:w-5 sm:h-5" />
                  <div>
                    <div className="font-bold text-sm sm:text-base">
                      Response Time
                    </div>
                    <span className="text-sm">Within 24 hours</span>
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
