import React from "react";

/** Docs 페이지 공통 타이틀 블록 */
export function DsPageHeader({
  eyebrow,
  title,
  description,
  status,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  status?: "Done" | "Planned";
}) {
  return (
    <header className="mb-10 border-b border-line pb-8">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {eyebrow && <p className="cp-caption">{eyebrow}</p>}
        {status && (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${
              status === "Done"
                ? "bg-brand-muted text-brand-ink"
                : "border border-line bg-surface-elevated text-ink-muted"
            }`}
          >
            {status}
          </span>
        )}
      </div>
      <h1 className="cp-h1">{title}</h1>
      <p className="mt-3 max-w-2xl text-base text-ink-secondary">
        {description}
      </p>
    </header>
  );
}

export function DsDoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-md border border-line bg-brand-muted/40 p-4">
        <p className="mb-2 text-sm font-semibold text-brand-ink">Do</p>
        <ul className="list-disc space-y-1.5 pl-4 text-sm text-ink-secondary">
          {dos.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-md border border-line bg-surface-card p-4">
        <p className="mb-2 text-sm font-semibold text-ink">Don&apos;t</p>
        <ul className="list-disc space-y-1.5 pl-4 text-sm text-ink-secondary">
          {donts.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DsSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="cp-h2 mb-4">{title}</h2>
      {children}
    </section>
  );
}
