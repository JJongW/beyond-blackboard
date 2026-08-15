import { createSingletonStore } from "./createSingletonStore";

export type EvaluationJobStatus = "in_progress" | "completed";

export type EvaluationJob = {
  id: string;
  title: string;
  fileNames: string[];
  strictness: number;
  progress: number;
  status: EvaluationJobStatus;
  score?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

type EvaluationState = { jobs: EvaluationJob[] };

const store = createSingletonStore<EvaluationState>(
  { jobs: [] },
  { persistKey: "cp.workspace.evaluationJobs" },
);

function nowISO() {
  return new Date().toISOString();
}

/** 채점 작업 — 업로드 데모 → 진행 중 → 완료 */
export const evaluationJobStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  getServerSnapshot: store.getServerSnapshot,
  list() {
    return store.getState().jobs;
  },
  getById(id: string) {
    return store.getState().jobs.find((j) => j.id === id);
  },
  create(input: { title?: string; fileNames: string[]; strictness: number }) {
    if (input.fileNames.length === 0) {
      return { ok: false as const, error: "파일을 한 개 이상 첨부해 주세요." };
    }
    const createdAt = nowISO();
    const job: EvaluationJob = {
      id: `eval-${Date.now()}`,
      title:
        input.title?.trim() ||
        `${input.fileNames[0].replace(/\.[^.]+$/, "")} 채점`,
      fileNames: input.fileNames,
      strictness: input.strictness,
      progress: 15,
      status: "in_progress",
      createdAt,
      updatedAt: createdAt,
    };
    store.setState((s) => ({ jobs: [job, ...s.jobs] }));
    return { ok: true as const, job };
  },
  updateScore(id: string, score: number, note: string) {
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return { ok: false as const, error: "점수는 0–100 사이여야 합니다." };
    }
    const job = store.getState().jobs.find((j) => j.id === id);
    if (!job)
      return { ok: false as const, error: "채점 작업을 찾을 수 없습니다." };
    store.setState((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              score,
              note: note.trim(),
              progress: Math.max(j.progress, 70),
              updatedAt: nowISO(),
            }
          : j,
      ),
    }));
    return { ok: true as const };
  },
  complete(id: string) {
    const job = store.getState().jobs.find((j) => j.id === id);
    if (!job)
      return { ok: false as const, error: "채점 작업을 찾을 수 없습니다." };
    if (job.score == null) {
      return { ok: false as const, error: "점수를 먼저 저장해 주세요." };
    }
    store.setState((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              status: "completed" as const,
              progress: 100,
              updatedAt: nowISO(),
            }
          : j,
      ),
    }));
    return {
      ok: true as const,
      job: { ...job, status: "completed" as const, score: job.score },
    };
  },
};
