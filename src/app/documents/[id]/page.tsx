"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import EmptyState from "@/components/ui/EmptyState";
import { DOCUMENT_TEMPLATES } from "@/constants";
import type { DocumentTemplate } from "@/types";
import { documentDraftStore } from "@/lib/workspace/documentDraftStore";
import { customTemplateStore } from "@/lib/workspace/customTemplateStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 문서 템플릿 작성 — 로컬 draft store 데모
 */
export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const customState = useSingletonStore(customTemplateStore);
  const drafts = useSingletonStore(documentDraftStore);

  const template: DocumentTemplate | undefined = useMemo(() => {
    const builtIn = DOCUMENT_TEMPLATES.find((t) => t.id === id);
    if (builtIn) return builtIn;
    const custom = customState.templates.find((t) => t.id === id);
    if (!custom) return undefined;
    return {
      id: custom.id,
      title: custom.title,
      description: custom.description,
      category: custom.category,
      features: ["커스텀 양식"],
    };
  }, [id, customState.templates]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  useEffect(() => {
    if (!template) return;
    const draft = documentDraftStore.ensure(template.id, template.title);
    setTitle(draft.title);
    setBody(draft.body);
    setError(null);
  }, [template]);

  const saved = template ? drafts.byId[template.id] : undefined;

  if (!template) {
    return (
      <MainLayout>
        <div className="cp-page max-w-3xl">
          <PageHeader
            title="문서"
            crumbs={[
              { label: "홈", href: "/" },
              { label: "문서", href: "/documents" },
              { label: "없음" },
            ]}
          />
          <EmptyState
            title="템플릿을 찾을 수 없습니다"
            description="목록에서 다른 문서를 선택해 주세요."
            actionLabel="문서 목록으로"
            actionHref="/documents"
          />
        </div>
      </MainLayout>
    );
  }

  const onSave = () => {
    const result = documentDraftStore.save(template.id, { title, body });
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
            { label: "문서", href: "/documents" },
            { label: template.title },
          ]}
          actions={
            <ActionButton variant="brandSolid" onClick={onSave}>
              저장
            </ActionButton>
          }
        />

        <Callout tone="informative" icon="documents" className="mb-6">
          데모용 로컬 저장입니다. 이 브라우저에 보관되며 서버로는 전송되지
          않습니다.
        </Callout>

        <Card className="space-y-5">
          <Field label="제목" htmlFor="doc-title" error={error ?? undefined}>
            <input
              id="doc-title"
              className="cp-input w-full"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <Field label="본문" htmlFor="doc-body" hint={template.description}>
            <textarea
              id="doc-body"
              rows={12}
              className="cp-input w-full resize-y"
              placeholder="안내 문구나 계획 내용을 작성하세요."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Field>
          {saved?.updatedAt && (
            <p className="text-xs text-ink-muted">
              마지막 저장: {new Date(saved.updatedAt).toLocaleString("ko-KR")}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <ActionButton variant="neutralWeak" href="/documents">
              목록
            </ActionButton>
            <ActionButton variant="brandSolid" onClick={onSave}>
              저장
            </ActionButton>
          </div>
        </Card>

        <Snackbar
          open={snack}
          message="문서를 저장했습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
