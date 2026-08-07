"use client";

import React, { useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Chip from "@/components/ui/Chip";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import type { CrepassIconName } from "@/constants/designSystemNav";

interface RecordTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  recentlyUsed: boolean;
}

const RECORD_TEMPLATES: RecordTemplate[] = [
  {
    id: "subject-details",
    title: "과목별 세부특기사항",
    description: "과목별 학업 성취도와 특기사항 기록",
    category: "academic",
    recentlyUsed: true,
  },
  {
    id: "creative-activities",
    title: "창의적 체험활동",
    description: "자율·동아리·봉사·진로활동 기록",
    category: "experience",
    recentlyUsed: false,
  },
  {
    id: "behavior-opinion",
    title: "행동특성 및 종합의견",
    description: "행동 특성과 학교생활 종합 의견",
    category: "behavior",
    recentlyUsed: true,
  },
  {
    id: "career-activities",
    title: "진로활동 기록",
    description: "진로 탐색 과정과 관련 활동",
    category: "career",
    recentlyUsed: false,
  },
  {
    id: "reading-activities",
    title: "독서활동 기록",
    description: "독서 이력과 독후 활동",
    category: "reading",
    recentlyUsed: false,
  },
  {
    id: "club-activities",
    title: "동아리활동 기록",
    description: "동아리 활동 내용과 성과",
    category: "experience",
    recentlyUsed: true,
  },
];

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: CrepassIconName }
> = {
  academic: { label: "교과", icon: "notebook" },
  experience: { label: "체험", icon: "crayon" },
  behavior: { label: "행동", icon: "user" },
  career: { label: "진로", icon: "clipboard" },
  reading: { label: "독서", icon: "records" },
};

/**
 * 생기부 목록 — Chip 필터 + Badge + EmptyState 통일
 */
export default function RecordsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates =
    selectedCategory === "all"
      ? RECORD_TEMPLATES
      : RECORD_TEMPLATES.filter((t) => t.category === selectedCategory);

  const categoryCounts: Record<"all" | keyof typeof CATEGORY_CONFIG, number> = {
    all: RECORD_TEMPLATES.length,
    academic: RECORD_TEMPLATES.filter((t) => t.category === "academic").length,
    experience: RECORD_TEMPLATES.filter((t) => t.category === "experience")
      .length,
    behavior: RECORD_TEMPLATES.filter((t) => t.category === "behavior").length,
    career: RECORD_TEMPLATES.filter((t) => t.category === "career").length,
    reading: RECORD_TEMPLATES.filter((t) => t.category === "reading").length,
  };

  return (
    <MainLayout>
      <main className="cp-page">
        <PageHeader
          title="생기부"
          description={`템플릿 ${RECORD_TEMPLATES.length}개`}
          crumbs={[{ label: "홈", href: "/" }, { label: "생기부" }]}
        />

        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="카테고리"
        >
          <Chip
            selected={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          >
            전체 ({categoryCounts.all})
          </Chip>
          {(
            Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>
          ).map((key) => (
            <Chip
              key={key}
              selected={selectedCategory === key}
              onClick={() => setSelectedCategory(key)}
              prefix={
                <CrepassIcon
                  name={CATEGORY_CONFIG[key].icon}
                  size={14}
                  className="text-inherit"
                />
              }
            >
              {CATEGORY_CONFIG[key].label} ({categoryCounts[key]})
            </Chip>
          ))}
        </div>

        {filteredTemplates.length === 0 ? (
          <EmptyState
            icon="records"
            title="해당 카테고리 템플릿이 없습니다"
            description="다른 카테고리를 선택해 보세요."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => {
              const config = CATEGORY_CONFIG[template.category];
              const iconName = config?.icon ?? "notebook";

              return (
                <Link
                  key={template.id}
                  href={`/records/${template.id}`}
                  className="block group"
                >
                  <div className="cp-card h-full flex flex-col justify-between transition-colors hover:border-line-strong group-active:scale-[0.99]">
                    <div>
                      <div className="mb-4 text-ink-secondary">
                        <CrepassIcon name={iconName} size={24} weight="fill" />
                      </div>
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="cp-h3 line-clamp-2">{template.title}</h3>
                        {template.recentlyUsed && (
                          <Badge tone="brand" size="small">
                            최근
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-ink-muted line-clamp-2">
                        {template.description}
                      </p>
                      {config && (
                        <p className="cp-caption mt-3">{config.label}</p>
                      )}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-sm font-medium text-brand">
                        작성
                      </span>
                      <CrepassIcon name="chevron-right" size={18} />
                    </div>
                  </div>
                </Link>
              );
            })}

            <Link href="/records/new" className="block group min-h-[200px]">
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-line-strong bg-surface px-6 py-8 text-center transition-colors hover:border-brand hover:bg-brand-muted/40">
                <div className="mb-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                  <CrepassIcon name="add" size={40} />
                </div>
                <h3 className="cp-h3">템플릿 요청</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  필요한 양식 요청하기
                </p>
              </div>
            </Link>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
