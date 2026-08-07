import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

/**
 * 페이지 상단 공통 헤더 — 페이지당 h1 1개, 마케팅 카피 최소화
 */
export default function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8">
      {crumbs && crumbs.length > 0 && (
        <nav className="cp-caption mb-3" aria-label="경로">
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`}>
              {i > 0 && <span className="mx-2 text-ink-subtle">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="cp-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ink">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="cp-h1">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-ink-muted max-w-prose">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
    </header>
  );
}
