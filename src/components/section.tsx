/**
 * A section opens with a quiet heading on a hairline: its name and a note. The big type
 * belongs to the content. `scene` makes the section a scene for the dots.
 */
export function SectionHead({ id, label, note }: { id: string; label: string; note?: string }) {
  return (
    <div data-reveal="" className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line-strong pb-4">
      <h2 id={`${id}-title`} className="text-lg font-semibold tracking-[-0.01em]">
        {label}
      </h2>
      {note && <p className="text-body text-muted">{note}</p>}
    </div>
  );
}

export function Section({
  id,
  label,
  note,
  scene,
  stage,
  alpha,
  className = "",
  children,
}: {
  id: string;
  label: string;
  note?: string;
  scene?: string;
  stage?: string;
  alpha?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-scene={scene}
      data-stage={scene ? stage : undefined}
      data-label={scene ? label : undefined}
      data-alpha={alpha}
      className={`page-w scroll-mt-16 px-5 pt-24 sm:px-8 sm:pt-36 lg:px-12 ${className}`}
    >
      <SectionHead id={id} label={label} note={note} />
      {children}
    </section>
  );
}
