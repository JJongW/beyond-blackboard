import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";

export default function GradesPage() {
  return (
    <MainLayout>
      <div className="cp-page">
        <PageHeader
          title="성적"
          crumbs={[{ label: "홈", href: "/" }, { label: "성적" }]}
        />

        <div className="cp-card py-16 text-center">
          <p className="cp-h3">준비 중</p>
          <p className="mt-2 text-sm text-ink-muted">
            성적 관리는 곧 제공됩니다.
          </p>
          <button type="button" className="cp-btn-primary mt-6">
            알림 신청
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
