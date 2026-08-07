"use client";

import React, { useId } from "react";
import Field from "@/components/ui/Field";

type SliderProps = {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  className?: string;
};

/**
 * Seed Slider — 점수·가중치 등 범위 값
 */
export default function Slider({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  showValue = true,
  className = "",
}: SliderProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const control = (
    <div className="flex items-center gap-3">
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--cp-brand)] disabled:opacity-50"
      />
      {showValue && (
        <span className="w-10 shrink-0 text-right text-sm font-medium text-ink">
          {value}
        </span>
      )}
    </div>
  );

  if (!label) return <div className={className}>{control}</div>;

  return (
    <Field label={label} htmlFor={inputId} className={className}>
      {control}
    </Field>
  );
}
