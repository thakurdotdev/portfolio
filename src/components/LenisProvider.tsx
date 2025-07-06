"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1, // Smoothness factor (0-1)
      duration: 1.2, // Duration in seconds
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Enable anchor links for smooth navigation
      anchors: true,
      // Prevent scrolling on certain elements
      prevent: (node) => {
        // Prevent smooth scroll on elements with data-lenis-prevent
        return Boolean(
          node.hasAttribute("data-lenis-prevent") ||
            node.classList.contains("lenis-prevent") ||
            // Prevent on modal/dialog elements
            node.closest('[role="dialog"]') ||
            node.closest('[role="modal"]') ||
            // Prevent on sheet components
            node.closest("[data-radix-dialog-content]"),
        );
      },
    });

    lenisRef.current = lenis;

    // Make Lenis instance globally accessible
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    // Log scroll events for debugging (optional)
    lenis.on("scroll", (e) => {
      // Uncomment for debugging
      // console.log("Scroll progress:", e.progress, "Direction:", e.direction);
    });

    // Clean up on unmount
    return () => {
      lenis.destroy();
      if (typeof window !== "undefined") {
        (window as any).lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}
