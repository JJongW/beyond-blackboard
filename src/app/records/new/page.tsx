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
import { recordDraftStore } from "@/lib/workspace/recordDraftStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 생기부 템플릿 요청 — 로컬 요청 목록에 적재
 */
export default function RecordRequestPage() {
  const router = useRouter();
  const state = useSingletonStore(recordDraftStore);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  const onSubmit = () => {
    const result = recordDraftStore.addRequest(title, reason);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setTitle("");
    setReason("");
    setSnack(true);
  };

  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title="템플릿 요청"
          crumbs={[
            { label: "홈", href: "/" },
            { label: "생기부", href: "/records" },
            { label: "템플릿 요청" },
          ]}
        />

        <Callout tone="informative" icon="records" className="mb-6">
          필요한 생기부 양식을 요청해 주세요. 데모에서는 아래에 바로 쌓입니다.
        </Callout>

        <Card className="mb-8 space-y-5">
          <Field
            label="템플릿 이름"
            htmlFor="req-title"
            error={error?.includes("이름") ? error : undefined}
          >
            <input
              id="req-title"
              className="cp-input w-full"
              placeholder="예: 봉사활동 세부기록"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <Field
            label="요청 사유"
            htmlFor="req-reason"
            error={error && !error.includes("이름") ? error : undefined}
          >
            <textarea
              id="req-reason"
              rows={5}
              className="cp-input w-full resize-y"
              placeholder="어떤 상황에서 필요한지 알려 주세요."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <ActionButton
              variant="neutralWeak"
              onClick={() => router.push("/records")}
            >
              취소
            </ActionButton>
            <ActionButton variant="brandSolid" onClick={onSubmit}>
              요청 보내기
            </ActionButton>
          </div>
        </Card>

        {state.requests.length > 0 && (
          <section>
            <h2 className="cp-h2 mb-3">요청 목록</h2>
            <ul className="space-y-3">
              {state.requests.map((r) => (
                <li key={r.id} className="cp-card">
                  <p className="font-medium text-ink">{r.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{r.reason}</p>
                  <p className="mt-2 text-xs text-ink-muted">
                    {new Date(r.createdAt).toLocaleString("ko-KR")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Snackbar
          open={snack}
          message="템플릿 요청을 등록했습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
