"use client";

import React from "react";
import Link from "next/link";
import { DocumentTemplate } from "@/types";
import type { CrepassIconName } from "@/constants/designSystemNav";
import CrepassIcon from "@/components/ui/CrepassIcon";

interface DocumentCardProps {
  template: DocumentTemplate;
  className?: string;
}

const CATEGORY_ICON: Record<string, CrepassIconName> = {
  communication: "documents",
  activity: "crayon",
  evaluation: "clipboard",
  meeting: "notebook",
};

/**
 * 문서 템플릿 카드 — 카테고리별 CrepassIcon
 */
const DocumentCard: React.FC<DocumentCardProps> = ({
  template,
  className = "",
}) => {
  const iconName = CATEGORY_ICON[template.category] ?? "documents";

  return (
    <Link
      href={`/documents/${template.id}`}
      className={`block group relative ${className}`}
    >
      <div className="cp-card h-full flex flex-col justify-between transition-colors duration-cp ease-cp hover:border-line-strong group-active:scale-[0.99]">
        <div className="flex-1">
          <div className="mb-4 text-ink-secondary">
            {/* Seed: 컨테이너 안 아이콘 → Fill, 배경 스티커 박스 제거 */}
            <CrepassIcon name={iconName} size={24} weight="fill" />
          </div>

          <h3 className="cp-h3 mb-1 line-clamp-2 group-hover:text-brand-ink transition-colors">
            {template.title}
          </h3>
          <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          {template.templateCount != null && (
            <p className="cp-caption mt-3">템플릿 {template.templateCount}개</p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm font-medium text-brand">만들기</span>
          <CrepassIcon name="chevron-right" size={18} />
        </div>

        {template.isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-surface-card cp-floating-surface">
            <span className="cp-chip border border-line text-ink-muted bg-surface">
              준비 중
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default DocumentCard;
