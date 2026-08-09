import type { Student } from "@/types";
import { studentAvatarSrc } from "@/constants/designTokens";
import { createSingletonStore } from "./createSingletonStore";

const SEED: Student[] = [
  {
    id: "1",
    name: "홍길동",
    studentNumber: "202401001",
    class: "1-2",
    grade: 1,
    gender: "male",
    tags: ["도움필요", "수학우수"],
    isFavorite: true,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "2",
    name: "김철수",
    studentNumber: "202402001",
    class: "2-1",
    grade: 2,
    gender: "male",
    tags: ["우수", "리더십"],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "3",
    name: "이영희",
    studentNumber: "202401002",
    class: "1-2",
    grade: 1,
    gender: "female",
    tags: ["성실", "예술"],
    isFavorite: true,
    avatar: studentAvatarSrc("female"),
  },
  {
    id: "4",
    name: "박민수",
    studentNumber: "202403001",
    class: "3-1",
    grade: 3,
    gender: "male",
    tags: ["체육우수"],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
];

type StudentState = { students: Student[] };

const store = createSingletonStore<StudentState>(
  { students: SEED },
  { persistKey: "cp.workspace.students" },
);

export type AddStudentInput = {
  name: string;
  studentNumber: string;
  grade: number;
  className: string;
  gender: "male" | "female";
};

/** 학생 명단 — seed + 로컬 추가/즐겨찾기 */
export const studentStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  list() {
    return store.getState().students;
  },
  toggleFavorite(id: string) {
    store.setState((s) => ({
      students: s.students.map((st) =>
        st.id === id ? { ...st, isFavorite: !st.isFavorite } : st,
      ),
    }));
  },
  add(input: AddStudentInput) {
    const name = input.name.trim();
    const studentNumber = input.studentNumber.trim();
    const className = input.className.trim();
    if (!name) return { ok: false as const, error: "이름을 입력해 주세요." };
    if (!studentNumber) {
      return { ok: false as const, error: "학번을 입력해 주세요." };
    }
    if (!className) {
      return { ok: false as const, error: "반을 입력해 주세요. (예: 3-1)" };
    }
    if (![1, 2, 3, 4, 5, 6].includes(input.grade)) {
      return { ok: false as const, error: "학년은 1–6이어야 합니다." };
    }
    if (
      store.getState().students.some((s) => s.studentNumber === studentNumber)
    ) {
      return { ok: false as const, error: "이미 있는 학번입니다." };
    }
    const student: Student = {
      id: `s-${Date.now()}`,
      name,
      studentNumber,
      class: className,
      grade: input.grade,
      gender: input.gender,
      tags: [],
      isFavorite: false,
      avatar: studentAvatarSrc(input.gender),
    };
    store.setState((s) => ({ students: [student, ...s.students] }));
    return { ok: true as const, student };
  },
};
