"use client";

import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

type ReactionButtonProps = {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
  /** 접근성 라벨 (기본: 즐겨찾기) */
  label?: string;
  size?: number;
  className?: string;
};

/**
 * Seed Reaction Button — 즐겨찾기 등 토글 반응
 */
export default function ReactionButton({
  pressed,
  onChange,
  label = "즐겨찾기",
  size = 22,
  className = "",
}: ReactionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={pressed ? `${label} 해제` : `${label} 추가`}
      onClick={() => onChange(!pressed)}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-surface-elevated ${
        pressed ? "text-brand" : "text-ink-muted"
      } ${className}`}
    >
      <CrepassIcon name={pressed ? "star" : "star-outline"} size={size} />
    </button>
  );
}
