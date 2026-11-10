"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { personalInfo } from "@/constants";
import { scrollToY } from "@/lib/smooth-scroll";

const links = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`nav-in fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-line bg-[color-mix(in_oklab,var(--bg)_94%,transparent)] backdrop-blur-md"
          : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="page-w flex h-16 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToY(0);
            history.replaceState(null, "", location.pathname);
          }}
          className="flex items-center gap-2.5 py-2.5 text-[15px] font-semibold tracking-[-0.01em]"
          aria-label={`${personalInfo.name}, back to top`}
        >
          <span className="dot" aria-hidden="true" />
          {personalInfo.name}
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href} className={l.href === "#contact" ? "" : "hidden md:block"}>
                <a href={l.href} className="px-3 py-2 text-[15px] text-muted transition-colors hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
