import React from "react";

type ProgressCircleProps = {
  /** 0–100. 없으면 indeterminate */
  value?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

/**
 * Seed Progress Circle — 확정 % 또는 indeterminate 로딩
 */
export default function ProgressCircle({
  value,
  size = 40,
  strokeWidth = 3,
  label,
  className = "",
}: ProgressCircleProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 25 : Math.min(100, Math.max(0, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div
      className={`inline-flex flex-col items-center gap-2 ${className}`}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? (indeterminate ? "로딩 중" : `${clamped}%`)}
    >
      <svg
        width={size}
        height={size}
        className={indeterminate ? "animate-spin" : ""}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--cp-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--cp-brand)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {!indeterminate && label === undefined && (
        <span className="text-xs font-medium text-ink-muted">{clamped}%</span>
      )}
      {label && <span className="text-xs text-ink-muted">{label}</span>}
    </div>
  );
}
