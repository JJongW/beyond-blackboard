"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { evaluationJobStore } from "@/lib/workspace/evaluationJobStore";
import { studentStore } from "@/lib/workspace/studentStore";
import { gradeStore } from "@/lib/workspace/gradeStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 채점 작업 상세 — 점수 입력·완료 → 성적 반영(데모)
 */
export default function EvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { jobs } = useSingletonStore(evaluationJobStore);
  const { students } = useSingletonStore(studentStore);
  const job = jobs.find((j) => j.id === params.id);

  const [score, setScore] = useState("");
  const [note, setNote] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => {
    if (!job) return;
    setScore(job.score != null ? String(job.score) : "");
    setNote(job.note ?? "");
  }, [job]);

  useEffect(() => {
    if (!studentId && students[0]) setStudentId(students[0].id);
  }, [students, studentId]);

  if (!job) {
    return (
      <MainLayout>
        <div className="cp-page max-w-3xl">
          <PageHeader
            title="채점"
            crumbs={[
              { label: "홈", href: "/" },
              { label: "채점", href: "/evaluation" },
              { label: "없음" },
            ]}
          />
          <EmptyState
            title="채점 작업을 찾을 수 없습니다"
            actionLabel="채점 목록으로"
            actionHref="/evaluation"
          />
        </div>
      </MainLayout>
    );
  }

  const onSaveScore = () => {
    const result = evaluationJobStore.updateScore(job.id, Number(score), note);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSnack("점수를 저장했습니다.");
  };

  const onComplete = () => {
    const save = evaluationJobStore.updateScore(job.id, Number(score), note);
    if (!save.ok) {
      setError(save.error);
      return;
    }
    const done = evaluationJobStore.complete(job.id);
    if (!done.ok) {
      setError(done.error);
      return;
    }
    if (studentId && done.job.score != null) {
      gradeStore.syncStudents();
      gradeStore.applyEvaluationScore(studentId, done.job.score);
    }
    setError(null);
    setSnack("채점을 완료했고 성적에 반영했습니다.");
    window.setTimeout(() => router.push("/evaluation"), 600);
  };

  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title={job.title}
          crumbs={[
            { label: "홈", href: "/" },
            { label: "채점", href: "/evaluation" },
            { label: job.title },
          ]}
          actions={
            <Badge tone={job.status === "completed" ? "brand" : "warning"}>
              {job.status === "completed" ? "완료" : `진행 ${job.progress}%`}
            </Badge>
          }
        />

        <Callout tone="informative" icon="grading" className="mb-6">
          데모 채점입니다. 완료 시 선택한 학생의 성적 과목 점수가 갱신됩니다.
        </Callout>

        <Card className="mb-6 space-y-3">
          <p className="text-sm text-ink-muted">첨부 파일</p>
          <ul className="list-disc pl-5 text-sm text-ink">
            {job.fileNames.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted">
            엄격도 {job.strictness}% ·{" "}
            <Link href="/evaluation/rubric" className="cp-link">
              루브릭
            </Link>
          </p>
        </Card>

        <Card className="space-y-5">
          <Field
            label="점수 (0–100)"
            htmlFor="eval-score"
            error={error?.includes("점수") ? error : undefined}
          >
            <input
              id="eval-score"
              type="number"
              min={0}
              max={100}
              className="cp-input w-32"
              value={score}
              disabled={job.status === "completed"}
              onChange={(e) => {
                setScore(e.target.value);
                if (error) setError(null);
              }}
            />
          </Field>
          <Field label="피드백" htmlFor="eval-note">
            <textarea
              id="eval-note"
              rows={4}
              className="cp-input w-full resize-y"
              value={note}
              disabled={job.status === "completed"}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <Field label="성적 반영 학생" htmlFor="eval-student">
            <Select
              id="eval-student"
              value={studentId}
              disabled={job.status === "completed" || students.length === 0}
              onChange={setStudentId}
              options={students.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.class})`,
              }))}
            />
          </Field>
          {error && !error.includes("점수") && (
            <p className="text-sm text-[var(--cp-danger)]" role="alert">
              {error}
            </p>
          )}
          {job.status !== "completed" && (
            <div className="flex flex-wrap justify-end gap-2">
              <ActionButton variant="neutralWeak" onClick={onSaveScore}>
                점수 저장
              </ActionButton>
              <ActionButton variant="brandSolid" onClick={onComplete}>
                채점 완료
              </ActionButton>
            </div>
          )}
          {job.status === "completed" && (
            <ActionButton variant="neutralWeak" href="/grades">
              성적 보기
            </ActionButton>
          )}
        </Card>

        <Snackbar
          open={!!snack}
          message={snack ?? ""}
          tone="positive"
          onClose={() => setSnack(null)}
        />
      </div>
    </MainLayout>
  );
}
