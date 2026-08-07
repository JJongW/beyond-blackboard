import Link from "next/link";
import { DS_COMPONENTS } from "@/constants/dsCatalog";
import { resolveDsStatus } from "@/constants/dsStatus";
import { DsPageHeader } from "@/components/design-system/DsPage";

export default function ComponentsIndexPage() {
  const done = DS_COMPONENTS.filter(
    (item) => resolveDsStatus("components", item.slug) === "Done",
  ).length;

  return (
    <div>
      <DsPageHeader
        eyebrow="Components"
        title="Components"
        description={`Seed Components 스펙 형식(Anatomy · Properties · Guidelines)을 따릅니다. Done ${done} / ${DS_COMPONENTS.length} — Planned은 Preview 없이 문서만 제공합니다.`}
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DS_COMPONENTS.map((item) => {
          const status = resolveDsStatus("components", item.slug);
          return (
            <li key={item.slug}>
              <Link
                href={`/design-system/components/${item.slug}`}
                className="block rounded-md border border-line bg-surface-card p-4 transition-colors hover:border-line-strong hover:bg-surface-elevated"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-medium text-ink">{item.title}</p>
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
                      status === "Done"
                        ? "bg-brand-muted text-brand-ink"
                        : status === "Excluded"
                          ? "border border-line text-ink-subtle"
                          : "border border-line text-ink-muted"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                  {item.description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
