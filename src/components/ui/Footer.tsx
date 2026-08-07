import React from "react";
import Link from "next/link";
import { BRAND } from "@/constants/designTokens";

type FooterProps = {
  className?: string;
};

/**
 * Seed Footer — 앱 하단 보조 링크·저작권
 */
export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`border-t border-line bg-surface-card px-4 py-6 sm:px-6 ${className}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          © {new Date().getFullYear()} {BRAND.name}
        </p>
        <nav className="flex flex-wrap gap-4" aria-label="푸터">
          <Link href="/design-system" className="cp-link text-sm">
            디자인 시스템
          </Link>
          <Link href="/documents" className="cp-link text-sm">
            문서
          </Link>
          <Link href="/students" className="cp-link text-sm">
            학생
          </Link>
        </nav>
      </div>
    </footer>
  );
}
