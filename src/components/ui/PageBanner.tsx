"use client";

import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";
import type { CrepassIconName } from "@/constants/designSystemNav";
import ActionButton from "@/components/ui/ActionButton";

export type PageBannerTone = "informative" | "warning" | "critical" | "neutral";

type PageBannerProps = {
  title: string;
  description?: string;
  tone?: PageBannerTone;
  icon?: CrepassIconName;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
};

const TONE: Record<PageBannerTone, string> = {
  informative: "border-brand/25 bg-brand-muted/60 text-brand-ink",
  warning: "border-[var(--cp-warning)]/25 bg-[#F5F0E6] text-ink",
  critical: "border-[var(--cp-danger)]/25 bg-[#F8EDEA] text-[var(--cp-danger)]",
  neutral: "border-line bg-surface-elevated text-ink-secondary",
};

/**
 * Seed Page Banner — 페이지 상단 전역 안내 (Callout보다 넓고 닫기 가능)
 */
export default function PageBanner({
  title,
  description,
  tone = "informative",
  icon = "bell",
  actionLabel,
  onAction,
  onDismiss,
  className = "",
}: PageBannerProps) {
  return (
    <div
      className={`flex gap-3 rounded-md border px-4 py-3 ${TONE[tone]} ${className}`}
      role="status"
    >
      <span className="mt-0.5 shrink-0">
        <CrepassIcon name={icon} size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm opacity-90">{description}</p>
        )}
        {actionLabel && onAction && (
          <div className="mt-2">
            <ActionButton
              variant="brandOutline"
              size="xsmall"
              onClick={onAction}
            >
              {actionLabel}
            </ActionButton>
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-ink/5"
          aria-label="닫기"
          onClick={onDismiss}
        >
          <CrepassIcon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
