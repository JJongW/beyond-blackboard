"use client";

import React, { useId } from "react";
import Field from "@/components/ui/Field";

type TimePickerProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
  className?: string;
};

/**
 * Seed Time Picker — 네이티브 time + Field (교시 시작/종료)
 */
export default function TimePicker({
  id,
  label = "시간",
  value,
  onChange,
  disabled,
  hint,
  className = "",
}: TimePickerProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <Field label={label} htmlFor={inputId} hint={hint} className={className}>
      <input
        id={inputId}
        type="time"
        className="cp-input w-full"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
