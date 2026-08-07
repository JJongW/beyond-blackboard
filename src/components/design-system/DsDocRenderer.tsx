import React from "react";
import Link from "next/link";
import type { DsDoc, DsGroupKey } from "@/constants/dsCatalog";
import { CREPASS_ICON_NAMES, DS_DOCS_BY_GROUP } from "@/constants/dsCatalog";
import { resolveDsStatus } from "@/constants/dsStatus";
import {
  COLOR,
  ELEVATION,
  MOTION,
  SPACE,
  TYPE,
} from "@/constants/designTokens";
import CrepassIcon from "@/components/ui/CrepassIcon";
import ActionButton from "@/components/ui/ActionButton";
import EmptyState from "@/components/ui/EmptyState";
import TextField from "@/components/ui/TextField";
import { SkeletonListRows } from "@/components/ui/Skeleton";
import Chip from "@/components/ui/Chip";
import Avatar from "@/components/ui/Avatar";
import {
  DsCheckboxDemo,
  DsControlsDemo,
  DsListDemo,
  DsLoadingDemo,
  DsMenuDemo,
  DsProgressDemo,
  DsRadioDemo,
  DsSegmentedDemo,
  DsSelectDemo,
  DsSwitchDemo,
  DsTabsDemo,
  DsAccordionDemo,
  DsDividerDemo,
  DsPageBannerDemo,
  DsHelpBubbleDemo,
  DsReactionDemo,
  DsTagGroupDemo,
  DsFabDemo,
  DsCardDemo,
} from "@/components/design-system/DsInteractiveDemos";
import {
  DsDoDont,
  DsPageHeader,
  DsSection,
} from "@/components/design-system/DsPage";

/** Seed식 문서 렌더러 — Status · Anatomy + Done만 실 Preview */
export function DsDocRenderer({
  group,
  doc,
}: {
  group: DsGroupKey;
  doc: DsDoc;
}) {
  const status = resolveDsStatus(group, doc.slug);
  const eyebrow =
    group === "foundations"
      ? "Foundations"
      : group === "patterns"
        ? "Patterns"
        : "Components";

  return (
    <div className="ds-doc">
      <DsPageHeader
        eyebrow={eyebrow}
        title={doc.title}
        description={doc.description}
        status={status}
      />

      {status === "Done" && doc.demo ? (
        <DsSection id="preview" title="Preview">
          <div className="ds-preview">{renderDemo(doc.demo)}</div>
        </DsSection>
      ) : status === "Planned" ? (
        <DsSection id="status" title="Status">
          <p className="max-w-2xl text-base text-ink-secondary">
            Planned — 런타임 컴포넌트 미구현입니다. 가짜 Preview는 제공하지
            않습니다.
          </p>
        </DsSection>
      ) : null}

      {doc.sections.map((section) => (
        <DsSection key={section.id} id={section.id} title={section.title}>
          {section.body && (
            <p className="mb-4 max-w-2xl text-base text-ink-secondary">
              {section.body}
            </p>
          )}
          {section.bullets && (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-base text-ink-secondary">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {section.table && (
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="bg-surface-elevated text-ink-muted">
                  <tr>
                    {section.table.headers.map((h) => (
                      <th key={h} className="px-3 py-2.5 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, i) => (
                    <tr key={i} className="border-t border-line">
                      {row.map((cell, j) => (
                        <td
                          key={`${i}-${j}`}
                          className="px-3 py-2.5 text-ink-secondary align-top"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DsSection>
      ))}

      {doc.dos && doc.donts && <DsDoDont dos={doc.dos} donts={doc.donts} />}

      {doc.related && doc.related.length > 0 && (
        <DsSection id="related" title="Related Documents">
          <ul className="flex flex-wrap gap-2">
            {doc.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-flex rounded-md border border-line bg-surface-card px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </DsSection>
      )}

      <DsPrevNext group={group} slug={doc.slug} />
    </div>
  );
}

function DsPrevNext({ group, slug }: { group: DsGroupKey; slug: string }) {
  const list = DS_DOCS_BY_GROUP[group];
  const idx = list.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-14 flex flex-wrap items-stretch justify-between gap-3 border-t border-line pt-8"
      aria-label="이전/다음 문서"
    >
      {prev ? (
        <Link
          href={`/design-system/${group}/${prev.slug}`}
          className="min-w-[12rem] flex-1 rounded-md border border-line bg-surface-card px-4 py-3 transition-colors hover:border-line-strong"
        >
          <p className="text-xs text-ink-muted">이전</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{prev.title}</p>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/design-system/${group}/${next.slug}`}
          className="min-w-[12rem] flex-1 rounded-md border border-line bg-surface-card px-4 py-3 text-right transition-colors hover:border-line-strong"
        >
          <p className="text-xs text-ink-muted">다음</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{next.title}</p>
        </Link>
      ) : null}
    </nav>
  );
}

function renderDemo(demo: NonNullable<DsDoc["demo"]>) {
  switch (demo) {
    case "button":
      return (
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton variant="brandSolid">저장</ActionButton>
          <ActionButton variant="neutralWeak">취소</ActionButton>
          <ActionButton variant="ghost">더보기</ActionButton>
          <ActionButton
            variant="brandSolid"
            aria-label="추가"
            className="!px-0 w-10"
          >
            <CrepassIcon name="add" size={20} className="text-white" />
          </ActionButton>
          <ActionButton variant="brandSolid" loading>
            저장 중
          </ActionButton>
        </div>
      );
    case "chip":
      return (
        <div className="flex flex-wrap gap-2">
          {["전체", "출석", "결석", "지각"].map((label, i) => (
            <Chip key={label} selected={i === 0}>
              {label}
            </Chip>
          ))}
        </div>
      );
    case "input":
      return (
        <div className="max-w-md space-y-3">
          <TextField
            id="ds-demo-name"
            label="학생 이름"
            placeholder="이름을 입력하세요"
          />
          <TextField
            id="ds-demo-memo"
            label="메모"
            multiline
            placeholder="특이사항을 적어 주세요"
          />
        </div>
      );
    case "avatar":
      return (
        <div className="flex items-center gap-4">
          <Avatar brand alt="교사" size={56} />
          <Avatar gender="male" alt="남학생" size={48} />
          <Avatar gender="female" alt="여학생" size={48} />
          <Avatar fallback="김민" alt="이니셜" size={40} />
        </div>
      );
    case "empty":
      return (
        <EmptyState
          title="아직 문서가 없습니다"
          description="자주 쓰는 공문 양식부터 만들어 보세요."
          actionLabel="새 문서 만들기"
          actionHref="/templates/new"
        />
      );
    case "skeleton":
      return (
        <div className="max-w-md">
          <SkeletonListRows count={3} />
        </div>
      );
    case "controls":
      return <DsControlsDemo />;
    case "checkbox":
      return <DsCheckboxDemo />;
    case "radio":
      return <DsRadioDemo />;
    case "switch":
      return <DsSwitchDemo />;
    case "select":
      return <DsSelectDemo />;
    case "tabs":
      return <DsTabsDemo />;
    case "menu":
      return <DsMenuDemo />;
    case "progress":
      return <DsProgressDemo />;
    case "segmented":
      return <DsSegmentedDemo />;
    case "list":
      return <DsListDemo />;
    case "loading":
      return <DsLoadingDemo />;
    case "accordion":
      return <DsAccordionDemo />;
    case "divider":
      return <DsDividerDemo />;
    case "page-banner":
      return <DsPageBannerDemo />;
    case "help-bubble":
      return <DsHelpBubbleDemo />;
    case "reaction":
      return <DsReactionDemo />;
    case "tag-group":
      return <DsTagGroupDemo />;
    case "fab":
      return <DsFabDemo />;
    case "badge":
      return (
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-brand-muted px-2 py-0.5 text-xs font-medium text-brand-ink">
            제출 완료
          </span>
          <span className="rounded-md border border-line bg-surface-elevated px-2 py-0.5 text-xs font-medium text-ink-secondary">
            작성 중
          </span>
          <span className="relative inline-flex">
            <CrepassIcon name="bell" size={24} />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-white">
              3
            </span>
          </span>
        </div>
      );
    case "icons":
      return (
        <div className="space-y-8">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Line (Top Navigation · 기본)
            </p>
            <p className="mb-3 text-xs text-ink-muted">
              Seed: 상단 내비·본문 UI는 Line. 배경 네모 없음.
            </p>
            <div className="flex flex-wrap gap-4 text-ink">
              {CREPASS_ICON_NAMES.slice(0, 12).map((name) => (
                <div
                  key={`line-${name}`}
                  className="flex flex-col items-center gap-1"
                >
                  <CrepassIcon name={name} size={24} weight="line" />
                  <span className="text-[10px] text-ink-muted">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Fill (≤15px · 컨테이너 · 탭)
            </p>
            <p className="mb-3 text-xs text-ink-muted">
              Seed: 작은 사이즈·버튼/칩 안·하단 탭은 Fill.
            </p>
            <div className="flex flex-wrap gap-4 text-ink">
              {CREPASS_ICON_NAMES.slice(0, 12).map((name) => (
                <div
                  key={`fill-${name}`}
                  className="flex flex-col items-center gap-1"
                >
                  <CrepassIcon name={name} size={24} weight="fill" />
                  <span className="text-[10px] text-ink-muted">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-ink">Size scale</p>
            <div className="flex flex-wrap items-end gap-4 text-ink">
              {[12, 14, 16, 20, 22, 24].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <CrepassIcon name="home" size={s} />
                  <span className="font-mono text-[10px] text-ink-muted">
                    {s}px
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "color": {
      const swatches = [
        { name: "Ink", hex: COLOR.ink },
        { name: "Secondary", hex: COLOR.inkSecondary },
        { name: "Surface", hex: COLOR.surface },
        { name: "Card", hex: COLOR.surfaceCard },
        { name: "Border", hex: COLOR.border },
        { name: "Brand", hex: COLOR.brand },
        { name: "Muted", hex: COLOR.brandMuted },
        { name: "Danger", hex: COLOR.danger },
      ];
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div
              key={s.name}
              className="overflow-hidden rounded-md border border-line"
            >
              <div className="h-14" style={{ background: s.hex }} />
              <div className="bg-surface-card px-2 py-1.5">
                <p className="text-xs font-medium text-ink">{s.name}</p>
                <p className="font-mono text-[10px] text-ink-muted">{s.hex}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "type":
      return (
        <div className="space-y-3">
          {(
            [
              ["h1", TYPE.h1],
              ["h2", TYPE.h2],
              ["h3", TYPE.h3],
              ["body", TYPE.body],
              ["caption", TYPE.caption],
            ] as const
          ).map(([name, t]) => (
            <div
              key={name}
              className="flex flex-wrap items-baseline gap-3 border-b border-line pb-2"
            >
              <span className="w-20 shrink-0 font-mono text-xs text-ink-muted">
                {name}
              </span>
              <span
                style={{
                  fontSize: t.size,
                  lineHeight: `${t.line}px`,
                  fontWeight: t.weight,
                }}
              >
                담임 업무를 부드럽게
              </span>
            </div>
          ))}
        </div>
      );
    case "spacing":
      return (
        <div className="flex flex-wrap items-end gap-3">
          {Object.entries(SPACE).map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-1">
              <div
                className="rounded-sm bg-brand-muted"
                style={{ width: v, height: v }}
              />
              <span className="font-mono text-[10px] text-ink-muted">
                {k}/{v}
              </span>
            </div>
          ))}
        </div>
      );
    case "elevation":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(ELEVATION).map(([key, val]) => (
            <div
              key={key}
              className="rounded-md border border-line bg-surface-card p-4"
              style={{ boxShadow: val.shadow }}
            >
              <p className="text-sm font-medium text-ink">{key}</p>
              <p className="mt-1 text-xs text-ink-muted">{val.use}</p>
            </div>
          ))}
        </div>
      );
    case "motion":
      return (
        <div className="flex flex-wrap gap-3">
          {Object.entries(MOTION.duration).map(([key, val]) => (
            <button
              key={key}
              type="button"
              className="ds-motion-chip rounded-md border border-line bg-surface-card px-3 py-2 text-sm text-ink"
              style={{ transitionDuration: val.css }}
            >
              {key} · {val.ms}ms
            </button>
          ))}
        </div>
      );
    case "card":
      return <DsCardDemo />;
    default:
      return null;
  }
}
