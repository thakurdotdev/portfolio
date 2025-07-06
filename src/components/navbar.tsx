"use client";

import { navbarLinks } from "@/constants";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

// Helper function to safely check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

const Navbar = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track scroll position for navbar transparency and active section
  useEffect(() => {
    const handleScroll = () => {
      if (!isBrowser) return;
      setScrolled(window.scrollY > 50);

      // Determine which section is currently visible
      const sections = navbarLinks.map((link) => link.url.substring(1));

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 3 &&
            rect.bottom >= window.innerHeight / 3
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Track mouse position for interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      if (!isBrowser) return;
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    if (isBrowser) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("mousemove", handleMouseMove);

      // Initial check
      handleScroll();
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-500 ${
        scrolled ? "border-b" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between relative">
        {/* Logo Area with subtle animation */}
        <motion.div
          className="flex items-center z-20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link className="flex items-center group" href="/about">
            <span className="relative overflow-hidden">
              <motion.span
                className="text-xl font-light tracking-tight inline-block relative"
                animate={{
                  x: mousePosition.x * 2,
                  y: mousePosition.y * 2,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
              >
                <span className="text-neutral-900 dark:text-neutral-100">
                  P
                </span>
                <span className="text-neutral-400">T</span>
              </motion.span>

              <motion.div
                className={`absolute -bottom-1 -left-1 h-[1px] w-6 ${
                  isDark ? "bg-neutral-400" : "bg-neutral-600"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-2 items-center">
          <div className="flex items-center space-x-8">
            {navbarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="relative overflow-hidden group"
                aria-label={link.name}
                onClick={() => setActiveSection(link.url.substring(1))}
              >
                <motion.div
                  className="flex items-center"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <span
                    className={`text-sm font-light ${
                      activeSection === link.url.substring(1)
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-500 dark:text-neutral-400"
                    } transition-colors duration-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100`}
                  >
                    {link.name}
                  </span>

                  {/* Animated indicator dot for active section */}
                  {activeSection === link.url.substring(1) && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="ml-1.5 h-1 w-1 rounded-full bg-neutral-900 dark:bg-neutral-100"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>

                {/* Animated underline */}
                <motion.div
                  className={`absolute -bottom-0 left-0 h-[1px] bg-neutral-900 dark:bg-neutral-100 w-full transform origin-left`}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: activeSection === link.url.substring(1) ? 1 : 0,
                  }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          {/* Theme toggle with separator */}
          <div className="flex items-center ml-8">
            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-4" />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center z-20">
          <div className="mr-4">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="absolute top-full left-0 right-0 z-10 md:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: isDark
              ? "rgba(10, 10, 10, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            pointerEvents: mobileMenuOpen ? "auto" : "none",
            overflow: "hidden",
          }}
        >
          <div className="flex flex-col px-4 py-6 space-y-6 border-t border-neutral-200 dark:border-neutral-800">
            {navbarLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{
                  x: mobileMenuOpen ? 0 : -20,
                  opacity: mobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
              >
                <Link
                  href={link.url}
                  className={`block text-lg ${
                    activeSection === link.url.substring(1)
                      ? "text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-500 dark:text-neutral-400"
                  } hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-light`}
                  onClick={() => {
                    setActiveSection(link.url.substring(1));
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-50">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{link.name}</span>
                    {activeSection === link.url.substring(1) && (
                      <motion.div
                        layoutId="mobile-navbar-active-indicator"
                        className="h-1 w-1 rounded-full bg-neutral-900 dark:bg-neutral-100"
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
