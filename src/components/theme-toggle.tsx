"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const box = "grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:text-fg";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Same footprint before hydration, so nothing shifts.
  if (!mounted) return <span className={box} aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`${box} cursor-pointer`}
      aria-label={label}
      title={label}
    >
      {/* A dot, half lit. */}
      <svg viewBox="0 0 24 24" className={`h-[18px] w-[18px] transition-transform duration-500 ${isDark ? "rotate-180" : ""}`} aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}
