import { addTick } from "@/lib/ticker";

/*
 * The time for the contact clock, from one place. The dots show the visitor's own time; the
 * caption under them reads the same snapshot and adds the time in India, where I am. Both
 * turn on the same frame. It is checked on the page's frame loop rather than a timer:
 * browsers throttle or pause timers in background tabs, and a timer that fires late leaves
 * one clock a minute behind the other.
 */

const hm = { hour: "2-digit", minute: "2-digit", hour12: false } as const;
const localFmt = new Intl.DateTimeFormat("en-GB", hm);
const indiaFmt = new Intl.DateTimeFormat("en-GB", { ...hm, timeZone: "Asia/Kolkata" });

export const INDIA_TZ = "Asia/Kolkata";

export interface ClockTime {
  /** The visitor's time, "HH:MM", 24-hour. */
  local: string;
  /** The time in India, "HH:MM", 24-hour. */
  india: string;
  indiaHour: number;
  /** Whether the visitor's clock already shows India time. */
  sameAsIndia: boolean;
}

function hhmm(fmt: Intl.DateTimeFormat, now: number) {
  const parts = fmt.formatToParts(now);
  // Some engines print midnight as "24".
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { text: `${String(hour).padStart(2, "0")}:${minute}`, hour };
}

function localZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

let current: ClockTime | null = null;
let nextMinuteAt = 0;
const listeners = new Set<() => void>();
let stop: (() => void) | null = null;

/** Re-reads the time if a minute boundary has passed. Cheap enough to call every frame. */
function refresh() {
  const now = Date.now();
  if (current && now < nextMinuteAt) return;
  nextMinuteAt = now - (now % 60_000) + 60_000;
  const local = hhmm(localFmt, now).text;
  const india = hhmm(indiaFmt, now);
  if (current && local === current.local && india.text === current.india) return;
  current = {
    local,
    india: india.text,
    indiaHour: india.hour,
    sameAsIndia: localZone() === INDIA_TZ || local === india.text,
  };
  for (const l of listeners) l();
}

const onVisible = () => {
  if (!document.hidden) refresh();
};

/** The current clock snapshot. Stable between minutes, as useSyncExternalStore needs. */
export function getClockTime(): ClockTime {
  refresh();
  return current!;
}

/** Calls `fn` whenever the minute turns. For useSyncExternalStore. */
export function subscribeClockTime(fn: () => void) {
  listeners.add(fn);
  if (!stop) {
    const remove = addTick(refresh, -1);
    document.addEventListener("visibilitychange", onVisible);
    stop = () => {
      remove();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size && stop) {
      stop();
      stop = null;
    }
  };
}
