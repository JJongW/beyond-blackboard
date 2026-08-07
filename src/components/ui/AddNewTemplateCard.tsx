"use client";

import React from "react";
import Link from "next/link";
import CrepassIcon from "@/components/ui/CrepassIcon";

interface AddNewTemplateCardProps {
  href?: string;
  title?: string;
  description?: string;
}

/**
 * 새 템플릿/요청 카드 — CrepassIcon add
 */
const AddNewTemplateCard: React.FC<AddNewTemplateCardProps> = ({
  href = "/templates/new",
  title = "새 템플릿",
  description = "필요한 양식 요청하기",
}) => {
  return (
    <Link href={href} className="block group min-h-[200px]">
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-line-strong bg-surface px-6 py-8 text-center transition-colors hover:border-brand hover:bg-brand-muted/40">
        <div className="mb-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <CrepassIcon name="add" size={40} />
        </div>
        <h3 className="cp-h3">{title}</h3>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      </div>
    </Link>
  );
};

export default AddNewTemplateCard;
