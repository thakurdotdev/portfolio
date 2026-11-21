"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/*
 * The browser's own chrome (the address bar on phones) is coloured by `theme-color`. The
 * metadata sets it per system scheme; once the visitor picks a theme with the toggle, it
 * follows that instead, so the bar never sits dark over a light page or the other way round.
 */
export function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const color = resolvedTheme === "dark" ? "#050505" : "#f2f2f2";
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
  }, [resolvedTheme]);

  return null;
}
