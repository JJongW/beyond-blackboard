import React from "react";
import Badge from "@/components/ui/Badge";

type TagGroupProps = {
  tags: string[];
  max?: number;
  className?: string;
};

/**
 * Seed Tag Group — 태그 묶음 (학생 특성 등)
 */
export default function TagGroup({ tags, max, className = "" }: TagGroupProps) {
  const shown = max ? tags.slice(0, max) : tags;
  const rest = max && tags.length > max ? tags.length - max : 0;

  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} role="list">
      {shown.map((tag) => (
        <span key={tag} role="listitem">
          <Badge tone="neutral">{tag}</Badge>
        </span>
      ))}
      {rest > 0 && (
        <span role="listitem">
          <Badge tone="brand" size="small">
            +{rest}
          </Badge>
        </span>
      )}
    </div>
  );
}
