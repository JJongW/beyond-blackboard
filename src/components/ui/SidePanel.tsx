"use client";

import React, { useEffect } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
};

/**
 * Seed Side Panel — 상세·보조 정보 패널
 */
export default function SidePanel({
  open,
  onClose,
  title,
  children,
  side = "right",
  className = "",
}: SidePanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        aria-labelledby="cp-side-panel-title"
        className={`relative z-10 flex h-full w-full max-w-md flex-col border-line bg-surface-card shadow-float ${
          side === "right" ? "ml-auto border-l" : "mr-auto border-r"
        } ${className}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cp-side-panel-title" className="cp-h3">
            {title}
          </h2>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-elevated"
            aria-label="닫기"
            onClick={onClose}
          >
            <CrepassIcon name="close" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
