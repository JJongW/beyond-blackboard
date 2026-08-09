import type { CrepassIconName } from "@/constants/designSystemNav";

export type RecordTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  recentlyUsed: boolean;
};

/** 생기부 목록·상세 공유 템플릿 (페이지 로컬 중복 제거) */
export const RECORD_TEMPLATES: RecordTemplate[] = [
  {
    id: "subject-details",
    title: "과목별 세부특기사항",
    description: "과목별 학업 성취도와 특기사항 기록",
    category: "academic",
    recentlyUsed: true,
  },
  {
    id: "creative-activities",
    title: "창의적 체험활동",
    description: "자율·동아리·봉사·진로활동 기록",
    category: "experience",
    recentlyUsed: false,
  },
  {
    id: "behavior-opinion",
    title: "행동특성 및 종합의견",
    description: "행동 특성과 학교생활 종합 의견",
    category: "behavior",
    recentlyUsed: true,
  },
  {
    id: "career-activities",
    title: "진로활동 기록",
    description: "진로 탐색 과정과 관련 활동",
    category: "career",
    recentlyUsed: false,
  },
  {
    id: "reading-activities",
    title: "독서활동 기록",
    description: "독서 이력과 독후 활동",
    category: "reading",
    recentlyUsed: false,
  },
  {
    id: "club-activities",
    title: "동아리활동 기록",
    description: "동아리 활동 내용과 성과",
    category: "experience",
    recentlyUsed: true,
  },
];

export const RECORD_CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: CrepassIconName }
> = {
  academic: { label: "교과", icon: "notebook" },
  experience: { label: "체험", icon: "crayon" },
  behavior: { label: "행동", icon: "user" },
  career: { label: "진로", icon: "clipboard" },
  reading: { label: "독서", icon: "records" },
};

export function getRecordTemplate(id: string): RecordTemplate | undefined {
  return RECORD_TEMPLATES.find((t) => t.id === id);
}
