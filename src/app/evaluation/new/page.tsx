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
import Field from "@/components/ui/Field";
import ContextualFloatingButton from "@/components/ui/ContextualFloatingButton";
import { evaluationJobStore } from "@/lib/workspace/evaluationJobStore";

/**
 * 답안지 업로드 — 로컬 채점 작업 생성
 */
export default function EvaluationNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [strictness, setStrictness] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  const onUpload = () => {
    const result = evaluationJobStore.create({
      title,
      fileNames: files.map((f) => f.name),
      strictness,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSnack(true);
    window.setTimeout(() => {
      router.push(`/evaluation/${result.job.id}`);
    }, 400);
  };

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
          파일은 서버로 올라가지 않습니다. 파일명만 로컬 채점 작업에 기록됩니다.
        </Callout>

        <Card className="mb-6 space-y-6">
          <Field label="채점 제목 (선택)" htmlFor="eval-title">
            <input
              id="eval-title"
              className="cp-input w-full"
              placeholder="예: 3단원 서술형"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <AttachmentInput files={files} onChange={setFiles} />
          <Slider
            label="채점 엄격도"
            value={strictness}
            onChange={setStrictness}
            min={0}
            max={100}
          />
          {error && (
            <p className="text-sm text-[var(--cp-danger)]" role="alert">
              {error}
            </p>
          )}
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
              onClick={onUpload}
            >
              업로드 시작
            </ActionButton>
          </div>
        </Card>

        {files.length === 0 ? (
          <ContentPlaceholder
            tall
            title="미리보기 영역"
            description="파일을 첨부하면 여기에 목록이 표시됩니다."
          />
        ) : (
          <ContentPlaceholder
            title={`${files.length}개 파일 선택됨`}
            description={files.map((f) => f.name).join(", ")}
          />
        )}

        <Snackbar
          open={snack}
          message="채점 작업을 만들었습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
