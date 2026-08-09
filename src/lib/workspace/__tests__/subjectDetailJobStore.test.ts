import { describe, expect, it } from "vitest";
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
