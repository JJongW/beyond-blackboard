import { DocumentTemplate, MenuItem, SupportItem, Notice } from '@/types';

// 메인 메뉴 항목들
export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'document-generation',
    title: '문서 생성',
    description: 'AI 기반 행정 문서 자동 생성',
    icon: 'fas fa-file-alt',
    href: '/documents',
    isActive: true,
  },
  {
    id: 'evaluation-grading',
    title: '수행평가 채점',
    description: 'AI 자동 채점 시스템',
    icon: 'fas fa-clipboard-check',
    href: '/evaluation',
  },
  {
    id: 'attendance-management',
    title: '출결 관리',
    description: '출석부 관리 및 통계',
    icon: 'fas fa-calendar-check',
    href: '/attendance',
  },
];

// 문서 템플릿들
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'home-communication',
    title: '가정통신문',
    description: '학부모 대상 안내 문서',
    category: 'communication',
    templateCount: 5,
    features: ['템플릿 제공', '자동 완성', '일괄 발송'],
  },
  {
    id: 'creative-activity-plan',
    title: '창의적 체험활동 계획서',
    description: '체험활동 계획 및 운영 문서',
    category: 'activity',
    features: ['자동 완성 기능', '교육과정 연계', 'AI 추천'],
  },
  {
    id: 'evaluation-rubric',
    title: '수행평가 기준표',
    description: '과목별 평가 기준 문서',
    category: 'evaluation',
    features: ['과목별 양식', '자동 배점', '루브릭 생성'],
  },
  {
    id: 'class-meeting-minutes',
    title: '학급회의록',
    description: '학급 회의 기록 문서',
    category: 'meeting',
    features: ['음성인식 받아쓰기', '자동 요약', '참석자 관리'],
  },
  {
    id: 'field-trip-plan',
    title: '현장체험학습 계획서',
    description: '체험학습 계획 및 안전 관리',
    category: 'activity',
    features: ['안전 계획 자동 생성', '보험 연계', '승인 절차'],
  },
  {
    id: 'parent-consultation',
    title: '학부모 상담 기록부',
    description: '상담 내용 기록 및 관리',
    category: 'communication',
    features: ['상담 이력 관리', '자동 분류', '후속 조치 알림'],
  },
];

// 공지사항
export const NOTICES: Notice[] = [
  {
    id: '1',
    title: '8월 시스템 정기점검 안내',
    content: '8월 25일 오전 2시부터 4시까지 시스템 정기점검이 진행됩니다.',
    date: '2024-08-15',
    isImportant: true,
  },
  {
    id: '2',
    title: '수행평가 채점 AI 모델 업데이트 안내',
    content: '더욱 정확한 채점을 위한 AI 모델이 업데이트되었습니다.',
    date: '2024-08-14',
  },
  {
    id: '3',
    title: '새로운 문서 템플릿 추가',
    content: '현장체험학습 계획서와 학부모 상담 기록부 템플릿이 추가되었습니다.',
    date: '2024-08-13',
  },
];

// 지원 메뉴
export const SUPPORT_ITEMS: SupportItem[] = [
  {
    id: 'manual',
    title: '사용 메뉴얼',
    href: '/manual',
    icon: 'fas fa-book',
  },
  {
    id: 'faq',
    title: '자주 묻는 질문 (FAQ)',
    href: '/faq',
    icon: 'fas fa-question-circle',
  },
  {
    id: 'support',
    title: '1:1 고객 지원',
    href: '/support',
    icon: 'fas fa-headset',
  },
];

// 네비게이션 메뉴
export const NAVIGATION_ITEMS = [
  { title: '학생관리', href: '/students' },
  { title: '출결도우미', href: '/attendance' },
  { title: '채점도우미', href: '/evaluation' },
  { title: '생기부도우미', href: '/records' },
];

// 색상 상수
export const COLORS = {
  primary: '#1ccf60',
  primaryLight: '#22d065',
  primaryDark: '#16a34a',
  background: '#ffffff',
  backgroundLight: '#f9fafb',
  text: '#333333',
  textLight: '#6b7280',
  border: '#e5e7eb',
  borderLight: '#f0f0f0',
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
