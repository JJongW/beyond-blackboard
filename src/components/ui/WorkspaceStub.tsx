import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

interface WorkspaceStubProps {
  title: string;
  crumbs: { label: string; href?: string }[];
  description?: string;
  backHref: string;
  backLabel?: string;
}

/**
 * 아직 본 기능이 없는 상세/작성 화면용 스텁
 * 막다른 URL을 404 대신 안내 + 복귀 CTA로 처리
 */
export default function WorkspaceStub({
  title,
  crumbs,
  description = "이 화면의 작성·편집 기능은 준비 중입니다.",
  backHref,
  backLabel = "목록으로",
}: WorkspaceStubProps) {
  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader title={title} crumbs={crumbs} />
        <EmptyState
          title="준비 중"
          description={description}
          actionLabel={backLabel}
          actionHref={backHref}
        />
      </div>
    </MainLayout>
  );
}
