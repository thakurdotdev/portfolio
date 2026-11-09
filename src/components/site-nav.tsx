"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { personalInfo } from "@/constants";

const links = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 rounded-2xl border border-line bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] pl-4 pr-3 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--fg)_5%,transparent),0_8px_24px_-16px_rgb(0_0_0/0.35)] backdrop-blur-md sm:pl-5"
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0 });
            history.replaceState(null, "", location.pathname);
          }}
          className="flex items-center gap-2.5 rounded-lg"
          aria-label={`${personalInfo.name}, back to top`}
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-[10px] bg-fg text-[13px] font-semibold tracking-tight text-bg shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]"
          >
            PT
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight min-[400px]:inline">
            {personalInfo.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://cdn.thakur.dev/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-surface"
            aria-label="Resume PDF (opens in new tab)"
          >
            Resume
            <ArrowUpRight />
          </a>
        </div>
      </nav>
    </header>
  );
}

export function ArrowUpRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
