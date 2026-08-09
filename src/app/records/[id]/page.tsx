"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import EmptyState from "@/components/ui/EmptyState";
import { getRecordTemplate } from "@/lib/workspace/recordTemplates";
import { recordDraftStore } from "@/lib/workspace/recordDraftStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 생기부 템플릿 작성 — 로컬 draft store 데모
 */
export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const template = getRecordTemplate(id);
  const state = useSingletonStore(recordDraftStore);

  const [studentName, setStudentName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  useEffect(() => {
    if (!template) return;
    const draft = recordDraftStore.ensureDraft(template.id);
    setStudentName(draft.studentName);
    setContent(draft.content);
    setError(null);
  }, [template]);

  const saved = template ? state.drafts[template.id] : undefined;

  if (!template) {
    return (
      <MainLayout>
        <div className="cp-page max-w-3xl">
          <PageHeader
            title="생기부"
            crumbs={[
              { label: "홈", href: "/" },
              { label: "생기부", href: "/records" },
              { label: "없음" },
            ]}
          />
          <EmptyState
            title="템플릿을 찾을 수 없습니다"
            description="목록에서 다른 항목을 선택해 주세요."
            actionLabel="생기부 목록으로"
            actionHref="/records"
          />
        </div>
      </MainLayout>
    );
  }

  const onSave = () => {
    const result = recordDraftStore.saveDraft(template.id, {
      studentName,
      content,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSnack(true);
  };

  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title={template.title}
          crumbs={[
            { label: "홈", href: "/" },
            { label: "생기부", href: "/records" },
            { label: template.title },
          ]}
          actions={
            <ActionButton variant="brandSolid" onClick={onSave}>
              저장
            </ActionButton>
          }
        />

        <Callout tone="informative" icon="records" className="mb-6">
          {template.description}. 내용은 이 브라우저에 로컬로 저장됩니다.
        </Callout>

        <Card className="space-y-5">
          <Field
            label="학생"
            htmlFor="record-student"
            error={error?.includes("학생") ? error : undefined}
          >
            <input
              id="record-student"
              className="cp-input w-full"
              placeholder="예: 김민준"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <Field
            label="기록 내용"
            htmlFor="record-body"
            error={error && !error.includes("학생") ? error : undefined}
          >
            <textarea
              id="record-body"
              rows={14}
              className="cp-input w-full resize-y"
              placeholder="관찰·활동 내용을 작성하세요."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          {saved?.updatedAt && (
            <p className="text-xs text-ink-muted">
              마지막 저장: {new Date(saved.updatedAt).toLocaleString("ko-KR")}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <ActionButton variant="neutralWeak" href="/records">
              목록
            </ActionButton>
            <ActionButton variant="brandSolid" onClick={onSave}>
              저장
            </ActionButton>
          </div>
        </Card>

        <Snackbar
          open={snack}
          message="생기부 기록을 저장했습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
