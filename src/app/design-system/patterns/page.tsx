import Link from "next/link";
import { DS_PATTERNS } from "@/constants/dsCatalog";
import { DsPageHeader } from "@/components/design-system/DsPage";

export default function PatternsIndexPage() {
  return (
    <div>
      <DsPageHeader
        eyebrow="Patterns"
        title="Patterns"
        description="자주 쓰는 UI 패턴과 가이드라인입니다. Seed Patterns(현재 Loading)를 교사 앱 맥락으로 옮겼습니다."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {DS_PATTERNS.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/design-system/patterns/${item.slug}`}
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
