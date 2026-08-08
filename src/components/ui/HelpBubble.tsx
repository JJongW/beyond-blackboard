"use client";

import React, { useId, useState } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

type HelpBubbleProps = {
  content: React.ReactNode;
  /** 트리거 옆 라벨(선택) */
  label?: string;
  className?: string;
};

/**
 * Seed Help Bubble — 터치 44 + inline(18) 글리프 + 팝오버
 * (이전 28×28은 장식처럼 보임)
 */
export default function HelpBubble({
  content,
  label,
  className = "",
}: HelpBubbleProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={`relative inline-flex items-center gap-1 ${className}`}>
      {label && <span className="text-sm text-ink-secondary">{label}</span>}
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-elevated hover:text-ink"
        style={{ minWidth: 44, minHeight: 44 }}
        aria-label="도움말"
        title="도움말"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        <CrepassIcon name="help" sizeToken="inline" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-md border border-line bg-surface-card px-3 py-2 text-left text-xs leading-relaxed text-ink-secondary shadow-float"
        >
          {content}
        </span>
      )}
    </span>
  );
}
