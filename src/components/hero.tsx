"use client";

import { socialLinks } from "@/constants";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  const nameLetters = "PANKAJ THAKUR".split("");

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden pt-28 md:pt-[200px]"
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none -z-10">
        <div className="col-span-full row-start-2 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block"></div>

        <div
          className="col-span-full row-start-6 h-[1px] w-full bg-neutral-800 dark:bg-neutral-200 opacity-30 hidden md:block
        "
        ></div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 0.7 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute top-4 left-8 pointer-events-none"
        >
          <span
            className={`text-[8rem] font-thin tracking-tighter select-none
            text-neutral-200 dark:text-neutral-800`}
          >
            01
          </span>
        </motion.div>

        {/* Triangular element - adds visual balance with other sections */}
        <motion.div
          initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
          animate={{
            opacity: isVisible ? 0.05 : 0,
            rotate: isVisible ? -15 : 0,
            scale: isVisible ? 1 : 0.8,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -left-[25vw] top-[20vh] w-[50vw] h-[50vw] border-t-2 border-l-2 opacity-30 border-neutral-300/50 dark:border-neutral-700/50"
        />

        {/* Circular decorative element - similar to tech stack section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isVisible ? 0.1 : 0,
            scale: isVisible ? 1 : 0.8,
          }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute right-[10vw] bottom-[10vh] w-[30vw] h-[30vw] rounded-full border border-neutral-400 dark:border-neutral-600 opacity-20"
        />

        <motion.div
          initial={{ opacity: 0, rotate: 90, x: 50 }}
          animate={{ opacity: 0.07, rotate: 90, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute right-[100px] top-0 -translate-y-1/2 select-none pointer-events-none hidden md:block"
        >
          <span className="text-[120px] md:text-[180px] font-bold tracking-tight opacity-50 text-neutral-900 dark:text-neutral-100">
            /H
          </span>
        </motion.div>
      </div>

      {/* Main content container with improved asymmetric grid */}
      <div className="h-full flex flex-col justify-center py-16 md:py-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16 items-start min-h-[65vh]">
            <div className="lg:col-span-12 lg:col-start-2 lg:row-start-1 flex flex-col items-start justify-center z-10 order-1 lg:order-2">
              {/* Section label indicator with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 flex items-center overflow-hidden"
              >
                <div className="h-px w-16 md:w-24 bg-neutral-400 dark:bg-neutral-600 mr-4"></div>
                <div className="text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-light overflow-hidden">
                  <motion.span
                    initial={{ y: 20 }}
                    animate={{ y: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="inline-block"
                  >
                    Introduction
                  </motion.span>
                </div>
              </motion.div>

              <div
                className="mb-8 select-none"
                style={{
                  perspective: "1000px",
                }}
              >
                <div className="relative text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-tighter">
                  <span className="inline-block text-neutral-900 dark:text-neutral-100">
                    {nameLetters.map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{
                          rotateY: isVisible ? 0 : 90,
                          opacity: isVisible ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.5 + i * 0.05,
                        }}
                        className="inline-block"
                      >
                        {letter === " "
                          ? "\u00A0" // Non-breaking space
                          : letter}
                      </motion.span>
                    ))}
                  </span>
                </div>
              </div>

              {/* Role/title with animated underline and improved styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="mb-8 relative overflow-hidden"
              >
                <div className="relative inline-block">
                  <span className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 font-light tracking-wide">
                    Software Engineer
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.7, delay: 1.3, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 h-[1px] w-full bg-neutral-500 dark:bg-neutral-400 origin-left"
                  />
                </div>
              </motion.div>

              {/* Description with staggered line reveal and improved typography */}
              <div className="max-w-2xl mb-16 overflow-hidden">
                {[
                  "Creating elegant digital experiences with modern web technologies.",
                  "Specialized in responsive, user-centric applications with attention to detail.",
                ].map((line, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.p
                      initial={{ y: 40 }}
                      animate={{ y: isVisible ? 0 : 40 }}
                      transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                      className="text-lg text-neutral-700 dark:text-neutral-300 font-light leading-relaxed my-1"
                    >
                      {line}
                    </motion.p>
                  </div>
                ))}
              </div>

              {/* CTAs and contact with fixed layout - properly positioned buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="w-full grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-4"
              >
                {/* CTA Button - Enhanced with better hover animation */}
                <div className="md:col-span-5 md:col-start-1">
                  <Link
                    href="#projects"
                    className="group relative flex items-center overflow-hidden"
                  >
                    <div className="mr-4 relative h-14 w-14 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                      <motion.div
                        initial={{ x: -40 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                        className="relative z-10"
                      >
                        <ArrowRight
                          size={18}
                          className="text-neutral-700 dark:text-neutral-300 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ x: "100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 bg-neutral-900 dark:bg-neutral-200 origin-left"
                      />
                    </div>
                    <div className="relative">
                      <span
                        className={`text-neutral-900 dark:text-neutral-100 text-base`}
                      >
                        View Work
                      </span>
                      <motion.span
                        className="absolute -bottom-1 left-0 h-[1px] bg-current"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </Link>
                </div>

                {/* Email - Repositioned for proper alignment */}
                <div className="md:col-span-3 md:col-start-7">
                  <Link
                    href="mailto:pankaj@thakur.dev"
                    className="group inline-block"
                  >
                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-neutral-500">
                        Email
                      </div>
                      <div className="flex items-center">
                        <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors duration-300 relative inline-block">
                          pankaj@thakur.dev
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
                        </span>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.5 }}
                          className="ml-2 opacity-0 group-hover:opacity-70 transition-opacity"
                        >
                          <ExternalLink size={14} />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Social links with improved position */}
                <div className="md:col-span-3 md:col-start-10">
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-neutral-500">
                      Connect
                    </div>
                    <div className="flex items-center gap-5">
                      {socialLinks.map((link, i) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                        >
                          <motion.div
                            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 1.6 + i * 0.1 }}
                            whileHover={{
                              y: -2,
                              transition: { duration: 0.2 },
                            }}
                          >
                            {link.icon}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
