"use client";

import React from "react";

export type SegmentOption<T extends string = string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string = string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 접근성 라벨 */
  "aria-label": string;
  size?: "small" | "medium";
  className?: string;
};

/**
 * Seed Segmented Control — 상호 배타적 보기/모드 전환 (Tabs와 구분)
 */
export default function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  size = "medium",
  className = "",
}: SegmentedControlProps<T>) {
  const pad = size === "small" ? "px-2.5 py-1 text-sm" : "px-3 py-1.5 text-sm";

  return (
    <div
      className={`inline-flex rounded-md border border-line bg-surface-elevated p-1 ${className}`}
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
            onClick={() => onChange(opt.value)}
            className={`rounded-sm font-medium transition-colors ${pad} ${
              selected
                ? "bg-surface-card text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
