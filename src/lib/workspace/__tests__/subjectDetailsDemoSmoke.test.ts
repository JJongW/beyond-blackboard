import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsv } from "../ingestParser";
import { subjectDetailJobStore } from "../subjectDetailJobStore";
import { appNoticeStore } from "../appNoticeStore";

const FIXTURE_PATH = path.join(
  process.cwd(),
  "public/fixtures/subject-details-sample.csv",
);

describe("subject details demo smoke (fixture → pipeline)", () => {
  it("parseCsv, createFromFragments, runPipeline → ready with notices", async () => {
    const csv = readFileSync(FIXTURE_PATH, "utf-8");
    const parsed = parseCsv(csv);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.fragments.length).toBeGreaterThanOrEqual(3);

    const jobId = subjectDetailJobStore.createFromFragments(parsed.fragments);
    await subjectDetailJobStore.runPipeline(jobId);

    const job = subjectDetailJobStore.getById(jobId);
    expect(job?.status).toBe("ready");
    expect(job?.entries.length).toBeGreaterThanOrEqual(3);
    expect(job?.entries.every((e) => e.aiText.length > 0)).toBe(true);

    const notice = appNoticeStore
      .list()
      .find((n) => n.href === `/records/subject-details?job=${jobId}`);
    expect(notice).toBeDefined();
    expect(notice?.title).toBe("학생들의 세부특기사항 작성이 완료되었습니다");
  });
});
