import { describe, it, expect } from "vitest";
import { matchFragment } from "../studentMatcher";
import type { Student } from "@/types";

const students: Student[] = [
  {
    id: "1",
    name: "홍길동",
    studentNumber: "202401001",
    class: "1-2",
    grade: 1,
    tags: [],
    isFavorite: false,
  },
  {
    id: "3",
    name: "이영희",
    studentNumber: "202401002",
    class: "1-2",
    grade: 1,
    tags: [],
    isFavorite: false,
  },
];

describe("matchFragment", () => {
  it("matches by exact studentNumber first", () => {
    const result = matchFragment(
      { studentName: "다른이름", studentNumber: "202401001", rawText: "내용" },
      students,
    );
    expect(result.studentId).toBe("1");
    expect(result.unmatchedName).toBeUndefined();
  });

  it("matches seeded 홍길동 by exact trimmed name when no studentNumber", () => {
    const result = matchFragment(
      { studentName: " 홍길동 ", rawText: "수학을 좋아함" },
      students,
    );
    expect(result.studentId).toBe("1");
  });

  it("falls back to unmatchedName when nothing matches", () => {
    const result = matchFragment(
      { studentName: "존재하지않음", rawText: "내용" },
      students,
    );
    expect(result.studentId).toBeUndefined();
    expect(result.unmatchedName).toBe("존재하지않음");
  });

  it("falls back to unmatchedName when studentNumber given but not found and name also mismatched", () => {
    const result = matchFragment(
      { studentName: "미상", studentNumber: "999999999", rawText: "내용" },
      students,
    );
    expect(result.studentId).toBeUndefined();
    expect(result.unmatchedName).toBe("미상");
  });
});
