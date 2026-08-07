import React from "react";

type BadgeTone = "neutral" | "brand" | "warning" | "critical";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const TONE: Record<BadgeTone, string> = {
  neutral: "border border-line bg-surface-elevated text-ink-secondary",
  brand: "bg-brand-muted text-brand-ink",
  warning: "bg-[#F5F0E6] text-[var(--cp-warning)]",
  critical: "bg-[#F8EDEA] text-[var(--cp-danger)]",
};

/**
 * Seed Badge — 상태·속성 짧은 라벨
 */
export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TONE[tone]} ${className}`}
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
