"use client";

import { socialLinks } from "@/constants";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchPage from "./ai-chat/page";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden pt-20 md:pt-[100px]"
    >
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full">
          <div className="text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="relative inline-block">
                <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-tighter">
                  <span className="text-neutral-900 dark:text-neutral-100">
                    {nameLetters.map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: isVisible ? 1 : 0,
                          y: isVisible ? 0 : 20,
                        }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.03 }}
                        className="inline-block"
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </span>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isVisible ? 1 : 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-[2px] w-24 bg-gradient-to-r from-transparent via-neutral-600 dark:via-neutral-400 to-transparent origin-center"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="flex items-center justify-center gap-3"
              >
                <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
                <span className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light tracking-wide">
                  Software Engineer
                </span>
                <div className="w-8 h-[1px] bg-neutral-400 dark:bg-neutral-600"></div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                Crafting exceptional digital experiences through innovative web
                technologies. I specialize in building scalable, user-centric
                applications that seamlessly blend
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  {" "}
                  performance
                </span>
                ,
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  {" "}
                  accessibility
                </span>
                , and
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  {" "}
                  aesthetic excellence
                </span>
                .
              </p>

              <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light">
                From concept to deployment, I transform complex ideas into
                intuitive digital solutions that drive engagement and deliver
                measurable results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0"></div>
                  <div className="relative p-3 md:p-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light text-center mb-4 leading-relaxed">
                      Curious about my experience, projects, or development
                      approach?
                    </p>
                    <SearchPage />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-row items-center justify-center gap-8 md:gap-16"
            >
              {/* Email */}
              <div className="group">
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2 text-center">
                  Let's Connect
                </div>
                <Link
                  href="mailto:pankaj@thakur.dev"
                  className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300"
                >
                  <span className="text-lg font-medium relative">
                    pankaj@thakur.dev
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </div>

              {/* Social Links */}
              <div className="group">
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2 text-center">
                  Follow
                </div>
                <div className="flex items-center gap-4">
                  {socialLinks.map((link, i) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className="group/social"
                    >
                      <motion.div
                        className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.6 + i * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        {link.icon}
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="flex flex-col items-center gap-2 pt-4"
            >
              <span className="text-xs text-neutral-500 uppercase tracking-wider">
                Explore More
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-[1px] h-8 bg-gradient-to-b from-neutral-400 to-transparent"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
