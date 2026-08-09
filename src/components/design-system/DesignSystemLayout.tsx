"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/constants/designTokens";
import { DS_NAV } from "@/constants/designSystemNav";
import CrepassIcon from "@/components/ui/CrepassIcon";

/**
 * Seed Design docs 셸 × 크레파스 파스텔
 * 시그니처: 사이드바 active에 크레용 스트로크(왼쪽 색연필 선)
 */
export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const NavTree = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-7" aria-label="Design System">
      <Link
        href="/design-system"
        onClick={onNavigate}
        className={`block text-sm font-medium transition-colors ${
          pathname === "/design-system"
            ? "text-brand-ink"
            : "text-ink-secondary hover:text-ink"
        }`}
      >
        소개
      </Link>

      {DS_NAV.map((group) => (
        <div key={group.href}>
          <Link
            href={group.href}
            onClick={onNavigate}
            className={`mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] ${
              isActive(group.href) ? "text-brand-ink" : "text-ink-muted"
            }`}
          >
            {group.title}
          </Link>
          <ul className="ds-nav-rail space-y-0.5 pl-0">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`ds-nav-link relative block rounded-r-md py-1.5 pl-3 pr-2 text-sm transition-colors ${
                      active
                        ? "ds-nav-link-active bg-brand-muted/70 text-brand-ink font-medium"
                        : "text-ink-secondary hover:bg-surface-elevated hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="ds-shell min-h-screen text-ink">
      {/* /90 opacity는 RGB 채널 없으면 투명 — solid card + blur */}
      <header className="cp-header-bar sticky top-0 z-40 border-b border-line backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-elevated lg:hidden"
              aria-label="문서 메뉴 열기"
              onClick={() => setMobileOpen(true)}
            >
              <CrepassIcon name="menu" sizeToken="xl" />
            </button>
            <Link
              href="/design-system"
              className="flex min-w-0 items-center gap-2.5"
            >
              <Image
                src={BRAND.mark}
                alt=""
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="truncate text-sm font-semibold tracking-tight">
                {BRAND.name}{" "}
                <span className="font-normal text-ink-muted">
                  Design System
                </span>
              </span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://seed-design.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs text-ink-muted hover:text-ink sm:inline"
            >
              Seed 원본 참고
            </a>
            <Link href="/" className="cp-link text-sm font-medium">
              ← 앱으로
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div
            className="cp-scrim fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            className="cp-floating-surface fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto p-5 shadow-float lg:hidden"
            role="dialog"
            aria-modal
            aria-label="문서 메뉴"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">목차</p>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-elevated"
                aria-label="메뉴 닫기"
                onClick={() => setMobileOpen(false)}
              >
                <CrepassIcon name="close" size={20} />
              </button>
            </div>
            <NavTree onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      <div className="mx-auto flex max-w-7xl gap-0 px-4 sm:px-6 lg:gap-12">
        {/* 문서 사이드바 — fill 없으면 그라데이션 셸이 비쳐 투명처럼 보임 */}
        <aside className="cp-floating-surface sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-line py-8 pr-4 lg:block">
          <NavTree />
        </aside>
        <main className="min-w-0 flex-1 py-8 pb-24">{children}</main>
      </div>
    </div>
  );
}
