import { notFound } from "next/navigation";
import {
  DS_FOUNDATIONS,
  getDsDoc,
  type DsGroupKey,
} from "@/constants/dsCatalog";
import { DsDocRenderer } from "@/components/design-system/DsDocRenderer";

export function generateStaticParams() {
  return DS_FOUNDATIONS.map((d) => ({ slug: d.slug }));
}

export default async function FoundationDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group: DsGroupKey = "foundations";
  const doc = getDsDoc(group, slug);
  if (!doc) notFound();
  return <DsDocRenderer group={group} doc={doc} />;
}
