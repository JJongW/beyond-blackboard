import { DOCUMENT_TEMPLATES } from "@/constants";
import WorkspaceStub from "@/components/ui/WorkspaceStub";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 문서 템플릿 상세/작성 — 현재 프론트 프로토타입 스텁
 */
export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = DOCUMENT_TEMPLATES.find((t) => t.id === id);
  const title = template?.title ?? "문서";

  return (
    <WorkspaceStub
      title={title}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "문서", href: "/documents" },
        { label: title },
      ]}
      description={
        template
          ? `「${template.title}」 작성 화면은 곧 연결됩니다.`
          : "요청한 문서 템플릿을 찾을 수 없습니다."
      }
      backHref="/documents"
    />
  );
}
