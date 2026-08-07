import React from "react";

export type ChipSize = "small" | "medium";

type ChipProps = {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: ChipSize;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
};

const SIZE: Record<ChipSize, string> = {
  small: "px-2 py-0.5 text-xs gap-1",
  medium: "px-2.5 py-1 text-sm gap-1.5",
};

/**
 * Seed Chip — 필터·선택 값 (실행은 ActionButton)
 * size / selected / disabled / prefix·suffix
 */
export default function Chip({
  children,
  selected = false,
  onClick,
  disabled,
  size = "medium",
  prefix,
  suffix,
  className = "",
}: ChipProps) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={`cp-chip inline-flex items-center rounded-md transition-colors ${SIZE[size]} ${
        selected
          ? "bg-brand-muted text-brand-ink font-medium"
          : "border border-line bg-surface-card text-ink-secondary hover:border-line-strong"
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {prefix}
      {children}
      {suffix}
    </Comp>
  );
}
