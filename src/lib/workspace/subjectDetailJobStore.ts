import { createSingletonStore } from "./createSingletonStore";
import { matchFragment } from "./studentMatcher";
import { getActiveDraftProvider } from "./draftProvider";
import { notifyHub } from "./notifyHub";
import { studentStore } from "./studentStore";
import type {
  IngestFragment,
  SubjectDetailEntry,
  SubjectDetailJob,
} from "./subjectDetailTypes";

type JobState = { jobs: SubjectDetailJob[] };

const store = createSingletonStore<JobState>(
  { jobs: [] },
  { persistKey: "cp.workspace.subjectDetailJobs" },
);

let seq = 0;
function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

function findEntryLocation(
  jobs: SubjectDetailJob[],
  entryId: string,
): { jobIndex: number; entryIndex: number } | null {
  for (let jobIndex = 0; jobIndex < jobs.length; jobIndex++) {
    const entryIndex = jobs[jobIndex].entries.findIndex(
      (e) => e.id === entryId,
    );
    if (entryIndex !== -1) return { jobIndex, entryIndex };
  }
  return null;
}

/** entryId는 job 전체에서 고유하므로 jobId 없이도 바로 찾아 patch */
function patchEntry(entryId: string, patch: Partial<SubjectDetailEntry>) {
  store.setState((s) => {
    const location = findEntryLocation(s.jobs, entryId);
    if (!location) return s;
    const { jobIndex, entryIndex } = location;
    const jobs = [...s.jobs];
    const entries = [...jobs[jobIndex].entries];
    entries[entryIndex] = { ...entries[entryIndex], ...patch };
    jobs[jobIndex] = { ...jobs[jobIndex], entries };
    return { jobs };
  });
}

function patchJob(jobId: string, patch: Partial<SubjectDetailJob>) {
  store.setState((s) => ({
    jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, ...patch } : j)),
  }));
}

/** jobId별 진행 중인 파이프라인 Promise — 동시 runPipeline 호출이 같은 실행을 공유하도록 함 */
const inflightPipelines = new Map<string, Promise<void>>();

async function runPipelineInternal(jobId: string): Promise<void> {
  patchJob(jobId, { status: "drafting" });
  const provider = getActiveDraftProvider();

  try {
    const job = store.getState().jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`job을 찾을 수 없습니다: ${jobId}`);

    for (const entry of job.entries) {
      try {
        const aiText = await provider.generate({ rawText: entry.rawText });
        patchEntry(entry.id, { aiText, draftError: undefined });
      } catch (error) {
        // entry 단위 폴백 — provider(Ollama 등) 장애가 job 전체를 막지 않도록 원본 텍스트로 대체
        const message =
          error instanceof Error ? error.message : "초안 생성에 실패했습니다.";
        patchEntry(entry.id, { aiText: entry.rawText, draftError: message });
      }
    }

    patchJob(jobId, { status: "ready" });

    const readyJob = store.getState().jobs.find((j) => j.id === jobId);
    if (readyJob) {
      notifyHub.onJobReady(readyJob);
      patchJob(jobId, { notifiedAt: new Date().toISOString() });
    }
  } catch (error) {
    patchJob(jobId, {
      status: "failed",
      errorMessage:
        error instanceof Error ? error.message : "알 수 없는 오류입니다.",
    });
  }
}

/** 세부특기사항 job CRUD + 파이프라인 실행기 (매칭 → 초안 생성 → 알림) */
export const subjectDetailJobStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  list() {
    return store.getState().jobs;
  },
  /** jobId로 job 조회 — 헤더 알림의 `?job=` 딥링크 처리에 사용 */
  getById(jobId: string): SubjectDetailJob | undefined {
    return store.getState().jobs.find((j) => j.id === jobId);
  },

  /**
   * 인제스트 조각을 학생과 매칭해 `ingesting` 상태 job을 생성.
   * 초안 생성(drafting → ready)은 별도로 `runPipeline(jobId)`를 호출해야 진행됨.
   */
  createFromFragments(fragments: IngestFragment[]): string {
    const students = studentStore.list();
    const jobId = nextId("job");

    const entries: SubjectDetailEntry[] = fragments.map((fragment) => {
      const match = matchFragment(fragment, students);
      const entry: SubjectDetailEntry = {
        id: nextId("entry"),
        rawText: fragment.rawText,
        aiText: "",
        reviewStatus: "pending",
      };
      if (match.studentId) entry.studentId = match.studentId;
      if (match.unmatchedName) entry.unmatchedName = match.unmatchedName;
      return entry;
    });

    const job: SubjectDetailJob = {
      id: jobId,
      status: "ingesting",
      createdAt: new Date().toISOString(),
      entries,
    };

    store.setState((s) => ({ jobs: [job, ...s.jobs] }));
    return jobId;
  },

  /**
   * `drafting` → 각 entry에 대해 DraftProvider.generate 실행 → `ready` → notifyHub.
   * entry별 provider 실패(Ollama 장애 등)는 `aiText = rawText` 폴백 + `draftError`만 남기고
   * 계속 진행 — job 전체는 `failed`로 가지 않음. job을 못 찾는 등 치명적 오류일 때만 `failed`.
   *
   * - 이미 `ready`인 job은 재호출해도 no-op.
   * - 이미 `drafting` 중인(즉 in-flight) job에 동시에 호출하면 새로 실행하지 않고
   *   진행 중인 동일 Promise를 반환 — 두 호출 모두 같은 완료를 기다리며 알림도 한 번만 발생.
   */
  runPipeline(jobId: string): Promise<void> {
    const existing = store.getState().jobs.find((j) => j.id === jobId);
    if (existing?.status === "ready") return Promise.resolve();

    const inflight = inflightPipelines.get(jobId);
    if (inflight) return inflight;

    const run = runPipelineInternal(jobId).finally(() => {
      inflightPipelines.delete(jobId);
    });
    inflightPipelines.set(jobId, run);
    return run;
  },

  /**
   * 사용자가 「다시 시도」를 눌렀을 때 진입점 — job/entry의 이전 에러를 지우고
   * runPipeline을 재실행. `drafting` 상태로 새로고침된 job(진행 중 Promise가
   * 메모리에만 있던 inflightPipelines가 비어 있어 영영 멈춰 있는 경우)과
   * `failed` job, 그리고 일부 entry만 draftError가 남은 `ready` job 모두를 다룸.
   */
  retryDraft(jobId: string): Promise<void> {
    store.setState((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              errorMessage: undefined,
              entries: j.entries.map((e) =>
                e.draftError ? { ...e, draftError: undefined } : e,
              ),
            }
          : j,
      ),
    }));
    return this.runPipeline(jobId);
  },

  /** entry 필드 부분 수정 — rawText/aiText 편집 등 공용 진입점 */
  updateEntry(entryId: string, patch: Partial<SubjectDetailEntry>) {
    patchEntry(entryId, patch);
  },

  /** 리뷰 상태(pending/edited/copied)만 바꾸는 축약 메서드 */
  setReviewStatus(entryId: string, status: SubjectDetailEntry["reviewStatus"]) {
    patchEntry(entryId, { reviewStatus: status });
  },

  /** 미매칭 entry를 교사가 수동으로 학생과 연결 — unmatchedName은 해제 */
  linkStudent(entryId: string, studentId: string) {
    store.setState((s) => {
      const location = findEntryLocation(s.jobs, entryId);
      if (!location) return s;
      const { jobIndex, entryIndex } = location;
      const jobs = [...s.jobs];
      const entries = [...jobs[jobIndex].entries];
      const prev = entries[entryIndex];
      const next: SubjectDetailEntry = { ...prev, studentId };
      delete next.unmatchedName;
      entries[entryIndex] = next;
      jobs[jobIndex] = { ...jobs[jobIndex], entries };
      return { jobs };
    });
  },
};
