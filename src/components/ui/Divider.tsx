import React from "react";

type DividerProps = {
  label?: string;
  className?: string;
};

/**
 * Seed Divider — 섹션 구분선 (선택 라벨)
 */
export default function Divider({ label, className = "" }: DividerProps) {
  if (!label) {
    return (
      <hr
        className={`border-0 border-t border-line ${className}`}
        role="separator"
      />
    );
  }

  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      role="separator"
      aria-label={label}
    >
      <span className="h-px flex-1 bg-line" />
      <span className="shrink-0 text-xs font-medium text-ink-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
