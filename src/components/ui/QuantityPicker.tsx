"use client";

import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

type QuantityPickerProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
};

/**
 * Seed Quantity Picker — ± 수치 조절
 */
export default function QuantityPicker({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  disabled,
  label,
  className = "",
}: QuantityPickerProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <div className="inline-flex items-center rounded-md border border-line bg-surface-card">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={dec}
          className="inline-flex h-10 w-10 items-center justify-center text-ink-secondary hover:bg-surface-elevated disabled:opacity-40"
          aria-label="감소"
        >
          <span className="text-lg leading-none">−</span>
        </button>
        <span className="min-w-[2.5rem] text-center text-sm font-medium text-ink tabular-nums">
          {value}
        </span>
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={inc}
          className="inline-flex h-10 w-10 items-center justify-center text-ink-secondary hover:bg-surface-elevated disabled:opacity-40"
          aria-label="증가"
        >
          <CrepassIcon name="add" size={16} />
        </button>
      </div>
    </div>
  );
}
