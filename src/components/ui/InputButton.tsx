"use client";

import React, { useId } from "react";
import ActionButton from "@/components/ui/ActionButton";

type InputButtonProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  buttonLabel?: string;
  type?: "text" | "search";
  disabled?: boolean;
  className?: string;
};

/**
 * Seed Input Button — 입력 + 실행 버튼 (검색·코드 입력)
 */
export default function InputButton({
  id,
  label,
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel = "확인",
  type = "search",
  disabled,
  className = "",
}: InputButtonProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          id={inputId}
          type={type}
          className="cp-input flex-1"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.();
          }}
        />
        <ActionButton
          variant="brandSolid"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
        >
          {buttonLabel}
        </ActionButton>
      </div>
    </div>
  );
}
