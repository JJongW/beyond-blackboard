"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

export type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
};

type MenuProps = {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  className?: string;
  /** 트리거 버튼 aria-label */
  "aria-label"?: string;
};

/**
 * Seed Menu — 트리거 + 드롭다운 액션 목록
 */
export default function Menu({
  trigger,
  items,
  align = "end",
  className = "",
  "aria-label": ariaLabel = "메뉴",
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`relative inline-flex ${className}`} ref={rootRef}>
      <button
        type="button"
        className="inline-flex items-center"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          className={`absolute top-full z-50 mt-1.5 min-w-[12rem] rounded-md border border-line bg-surface-card py-1 shadow-float cp-floating-surface ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50 ${
                  item.destructive
                    ? "text-[var(--cp-danger)] hover:bg-[#F8EDEA]"
                    : "text-ink-secondary hover:bg-surface-elevated hover:text-ink"
                }`}
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 아이콘 트리거용 기본 점 세 개 — 항상 보이도록 (hover-only 제거) */
export function MenuDotsTrigger() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-muted hover:bg-surface-elevated hover:text-ink">
      <CrepassIcon name="menu" sizeToken="lg" />
    </span>
  );
}
