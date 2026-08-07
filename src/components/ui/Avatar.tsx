import React from "react";
import Image from "next/image";
import { BRAND, studentAvatarSrc } from "@/constants/designTokens";

export type AvatarSize = 20 | 24 | 32 | 36 | 40 | 48 | 56;

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  /** 이미지 없을 때 이니셜 (최대 2자) */
  fallback?: string;
  /** 학생 성별 기본 아바타 */
  gender?: "male" | "female";
  /** 교사 브랜드 아바타 */
  brand?: boolean;
  className?: string;
};

/**
 * Seed Identity Avatar — 원형 이미지 / 이니셜 / 성별·브랜드 기본값
 */
export default function Avatar({
  src,
  alt = "",
  size = 40,
  fallback,
  gender,
  brand,
  className = "",
}: AvatarProps) {
  const resolved =
    src ??
    (brand ? BRAND.avatar : gender ? studentAvatarSrc(gender) : undefined);

  if (resolved) {
    return (
      <Image
        src={resolved}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full border border-line object-cover ${className}`}
      />
    );
  }

  const initials = (fallback ?? "?").slice(0, 2);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-brand-muted text-brand-ink font-medium ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.35) }}
      aria-hidden={alt ? undefined : true}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    >
      {initials}
    </span>
  );
}
