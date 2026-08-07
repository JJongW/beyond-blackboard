import Link from "next/link";
import Image from "next/image";
import { BRAND, STUDENT_AVATARS } from "@/constants/designTokens";
import { DS_NAV } from "@/constants/designSystemNav";
import {
  DS_COMPONENTS,
  DS_FOUNDATIONS,
  DS_PATTERNS,
} from "@/constants/dsCatalog";

/**
 * /design-system — Seed식 소개 + 크레파스 파스텔 시그니처(크레용 스와치 레일)
 * Subject: 교사용 Soft UI DS · Job: Seed IA로 토큰·패턴·컴포넌트를 찾게 함
 */
export default function DesignSystemHomePage() {
  return (
    <div>
      <section className="ds-hero relative mb-12 overflow-hidden rounded-lg border border-line px-6 py-10 sm:px-10 sm:py-12">
        <div className="ds-crayon-rail" aria-hidden />
        <p className="cp-caption mb-2 relative">크레파스 Design System</p>
        <h1 className="relative max-w-xl text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          Seed의 문서 구조로,
          <br />
          파스텔 Soft UI를 적습니다.
        </h1>
        <p className="relative mt-4 max-w-lg text-base text-ink-secondary">
          Foundations → Patterns → Components. IA와 스펙 형식은{" "}
          <a
            href="https://seed-design.io"
            className="cp-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            seed-design.io
          </a>
          를 따르고, 색·아이콘·톤은 크레파스 그대로입니다.
        </p>
        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <Image
            src={BRAND.mark}
            alt=""
            width={48}
            height={48}
            className="rounded-md"
          />
          {BRAND.avatar && (
            <Image
              src={BRAND.avatar}
              alt="교사 아바타"
              width={48}
              height={48}
              className="rounded-full border border-line"
            />
          )}
          <Image
            src={STUDENT_AVATARS.male}
            alt=""
            width={40}
            height={40}
            className="rounded-full border border-line"
          />
          <Image
            src={STUDENT_AVATARS.female}
            alt=""
            width={40}
            height={40}
            className="rounded-full border border-line"
          />
          <p className="text-sm text-ink-muted">
            {DS_FOUNDATIONS.length} foundations · {DS_PATTERNS.length} patterns
            · {DS_COMPONENTS.length} components
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {DS_NAV.map((group) => (
          <Link
            key={group.href}
            href={group.href}
            className="group block rounded-md border border-line bg-surface-card p-5 transition-colors hover:border-line-strong hover:bg-surface-elevated"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {group.title}
            </p>
            <p className="mt-2 text-lg font-semibold text-ink group-hover:text-brand-ink">
              {group.items.length}개 문서
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
              {group.items
                .slice(0, 6)
                .map((i) => i.title)
                .join(" · ")}
              {group.items.length > 6 ? " …" : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
