import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";
import ActionButton from "@/components/ui/ActionButton";
import type { CrepassIconName } from "@/constants/designSystemNav";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: CrepassIconName;
  className?: string;
};

/**
 * Seed Result / Empty — 빈 목록·결과 없음 (illustration + title + description + CTA)
 */
export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon = "help",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`cp-card flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-4 text-ink-muted">
        <CrepassIcon name={icon} size={56} />
      </div>
      <p className="cp-h3">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-6">
          {actionHref ? (
            <ActionButton variant="brandSolid" href={actionHref}>
              {actionLabel}
            </ActionButton>
          ) : (
            <ActionButton variant="brandSolid" onClick={onAction}>
              {actionLabel}
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
}
