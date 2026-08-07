"use client";

import React, { useId } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Seed Checkbox — 다중 선택 / 완료 토글
 */
export default function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  indeterminate,
  id,
  className = "",
  "aria-label": ariaLabel,
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2.5 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <span className="relative inline-flex h-5 w-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel ?? (label ? undefined : "선택")}
          ref={(el) => {
            if (el) el.indeterminate = !!indeterminate && !checked;
          }}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--cp-focus)] peer-focus-visible:ring-offset-1 ${
            checked || indeterminate
              ? "border-brand bg-brand text-white"
              : "border-line-strong bg-surface-card"
          }`}
          aria-hidden
        >
          {(checked || indeterminate) && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              {indeterminate && !checked ? (
                <path
                  d="M2.5 6h7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2.5 6.5l2.5 2.5 4.5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          )}
        </span>
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}
