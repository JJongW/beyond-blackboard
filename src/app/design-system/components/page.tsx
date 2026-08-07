import Link from "next/link";
import { DS_COMPONENTS } from "@/constants/dsCatalog";
import { DsPageHeader } from "@/components/design-system/DsPage";

export default function ComponentsIndexPage() {
  return (
    <div>
      <DsPageHeader
        eyebrow="Components"
        title="Components"
        description="Seed Components 스펙 형식(Anatomy · Properties · Guidelines)을 따릅니다. 비주얼은 크레파스 Soft UI이며, Karrot 전용(매너온도 등)은 제외했습니다."
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DS_COMPONENTS.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/design-system/components/${item.slug}`}
              className="block rounded-md border border-line bg-surface-card p-4 transition-colors hover:border-line-strong hover:bg-surface-elevated"
            >
              <p className="text-base font-medium text-ink">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                {item.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
