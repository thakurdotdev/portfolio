"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, AtSign, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Track when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle form submission
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
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none -z-10">
        <div className="col-span-full row-start-3 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block"></div>
      </div>

      {/* Minimal geometric background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Section indicator overlay */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isInView ? 0.7 : 0, x: isInView ? 0 : -50 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute top-20 left-8 pointer-events-none hidden md:block"
        >
          <span
            className={`text-[8rem] font-thin tracking-tighter select-none
            ${isDark ? "text-neutral-800" : "text-neutral-200"}`}
          >
            05
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: 90, x: 50 }}
        animate={{ opacity: 0.07, rotate: 90, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute right-[100px] top-0 -translate-y-1/2 select-none pointer-events-none hidden md:block"
      >
        <span className="text-[120px] md:text-[180px] font-bold tracking-tight opacity-50 text-neutral-900 dark:text-neutral-100">
          /C
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header - Deconstructed and asymmetric */}
        <div className="relative mb-20 md:mb-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute -left-2 md:left-4 top-0 hidden md:block"
          >
            <div className="flex flex-col items-start space-y-1">
              <div className="h-[1px] w-8 bg-neutral-400"></div>
              <div className="h-[1px] w-16 bg-neutral-400"></div>
              <div className="h-[1px] w-4 bg-neutral-400"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="ml-0 md:ml-20"
          >
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-8">
              <span className="block">Contact</span>
            </h2>
            <p
              className={`text-base max-w-lg ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Let's discuss your project or explore potential collaborations.
            </p>
          </motion.div>
        </div>

        {/* Main content grid with form and contact info */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-7 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className={`p-6 md:p-10 ${
                  isDark ? "bg-neutral-900/50" : "bg-white/50"
                } backdrop-blur-sm relative`}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs uppercase tracking-wider text-neutral-500"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-neutral-300 dark:border-neutral-700 bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs uppercase tracking-wider text-neutral-500"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-neutral-300 dark:border-neutral-700 bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs uppercase tracking-wider text-neutral-500"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="border-neutral-300 dark:border-neutral-700 bg-transparent resize-none"
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full md:w-auto relative group overflow-hidden ${
                        isDark
                          ? "bg-neutral-800 hover:bg-neutral-700"
                          : "bg-neutral-200 hover:bg-neutral-300"
                      } text-neutral-900 dark:text-neutral-100 rounded-none`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Send Message</span>
                          </>
                        )}
                      </span>
                      <motion.div
                        initial={{ x: "100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`absolute inset-0 ${
                          isDark ? "bg-neutral-200" : "bg-neutral-900"
                        } origin-left z-0`}
                      />
                    </Button>

                    {/* Form submit status */}
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-green-500 dark:text-green-400 text-sm"
                      >
                        Message sent successfully! I'll get back to you soon.
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-red-500 dark:text-red-400 text-sm"
                      >
                        Something went wrong. Please try again later.
                      </motion.div>
                    )}
                  </div>
                </form>

                {/* Decorative corner elements */}
                <div className="absolute -bottom-3 -left-3 w-12 h-12 md:w-16 md:h-16 border-l-2 border-b-2 border-neutral-400 opacity-40" />
                <div className="absolute -top-3 -right-3 w-12 h-12 md:w-16 md:h-16 border-r-2 border-t-2 border-neutral-400 opacity-40" />
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div
                className={`p-6 md:p-10 h-full flex flex-col justify-between ${
                  isDark ? "bg-neutral-900/30" : "bg-white/30"
                } backdrop-blur-sm`}
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-8">
                    Get in Touch
                  </h3>

                  <div className="space-y-6 mb-12">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                        Email
                      </div>
                      <a
                        href="mailto:pankaj@thakur.dev"
                        className="group flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300"
                      >
                        <AtSign size={18} className="text-neutral-500" />
                        <span className="relative">
                          pankaj@thakur.dev
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="text-neutral-500 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </a>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                        Location
                      </div>
                      <div className="text-neutral-700 dark:text-neutral-300">
                        Ahmedabad, India
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                        Availability
                      </div>
                      <div className="relative inline-flex items-center text-neutral-700 dark:text-neutral-300">
                        <span className="relative flex h-2 w-2 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Available for new projects
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
                    Response Time
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    I usually respond to inquiries within 24-48 hours. For
                    urgent matters, please mention it in your message.
                  </div>
                </div>
              </div>

              {/* Decorative line element */}
              <div className="absolute -left-2 top-16 bottom-1/2 w-[1px]">
                <motion.div
                  className="h-full w-full opacity-20"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isInView ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{
                    transformOrigin: "top",
                    background: `linear-gradient(to bottom, ${
                      isDark ? "#525252" : "#a3a3a3"
                    }, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
