"use client";

import React from "react";
import Link from "next/link";
import CrepassIcon from "@/components/ui/CrepassIcon";

type ContextualFloatingButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Seed Contextual Floating Button — 화면 맥락 CTA (주 FAB보다 작게)
 */
export default function ContextualFloatingButton({
  label,
  href,
  onClick,
  className = "",
}: ContextualFloatingButtonProps) {
  const classes = `inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-surface-card px-4 text-sm font-medium text-ink shadow-float transition-colors hover:border-line-strong hover:bg-surface-elevated ${className}`;
  const content = (
    <>
      <CrepassIcon name="help" size={16} />
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={label}
    >
      {content}
    </button>
  );
}
