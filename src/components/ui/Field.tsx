import React from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
  className?: string;
};

/**
 * Seed Field — 라벨·도움말·오류를 묶는 입력 컨테이너
 */
export default function Field({
  label,
  htmlFor,
  children,
  hint,
  error,
  className = "",
}: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-[var(--cp-danger)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
