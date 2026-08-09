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
});

describe("parseTxtFile", () => {
  it("uses filename stem as name", () => {
    const f = parseTxtFile("김철수.txt", "성실함");
    expect(f.studentName).toBe("김철수");
    expect(f.rawText).toBe("성실함");
  });
});
