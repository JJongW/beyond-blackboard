"use client";

import React from "react";
import Link from "next/link";
import CrepassIcon from "@/components/ui/CrepassIcon";

export type ActionButtonSize = "xsmall" | "small" | "medium" | "large";
export type ActionButtonVariant =
  | "brandSolid"
  | "neutralSolid"
  | "neutralWeak"
  | "brandOutline"
  | "neutralOutline"
  | "criticalSolid"
  | "ghost";

type ActionButtonProps = {
  children?: React.ReactNode;
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  /** Hug | Fill */
  width?: "hug" | "fill";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  /** 있으면 Next Link로 렌더 */
  href?: string;
  className?: string;
  "aria-label"?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
};

const SIZE: Record<ActionButtonSize, string> = {
  xsmall: "h-8 px-2.5 text-sm gap-1",
  small: "h-9 px-3 text-sm gap-1.5",
  medium: "h-10 px-4 text-base gap-2",
  large: "h-12 px-5 text-base gap-2",
};

const VARIANT: Record<ActionButtonVariant, string> = {
  brandSolid: "bg-brand text-white hover:bg-brand-hover",
  neutralSolid: "bg-ink text-white hover:bg-ink/90",
  neutralWeak:
    "bg-surface-elevated text-ink border border-line hover:bg-border/40",
  brandOutline:
    "bg-transparent text-brand-ink border border-brand hover:bg-brand-muted",
  neutralOutline:
    "bg-transparent text-ink border border-line-strong hover:bg-surface-elevated",
  criticalSolid: "bg-danger text-white hover:bg-danger/90",
  ghost:
    "bg-transparent text-ink-secondary hover:bg-surface-elevated hover:text-ink",
};

/**
 * Seed Action Button — size / variant / state / width
 * Brand Solid는 화면당 CTA 1개 권장
 */
export default function ActionButton({
  children,
  variant = "brandSolid",
  size = "medium",
  width = "hug",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  href,
  className = "",
  "aria-label": ariaLabel,
  prefixIcon,
  suffixIcon,
}: ActionButtonProps) {
  const isDisabled = disabled || loading;
  const classes = `inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${SIZE[size]} ${VARIANT[variant]} ${width === "fill" ? "w-full" : ""} ${className}`;

  const content = loading ? (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden
      />
      {children ?? "처리 중"}
    </span>
  ) : (
    <>
      {prefixIcon}
      {children}
      {suffixIcon}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}

/** 아이콘만 — 반드시 aria-label */
export function IconActionButton({
  label,
  children,
  ...rest
}: Omit<ActionButtonProps, "children" | "aria-label"> & {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <ActionButton
      {...rest}
      aria-label={label}
      className={`!px-0 aspect-square ${rest.className ?? ""}`}
    >
      {children ?? (
        <CrepassIcon name="add" size={20} className="text-inherit" />
      )}
    </ActionButton>
  );
}
