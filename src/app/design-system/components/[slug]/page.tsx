import { notFound } from "next/navigation";
import {
  DS_COMPONENTS,
  getDsDoc,
  type DsGroupKey,
} from "@/constants/dsCatalog";
import { DsDocRenderer } from "@/components/design-system/DsDocRenderer";

export function generateStaticParams() {
  return DS_COMPONENTS.map((d) => ({ slug: d.slug }));
}

export default async function ComponentDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group: DsGroupKey = "components";
  const doc = getDsDoc(group, slug);
  if (!doc) notFound();
  return <DsDocRenderer group={group} doc={doc} />;
}
