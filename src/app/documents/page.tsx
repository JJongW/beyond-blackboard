import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import DocumentCard from "@/components/ui/DocumentCard";
import AddNewTemplateCard from "@/components/ui/AddNewTemplateCard";
import Callout from "@/components/ui/Callout";
import { DOCUMENT_TEMPLATES } from "@/constants";

/**
 * 문서 템플릿 — Seed PageHeader / Callout / Card 적용
 */
export default function DocumentsPage() {
  return (
    <MainLayout>
      <div className="cp-page">
        <PageHeader
          title="문서"
          description={`템플릿 ${DOCUMENT_TEMPLATES.length}개`}
          crumbs={[{ label: "홈", href: "/" }, { label: "문서" }]}
        />

        <Callout tone="neutral" icon="documents" className="mb-6">
          자주 쓰는 양식을 골라 바로 작성하세요. 카드는 한 템플릿·한 목적입니다.
        </Callout>

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
