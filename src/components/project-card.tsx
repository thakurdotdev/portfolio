"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Img = string | StaticImageData;

export interface ProjectCardProps {
  /** Project name. */
  title: string;
  /** Short description (clamped to 2 lines). Aim for ~90 characters. */
  description: string;
  /** Project URL. External URLs open in a new tab unless `onClick` is used. */
  href: string;
  /** Main screenshot. Cropped to the top of the page. */
  image: Img;
  /** Alt text for the screenshot. Defaults to "<title> screenshot". */
  imageAlt?: string;
  /**
   * Up to two more screens (dashboard, settings, docs...). They appear on sheets
   * behind the main screenshot and fan out on hover. Without them, no sheets are drawn.
   * Order: [closest sheet, farthest sheet].
   */
  screens?: Img[];
  /** Crops dead margins by scaling screenshots from the top-center. 1 = off, 1.2 is a good start. */
  zoom?: number;
  /** Brand color of the project. Tints the stage and glows behind the screenshot. */
  accent?: string;
  /** Year (or any short date text) shown beside the title. */
  year?: string;
  /** Technologies, most important first. First `maxTags` are listed, the rest become "and N more". */
  tags?: string[];
  maxTags?: number;
  /** Optional photo/texture revealed behind the sheets on hover. */
  background?: Img;
  /** Small text in the top-left of the stage, e.g. "Web app". */
  label?: string;
  /** Text of the hover button. Defaults to "Visit site", "View project" or "Watch demo". */
  actionLabel?: string;
  /** Optional click handler (e.g. to open a video modal). */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Whether the card opens a video walkthrough. Swaps the button icon and text. */
  isVideo?: boolean;
  /** Extra classes for the outer link. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Motion                                                                     */
/* -------------------------------------------------------------------------- */

const MotionLink = motion.create(Link);

const FAN_SPRING = { stiffness: 260, damping: 24, mass: 0.8 };
const POINTER_SPRING = { stiffness: 180, damping: 22 };

const GLOW_BG =
  "radial-gradient(ellipse 80% 70% at 50% 105%, color-mix(in oklab, var(--accent) 60%, transparent), transparent 70%)";

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Builds the motion values for one sheet.
 * `progress` is 0 at rest and 1 on hover; `pointer` is -1..1 across the card.
 * The fan angle follows the cursor by up to `tilt` degrees.
 */
function useFan(
  progress: MotionValue<number>,
  pointer: MotionValue<number>,
  fan: { rotate: number; x: number; y: number; tilt: number },
): MotionStyle {
  const rotate = useTransform(
    [progress, pointer],
    ([p, t]: number[]) => (fan.rotate + t * fan.tilt) * p,
  );
  const x = useTransform(progress, (p: number) => `${fan.x * p}%`);
  const y = useTransform(progress, (p: number) => fan.y * p);
  return { rotate, x, y };
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ProjectCard({
  title,
  description,
  href,
  image,
  imageAlt,
  screens = [],
  zoom = 1,
  accent = "#71717a",
  year,
  tags = [],
  maxTags = 3,
  background,
  label,
  actionLabel,
  onClick,
  isVideo,
  className,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  // 0 = rest, 1 = hovered. Everything animates from this one spring.
  const progress = useSpring(0, FAN_SPRING);
  // Horizontal cursor position across the card, -1 (left) to 1 (right).
  const pointer = useSpring(0, POINTER_SPRING);

  useEffect(() => {
    const target = hovered || focused ? 1 : 0;
    if (reduceMotion) progress.jump(target);
    else progress.set(target);
  }, [hovered, focused, reduceMotion, progress]);

  const back = useFan(progress, pointer, { rotate: -7, x: -7, y: -6, tilt: 3 });
  const mid = useFan(progress, pointer, { rotate: 5, x: 6, y: -3, tilt: 3 });

  const frameY = useTransform(progress, (p: number) => -10 * p);
  const frameScale = useTransform(progress, (p: number) => 1 + 0.02 * p);
  const frameX = useTransform([progress, pointer], ([p, t]: number[]) => t * 5 * p);
  const glowOpacity = useTransform(progress, [0, 1], [0.55, 1]);

  const isExternal = /^https?:\/\//.test(href);
  const hiddenCount = Math.max(tags.length - maxTags, 0);
  const tagLine =
    tags.slice(0, maxTags).join(", ") +
    (hiddenCount > 0 ? ` and ${hiddenCount} more` : "");

  const buttonText =
    actionLabel ?? (isVideo ? "Watch demo" : isExternal ? "Visit site" : "View project");

  const zoomStyle: CSSProperties | undefined =
    zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: "50% 0%" } : undefined;

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
  };

  return (
    <MotionLink
      href={href}
      {...(isExternal && !onClick ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={
        onClick
          ? (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onClick(e);
          }
          : undefined
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false);
        pointer.set(0);
      }}
      onPointerMove={handlePointerMove}
      onFocus={(e: React.FocusEvent<HTMLAnchorElement>) =>
        setFocused(e.currentTarget.matches(":focus-visible"))
      }
      onBlur={() => setFocused(false)}
      className={cx(
        "group/card block w-full touch-manipulation rounded-2xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
        className,
      )}
      style={
        { "--accent": accent, WebkitTapHighlightColor: "transparent" } as CSSProperties
      }
    >
      {/* ------------------------------ Stage ------------------------------ */}
      <div
        className={cx(
          "relative aspect-[5/4] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-black/5",
          "bg-[color-mix(in_oklab,var(--accent)_16%,white)]",
          "dark:bg-[color-mix(in_oklab,var(--accent)_18%,#0c0c0c)] dark:ring-white/10",
        )}
      >
        {background && (
          <motion.div style={{ opacity: progress }} className="absolute inset-0" aria-hidden="true">
            <Image
              src={background}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 380px"
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Accent glow behind the screenshot */}
        <motion.div
          style={{ backgroundImage: GLOW_BG, opacity: glowOpacity }}
          className="absolute inset-0"
          aria-hidden="true"
        />

        {label && (
          <span className="absolute left-4 top-4 z-30 text-xs font-medium text-neutral-800/75 dark:text-white/75">
            {label}
          </span>
        )}

        {/* Sheets: only drawn when you pass extra screens */}
        {screens[1] && (
          <Sheet
            style={back}
            screen={screens[1]}
            zoomStyle={zoomStyle}
            className="inset-x-[14%] top-[15%] bg-[color-mix(in_oklab,var(--accent)_38%,white)] dark:bg-[color-mix(in_oklab,var(--accent)_40%,#111)]"
          />
        )}
        {screens[0] && (
          <Sheet
            style={mid}
            screen={screens[0]}
            zoomStyle={zoomStyle}
            className="inset-x-[10%] top-[20%] bg-[color-mix(in_oklab,var(--accent)_58%,white)] dark:bg-[color-mix(in_oklab,var(--accent)_58%,#111)]"
          />
        )}

        {/* Main screenshot */}
        <motion.div
          style={{ x: frameX, y: frameY, scale: frameScale, transformOrigin: "50% 100%" }}
          className={cx(
            "absolute inset-x-[6%] -bottom-[6%] z-10 overflow-hidden rounded-t-[10px] bg-neutral-900",
            "shadow-[0_20px_40px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/10 dark:ring-white/15",
            screens.length > 0 ? "top-[25%]" : "top-[21%]",
          )}
        >
          {failed ? (
            <div className="absolute inset-0 grid place-items-center bg-[color-mix(in_oklab,var(--accent)_30%,#111)] px-4 text-center text-sm font-medium text-white/85">
              {title}
            </div>
          ) : (
            <Image
              src={image}
              alt={imageAlt ?? `${title} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, 380px"
              className="object-cover object-top"
              style={zoomStyle}
              onError={() => setFailed(true)}
            />
          )}
        </motion.div>

        {/* Action button (top-right). CSS-driven so it stays visible on touch screens. */}
        <div className="pointer-events-none absolute right-3 top-3 z-30">
          <span
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white shadow-lg",
              "dark:bg-white dark:text-neutral-950",
              "-translate-y-1.5 opacity-0 transition duration-300 ease-out motion-reduce:transition-none",
              "group-hover/card:translate-y-0 group-hover/card:opacity-100",
              "group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100",
              "[@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
            )}
          >
            {isVideo ? <PlayIcon /> : <ArrowUpRight />}
            {buttonText}
          </span>
        </div>
      </div>

      {/* ----------------------------- Caption ----------------------------- */}
      <div className="pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] font-medium leading-6 tracking-tight text-neutral-900 dark:text-neutral-50">
            {title}
          </h3>
          {year && (
            <span className="shrink-0 text-sm tabular-nums text-neutral-400 dark:text-neutral-500">
              {year}
            </span>
          )}
        </div>

        <p className="mt-1.5 line-clamp-2 max-w-[44ch] text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {description}
        </p>

        {tags.length > 0 && (
          <p
            title={tags.join(", ")}
            className="mt-3 truncate text-[13px] text-neutral-500 dark:text-neutral-400"
          >
            {tagLine}
          </p>
        )}
      </div>
    </MotionLink>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid                                                                       */
/* -------------------------------------------------------------------------- */

export function ProjectGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2", className)}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function Sheet({
  style,
  screen,
  zoomStyle,
  className,
}: {
  style: MotionStyle;
  screen: Img;
  zoomStyle?: CSSProperties;
  className: string;
}) {
  return (
    <motion.div
      style={{ ...style, transformOrigin: "50% 100%" }}
      className={cx(
        "absolute -bottom-[6%] overflow-hidden rounded-t-[10px] border border-white/40 dark:border-white/10",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src={screen}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 380px"
        className="object-cover object-top"
        style={zoomStyle}
      />
    </motion.div>
  );
}

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}