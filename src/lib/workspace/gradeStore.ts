import { createSingletonStore } from "./createSingletonStore";
import { studentStore } from "./studentStore";

export type GradeRow = {
  studentId: string;
  subject: string;
  score: number | null;
  updatedAt: string | null;
};

type GradeState = {
  subject: string;
  rows: GradeRow[];
};

function seedRows(): GradeRow[] {
  return studentStore.list().map((s, i) => ({
    studentId: s.id,
    subject: "국어",
    score: [88, 92, 76, 81][i] ?? null,
    updatedAt: null,
  }));
}

const store = createSingletonStore<GradeState>(
  {
    subject: "국어",
    rows: seedRows(),
  },
  { persistKey: "cp.workspace.grades" },
);

function nowISO() {
  return new Date().toISOString();
}

/** 성적표 — 학생 store와 맞춰 로컬 편집 */
export const gradeStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  /** 학생 추가 후 빠진 행 보충 */
  syncStudents() {
    const students = studentStore.list();
    store.setState((s) => {
      const byId = new Map(s.rows.map((r) => [r.studentId, r]));
      const rows = students.map(
        (st) =>
          byId.get(st.id) ?? {
            studentId: st.id,
            subject: s.subject,
            score: null,
            updatedAt: null,
          },
      );
      return { ...s, rows };
    });
  },
  setSubject(subject: string) {
    const t = subject.trim() || "국어";
    store.setState((s) => ({
      subject: t,
      rows: s.rows.map((r) => ({ ...r, subject: t })),
    }));
  },
  setScore(studentId: string, score: number | null) {
    if (
      score != null &&
      (!Number.isFinite(score) || score < 0 || score > 100)
    ) {
      return { ok: false as const, error: "점수는 0–100 사이여야 합니다." };
    }
    store.setState((s) => ({
      ...s,
      rows: s.rows.map((r) =>
        r.studentId === studentId ? { ...r, score, updatedAt: nowISO() } : r,
      ),
    }));
    return { ok: true as const };
  },
  applyEvaluationScore(studentId: string, score: number) {
    this.syncStudents();
    return this.setScore(studentId, score);
  },
};
