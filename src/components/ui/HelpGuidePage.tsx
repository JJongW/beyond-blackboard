import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import ActionButton from "@/components/ui/ActionButton";

type HelpPageProps = {
  title: string;
  crumbsLabel: string;
  intro: string;
  bullets: string[];
};

/**
 * /manual · /faq · /support 공통 안내 셸 (404 방지)
 */
export function HelpGuidePage({
  title,
  crumbsLabel,
  intro,
  bullets,
}: HelpPageProps) {
  return (
    <MainLayout>
      <div className="cp-page max-w-3xl">
        <PageHeader
          title={title}
          crumbs={[{ label: "홈", href: "/" }, { label: crumbsLabel }]}
        />
        <Callout tone="informative" icon="help" className="mb-6">
          {intro}
        </Callout>
        <Card className="space-y-3">
          <ul className="list-disc space-y-2 pl-5 text-sm text-ink-secondary">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="pt-2">
            <ActionButton variant="brandSolid" href="/">
              홈으로
            </ActionButton>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
