import React from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import CrepassIcon from "@/components/ui/CrepassIcon";

/**
 * 채점 — CrepassIcon 액션 아이콘
 */
export default function EvaluationPage() {
  const inProgress: { id: string; title: string; progress: number }[] = [];

  return (
    <MainLayout>
      <div className="cp-page">
        <PageHeader
          title="채점"
          crumbs={[{ label: "홈", href: "/" }, { label: "채점" }]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="cp-card">
            <div className="mb-4 flex items-center gap-3 text-ink">
              <CrepassIcon name="add" size={22} weight="fill" />
              <h2 className="cp-h3">새 채점</h2>
            </div>
            <p className="mb-4 text-sm text-ink-muted">
              답안지를 올리고 채점을 시작합니다.
            </p>
            <div className="space-y-2">
              <Link href="/evaluation/new" className="cp-btn-primary w-full">
                답안지 업로드
              </Link>
              <Link
                href="/evaluation/rubric"
                className="cp-btn-secondary w-full"
              >
                채점 기준 설정
              </Link>
            </div>
          </section>

          <section className="cp-card">
            <div className="mb-4 flex items-center gap-3 text-ink">
              <CrepassIcon name="calendar" size={22} weight="fill" />
              <h2 className="cp-h3">진행 중</h2>
            </div>
            {inProgress.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-muted">
                진행 중인 채점이 없습니다
              </p>
            ) : (
              <ul className="space-y-2">
                {inProgress.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md border border-line px-3 py-2 text-sm text-ink"
                  >
                    {item.title}
                    <span className="cp-caption ml-2">{item.progress}%</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section>
          <h2 className="cp-h2 mb-4">최근 채점</h2>
          <EmptyState
            title="아직 채점 기록이 없습니다"
            description="새 채점을 시작하면 여기에 기록이 쌓입니다."
            actionLabel="답안지 업로드"
            actionHref="/evaluation/new"
            icon="grading"
          />
        </section>

        <p className="mt-8 flex items-center gap-2 cp-caption">
          <CrepassIcon name="clipboard" size={18} />
          채점 결과는 추후 학생·성적 메뉴와 연결될 예정입니다.
        </p>
      </div>
    </MainLayout>
  );
}
