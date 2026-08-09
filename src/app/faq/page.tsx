import { HelpGuidePage } from "@/components/ui/HelpGuidePage";

export default function FaqPage() {
  return (
    <HelpGuidePage
      title="자주 묻는 질문"
      crumbsLabel="FAQ"
      intro="데모 단계에서 자주 묻는 내용을 모았습니다."
      bullets={[
        "데이터가 사라지나요? — 서버 없이 브라우저(localStorage)에만 저장됩니다. 기기를 바꾸면 보이지 않습니다.",
        "로그인이 필요한가요? — 현재 프로토타입에는 인증이 없습니다.",
        "AI 문서 생성은? — 로드맵 항목이며 아직 연결되지 않았습니다.",
        "실학생 정보가 보이나요? — 모두 샘플(가짜) 데이터입니다.",
      ]}
    />
  );
}
