import React from "react";

type ChipProps = {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Seed Chip — 필터/선택 값 표시 (실행은 Action Button)
 */
export default function Chip({
  children,
  selected = false,
  onClick,
  disabled,
  className = "",
}: ChipProps) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`cp-chip inline-flex items-center rounded-md px-2.5 py-1 text-sm transition-colors ${
        selected
          ? "bg-brand-muted text-brand-ink font-medium"
          : "border border-line bg-surface-card text-ink-secondary hover:border-line-strong"
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </Comp>
  );
}
