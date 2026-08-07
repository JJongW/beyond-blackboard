"use client";

import React, { useId } from "react";

type RadioOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type RadioGroupProps<T extends string = string> = {
  name?: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  legend?: string;
  direction?: "row" | "column";
  className?: string;
};

/**
 * Seed Radio — 상호 배타적 단일 선택
 */
export default function RadioGroup<T extends string = string>({
  name,
  value,
  onChange,
  options,
  legend,
  direction = "column",
  className = "",
}: RadioGroupProps<T>) {
  const autoName = useId();
  const groupName = name ?? autoName;

  return (
    <fieldset className={className}>
      {legend && (
        <legend className="mb-2 text-sm font-medium text-ink">{legend}</legend>
      )}
      <div
        className={`flex gap-3 ${
          direction === "row" ? "flex-wrap items-center" : "flex-col"
        }`}
        role="radiogroup"
        aria-label={legend}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`inline-flex items-center gap-2.5 ${
                opt.disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <span className="relative inline-flex h-5 w-5 shrink-0">
                <input
                  type="radio"
                  className="peer sr-only"
                  name={groupName}
                  value={opt.value}
                  checked={selected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                />
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--cp-focus)] peer-focus-visible:ring-offset-1 ${
                    selected
                      ? "border-brand"
                      : "border-line-strong bg-surface-card"
                  }`}
                  aria-hidden
                >
                  {selected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                  )}
                </span>
              </span>
              <span className="text-sm text-ink">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
