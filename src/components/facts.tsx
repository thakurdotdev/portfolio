/**
 * The three facts of a project or chapter, one per hairline. The same list everywhere, so a
 * project and a piece of work read the same way.
 */
export function Facts({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`border-t border-line-strong ${className}`}>
      {items.map((f) => (
        <li key={f} className="border-b border-line py-2.5 text-body font-medium">
          {f}
        </li>
      ))}
    </ul>
  );
}

/** Label and value rows: what it is built with, what is running. */
export function Specs({ rows, className = "" }: { rows: { term: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-meta ${className}`}>
      {rows.map((r) => (
        <div key={r.term} className="contents">
          <dt className="text-dim">{r.term}</dt>
          <dd className="text-muted">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
