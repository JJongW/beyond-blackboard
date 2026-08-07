import React from "react";

export type BadgeTone =
  "neutral" | "brand" | "warning" | "critical" | "positive";
export type BadgeSize = "small" | "medium";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
};

const TONE: Record<BadgeTone, string> = {
  neutral: "border border-line bg-surface-elevated text-ink-secondary",
  brand: "bg-brand-muted text-brand-ink",
  positive: "bg-brand-muted text-brand-ink",
  warning: "bg-[#F5F0E6] text-[var(--cp-warning)]",
  critical: "bg-[#F8EDEA] text-[var(--cp-danger)]",
};

const SIZE: Record<BadgeSize, string> = {
  small: "px-1.5 py-0 text-[11px]",
  medium: "px-2 py-0.5 text-xs",
};

/**
 * Seed Badge — 상태·속성 짧은 라벨 (tone / size)
 */
export default function Badge({
  children,
  tone = "neutral",
  size = "medium",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${TONE[tone]} ${SIZE[size]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Seed Notification Badge — 읽지 않은 수 */
export function NotificationBadge({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  return (
    <span
      className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-white ${className}`}
    >
      {label}
    </span>
  );
}
