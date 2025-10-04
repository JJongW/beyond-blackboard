// 공통 타입 정의

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  school: string;
  avatar?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  templateCount?: number;
  features: string[];
  isComingSoon?: boolean;
}

export type DocumentCategory = 
  | 'communication' // 생활지도
  | 'activity' // 창의적 체험활동
  | 'evaluation' // 수행평가
  | 'life' // 행동 및 특성화 의견
  | 'meeting' // 회의록
  | 'other'; // 기타

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

export interface SupportItem {
  id: string;
  title: string;
  href: string;
  icon: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지 props 타입
export interface PageProps {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

// 출결 관리 타입
export interface ClassPeriod {
  id: string;
  subject: string; // 과목명
  period: number; // 교시 (1교시, 2교시 등)
  date: string; // 날짜 (YYYY-MM-DD)
  startTime: string; // 시작 시간 (HH:MM)
  endTime: string; // 종료 시간 (HH:MM)
  attendanceCount: number; // 출석 인원
  totalStudents: number; // 전체 학생 수
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string; // 학번
  class: string; // 반
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classPeriodId: string;
  status: AttendanceStatus;
  note?: string; // 비고
  recordedAt: string; // 기록 시간
}

export type AttendanceStatus = 
  | 'present' // 출석
  | 'absent' // 결석
  | 'late' // 지각
  | 'early_leave' // 조퇴
  | 'sick_leave' // 병결
  | 'official_leave'; // 공결
