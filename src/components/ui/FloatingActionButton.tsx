"use client";

import React from "react";
import Link from "next/link";
import CrepassIcon from "@/components/ui/CrepassIcon";

type FloatingActionButtonProps = {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
};

/**
 * Seed Floating Action Button — 화면 고정 핵심 CTA 1개
 */
export default function FloatingActionButton({
  label,
  onClick,
  href,
  className = "",
}: FloatingActionButtonProps) {
  const classes = `fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-brand px-5 text-base font-medium text-white shadow-float transition-colors hover:bg-brand-hover ${className}`;

  const content = (
    <>
      <CrepassIcon name="add" sizeToken="xl" className="text-white" />
      <span className="pr-0.5">{label}</span>
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
