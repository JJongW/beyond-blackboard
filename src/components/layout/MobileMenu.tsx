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
}

/**
 * 모바일 드로어 — 내비 항목에 CrepassIcon
 */
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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
            <CrepassIcon name="close" size={24} />
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
                    size={22}
                    weight="line"
                    className={isActive ? "text-brand-ink" : "text-ink-muted"}
                  />
                )}
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line px-6 py-4">
          <p className="text-sm font-medium text-ink">김민준 선생님</p>
          <p className="cp-caption mt-0.5">서울초등학교</p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
