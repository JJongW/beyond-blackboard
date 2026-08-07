"use client";

import React, { useId } from "react";
import Field from "@/components/ui/Field";

type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SelectProps<T extends string = string> = {
  id?: string;
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Seed Select / Select Box — 네이티브 select + Field 래퍼
 */
export default function Select<T extends string = string>({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  hint,
  error,
  className = "",
  "aria-label": ariaLabel,
}: SelectProps<T>) {
  const autoId = useId();
  const selectId = id ?? autoId;

  const control = (
    <select
      id={selectId}
      className={`cp-input w-full appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${
        error ? "!border-[var(--cp-danger)]" : ""
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%236F6F67' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m4 6 4 4 4-4'/%3E%3C/svg%3E")`,
      }}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-invalid={!!error}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  if (!label) {
    return <div className={className}>{control}</div>;
  }

  return (
    <Field
      label={label}
      htmlFor={selectId}
      hint={hint}
      error={error}
      className={className}
    >
      {control}
    </Field>
  );
}
