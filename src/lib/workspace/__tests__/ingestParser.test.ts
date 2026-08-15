import { describe, it, expect } from "vitest";
import { parseCsv, parseTxtFile } from "../ingestParser";

describe("parseCsv", () => {
  it("parses header + rows", () => {
    const csv = `studentName,studentNumber,rawText
홍길동,202401001,"수학을 좋아함"
이영희,,토론에 적극적`;
    const r = parseCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.fragments).toHaveLength(2);
    expect(r.fragments[0].studentName).toBe("홍길동");
    expect(r.fragments[0].rawText).toContain("수학");
  });

  it("rejects empty body", () => {
    const r = parseCsv("studentName,rawText\n");
    expect(r.ok).toBe(false);
  });

  it("rejects missing studentName header", () => {
    const r = parseCsv("studentNumber,rawText\n202401001,내용");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("studentName");
  });

  it("rejects missing rawText header", () => {
    const r = parseCsv("studentName,studentNumber\n홍길동,202401001");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("rawText");
  });

  it("skips broken rows missing required field values", () => {
    const csv = `studentName,rawText
홍길동,유효함
,빈이름
박민수,`;
    const r = parseCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.fragments).toHaveLength(1);
    expect(r.fragments[0].studentName).toBe("홍길동");
    expect(r.fragments[0].rawText).toBe("유효함");
  });

  it("preserves multiline quoted rawText", () => {
    const csv = `studentName,rawText
홍길동,"수업 중 질문함
토론에도 참여함"`;
    const r = parseCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.fragments).toHaveLength(1);
    expect(r.fragments[0].rawText).toBe("수업 중 질문함\n토론에도 참여함");
  });

  it("preserves commas inside quoted rawText", () => {
    const csv = `studentName,rawText
홍길동,"관찰, 토론 참여"`;
    const r = parseCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.fragments).toHaveLength(1);
    expect(r.fragments[0].rawText).toBe("관찰, 토론 참여");
  });
});

describe("parseTxtFile", () => {
  it("uses filename stem as name", () => {
    const f = parseTxtFile("김철수.txt", "성실함");
    expect(f.studentName).toBe("김철수");
    expect(f.rawText).toBe("성실함");
  });
});
