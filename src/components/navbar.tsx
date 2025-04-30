"use client";

import { navbarLinks } from "@/constants";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const highlightColor = "#3B82F6";

const Navbar = () => {
  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300"
      style={{
        borderColor: `${highlightColor}20`,
      }}
    >
      <div className="container max-w-[1300px] flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link
            className="flex items-center mr-8 transition-transform duration-300 hover:scale-105"
            href="/"
          >
            <span
              className="text-lg font-bold tracking-tight italic"
              style={{
                fontFamily: "'Brush Script MT', 'Brush Script Std', cursive",
              }}
            >
              Pankaj Thakur
            </span>
          </Link>

          <div className="hidden md:flex gap-2">
            <div className="flex items-center space-x-8 text-sm font-medium">
              {navbarLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="relative group transition-colors hover:text-foreground/80"
                  aria-label={link.name}
                >
                  {link.name}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: highlightColor }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
