import React from "react";

type IdentityPlaceholderProps = {
  label?: string;
  size?: number;
  className?: string;
};

/**
 * Seed Identity Placeholder — 아바타 없을 때 이니셜 자리
 */
export default function IdentityPlaceholder({
  label = "?",
  size = 40,
  className = "",
}: IdentityPlaceholderProps) {
  const initials = label.trim().slice(0, 2) || "?";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-surface-elevated font-medium text-ink-muted ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.32) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
