"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import EmptyState from "@/components/ui/EmptyState";
import { gradeStore } from "@/lib/workspace/gradeStore";
import { studentStore } from "@/lib/workspace/studentStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 성적 — 학생 명단 기준 로컬 점수 편집
 */
export default function GradesPage() {
  const gradeState = useSingletonStore(gradeStore);
  const { students } = useSingletonStore(studentStore);
  const [subject, setSubject] = useState(gradeState.subject);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState(false);

  useEffect(() => {
    gradeStore.syncStudents();
  }, [students]);

  useEffect(() => {
    setSubject(gradeState.subject);
    const next: Record<string, string> = {};
    for (const row of gradeState.rows) {
      next[row.studentId] = row.score == null ? "" : String(row.score);
    }
    setDrafts(next);
  }, [gradeState]);

  const onSaveAll = () => {
    gradeStore.setSubject(subject);
    for (const row of gradeState.rows) {
      const raw = drafts[row.studentId]?.trim() ?? "";
      const score = raw === "" ? null : Number(raw);
      const result = gradeStore.setScore(row.studentId, score);
      if (!result.ok) {
        setError(result.error);
        return;
      }
    }
    setError(null);
    setSnack(true);
  };

  const studentName = (id: string) =>
    students.find((s) => s.id === id)?.name ?? "학생";

  const studentMeta = (id: string) => {
    const s = students.find((st) => st.id === id);
    return s ? `${s.class} · ${s.studentNumber}` : "";
  };

  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title="성적"
          crumbs={[{ label: "홈", href: "/" }, { label: "성적" }]}
          actions={
            <ActionButton variant="brandSolid" onClick={onSaveAll}>
              저장
            </ActionButton>
          }
        />

        <Callout tone="informative" icon="grading" className="mb-6">
          데모용 로컬 성적표입니다. 학생 메뉴에서 등록한 명단과 맞춰집니다.
        </Callout>

        <Card className="mb-6 space-y-4">
          <Field label="과목" htmlFor="grade-subject">
            <input
              id="grade-subject"
              className="cp-input w-full max-w-xs"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Field>
          {error && (
            <p className="text-sm text-[var(--cp-danger)]" role="alert">
              {error}
            </p>
          )}
        </Card>

        {gradeState.rows.length === 0 ? (
          <EmptyState
            icon="students"
            title="학생이 없습니다"
            description="학생 메뉴에서 명단을 추가해 주세요."
            actionLabel="학생으로"
            actionHref="/students"
          />
        ) : (
          <ul className="space-y-3">
            {gradeState.rows.map((row) => (
              <li
                key={row.studentId}
                className="cp-card flex flex-wrap items-center gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">
                    {studentName(row.studentId)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {studentMeta(row.studentId)}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-secondary">
                  점수
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="cp-input w-24"
                    value={drafts[row.studentId] ?? ""}
                    onChange={(e) => {
                      setDrafts((d) => ({
                        ...d,
                        [row.studentId]: e.target.value,
                      }));
                      if (error) setError(null);
                    }}
                    aria-label={`${studentName(row.studentId)} 점수`}
                  />
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <ActionButton variant="brandSolid" onClick={onSaveAll}>
            저장
          </ActionButton>
        </div>

        <Snackbar
          open={snack}
          message="성적을 저장했습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </div>
    </MainLayout>
  );
}
