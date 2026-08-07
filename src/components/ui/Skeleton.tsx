import React from "react";

type SkeletonProps = {
  className?: string;
  /** rounded shape */
  rounded?: "sm" | "md" | "full";
};

/**
 * Seed Skeleton — 콘텐츠 윤곽 로딩
 */
export function Skeleton({ className = "", rounded = "sm" }: SkeletonProps) {
  const r =
    rounded === "full"
      ? "rounded-full"
      : rounded === "md"
        ? "rounded-md"
        : "rounded-sm";
  return (
    <div
      className={`animate-pulse bg-border/80 ${r} ${className}`}
      aria-hidden
    />
  );
}

/** 학생/리스트 행 스켈레톤 */
export function SkeletonListRows({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy aria-label="불러오는 중">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
