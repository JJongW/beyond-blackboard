"use client";

import React from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Accordion from "@/components/ui/Accordion";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import ActionButton from "@/components/ui/ActionButton";
import HelpBubble from "@/components/ui/HelpBubble";
import Badge from "@/components/ui/Badge";
import { evaluationJobStore } from "@/lib/workspace/evaluationJobStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 채점 — 로컬 작업 목록 + FAQ
 */
export default function EvaluationPage() {
  const { jobs } = useSingletonStore(evaluationJobStore);
  const inProgress = jobs.filter((j) => j.status === "in_progress");
  const completed = jobs.filter((j) => j.status === "completed");

  return (
    <MainLayout>
      <div className="cp-page">
        <PageHeader
          title="채점"
          crumbs={[{ label: "홈", href: "/" }, { label: "채점" }]}
          actions={
            <HelpBubble content="답안지를 올린 뒤 루브릭 기준으로 채점합니다." />
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card as="section">
            <div className="mb-4 flex items-center gap-3 text-ink">
              <CrepassIcon name="add" sizeToken="xl" weight="fill" />
              <h2 className="cp-h3">새 채점</h2>
            </div>
            <p className="mb-4 text-sm text-ink-muted">
              답안지를 올리고 채점을 시작합니다.
            </p>
            <div className="space-y-2">
              <ActionButton
                variant="brandSolid"
                width="fill"
                href="/evaluation/new"
              >
                답안지 업로드
              </ActionButton>
              <ActionButton
                variant="neutralWeak"
                width="fill"
                href="/evaluation/rubric"
              >
                채점 기준 설정
              </ActionButton>
            </div>
          </Card>

          <Card as="section">
            <div className="mb-4 flex items-center gap-3 text-ink">
              <CrepassIcon name="calendar" sizeToken="xl" weight="fill" />
              <h2 className="cp-h3">진행 중</h2>
            </div>
            {inProgress.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-muted">
                진행 중인 채점이 없습니다
              </p>
            ) : (
              <ul className="space-y-2">
                {inProgress.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/evaluation/${item.id}`}
                      className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm text-ink hover:border-line-strong hover:bg-surface-elevated"
                    >
                      <span className="truncate">{item.title}</span>
                      <Badge tone="warning" size="small">
                        {item.progress}%
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Divider label="최근" className="mb-6" />

        <section>
          <h2 className="cp-h2 mb-4">최근 채점</h2>
          {completed.length === 0 ? (
            <EmptyState
              title="아직 채점 기록이 없습니다"
              description="새 채점을 시작하면 여기에 기록이 쌓입니다."
              actionLabel="답안지 업로드"
              actionHref="/evaluation/new"
              icon="grading"
            />
          ) : (
            <ul className="space-y-2">
              {completed.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/evaluation/${item.id}`}
                    className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm hover:border-line-strong hover:bg-surface-elevated"
                  >
                    <span>
                      <span className="font-medium text-ink">{item.title}</span>
                      {item.score != null && (
                        <span className="cp-caption ml-2">{item.score}점</span>
                      )}
                    </span>
                    <Badge tone="brand" size="small">
                      완료
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Divider label="도움말" className="my-8" />

        <section>
          <h2 className="cp-h2 mb-4">자주 묻는 질문</h2>
          <Accordion
            exclusive
            items={[
              {
                id: "upload",
                title: "어떤 파일을 올릴 수 있나요?",
                defaultOpen: true,
                content:
                  "이미지·PDF를 고를 수 있습니다. 데모에서는 파일명만 저장됩니다.",
              },
              {
                id: "rubric",
                title: "채점 기준은 어디서 만드나요?",
                content: (
                  <p>
                    <Link href="/evaluation/rubric" className="cp-link">
                      채점 기준 설정
                    </Link>
                    에서 루브릭을 구성합니다.
                  </p>
                ),
              },
              {
                id: "sync",
                title: "성적·학생 메뉴와 연결되나요?",
                content: (
                  <p>
                    채점 완료 시 선택한 학생의{" "}
                    <Link href="/grades" className="cp-link">
                      성적
                    </Link>
                    이 로컬에서 갱신됩니다.
                  </p>
                ),
              },
            ]}
          />
        </section>
      </div>
    </MainLayout>
  );
}
