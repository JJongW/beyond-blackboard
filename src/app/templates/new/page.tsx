import WorkspaceStub from "@/components/ui/WorkspaceStub";

/**
 * 새 문서 양식 만들기 — 프로토타입 스텁
 */
export default function NewTemplatePage() {
  return (
    <WorkspaceStub
      title="새 양식"
      crumbs={[
        { label: "홈", href: "/" },
        { label: "문서", href: "/documents" },
        { label: "새 양식" },
      ]}
      description="커스텀 양식 만들기는 준비 중입니다. 기존 템플릿을 먼저 사용해 보세요."
      backHref="/documents"
      backLabel="문서 목록으로"
    />
  );
}
