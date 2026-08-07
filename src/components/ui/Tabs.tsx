"use client";

import React from "react";

export type TabOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type TabsProps<T extends string = string> = {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
};

/**
 * Seed Tabs — 콘텐츠 영역 전환 (Segmented는 보기 모드용)
 */
export default function Tabs<T extends string = string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className = "",
}: TabsProps<T>) {
  return (
    <div
      className={`flex gap-1 border-b border-line ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
              selected
                ? "border-brand text-brand-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
