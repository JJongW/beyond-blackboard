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
   * provider 실패 시 job을 `failed`로 표시 (Phase 2 Ollama 장애 대비 동일 경로).
   */
  async runPipeline(jobId: string): Promise<void> {
    patchJob(jobId, { status: "drafting" });
    const provider = getActiveDraftProvider();

    try {
      const job = store.getState().jobs.find((j) => j.id === jobId);
      if (!job) throw new Error(`job을 찾을 수 없습니다: ${jobId}`);

      for (const entry of job.entries) {
        const aiText = await provider.generate({ rawText: entry.rawText });
        patchEntry(entry.id, { aiText });
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
