"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, AtSign, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export default function ContactSection() {
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
      className="py-16 md:py-20 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Minimal background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isInView ? 0.03 : 0,
            scale: isInView ? 1 : 0.8,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute right-0 bottom-1/4 transform w-96 h-96 border border-neutral-300 dark:border-neutral-700 rotate-45"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - matching Hero, Experience & Projects style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tighter">
              <span className="text-neutral-900 dark:text-neutral-100">
                CONTACT
              </span>
            </h2>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mx-auto h-[2px] w-16 bg-gradient-to-r from-transparent via-neutral-600 dark:via-neutral-400 to-transparent"
            />

            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
              <span className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light tracking-wide">
                Let's Connect
              </span>
              <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="max-w-2xl mx-auto mt-8 text-neutral-600 dark:text-neutral-400 font-light leading-relaxed"
          >
            Ready to bring your ideas to life? Let's discuss your project and
            explore how we can work together to create something amazing.
          </motion.p>
        </motion.div>

        {/* Main Content - Contact Form and Info */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative"
          >
            <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-neutral-200/30 dark:border-neutral-800/30 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-neutral-300/50 dark:group-hover:border-neutral-700/50">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                    Send Message
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 font-light">
                    Fill out the form below and I'll get back to you soon.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-neutral-300/50 dark:border-neutral-700/50 bg-transparent focus:border-neutral-500 dark:focus:border-neutral-400 transition-colors duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
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
                        className="border-neutral-300/50 dark:border-neutral-700/50 bg-transparent focus:border-neutral-500 dark:focus:border-neutral-400 transition-colors duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your project..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="border-neutral-300/50 dark:border-neutral-700/50 bg-transparent resize-none focus:border-neutral-500 dark:focus:border-neutral-400 transition-colors duration-300"
                    />
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative overflow-hidden bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg py-3 px-6 font-medium transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Send Message</span>
                            <ArrowUpRight
                              size={16}
                              className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                            />
                          </>
                        )}
                      </span>
                    </Button>

                    {/* Form submit status */}
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg"
                      >
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                          Message sent successfully! I'll get back to you soon.
                        </p>
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg"
                      >
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                          Something went wrong. Please try again later.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-neutral-300/30 dark:border-neutral-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-neutral-300/30 dark:border-neutral-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                  Get in Touch
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                  I'm always open to discussing new opportunities and
                  interesting projects.
                </p>
              </div>

              <div className="space-y-8">
                {/* Email */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-neutral-400"></span>
                    Email
                  </h4>
                  <a
                    href="mailto:pankaj@thakur.dev"
                    className="group inline-flex items-center gap-3 p-4 bg-white/40 dark:bg-black/10 backdrop-blur-sm rounded-lg border border-neutral-200/30 dark:border-neutral-800/30 hover:border-neutral-300/50 dark:hover:border-neutral-700/50 transition-all duration-300"
                  >
                    <AtSign size={20} className="text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors duration-300">
                      pankaj@thakur.dev
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-neutral-500 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-neutral-400"></span>
                    Location
                  </h4>
                  <div className="p-4 bg-white/40 dark:bg-black/10 backdrop-blur-sm rounded-lg border border-neutral-200/30 dark:border-neutral-800/30">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Ahmedabad, India
                    </span>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-neutral-400"></span>
                    Availability
                  </h4>
                  <div className="p-4 bg-white/40 dark:bg-black/10 backdrop-blur-sm rounded-lg border border-neutral-200/30 dark:border-neutral-800/30">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Available for new projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* End indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-4 mt-16 md:mt-20"
        >
          <div className="w-12 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            Let's Build Something Great
          </span>
          <div className="w-12 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
        </motion.div>
      </div>
    </section>
  );
}
