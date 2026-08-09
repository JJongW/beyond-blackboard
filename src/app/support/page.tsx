import { HelpGuidePage } from "@/components/ui/HelpGuidePage";

export default function SupportPage() {
  return (
    <HelpGuidePage
      title="고객 지원"
      crumbsLabel="지원"
      intro="1:1 문의 채널은 준비 중입니다. 데모 피드백은 제품 담당자에게 전달해 주세요."
      bullets={[
        "화면 오류·불편 제보 시 사용 중인 페이지 URL을 함께 알려 주세요.",
        "개인정보가 포함된 실제 학생 기록은 보내지 마세요.",
        "긴급 장애는 학교 IT 담당 절차를 우선해 주세요.",
      ]}
    />
  );
}
