"use client";

import { useRef, type CSSProperties } from "react";
import { DotField } from "@/components/dot-field";
import { ProcessStrip } from "@/components/process-strip";
import { personalInfo } from "@/constants";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Each letter rises out of its word's mask, a beat after the one before. */
function Rise({ word, start }: { word: string; start: number }) {
  return (
    <span className="mask" aria-hidden="true">
      {[...word].map((ch, i) => (
        <span key={i} style={d(start + i * 38)}>
          {ch}
        </span>
      ))}
    </span>
  );
}

const tagline = ["I", "build", "software", "and", "keep", "it", "running."];

/*
 * Nothing in the hero sets a z-index or opacity on a wrapper: the process strip has to stay
 * in the root stacking context so it can sit above the intro layer.
 */
export function Hero() {
  const portrait = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-labelledby="intro-title"
      className="relative flex min-h-[max(100svh,34rem)] flex-col justify-end overflow-clip px-5 pt-[calc(4rem+min(100vw,48svh))] pb-6 sm:px-8 sm:pb-8 lg:px-12 lg:pt-24"
    >
      <DotField
        image="/pankaj-cutout.webp"
        anchor={portrait}
        intro
        className="absolute inset-0 h-full w-full [--dot-accent:var(--accent)] [--dot-alpha:0.17] [--dot-ink:var(--fg)] [--dot-invert:0] dark:[--dot-alpha:0.22] dark:[--dot-invert:1]"
      />

      {/* Where the halftone portrait sits. The photo itself only shows without WebGL. */}
      <div
        ref={portrait}
        className="absolute top-16 left-1/2 aspect-square w-[min(100vw,48svh)] -translate-x-1/2 lg:top-[5svh] lg:right-[3vw] lg:left-auto lg:w-[min(70svh,46vw)] lg:translate-x-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pankaj.webp"
          alt="Portrait of Pankaj Thakur"
          width={240}
          height={240}
          className="portrait-fallback mx-auto mt-[12%] h-[60%] w-[60%] rounded-[14px] object-cover opacity-0"
        />
      </div>

      <h1
        id="intro-title"
        className="display relative -ml-[0.04em] whitespace-nowrap text-[clamp(3.25rem,16.4vw,19.5rem)]"
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
