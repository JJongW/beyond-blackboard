import React from "react";

type ContentPlaceholderProps = {
  title?: string;
  description?: string;
  className?: string;
  /** 높이 힌트 */
  tall?: boolean;
};

/**
 * Seed Content Placeholder — 영역 예약·준비 중 윤곽
 */
export default function ContentPlaceholder({
  title = "콘텐츠 준비 중",
  description,
  className = "",
  tall = false,
}: ContentPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border border-dashed border-line-strong bg-surface px-6 text-center ${
        tall ? "min-h-[16rem] py-12" : "min-h-[8rem] py-8"
      } ${className}`}
      aria-hidden={false}
    >
      <p className="text-sm font-medium text-ink-muted">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-ink-subtle">{description}</p>
      )}
    </div>
  );
}
