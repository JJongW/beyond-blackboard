"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import CrepassIcon from "@/components/ui/CrepassIcon";
import { rubricStore, type RubricCriterion } from "@/lib/workspace/rubricStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 채점 기준(루브릭) 편집 — 로컬 store 데모
 */
export default function EvaluationRubricPage() {
  const saved = useSingletonStore(rubricStore);
  const [title, setTitle] = useState(saved.title);
  const [criteria, setCriteria] = useState<RubricCriterion[]>(saved.criteria);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  const total = criteria.reduce((sum, c) => sum + (c.maxScore || 0), 0);

  const updateCriterion = (
    id: string,
    patch: Partial<Pick<RubricCriterion, "label" | "description" | "maxScore">>,
  ) => {
    setCriteria((list) =>
      list.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
    if (error) setError(null);
  };

  const onAdd = () => {
    const id = `c-${Date.now()}`;
    setCriteria((list) => [
      ...list,
      { id, label: "새 기준", description: "", maxScore: 10 },
    ]);
  };

  const onRemove = (id: string) => {
    setCriteria((list) => list.filter((c) => c.id !== id));
  };

  const onSave = () => {
    const result = rubricStore.save(title, criteria);
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
          title="채점 기준"
          crumbs={[
            { label: "홈", href: "/" },
            { label: "채점", href: "/evaluation" },
            { label: "채점 기준" },
          ]}
          actions={
            <ActionButton variant="brandSolid" onClick={onSave}>
              저장
            </ActionButton>
          }
        />

        <Callout tone="informative" icon="grading" className="mb-6">
          루브릭은 이 브라우저에 로컬로 저장됩니다. 합계 배점: {total}점
        </Callout>

        <Card className="mb-6 space-y-5">
          <Field
            label="루브릭 제목"
            htmlFor="rubric-title"
            error={error?.includes("제목") ? error : undefined}
          >
            <input
              id="rubric-title"
              className="cp-input w-full"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="cp-h3">평가 기준</h2>
              <ActionButton
                variant="neutralWeak"
                size="small"
                onClick={onAdd}
                prefixIcon={<CrepassIcon name="add" sizeToken="inline" />}
              >
                기준 추가
              </ActionButton>
            </div>

            {error && !error.includes("제목") && (
              <p className="text-sm text-[var(--cp-danger)]" role="alert">
                {error}
              </p>
            )}

            {criteria.map((c, index) => (
              <div
                key={c.id}
                className="rounded-md border border-line bg-surface-elevated p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-ink-muted">
                    기준 {index + 1}
                  </p>
                  <button
                    type="button"
                    className="text-sm text-ink-muted hover:text-ink"
                    onClick={() => onRemove(c.id)}
                    aria-label={`${c.label} 삭제`}
                  >
                    삭제
                  </button>
                </div>
                <Field label="이름" htmlFor={`rubric-label-${c.id}`}>
                  <input
                    id={`rubric-label-${c.id}`}
                    className="cp-input w-full"
                    value={c.label}
                    onChange={(e) =>
                      updateCriterion(c.id, { label: e.target.value })
                    }
                  />
                </Field>
                <Field label="설명" htmlFor={`rubric-desc-${c.id}`}>
                  <input
                    id={`rubric-desc-${c.id}`}
                    className="cp-input w-full"
                    value={c.description}
                    onChange={(e) =>
                      updateCriterion(c.id, { description: e.target.value })
                    }
                  />
                </Field>
                <Field label="배점" htmlFor={`rubric-score-${c.id}`}>
                  <input
                    id={`rubric-score-${c.id}`}
                    type="number"
                    min={1}
                    max={100}
                    className="cp-input w-28"
                    value={c.maxScore}
                    onChange={(e) =>
                      updateCriterion(c.id, {
                        maxScore: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <ActionButton variant="neutralWeak" href="/evaluation">
              채점으로
            </ActionButton>
            <ActionButton variant="brandSolid" onClick={onSave}>
              저장
            </ActionButton>
          </div>

          {saved.updatedAt && (
            <p className="text-xs text-ink-muted">
              마지막 저장: {new Date(saved.updatedAt).toLocaleString("ko-KR")}
            </p>
          )}
        </Card>

        <Snackbar
          open={snack}
          message="채점 기준을 저장했습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
