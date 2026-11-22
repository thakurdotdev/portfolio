import { addTick } from "@/lib/ticker";

/*
 * The time in India, from one place. The dot clock and the printed time under it both read
 * this, so they turn on the same frame. It is checked on the page's frame loop rather than a
 * timer: browsers throttle or pause timers in background tabs, and a timer that fires late
 * leaves the printed time a minute behind the dots.
 */

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

export interface IndiaTime {
  /** "HH:MM", 24-hour. */
  text: string;
  hour: number;
  minute: number;
}

let current: IndiaTime | null = null;
let nextMinuteAt = 0;
const listeners = new Set<() => void>();
let stop: (() => void) | null = null;

function read(now: number): IndiaTime {
  const parts = fmt.formatToParts(now);
  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  // Some engines print midnight as "24".
  const hour = Number(hh) % 24;
  return { text: `${String(hour).padStart(2, "0")}:${mm}`, hour, minute: Number(mm) };
}

/** Re-reads the time if a minute boundary has passed. Cheap enough to call every frame. */
function refresh() {
  const now = Date.now();
  if (current && now < nextMinuteAt) return;
  nextMinuteAt = now - (now % 60_000) + 60_000;
  const next = read(now);
  if (next.text === current?.text) return;
  current = next;
  for (const l of listeners) l();
}

const onVisible = () => {
  if (!document.hidden) refresh();
};

/** The current time in India. */
export function getIndiaTime(): IndiaTime {
  refresh();
  return current!;
}

/** Calls `fn` whenever the minute turns. For useSyncExternalStore. */
export function subscribeIndiaTime(fn: () => void) {
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
