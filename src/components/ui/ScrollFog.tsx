import React from "react";

type ScrollFogProps = {
  children: React.ReactNode;
  className?: string;
  /** max height for scroll area */
  maxHeightClass?: string;
};

/**
 * Seed Scroll Fog — 스크롤 영역 상·하 페이드
 */
export default function ScrollFog({
  children,
  className = "",
  maxHeightClass = "max-h-64",
}: ScrollFogProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`overflow-y-auto ${maxHeightClass}`}
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
