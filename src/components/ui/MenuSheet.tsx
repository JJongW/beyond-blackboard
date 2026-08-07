"use client";

import React from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import type { MenuItem } from "@/components/ui/Menu";

type MenuSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  items: MenuItem[];
};

/**
 * Seed Menu Sheet — Bottom Sheet 기반 액션 목록
 */
export default function MenuSheet({
  open,
  onClose,
  title = "메뉴",
  items,
}: MenuSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              disabled={item.disabled}
              className={`flex w-full items-center gap-3 px-1 py-3.5 text-left text-sm disabled:opacity-50 ${
                item.destructive ? "text-[var(--cp-danger)]" : "text-ink"
              }`}
              onClick={() => {
                item.onSelect?.();
                onClose();
              }}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
