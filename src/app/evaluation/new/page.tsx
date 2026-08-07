"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import AttachmentInput from "@/components/ui/AttachmentInput";
import Slider from "@/components/ui/Slider";
import ContentPlaceholder from "@/components/ui/ContentPlaceholder";
import ActionButton from "@/components/ui/ActionButton";
import Callout from "@/components/ui/Callout";
import Snackbar from "@/components/ui/Snackbar";
import Card from "@/components/ui/Card";
import ContextualFloatingButton from "@/components/ui/ContextualFloatingButton";

/**
 * 답안지 업로드 — AttachmentInput / Slider 미리보기
 */
export default function EvaluationNewPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [strictness, setStrictness] = useState(60);
  const [snack, setSnack] = useState(false);

  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title="답안지 업로드"
          crumbs={[
            { label: "홈", href: "/" },
            { label: "채점", href: "/evaluation" },
            { label: "업로드" },
          ]}
          actions={
            <ContextualFloatingButton
              label="채점 기준"
              href="/evaluation/rubric"
            />
          }
        />

        <Callout tone="informative" icon="grading" className="mb-6">
          업로드·자동 채점은 곧 연결됩니다. 지금은 첨부 UI 미리보기입니다.
        </Callout>

        <Card className="mb-6 space-y-6">
          <AttachmentInput files={files} onChange={setFiles} />
          <Slider
            label="채점 엄격도 (미리보기)"
            value={strictness}
            onChange={setStrictness}
            min={0}
            max={100}
          />
          <div className="flex flex-wrap justify-end gap-2">
            <ActionButton
              variant="neutralWeak"
              onClick={() => router.push("/evaluation")}
            >
              취소
            </ActionButton>
            <ActionButton
              variant="brandSolid"
              disabled={files.length === 0}
              onClick={() => setSnack(true)}
            >
              업로드 시작
            </ActionButton>
          </div>
        </Card>

        {files.length === 0 ? (
          <ContentPlaceholder
            tall
            title="미리보기 영역"
            description="파일을 첨부하면 여기에 미리보기가 표시됩니다."
          />
        ) : (
          <ContentPlaceholder
            title={`${files.length}개 파일 선택됨`}
            description="실제 미리보기는 백엔드 연동 후 제공됩니다."
          />
        )}

        <Snackbar
          open={snack}
          message="업로드 미리보기 — 서버 연동 전입니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
