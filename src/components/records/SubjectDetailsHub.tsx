"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import AttachmentInput from "@/components/ui/AttachmentInput";
import Field from "@/components/ui/Field";
import { subjectDetailJobStore } from "@/lib/workspace/subjectDetailJobStore";
import { isOllamaModeForClientUi } from "@/lib/workspace/draftProvider";
import { studentStore } from "@/lib/workspace/studentStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";
import { parseCsv, parseTxtFile } from "@/lib/workspace/ingestParser";
import type {
  JobStatus,
  SubjectDetailEntry,
} from "@/lib/workspace/subjectDetailTypes";
import type { IngestFragment } from "@/lib/workspace/subjectDetailTypes";

const STATUS_BANNER: Record<
  JobStatus,
  { tone: "neutral" | "informative" | "critical"; message: string }
> = {
  ingesting: { tone: "neutral", message: "학생 정보를 확인하고 있습니다…" },
  drafting: {
    tone: "informative",
    message: "AI가 초안을 작성하고 있습니다. 완료되면 알려드릴게요.",
  },
  ready: {
    tone: "informative",
    message: "초안 검토 준비가 완료됐습니다. 원본·AI 초안을 확인해 주세요.",
  },
  failed: { tone: "critical", message: "초안 생성에 실패했습니다." },
};

const REVIEW_BADGE: Record<
  SubjectDetailEntry["reviewStatus"],
  { tone: "neutral" | "warning" | "positive"; label: string }
> = {
  pending: { tone: "neutral", label: "대기 중" },
  edited: { tone: "warning", label: "수정됨" },
  copied: { tone: "positive", label: "복사됨" },
};

function studentLabel(
  entry: SubjectDetailEntry,
  students: ReturnType<typeof studentStore.list>,
): string {
  if (entry.studentId) {
    const student = students.find((s) => s.id === entry.studentId);
    if (student) return student.name;
  }
  return entry.unmatchedName ?? "이름 없음";
}

async function readFilesAsFragments(
  files: File[],
): Promise<
  { ok: true; fragments: IngestFragment[] } | { ok: false; error: string }
> {
  const fragments: IngestFragment[] = [];
  try {
    for (const file of files) {
      const isCsv =
        file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
      const text = await file.text();
      if (isCsv) {
        const result = parseCsv(text);
        if (!result.ok) return result;
        fragments.push(...result.fragments);
      } else {
        fragments.push(parseTxtFile(file.name, text));
      }
    }
  } catch {
    return { ok: false, error: "파일을 읽는 중 오류가 발생했습니다." };
  }
  if (fragments.length === 0) {
    return { ok: false, error: "유효한 데이터가 없습니다." };
  }
  return { ok: true, fragments };
}

/**
 * 과목별 세부특기사항 배치 검토 허브 — 업로드 즉시 매칭·초안 생성이 시작되고
 * 교사는 검토·수정·나이스 복사만 수행 ("AI 실행" 버튼 없음)
 */
export default function SubjectDetailsHub() {
  const searchParams = useSearchParams();
  const { jobs } = useSingletonStore(subjectDetailJobStore);
  const { students } = useSingletonStore(studentStore);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [rawDraft, setRawDraft] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [dirtyRaw, setDirtyRaw] = useState(false);
  const [dirtyAi, setDirtyAi] = useState(false);
  const [mobileTab, setMobileTab] = useState<"raw" | "ai">("raw");
  const [snack, setSnack] = useState<string | null>(null);
  const appliedQueryJob = useRef(false);
  const lastEntryIdRef = useRef<string | null>(null);
  const autoResumedJobIds = useRef<Set<string>>(new Set());

  const job = jobs.find((j) => j.id === selectedJobId) ?? null;
  const entry = job?.entries.find((e) => e.id === selectedEntryId) ?? null;

  // ?job= 딥링크 — 최초 1회만 적용, 이후 사용자 선택을 덮어쓰지 않음
  useEffect(() => {
    if (appliedQueryJob.current) return;
    const jobParam = searchParams.get("job");
    if (jobParam) {
      appliedQueryJob.current = true;
      setSelectedJobId(jobParam);
    }
  }, [searchParams]);

  // 존재하지 않는 ?job= (또는 삭제된 id) → 최근 job으로 복구
  useEffect(() => {
    if (!selectedJobId) return;
    if (jobs.some((j) => j.id === selectedJobId)) return;
    // hydrate 전 빈 목록이면 대기
    if (jobs.length === 0) return;
    setSelectedJobId(jobs[0].id);
    setSnack("요청한 작업을 찾지 못해 최근 작업으로 이동했습니다.");
  }, [jobs, selectedJobId]);

  // job 미선택 시 가장 최근 job(목록 맨 앞)을 기본 선택
  useEffect(() => {
    if (selectedJobId) return;
    if (jobs.length > 0) setSelectedJobId(jobs[0].id);
  }, [jobs, selectedJobId]);

  // 새로고침 직후 `drafting` 상태로 멈춘 job 자동 재개 — inflightPipelines는
  // 메모리 전용이라 새로고침되면 비어 있고, 저장된 job.status만 `drafting`으로
  // 남아 영영 진행되지 않는 문제(I-1)를 mount 시 1회 runPipeline 재호출로 해결.
  // 이미 실행 중이면 runPipeline의 inflight Map이 중복 실행을 막아준다.
  useEffect(() => {
    if (!job) return;
    if (job.status !== "drafting") return;
    if (autoResumedJobIds.current.has(job.id)) return;
    autoResumedJobIds.current.add(job.id);
    void subjectDetailJobStore.runPipeline(job.id);
    // job.id/status만 의존 — job 객체 전체를 넣으면 파이프라인 진행 중 매
    // entries 갱신마다(참조가 바뀌므로) 재실행 여부를 다시 계산하게 됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id, job?.status]);

  // 선택된 job이 바뀌거나 entry가 사라지면 첫 entry로 보정
  useEffect(() => {
    if (!job) return;
    if (!job.entries.some((e) => e.id === selectedEntryId)) {
      setSelectedEntryId(job.entries[0]?.id ?? null);
    }
  }, [job, selectedEntryId]);

  // entry 선택이 바뀌면 편집 버퍼를 리셋하고, 같은 entry라면 사용자가
  // 아직 손대지 않은(=dirty 아닌) 필드만 스토어 최신값으로 동기화
  // (드래프팅 중 백그라운드에서 aiText가 채워져도 편집 중인 내용을 덮어쓰지 않음)
  useEffect(() => {
    if (!entry) {
      lastEntryIdRef.current = null;
      setRawDraft("");
      setAiDraft("");
      setDirtyRaw(false);
      setDirtyAi(false);
      return;
    }
    if (lastEntryIdRef.current !== entry.id) {
      lastEntryIdRef.current = entry.id;
      setRawDraft(entry.rawText);
      setAiDraft(entry.aiText);
      setDirtyRaw(false);
      setDirtyAi(false);
      return;
    }
    if (!dirtyRaw) setRawDraft(entry.rawText);
    if (!dirtyAi) setAiDraft(entry.aiText);
    // entry의 개별 스칼라 필드만 의존 — entry 객체 전체를 넣으면 매 스토어
    // 갱신마다(참조가 바뀌므로) 재동기화되어 위 dirty 가드가 무의미해짐
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.id, entry?.rawText, entry?.aiText, dirtyRaw, dirtyAi]);

  const ingestFragments = (fragments: IngestFragment[]) => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    setUploadFiles([]);
    setSelectedJobId(jobId);
    void subjectDetailJobStore.runPipeline(jobId);
  };

  const onFilesSelected = async (files: File[]) => {
    setUploadFiles(files);
    setUploadError(null);
    if (files.length === 0) return;

    const result = await readFilesAsFragments(files);
    if (!result.ok) {
      setUploadError(result.error);
      return;
    }

    ingestFragments(result.fragments);
  };

  const onLoadSample = async () => {
    setUploadError(null);
    try {
      const res = await fetch("/fixtures/subject-details-sample.csv");
      if (!res.ok) {
        setUploadError("샘플 파일을 불러오지 못했습니다.");
        return;
      }
      const text = await res.text();
      const result = parseCsv(text);
      if (!result.ok) {
        setUploadError(result.error);
        return;
      }
      ingestFragments(result.fragments);
    } catch {
      setUploadError("샘플 파일을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const markEdited = () => {
    if (entry && entry.reviewStatus !== "edited") {
      subjectDetailJobStore.setReviewStatus(entry.id, "edited");
    }
  };

  const onRawChange = (value: string) => {
    setRawDraft(value);
    setDirtyRaw(true);
    markEdited();
  };

  const onAiChange = (value: string) => {
    setAiDraft(value);
    setDirtyAi(true);
    markEdited();
  };

  /** 학생 전환 전에 dirty 버퍼를 스토어에 반영 — 미저장 손실 방지 */
  const flushDraftIfDirty = () => {
    if (!entry) return;
    if (!dirtyRaw && !dirtyAi) return;
    subjectDetailJobStore.updateEntry(entry.id, {
      rawText: rawDraft,
      aiText: aiDraft,
    });
    setDirtyRaw(false);
    setDirtyAi(false);
  };

  const selectEntry = (id: string) => {
    if (id === selectedEntryId) return;
    flushDraftIfDirty();
    setSelectedEntryId(id);
  };

  const onSave = () => {
    if (!entry) return;
    subjectDetailJobStore.updateEntry(entry.id, {
      rawText: rawDraft,
      aiText: aiDraft,
    });
    setDirtyRaw(false);
    setDirtyAi(false);
    setSnack("저장했습니다.");
  };

  const onCopyAi = async () => {
    if (!entry) return;
    subjectDetailJobStore.updateEntry(entry.id, {
      rawText: rawDraft,
      aiText: aiDraft,
    });
    setDirtyRaw(false);
    setDirtyAi(false);
    try {
      await navigator.clipboard.writeText(aiDraft);
      subjectDetailJobStore.setReviewStatus(entry.id, "copied");
      setSnack("나이스에 붙여넣으세요");
    } catch {
      setSnack(
        "클립보드 복사에 실패했습니다. 텍스트를 직접 선택해 복사해 주세요.",
      );
    }
  };

  const onCopyRaw = async () => {
    if (!entry) return;
    try {
      await navigator.clipboard.writeText(rawDraft);
      setSnack("원본 텍스트를 복사했습니다.");
    } catch {
      setSnack(
        "클립보드 복사에 실패했습니다. 텍스트를 직접 선택해 복사해 주세요.",
      );
    }
  };

  const onNext = () => {
    if (!job || !entry) return;
    const idx = job.entries.findIndex((e) => e.id === entry.id);
    const next = job.entries[idx + 1];
    if (next) selectEntry(next.id);
  };

  const onRetryDraft = () => {
    if (!job) return;
    void subjectDetailJobStore.retryDraft(job.id);
  };

  const entryIndex =
    job && entry ? job.entries.findIndex((e) => e.id === entry.id) : -1;
  const hasNext =
    job != null && entryIndex >= 0 && entryIndex < job.entries.length - 1;
  const banner = job ? STATUS_BANNER[job.status] : null;
  const isReviewable = job?.status === "ready" || job?.status === "failed";
  // 「다시 시도」 노출 조건(I-1/I-3) — 멈춰 보일 수 있는 drafting, 완전 실패한
  // failed, 또는 일부 entry만 초안 생성에 실패한 경우(ready이지만 draftError 잔존)
  const hasAnyDraftError = job?.entries.some((e) => e.draftError) ?? false;
  const canRetryDraft =
    job != null &&
    (job.status === "drafting" || job.status === "failed" || hasAnyDraftError);
  // SSR/CSR 하이드레이션 불일치 방지 — NEXT_PUBLIC_*만 읽는 전용 헬퍼 사용
  // (AI_DRAFT_PROVIDER만 설정된 서버 환경에서는 SSR과 클라이언트 값이 달라질 수 있음)
  const isOllamaMode = isOllamaModeForClientUi();

  return (
    <MainLayout>
      <div className="cp-page max-w-6xl pb-28 lg:pb-8">
        <PageHeader
          title="과목별 세부특기사항"
          description="파일을 올리면 학생 매칭과 초안 작성이 자동으로 시작됩니다. 검토 후 나이스에 복사하세요."
          crumbs={[
            { label: "홈", href: "/" },
            { label: "생기부", href: "/records" },
            { label: "과목별 세부특기사항" },
          ]}
          actions={
            jobs.length > 0 ? (
              <Select
                aria-label="작업 선택"
                value={
                  selectedJobId && jobs.some((j) => j.id === selectedJobId)
                    ? selectedJobId
                    : (jobs[0]?.id ?? "")
                }
                onChange={(value) => setSelectedJobId(value)}
                options={jobs.map((j) => ({
                  value: j.id,
                  label: `${new Date(j.createdAt).toLocaleString("ko-KR")} · ${j.entries.length}명`,
                }))}
                className="w-64"
              />
            ) : undefined
          }
        />

        {isOllamaMode && (
          <Callout tone="neutral" icon="help" className="mb-6">
            Ollama 초안 생성 모드가 켜져 있습니다. 로컬에서 Ollama 서버가 실행
            중이어야 AI 초안이 생성되며, 연결에 실패하면 원본 텍스트로 자동
            대체됩니다.
          </Callout>
        )}

        <Card className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <AttachmentInput
                id="subject-detail-upload"
                label="파일 업로드"
                hint="CSV(studentName, studentNumber?, rawText) 또는 학생별 .txt 여러 개"
                error={uploadError ?? undefined}
                accept=".csv,text/csv,.txt"
                multiple
                files={uploadFiles}
                onChange={(files) => {
                  void onFilesSelected(files);
                }}
              />
            </div>
            <ActionButton
              variant="neutralOutline"
              type="button"
              onClick={() => void onLoadSample()}
            >
              샘플 불러오기
            </ActionButton>
          </div>
        </Card>

        {banner && (
          <Callout
            tone={banner.tone}
            icon={job?.status === "failed" ? "close" : "records"}
            className="mb-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>
                {banner.message}
                {job?.status === "failed" && job.errorMessage
                  ? ` (${job.errorMessage})`
                  : null}
              </span>
              {canRetryDraft && (
                <ActionButton
                  variant="neutralOutline"
                  size="small"
                  loading={job?.status === "drafting"}
                  disabled={job?.status === "drafting"}
                  onClick={onRetryDraft}
                >
                  다시 시도
                </ActionButton>
              )}
            </div>
          </Callout>
        )}

        {!job && (
          <EmptyState
            title="검토할 작업이 없습니다"
            description="위에서 CSV 또는 .txt 파일을 업로드하면 자동으로 매칭·초안 작성이 시작됩니다."
            icon="records"
          />
        )}

        {job && (
          <>
            {/* 데스크톱 3단 레이아웃 */}
            <div className="hidden gap-4 lg:grid lg:grid-cols-[240px_1fr_220px]">
              <Card padding={false} className="h-fit overflow-hidden">
                <ul className="divide-y divide-line">
                  {job.entries.map((e) => {
                    const selected = e.id === entry?.id;
                    const review = REVIEW_BADGE[e.reviewStatus];
                    return (
                      <li key={e.id}>
                        <button
                          type="button"
                          onClick={() => selectEntry(e.id)}
                          className={`flex w-full flex-col items-start gap-1.5 px-3 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "bg-brand-muted/60"
                              : "hover:bg-surface-elevated"
                          }`}
                        >
                          <span className="font-medium text-ink">
                            {studentLabel(e, students)}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            <Badge
                              tone={e.studentId ? "brand" : "critical"}
                              size="small"
                            >
                              {e.studentId ? "매칭됨" : "미매칭"}
                            </Badge>
                            <Badge tone={review.tone} size="small">
                              {review.label}
                            </Badge>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>

              <Card className="space-y-4">
                {entry?.draftError && (
                  <Callout tone="critical" icon="close">
                    AI 초안 생성에 실패해 원본 텍스트를 그대로 표시했습니다.
                    필요하면 AI 초안을 직접 수정해 주세요. ({entry.draftError})
                  </Callout>
                )}
                {entry?.unmatchedName && !entry.studentId && (
                  <Select
                    label="학생 연결"
                    aria-label="학생 연결"
                    value=""
                    placeholder={`"${entry.unmatchedName}" 와(과) 연결할 학생 선택`}
                    onChange={(value) => {
                      if (entry)
                        subjectDetailJobStore.linkStudent(entry.id, value);
                    }}
                    options={students.map((s) => ({
                      value: s.id,
                      label: `${s.name} (${s.class})`,
                    }))}
                  />
                )}
                <Field label="원본" htmlFor="subject-detail-raw">
                  <textarea
                    id="subject-detail-raw"
                    rows={14}
                    className="cp-input w-full resize-y"
                    value={rawDraft}
                    disabled={!entry}
                    onChange={(e) => onRawChange(e.target.value)}
                  />
                </Field>
                <Field label="AI 초안" htmlFor="subject-detail-ai">
                  <textarea
                    id="subject-detail-ai"
                    rows={14}
                    className="cp-input w-full resize-y"
                    placeholder={
                      isReviewable ? "" : "AI가 초안을 작성하는 중입니다…"
                    }
                    value={aiDraft}
                    disabled={!entry}
                    onChange={(e) => onAiChange(e.target.value)}
                  />
                </Field>
              </Card>

              <div className="flex h-fit flex-col gap-2">
                <ActionButton
                  variant="brandSolid"
                  width="fill"
                  disabled={!entry || !isReviewable}
                  onClick={() => void onCopyAi()}
                >
                  AI 초안 복사
                </ActionButton>
                <ActionButton
                  variant="neutralOutline"
                  width="fill"
                  disabled={!entry}
                  onClick={() => void onCopyRaw()}
                >
                  원본 복사
                </ActionButton>
                <ActionButton
                  variant="neutralWeak"
                  width="fill"
                  disabled={!entry}
                  onClick={onSave}
                >
                  저장
                </ActionButton>
                <ActionButton
                  variant="ghost"
                  width="fill"
                  disabled={!hasNext}
                  onClick={onNext}
                >
                  다음 학생
                </ActionButton>
              </div>
            </div>

            {/* 모바일: 학생 선택 + 탭 + 하단 고정 CTA */}
            <div className="space-y-4 lg:hidden">
              <Select
                label="학생"
                aria-label="학생 선택"
                value={entry?.id ?? ""}
                onChange={(value) => selectEntry(value)}
                options={job.entries.map((e) => ({
                  value: e.id,
                  label: `${studentLabel(e, students)} · ${REVIEW_BADGE[e.reviewStatus].label}`,
                }))}
              />

              {entry?.draftError && (
                <Callout tone="critical" icon="close">
                  AI 초안 생성에 실패해 원본 텍스트를 그대로 표시했습니다.
                  필요하면 AI 초안을 직접 수정해 주세요. ({entry.draftError})
                </Callout>
              )}

              {entry?.unmatchedName && !entry.studentId && (
                <Select
                  label="학생 연결"
                  aria-label="학생 연결"
                  value=""
                  placeholder={`"${entry.unmatchedName}" 와(과) 연결할 학생 선택`}
                  onChange={(value) => {
                    if (entry)
                      subjectDetailJobStore.linkStudent(entry.id, value);
                  }}
                  options={students.map((s) => ({
                    value: s.id,
                    label: `${s.name} (${s.class})`,
                  }))}
                />
              )}

              <Tabs
                aria-label="원본·AI 초안 전환"
                value={mobileTab}
                onChange={setMobileTab}
                options={[
                  { value: "raw", label: "원본" },
                  { value: "ai", label: "AI 초안" },
                ]}
              />

              {mobileTab === "raw" ? (
                <textarea
                  aria-label="원본"
                  rows={12}
                  className="cp-input w-full resize-y"
                  value={rawDraft}
                  disabled={!entry}
                  onChange={(e) => onRawChange(e.target.value)}
                />
              ) : (
                <textarea
                  aria-label="AI 초안"
                  rows={12}
                  className="cp-input w-full resize-y"
                  placeholder={
                    isReviewable ? "" : "AI가 초안을 작성하는 중입니다…"
                  }
                  value={aiDraft}
                  disabled={!entry}
                  onChange={(e) => onAiChange(e.target.value)}
                />
              )}

              <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-surface-card p-4">
                <ActionButton
                  variant="neutralWeak"
                  className="flex-1"
                  disabled={!entry}
                  onClick={onSave}
                >
                  저장
                </ActionButton>
                <ActionButton
                  variant="brandSolid"
                  className="flex-[1.4]"
                  disabled={!entry || !isReviewable}
                  onClick={() => void onCopyAi()}
                >
                  AI 초안 복사
                </ActionButton>
              </div>
            </div>
          </>
        )}

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
