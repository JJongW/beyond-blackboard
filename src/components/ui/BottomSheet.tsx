"use client";

import React, { useEffect } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Seed Bottom Sheet — 모바일 액션·필터 시트
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  className = "",
}: BottomSheetProps) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="cp-scrim absolute inset-0"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="cp-sheet-title"
        className={`relative z-10 w-full max-w-lg rounded-t-md border border-line bg-surface-card p-5 shadow-float sm:rounded-md cp-floating-surface ${className}`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="cp-sheet-title" className="cp-h3">
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
        {children}
      </div>
    </div>
  );
}
