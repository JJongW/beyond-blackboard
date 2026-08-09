"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/constants";
import { BRAND } from "@/constants/designTokens";
import { NAV_ICON_BY_HREF } from "@/constants/designSystemNav";
import CrepassIcon from "@/components/ui/CrepassIcon";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { name: string; school: string };
  onOpenSettings?: () => void;
  onOpenLogout?: () => void;
}

/**
 * 모바일 드로어 — 내비 + 설정/로그아웃 진입
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user,
  onOpenSettings,
  onOpenLogout,
}) => {
  const pathname = usePathname();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="cp-scrim fixed inset-0 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="cp-floating-surface fixed top-0 left-0 z-50 flex h-full w-80 flex-col shadow-float md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2">
            <Image
              src={BRAND.mark}
              alt=""
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-[15px] font-semibold text-ink">
              {BRAND.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-muted hover:bg-surface-elevated hover:text-ink"
            aria-label="메뉴 닫기"
          >
            <CrepassIcon name="close" sizeToken="2xl" />
          </button>
        </div>

        <nav className="flex-1 py-4">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const iconName = NAV_ICON_BY_HREF[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-muted text-brand-ink border-r-2 border-brand"
                    : "text-ink-secondary hover:bg-surface-elevated hover:text-ink"
                }`}
              >
                {iconName && (
                  <CrepassIcon
                    name={iconName}
                    sizeToken="xl"
                    weight="line"
                    className={isActive ? "text-brand-ink" : "text-ink-muted"}
                  />
                )}
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line px-6 py-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-ink">
              {user?.name ?? "김민준"} 선생님
            </p>
            <p className="cp-caption mt-0.5">
              {user?.school ?? "서울초등학교"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm text-ink-secondary hover:bg-surface-elevated hover:text-ink"
              onClick={() => onOpenSettings?.()}
            >
              <CrepassIcon name="settings" sizeToken="inline" />
              설정
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm text-[var(--cp-danger)] hover:bg-[#F8EDEA]"
              onClick={() => onOpenLogout?.()}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
