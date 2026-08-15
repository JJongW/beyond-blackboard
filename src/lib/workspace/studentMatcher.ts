import type { Student } from "@/types";
import type { IngestFragment } from "./subjectDetailTypes";

export type MatchResult = { studentId?: string; unmatchedName?: string };

/** 인제스트 조각 → 학생 매칭: 학번 우선, 없으면 이름 완전일치, 실패 시 미매칭 이름 반환 */
export function matchFragment(
  fragment: IngestFragment,
  students: Student[],
): MatchResult {
  const name = fragment.studentName.trim();
  const studentNumber = fragment.studentNumber?.trim();

  if (studentNumber) {
    const byNumber = students.find((s) => s.studentNumber === studentNumber);
    if (byNumber) return { studentId: byNumber.id };
  }

  const byName = students.find((s) => s.name.trim() === name);
  if (byName) return { studentId: byName.id };

  return { unmatchedName: name };
}
