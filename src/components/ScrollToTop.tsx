"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { scrollToTop } from "@/hooks/useLenis";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxHeight, 1);

      setScrollProgress(progress);
      setIsVisible(scrolled > 500);
    };

    // Listen to Lenis scroll events for better performance
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleScrollToTop = () => {
    scrollToTop({
      duration: 1.5,
      offset: 0,
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
        >
          {/* Progress ring */}
          <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
              {/* Background circle */}
              <circle
                cx="22"
                cy="22"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-neutral-200 dark:text-neutral-700"
              />
              {/* Progress circle */}
              <circle
                cx="22"
                cy="22"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 * (1 - scrollProgress)}
                className="text-neutral-900 dark:text-neutral-100 transition-all duration-300"
              />
            </svg>

            {/* Button content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-neutral-900 rounded-full p-2 shadow-lg border border-neutral-200 dark:border-neutral-700 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <ChevronUp className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
              </div>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
