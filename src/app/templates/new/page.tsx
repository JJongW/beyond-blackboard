"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import type { DocumentCategory } from "@/types";
import {
  customTemplateStore,
  isDocumentCategory,
} from "@/lib/workspace/customTemplateStore";

const CATEGORY_OPTIONS: { value: DocumentCategory; label: string }[] = [
  { value: "communication", label: "생활지도·가정통신" },
  { value: "activity", label: "체험활동" },
  { value: "evaluation", label: "수행평가" },
  { value: "life", label: "행동·종합의견" },
  { value: "meeting", label: "회의록" },
  { value: "other", label: "기타" },
];

/**
 * 새 문서 양식 — 로컬 customTemplateStore에 등록 후 작성 화면으로 이동
 */
export default function NewTemplatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("other");
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  const onSubmit = () => {
    const result = customTemplateStore.add({ title, description, category });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSnack(true);
    // 작성 화면으로 — custom id는 documents/[id]에서 Empty 대신 커스텀 처리 필요
    window.setTimeout(() => {
      router.push(`/documents/${result.template.id}`);
    }, 400);
  };

  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title="새 양식"
          crumbs={[
            { label: "홈", href: "/" },
            { label: "문서", href: "/documents" },
            { label: "새 양식" },
          ]}
        />

        <Callout tone="informative" icon="documents" className="mb-6">
          만든 양식은 이 브라우저의 문서 목록에 나타납니다.
        </Callout>

        <Card className="space-y-5">
          <Field
            label="양식 이름"
            htmlFor="tpl-title"
            error={error?.includes("이름") ? error : undefined}
          >
            <input
              id="tpl-title"
              className="cp-input w-full"
              placeholder="예: 안전교육 가정통신문"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <Field
            label="설명"
            htmlFor="tpl-desc"
            error={error && !error.includes("이름") ? error : undefined}
          >
            <textarea
              id="tpl-desc"
              rows={4}
              className="cp-input w-full resize-y"
              placeholder="어떤 상황에 쓰는 양식인지 적어 주세요."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <Field label="분류" htmlFor="tpl-category">
            <select
              id="tpl-category"
              className="cp-input w-full"
              value={category}
              onChange={(e) => {
                const v = e.target.value;
                if (isDocumentCategory(v)) setCategory(v);
              }}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex justify-end gap-2">
            <ActionButton variant="neutralWeak" href="/documents">
              취소
            </ActionButton>
            <ActionButton variant="brandSolid" onClick={onSubmit}>
              양식 만들기
            </ActionButton>
          </div>
        </Card>

        <Snackbar
          open={snack}
          message="양식을 만들었습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
