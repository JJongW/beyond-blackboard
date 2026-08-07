import React from "react";
import type { CrepassIconName } from "@/constants/designSystemNav";
import {
  CrepassGlyphIcon,
  ICON_SIZE,
  type IconSizeToken,
  type IconWeight,
} from "@/components/ui/CrepassGlyphIcon";

export type { CrepassIconName, IconWeight, IconSizeToken };
export { ICON_SIZE };

type CrepassIconProps = {
  name: CrepassIconName;
  size?: number;
  sizeToken?: IconSizeToken;
  /** Seed Line | Fill. 미지정 시 ≤15px → fill */
  weight?: IconWeight;
  className?: string;
  /** @deprecated 스티커 PNG 폐기됨 */
  variant?: "auto" | "sticker" | "glyph";
  alt?: string;
  priority?: boolean;
};

/**
 * Seed Iconography — 모노크롬 Line/Fill만. 배경 네모·스티커 PNG 없음.
 * 브랜드 마크·프로필은 next/image로 따로.
 */
export default function CrepassIcon({
  name,
  size,
  sizeToken,
  weight,
  className = "",
}: CrepassIconProps) {
  const px = size ?? (sizeToken ? ICON_SIZE[sizeToken] : 24);
  const colorClass = /\btext-/.test(className) ? "" : "text-ink";

  return (
    <CrepassGlyphIcon
      name={name}
      size={px}
      weight={weight}
      className={`${colorClass} ${className}`.trim()}
    />
  );
}

/** Seed: 아이콘 단독 버튼 터치 영역 ≥40px (24px 아이콘은 44 권장) */
export function IconButton({
  label,
  children,
  onClick,
  className = "",
  size = 44,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 40 | 44 | 48;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-elevated hover:text-ink ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {children}
    </button>
  );
}
