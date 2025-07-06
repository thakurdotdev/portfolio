"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Try to get the global Lenis instance if available
    if (typeof window !== "undefined") {
      lenisRef.current = (window as any).lenis || null;
    }
  }, []);

  return lenisRef.current;
};

export const scrollTo = (
  target: string | number | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    easing?: (t: number) => number;
    immediate?: boolean;
    lock?: boolean;
    onComplete?: () => void;
  },
) => {
  const lenis = (window as any).lenis;
  if (lenis) {
    lenis.scrollTo(target, options);
  }
};

export const scrollToTop = (options?: {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}) => {
  scrollTo(0, options);
};

export const scrollToBottom = (options?: {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}) => {
  scrollTo("bottom", options);
};
