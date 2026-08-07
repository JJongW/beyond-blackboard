import Link from "next/link";
import { DS_FOUNDATIONS } from "@/constants/dsCatalog";
import { DsPageHeader } from "@/components/design-system/DsPage";

export default function FoundationsIndexPage() {
  return (
    <div>
      <DsPageHeader
        eyebrow="Foundations"
        title="Foundations"
        description="색·타이포·토큰·레이아웃·모션·보이스 등 UI의 기반입니다. Seed foundations IA를 크레파스 파스텔 토큰으로 옮겼습니다."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {DS_FOUNDATIONS.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/design-system/foundations/${item.slug}`}
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
