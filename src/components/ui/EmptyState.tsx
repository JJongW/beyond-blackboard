import React from "react";
import Link from "next/link";
import CrepassIcon from "@/components/ui/CrepassIcon";
import type { CrepassIconName } from "@/constants/designSystemNav";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  /** 선택적 파스텔 아이콘 */
  icon?: CrepassIconName;
}

/**
 * 빈 목록 / 준비 중 — CrepassIcon 선택 지원
 */
export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon = "help",
}: EmptyStateProps) {
  return (
    <div className="cp-card flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4">
        <CrepassIcon name={icon} size={56} />
      </div>
      <p className="cp-h3">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {actionLabel &&
        (actionHref || onAction) &&
        (actionHref ? (
          <Link href={actionHref} className="cp-btn-primary mt-6">
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="cp-btn-primary mt-6"
          >
            {actionLabel}
          </button>
        ))}
    </div>
  );
}
