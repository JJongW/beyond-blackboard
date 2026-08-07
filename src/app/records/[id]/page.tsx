import WorkspaceStub from "@/components/ui/WorkspaceStub";

const RECORD_TITLES: Record<string, string> = {
  "subject-details": "과목별 세부특기사항",
  "creative-activities": "창의적 체험활동",
  "behavior-opinion": "행동특성 및 종합의견",
  "career-activities": "진로활동 기록",
  "reading-activities": "독서활동 기록",
  "club-activities": "동아리활동 기록",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 생기부 템플릿 상세 — 프로토타입 스텁 (404 방지)
 */
export default async function RecordDetailPage({ params }: PageProps) {
  const { id } = await params;
  const title = RECORD_TITLES[id] ?? "생기부";

  return (
    <WorkspaceStub
      title={title}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "생기부", href: "/records" },
        { label: title },
      ]}
      description={
        RECORD_TITLES[id]
          ? `「${title}」 작성 화면은 곧 연결됩니다.`
          : "요청한 생기부 템플릿을 찾을 수 없습니다."
      }
      backHref="/records"
    />
  );
}
