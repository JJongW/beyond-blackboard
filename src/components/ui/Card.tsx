import React from "react";

type CardProps = {
  children: React.ReactNode;
  raised?: boolean;
  padding?: boolean;
  className?: string;
  as?: "article" | "div" | "section";
  "aria-labelledby"?: string;
};

/**
 * Seed Card — Soft UI 표면 컨테이너 (cp-card)
 */
export default function Card({
  children,
  raised = false,
  padding = true,
  className = "",
  as: Comp = "div",
  "aria-labelledby": ariaLabelledBy,
}: CardProps) {
  return (
    <Comp
      aria-labelledby={ariaLabelledBy}
      className={`${raised ? "cp-card cp-card-raised" : "cp-card"} ${
        padding ? "" : "!p-0"
      } ${className}`}
    >
      {children}
    </Comp>
  );
}
