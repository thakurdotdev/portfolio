/** A section opens with a quiet heading on a hairline. The big type belongs to the content. */
export function Section({
  id,
  label,
  note,
  children,
}: {
  id: string;
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 px-5 pt-24 sm:px-8 sm:pt-36 lg:px-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line-strong pb-4">
        <h2 id={`${id}-title`} className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.01em]">
          <span className="dot" aria-hidden="true" />
          {label}
        </h2>
        {note && <p className="text-[15px] text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}
