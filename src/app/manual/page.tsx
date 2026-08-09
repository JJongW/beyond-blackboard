import { HelpGuidePage } from "@/components/ui/HelpGuidePage";

export default function ManualPage() {
  return (
    <HelpGuidePage
      title="사용 매뉴얼"
      crumbsLabel="매뉴얼"
      intro="크레파스 데모 화면 안내입니다. 실제 운영 매뉴얼은 추후 연결됩니다."
      bullets={[
        "홈에서 오늘의 할 일과 달력을 확인합니다.",
        "문서·생기부에서 템플릿을 고르고 초안을 저장해 보세요.",
        "출결에서 교시를 추가하고 학생 상태를 바꿔 저장할 수 있습니다.",
        "채점 기준(루브릭)은 이 브라우저에 저장·편집됩니다.",
      ]}
    />
  );
}
