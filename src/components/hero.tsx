"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ProcessStrip } from "@/components/process-strip";
import { personalInfo } from "@/constants";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const tagline = ["I", "build", "software", "and", "keep", "it", "running."];

/*
 * The letters of the name swell towards the pointer: wider and lighter where it is, back to
 * the condensed heavy cut elsewhere. One rAF loop, and only while something is moving.
 */
function useLens(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = ref.current;
    if (!host || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = [...host.querySelectorAll<HTMLElement>("[data-l]")];
    const cur = letters.map(() => 0);
    let px = -1e4;
    let py = -1e4;
    let raf = 0;

    const frame = () => {
      raf = 0;
      const size = parseFloat(getComputedStyle(host).fontSize);
      let moving = false;
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = (r.left + r.width / 2 - px) / size;
        const dy = (r.top + r.height / 2 - py) / size;
        const target = Math.exp(-(dx * dx * 2.2 + dy * dy * 1.2));
        cur[i] += (target - cur[i]) * 0.2;
        if (Math.abs(target - cur[i]) > 0.002) moving = true;
        el.style.fontWeight = String(Math.round(800 - cur[i] * 560));
        el.style.fontStretch = `${(76 + cur[i] * 24).toFixed(1)}%`;
      });
      if (moving) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onLeave = () => {
      px = py = -1e4;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
}

/** Each letter rises out of its word's mask, a beat after the one before. */
function Rise({ word, start }: { word: string; start: number }) {
  return (
    <span className="mask" aria-hidden="true">
      {[...word].map((ch, i) => (
        <span key={i} data-l="" style={d(start + i * 38)}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const name = useRef<HTMLHeadingElement>(null);
  useLens(name);

  return (
    <section
      aria-labelledby="intro-title"
      data-scene="portrait"
      data-stage="#stage-hero"
      data-label="Index"
      className="page-w relative flex flex-col justify-end lg:min-h-[max(100svh,36rem)] px-5 pt-[calc(4rem+min(100vw,50svh))] pb-6 sm:px-8 sm:pb-8 lg:px-12 lg:pt-24"
    >
      {/* Where the portrait is drawn. Drag it to turn it. The photo only shows without WebGL. */}
      <div
        id="stage-hero"
        data-drag=""
        className="stage absolute top-14 left-1/2 aspect-square w-[min(100vw,50svh)] -translate-x-1/2 lg:top-[9svh] lg:right-[5%] lg:left-auto lg:w-[min(60svh,38vw,40rem)] lg:translate-x-0"
      >
        {/* The first thing on the page: one dot, online. When WebGL is ready it bursts into the portrait. */}
        <span className="boot" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pankaj.webp"
          alt="Portrait of Pankaj Thakur"
          width={240}
          height={240}
          className="portrait-fallback mx-auto mt-[14%] h-[60%] w-[60%] rounded-[14px] object-cover opacity-0"
        />
        <p className="hint settle absolute right-0 bottom-[6%] hidden font-mono text-[11px] text-dim lg:block" style={d(1500)}>
          drag to turn
        </p>
      </div>

      <h1
        ref={name}
        id="intro-title"
        className="display relative -ml-[0.04em] whitespace-nowrap text-[clamp(3.1rem,15.6vw,18.5rem)]"
      >
        <span className="sr-only">{personalInfo.name}</span>
        <Rise word="Pankaj" start={0} /> <Rise word="Thakur" start={150} />
      </h1>

      <p className="relative mt-3 text-[clamp(1.25rem,2.2vw,1.875rem)] leading-snug tracking-[-0.02em]">
        <span className="sr-only">I build software and keep it running.</span>
        <span aria-hidden="true">
          {tagline.map((w, i) => (
            <span key={i}>
              <span className="word" style={d(520 + i * 55)}>
                {w}
              </span>
              {i < tagline.length - 1 && " "}
            </span>
          ))}
        </span>
      </p>

      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 pt-5 sm:mt-10">
        <span aria-hidden="true" className="draw absolute inset-x-0 top-0 h-px bg-line-strong" style={d(300)} />
        <ProcessStrip />
        <p className="settle text-[15px] leading-snug text-muted sm:text-right" style={d(900)}>
          {personalInfo.role}
          <br />
          at {personalInfo.company}
        </p>
      </div>
    </section>
  );
}
