"use client";

import React, { useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import DocumentCard from "@/components/ui/DocumentCard";
import AddNewTemplateCard from "@/components/ui/AddNewTemplateCard";
import Callout from "@/components/ui/Callout";
import PageBanner from "@/components/ui/PageBanner";
import Badge from "@/components/ui/Badge";
import { DOCUMENT_TEMPLATES } from "@/constants";
import type { DocumentTemplate } from "@/types";
import { customTemplateStore } from "@/lib/workspace/customTemplateStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 문서 템플릿 — 기본 + 로컬 커스텀 양식
 */
export default function DocumentsPage() {
  const { templates: custom } = useSingletonStore(customTemplateStore);

  const customAsDocs: DocumentTemplate[] = useMemo(
    () =>
      custom.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        features: ["커스텀"],
      })),
    [custom],
  );

  const total = DOCUMENT_TEMPLATES.length + customAsDocs.length;

  return (
    <MainLayout>
      <div className="cp-page">
        <PageHeader
          title="문서"
          description={`템플릿 ${total}개`}
          crumbs={[{ label: "홈", href: "/" }, { label: "문서" }]}
        />

        <PageBanner
          className="mb-4"
          title="자주 쓰는 양식부터"
          description="카드를 눌러 바로 작성하세요."
          tone="neutral"
          icon="documents"
        />

        <Callout tone="neutral" icon="documents" className="mb-6">
          카드는 한 템플릿·한 목적입니다. 새 양식은 이 브라우저에 로컬로
          보관됩니다.
        </Callout>

        {customAsDocs.length > 0 && (
          <section className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="cp-h2">내가 만든 양식</h2>
              <Badge tone="brand" size="small">
                {customAsDocs.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {customAsDocs.map((template) => (
                <DocumentCard key={template.id} template={template} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DOCUMENT_TEMPLATES.map((template) => (
            <DocumentCard key={template.id} template={template} />
          ))}
          <AddNewTemplateCard />
        </div>
      </div>
    </MainLayout>
  );
}
