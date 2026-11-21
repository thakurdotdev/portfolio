import type { CSSProperties } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * The name of what the dots are drawing, above the sticky stage on wide screens. The stage is
 * where the eye goes, so the name has to be there too, not only in the text column. Keyed on
 * the title by its parent's `key`, so each switch remounts it and the letters rise again.
 *
 * With `href` the name also opens the project. It is a pointer shortcut only: the text column
 * holds the same link for keyboards and screen readers, so this one stays out of both.
 */
export function StageHead({
  index,
  count,
  title,
  sub,
  href,
  large = false,
}: {
  index: number;
  count: number;
  title: string;
  sub: string;
  href?: string;
  large?: boolean;
}) {
  let n = 0;
  const letters = title.split(" ").map((word, w) => (
    <span key={w}>
      {w > 0 && " "}
      <span className="mask">
        {[...word].map((ch, i) => (
          <span key={i} style={{ "--d": `${n++ * 28}ms` } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  ));

  return (
    <div aria-hidden="true" className="select-none">
      <p className="swap font-mono text-[11px] text-dim">
        {pad(index + 1)} / {pad(count)}
      </p>
      <p className={`display stage-title mt-2 ${large ? "stage-title-lg" : ""}`}>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="stage-link group">
            {letters}
            <span className="stage-arrow">↗</span>
          </a>
        ) : (
          letters
        )}
      </p>
      <p className="swap mt-2 text-[15px] text-muted" style={{ animationDelay: "120ms", animationFillMode: "both" }}>
        {sub}
      </p>
    </div>
  );
}
