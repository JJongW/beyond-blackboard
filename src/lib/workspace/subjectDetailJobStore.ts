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

/**
 * in-flight dedup만 적용해 실제로 파이프라인을 시작 — `ready` 가드는 호출자
 * (`runPipeline`)의 책임으로 분리해, `retryDraft`가 그 가드를 우회하고도
 * 동시 실행 dedup은 그대로 누릴 수 있게 함.
 *
 * `onlyEntryIds`가 주어지면 해당 entry만 재생성(다른 entry는 건드리지 않음) —
 * `retryDraft`가 이미 정상 생성됐거나 교사가 편집·저장한 aiText를 재생성으로
 * 덮어쓰지 않기 위해 사용.
 */
function startPipeline(
  jobId: string,
  onlyEntryIds?: Set<string>,
): Promise<void> {
  const inflight = inflightPipelines.get(jobId);
  if (inflight) return inflight;

  const run = runPipelineInternal(jobId, onlyEntryIds).finally(() => {
    inflightPipelines.delete(jobId);
  });
  inflightPipelines.set(jobId, run);
  return run;
}

async function runPipelineInternal(
  jobId: string,
  onlyEntryIds?: Set<string>,
): Promise<void> {
  patchJob(jobId, { status: "drafting" });
  const provider = getActiveDraftProvider();

  try {
    const job = store.getState().jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`job을 찾을 수 없습니다: ${jobId}`);

    for (const entry of job.entries) {
      // onlyEntryIds가 있으면 그 안에 없는 entry(이미 정상 생성됐거나 교사가
      // 편집·저장한 것)는 건드리지 않고 그대로 둔다
      if (onlyEntryIds && !onlyEntryIds.has(entry.id)) continue;
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
    return startPipeline(jobId);
  },

  /**
   * 사용자가 「다시 시도」를 눌렀을 때 진입점 — job을 `drafting`으로 되돌리고
   * job/entry의 이전 에러를 지운 뒤 파이프라인을 강제로 재실행.
   *
   * `runPipeline`과 달리 `ready` 가드를 거치지 않는다 — Ollama 폴백으로 일부
   * entry만 draftError가 남은 채 job이 `ready`로 끝난 경우가 바로 이 버튼의
   * 주 대상이므로, `ready`를 이유로 no-op하면 재시도가 아무 효과가 없다.
   * `drafting` 상태로 새로고침된 job(진행 중 Promise가 메모리 전용인
   * inflightPipelines에서 사라져 영영 멈춰 있는 경우)과 `failed` job도 함께 다룸.
   * 이미 실행 중인 파이프라인이 있으면 startPipeline의 dedup으로 새로 시작하지
   * 않고 그 완료를 기다린다.
   *
   * entry 선별 — 정상 생성됐거나 교사가 편집·저장한 aiText를 재시도로
   * 덮어쓰면 안 되므로, "재생성이 필요한" entry(= draftError가 있거나
   * aiText가 아직 비어 있는 것)만 다시 생성한다. 이 판단은 반드시 아래에서
   * draftError를 지우기 **전** 스냅샷 기준으로 해야 한다 — 지운 뒤에는
   * draftError가 이미 없어 대상을 구분할 수 없다.
   *
   * 재생성이 필요한 entry가 하나도 없으면(모든 entry에 draftError도 없고
   * aiText도 이미 채워져 있음) provider를 전혀 호출하지 않고 job만
   * `ready`로 되돌린다 — "대상이 없으니 전체 재생성"은 얻는 것 없이 이미
   * 정상이거나 교사가 편집·저장한 aiText를 덮어쓸 위험만 만든다. 이 분기는
   * job-level 오류만 있고(예: notifyHub 실패 등으로 `failed`가 됐지만 entry
   * 자체는 이미 다 채워진 드문 경우) entry는 멀쩡한 상황의 유일한 복구
   * 경로이기도 하다.
   */
  retryDraft(jobId: string): Promise<void> {
    const job = store.getState().jobs.find((j) => j.id === jobId);
    if (!job) return Promise.resolve();

    const needsRegen = job.entries.filter(
      (e) => e.draftError || !e.aiText.trim(),
    );

    if (needsRegen.length === 0) {
      store.setState((s) => ({
        jobs: s.jobs.map((j) =>
          j.id === jobId
            ? { ...j, status: "ready", errorMessage: undefined }
            : j,
        ),
      }));
      return Promise.resolve();
    }

    const onlyEntryIds = new Set(needsRegen.map((e) => e.id));

    store.setState((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: "drafting",
              errorMessage: undefined,
              notifiedAt: undefined,
              entries: j.entries.map((e) =>
                e.draftError ? { ...e, draftError: undefined } : e,
              ),
            }
          : j,
      ),
    }));
    return startPipeline(jobId, onlyEntryIds);
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
