"use client";

import React, { useEffect } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

export type SnackbarTone = "neutral" | "positive" | "critical";

type SnackbarProps = {
  open: boolean;
  message: string;
  tone?: SnackbarTone;
  onClose?: () => void;
  /** ms, 0이면 수동 닫기만 */
  duration?: number;
};

const TONE: Record<SnackbarTone, string> = {
  neutral: "border-line bg-surface-card text-ink",
  positive: "border-brand/30 bg-brand-muted text-brand-ink",
  critical: "border-[var(--cp-danger)]/30 bg-[#F8EDEA] text-[var(--cp-danger)]",
};

/**
 * Seed Snackbar — 하단 일시 피드백
 */
export default function Snackbar({
  open,
  message,
  tone = "neutral",
  onClose,
  duration = 3000,
}: SnackbarProps) {
  useEffect(() => {
    if (!open || !onClose || duration <= 0) return;
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-float ${TONE[tone]}`}
      >
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-ink/5"
            aria-label="닫기"
            onClick={onClose}
          >
            <CrepassIcon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
