import WorkspaceStub from "@/components/ui/WorkspaceStub";

export default function EvaluationRubricPage() {
  return (
    <WorkspaceStub
      title="채점 기준"
      crumbs={[
        { label: "홈", href: "/" },
        { label: "채점", href: "/evaluation" },
        { label: "채점 기준" },
      ]}
      description="채점 기준(루브릭) 설정 화면은 준비 중입니다."
      backHref="/evaluation"
    />
  );
}
