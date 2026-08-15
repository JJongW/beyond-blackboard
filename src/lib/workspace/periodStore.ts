import type { ClassPeriod } from "@/types";
import { getMockClassPeriods } from "@/constants/attendanceMock";
import { createSingletonStore } from "./createSingletonStore";

type PeriodState = {
  periods: ClassPeriod[];
};

function seed(): ClassPeriod[] {
  return getMockClassPeriods();
}

const store = createSingletonStore<PeriodState>(
  {
    periods: seed(),
  },
  { persistKey: "cp.workspace.periods" },
);

export type AddPeriodInput = {
  subject: string;
  period: number;
  date: string;
  startTime: string;
  endTime: string;
  totalStudents?: number;
};

const TIME_RE = /^\d{2}:\d{2}$/;

/** 출결 교시 목록 — mock seed + 세션 추가분 */
export const periodStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  getServerSnapshot: store.getServerSnapshot,
  list(): ClassPeriod[] {
    return store.getState().periods;
  },
  getById(id: string): ClassPeriod | undefined {
    return store.getState().periods.find((p) => p.id === id);
  },
  add(input: AddPeriodInput) {
    const subject = input.subject.trim();
    if (!subject) {
      return { ok: false as const, error: "과목명을 입력해 주세요." };
    }
    if (
      !Number.isInteger(input.period) ||
      input.period < 1 ||
      input.period > 8
    ) {
      return { ok: false as const, error: "교시는 1–8 사이여야 합니다." };
    }
    if (!TIME_RE.test(input.startTime) || !TIME_RE.test(input.endTime)) {
      return {
        ok: false as const,
        error: "시간은 HH:MM 형식으로 입력해 주세요.",
      };
    }
    if (input.startTime >= input.endTime) {
      return {
        ok: false as const,
        error: "종료 시간은 시작 시간보다 늦어야 합니다.",
      };
    }
    const totalStudents = input.totalStudents ?? 30;
    const period: ClassPeriod = {
      id: `p-${Date.now()}`,
      subject,
      period: input.period,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      attendanceCount: 0,
      totalStudents,
    };
    store.setState((s) => ({
      periods: [...s.periods, period],
    }));
    return { ok: true as const, period };
  },
};
