import WorkspaceStub from "@/components/ui/WorkspaceStub";

export default function EvaluationNewPage() {
  return (
    <WorkspaceStub
      title="답안지 업로드"
      crumbs={[
        { label: "홈", href: "/" },
        { label: "채점", href: "/evaluation" },
        { label: "업로드" },
      ]}
      description="답안지 업로드·자동 채점 화면은 준비 중입니다."
      backHref="/evaluation"
    />
  );
}
