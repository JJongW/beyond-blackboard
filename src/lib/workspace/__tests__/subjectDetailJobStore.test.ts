import { describe, expect, it, vi } from "vitest";
import type { DraftProvider } from "../draftProvider";

// runPipeline의 동시 호출 가드를 검증하려면 provider.generate가 즉시 resolve되지 않아야
// 두 호출이 실제로 "겹치는" 시점(첫 호출이 아직 drafting 중)을 안정적으로 만들 수 있음.
// retryDraft가 "실제로 provider를 다시 호출하는지" 검증하려면 특정 rawText에 대해
// 딱 한 번 실패를 주입할 수 있어야 하므로, 그 상태를 vi.hoisted로 mock 팩토리와 공유한다.
const hoisted = vi.hoisted(() => ({
  failOnceFor: new Set<string>(),
}));

vi.mock("../draftProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../draftProvider")>();
  const realMock = actual.createMockDraftProvider();
  const delayedProvider: DraftProvider = {
    generate: (input) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (hoisted.failOnceFor.has(input.rawText)) {
            hoisted.failOnceFor.delete(input.rawText);
            reject(new Error("일시적인 Ollama 오류"));
            return;
          }
          realMock.generate(input).then(resolve, reject);
        }, 10);
      }),
  };
  return {
    ...actual,
    getActiveDraftProvider: () => delayedProvider,
  };
});

import { subjectDetailJobStore } from "../subjectDetailJobStore";
import { appNoticeStore } from "../appNoticeStore";
import type { IngestFragment } from "../subjectDetailTypes";

const fragments: IngestFragment[] = [
  {
    studentName: "홍길동",
    studentNumber: "202401001",
    rawText: "수학을 좋아함",
  },
  { studentName: "존재하지않는학생", rawText: "미매칭 조각" },
];

describe("subjectDetailJobStore", () => {
  it("createFromFragments matches students and starts as ingesting", () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    const job = subjectDetailJobStore.getById(jobId);

    expect(job?.status).toBe("ingesting");
    expect(job?.entries).toHaveLength(2);
    expect(job?.entries[0].studentId).toBe("1");
    expect(job?.entries[1].unmatchedName).toBe("존재하지않는학생");
  });

  it("runPipeline drafts every entry, marks ready, and notifies", async () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    await subjectDetailJobStore.runPipeline(jobId);

    const job = subjectDetailJobStore.getById(jobId);
    expect(job?.status).toBe("ready");
    expect(job?.notifiedAt).toBeDefined();
    expect(job?.entries.every((e) => e.aiText.length > 0)).toBe(true);

    const notice = appNoticeStore
      .list()
      .find((n) => n.href === `/records/subject-details?job=${jobId}`);
    expect(notice).toBeDefined();
    expect(notice?.title).toBe("학생들의 세부특기사항 작성이 완료되었습니다");
  });

  it("runPipeline no-ops on an already-ready job (no duplicate notice)", async () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    await subjectDetailJobStore.runPipeline(jobId);

    const noticesForJob = () =>
      appNoticeStore
        .list()
        .filter((n) => n.href === `/records/subject-details?job=${jobId}`);

    expect(noticesForJob()).toHaveLength(1);
    const firstNotifiedAt = subjectDetailJobStore.getById(jobId)?.notifiedAt;

    await subjectDetailJobStore.runPipeline(jobId);

    expect(noticesForJob()).toHaveLength(1);
    expect(subjectDetailJobStore.getById(jobId)?.notifiedAt).toBe(
      firstNotifiedAt,
    );
  });

  it("overlapping runPipeline calls on the same job notify only once", async () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);

    // 첫 호출이 아직 drafting 중(await 전)일 때 바로 두 번째 호출 — in-flight Promise 공유 검증
    const first = subjectDetailJobStore.runPipeline(jobId);
    expect(subjectDetailJobStore.getById(jobId)?.status).toBe("drafting");
    const second = subjectDetailJobStore.runPipeline(jobId);

    await Promise.all([first, second]);

    const job = subjectDetailJobStore.getById(jobId);
    expect(job?.status).toBe("ready");
    expect(job?.entries.every((e) => e.aiText.length > 0)).toBe(true);

    const notices = appNoticeStore
      .list()
      .filter((n) => n.href === `/records/subject-details?job=${jobId}`);
    expect(notices).toHaveLength(1);
  });

  it("retryDraft calls the provider again and clears draftError after a real failure (ready job)", async () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    const entry = subjectDetailJobStore.getById(jobId)!.entries[0];
    const { id: entryId, rawText } = entry;

    // 첫 파이프라인 실행에서 이 entry의 provider 호출만 실패하도록 주입 —
    // subjectDetailJobStore의 entry 단위 폴백으로 job은 그래도 `ready`가 됨.
    hoisted.failOnceFor.add(rawText);
    await subjectDetailJobStore.runPipeline(jobId);

    const afterFirstRun = subjectDetailJobStore.getById(jobId);
    expect(afterFirstRun?.status).toBe("ready");
    const failedEntry = afterFirstRun?.entries.find((e) => e.id === entryId);
    expect(failedEntry?.draftError).toBeDefined();
    expect(failedEntry?.aiText).toBe(rawText); // 실패 시 원본 텍스트로 폴백

    // 회귀 방지: retryDraft는 runPipeline의 `ready` 조기 반환 가드를 우회해야
    // 하므로, provider가 실제로 다시 호출되어 aiText가 갱신되는지까지 검증한다
    // (단순히 draftError 필드만 지우고 파이프라인은 재실행하지 않는 버그가 있었음).
    await subjectDetailJobStore.retryDraft(jobId);

    const afterRetry = subjectDetailJobStore.getById(jobId);
    expect(afterRetry?.status).toBe("ready");
    const retriedEntry = afterRetry?.entries.find((e) => e.id === entryId);
    expect(retriedEntry?.draftError).toBeUndefined();
    expect(retriedEntry?.aiText).not.toBe(rawText);
    expect(retriedEntry?.aiText.length).toBeGreaterThan(0);
  });

  it("retryDraft on a job with no errors still re-runs the pipeline to ready", async () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    await subjectDetailJobStore.runPipeline(jobId);

    await subjectDetailJobStore.retryDraft(jobId);

    const updated = subjectDetailJobStore.getById(jobId);
    expect(updated?.status).toBe("ready");
    expect(updated?.entries.every((e) => !e.draftError)).toBe(true);
  });

  it("retryDraft re-triggers a stale drafting job (simulating a reload)", async () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);

    // drafting 도중 in-flight 실행이 끊긴 상황을 시뮬레이션 — 새로고침 후에는
    // inflightPipelines가 비어 있어 runPipeline 재호출만이 유일한 진행 경로.
    const first = subjectDetailJobStore.runPipeline(jobId);
    expect(subjectDetailJobStore.getById(jobId)?.status).toBe("drafting");

    await subjectDetailJobStore.retryDraft(jobId);
    await first;

    expect(subjectDetailJobStore.getById(jobId)?.status).toBe("ready");
  });

  it("updateEntry and setReviewStatus patch the matching entry only", () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    const job = subjectDetailJobStore.getById(jobId);
    const entryId = job!.entries[0].id;

    subjectDetailJobStore.updateEntry(entryId, { rawText: "수정된 원본" });
    subjectDetailJobStore.setReviewStatus(entryId, "edited");

    const updated = subjectDetailJobStore.getById(jobId);
    expect(updated?.entries[0].rawText).toBe("수정된 원본");
    expect(updated?.entries[0].reviewStatus).toBe("edited");
    expect(updated?.entries[1].reviewStatus).toBe("pending");
  });

  it("linkStudent attaches studentId and clears unmatchedName", () => {
    const jobId = subjectDetailJobStore.createFromFragments(fragments);
    const job = subjectDetailJobStore.getById(jobId);
    const unmatchedEntryId = job!.entries[1].id;

    subjectDetailJobStore.linkStudent(unmatchedEntryId, "3");

    const updated = subjectDetailJobStore.getById(jobId);
    expect(updated?.entries[1].studentId).toBe("3");
    expect(updated?.entries[1].unmatchedName).toBeUndefined();
  });
});
