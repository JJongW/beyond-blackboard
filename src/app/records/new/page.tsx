import WorkspaceStub from "@/components/ui/WorkspaceStub";

export default function RecordRequestPage() {
  return (
    <WorkspaceStub
      title="템플릿 요청"
      crumbs={[
        { label: "홈", href: "/" },
        { label: "생기부", href: "/records" },
        { label: "템플릿 요청" },
      ]}
      description="생기부 템플릿 요청 기능은 준비 중입니다."
      backHref="/records"
      backLabel="생기부 목록으로"
    />
  );
}
