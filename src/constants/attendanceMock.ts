import { ClassPeriod } from "@/types";

/**
 * 데모 출결 기준일 (로컬 YYYY-MM-DD).
 * 목록 헤더·교시 mock·상세 헤더가 같은 날을 쓰도록 한곳에서 생성.
 * (이전: 목록은 new Date(), 상세는 2024-08-15 고정 → 불일치)
 */
export function todayISODate(base: Date = new Date()): string {
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** ISO 날짜를 로컬 기준 한국어 표기로 (UTC 파싱 흔들림 방지) */
export function formatKoDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString("ko-KR");
}

/** ISO → Date (로컬 자정) */
export function parseISODateLocal(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** 데모 교시 — 날짜는 호출 시점의 오늘로 맞춤 */
export function getMockClassPeriods(
  date: string = todayISODate(),
): ClassPeriod[] {
  return [
    {
      id: "1",
      subject: "수학",
      period: 1,
      date,
      startTime: "09:00",
      endTime: "09:50",
      attendanceCount: 28,
      totalStudents: 30,
    },
    {
      id: "2",
      subject: "국어",
      period: 2,
      date,
      startTime: "10:00",
      endTime: "10:50",
      attendanceCount: 29,
      totalStudents: 30,
    },
    {
      id: "3",
      subject: "영어",
      period: 3,
      date,
      startTime: "11:00",
      endTime: "11:50",
      attendanceCount: 27,
      totalStudents: 30,
    },
  ];
}

export function getMockClassPeriod(
  id: string,
  date: string = todayISODate(),
): ClassPeriod {
  return (
    getMockClassPeriods(date).find((p) => p.id === id) ??
    getMockClassPeriods(date)[0]
  );
}
