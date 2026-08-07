"use client";

import React from "react";
import Field from "@/components/ui/Field";

type TextFieldProps = {
  id: string;
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  type?: "text" | "search" | "email" | "password";
  multiline?: boolean;
  rows?: number;
  className?: string;
};

/**
 * Seed Text Input & Textarea + Field 래퍼
 */
export default function TextField({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  hint,
  error,
  disabled,
  type = "text",
  multiline = false,
  rows = 3,
  className = "",
}: TextFieldProps) {
  const controlClass = `cp-input w-full ${error ? "!border-[var(--cp-danger)]" : ""}`;

  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      className={className}
    >
      {multiline ? (
        <textarea
          id={id}
          className={`${controlClass} min-h-[88px] resize-y`}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={controlClass}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
        />
      )}
    </Field>
  );
}
