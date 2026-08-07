"use client";

import React, { useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import EmptyState from "@/components/ui/EmptyState";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import { ClassPeriod } from "@/types";
import {
  getMockClassPeriods,
  parseISODateLocal,
  todayISODate,
} from "@/constants/attendanceMock";

function statusLabel(period: ClassPeriod) {
  if (period.attendanceCount === period.totalStudents) return "완료";
  if (period.attendanceCount > period.totalStudents * 0.8) return "진행";
  return "미완료";
}

function toISODate(date: Date) {
  return todayISODate(date);
}

/**
 * 출결 목록 — FA 제거, EmptyState, 토큰 카드
 * 날짜: 데모 교시와 동일한 로컬 오늘을 기준으로 맞춤 (상세 페이지와 동기)
 */
export default function AttendancePage() {
  // mock 교시 날짜와 동일한 오늘로 초기화 — 헤더·카드·상세가 어긋나지 않게
  const [currentDate, setCurrentDate] = useState(() =>
    parseISODateLocal(todayISODate()),
  );
  const [classPeriods] = useState<ClassPeriod[]>(() => getMockClassPeriods());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedISO = toISODate(currentDate);
  // 선택한 날짜의 교시만 표시 (다른 날은 EmptyState)
  const visiblePeriods = classPeriods.filter((p) => p.date === selectedISO);

  const navigateDate = (direction: "prev" | "next") => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + (direction === "prev" ? -1 : 1));
    setCurrentDate(next);
  };

  const formatCurrentTime = () =>
    new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  return (
    <MainLayout>
      <main className="cp-page">
        <PageHeader
          title="출결"
          crumbs={[{ label: "홈", href: "/" }, { label: "출결" }]}
        />

        <div className="cp-card mb-6">
          <div className="mb-4 flex items-center gap-3">
            <p className="text-xl font-semibold text-ink">
              {formatCurrentTime()}
            </p>
            <p className="text-sm text-ink-muted">현재</p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigateDate("prev")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line hover:bg-surface"
              aria-label="이전 날"
            >
              <CrepassIcon name="chevron-left" size={22} />
            </button>
            <p className="text-sm font-medium text-ink">
              {formatDate(currentDate)}
            </p>
            <button
              type="button"
              onClick={() => navigateDate("next")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line hover:bg-surface"
              aria-label="다음 날"
            >
              <CrepassIcon name="chevron-right" size={22} />
            </button>
          </div>
        </div>

        {visiblePeriods.length > 0 ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="cp-h2">오늘의 수업</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="cp-btn-primary !py-2 !px-3"
              >
                <CrepassIcon name="add" size={20} className="text-white" />
                교시 추가
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visiblePeriods.map((period) => (
                <Link
                  key={period.id}
                  href={`/attendance/${period.id}`}
                  className="cp-card block transition-colors hover:border-line-strong"
                >
                  <div className="mb-3 flex items-center justify-between cp-caption">
                    <span>{period.period}교시</span>
                    <span>
                      {period.startTime}–{period.endTime}
                    </span>
                  </div>
                  <h3 className="cp-h3 mb-4">{period.subject}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-ink-muted">
                      {/* UserGroupIcon → students 파스텔 아이콘 */}
                      <CrepassIcon name="students" size={18} />
                      {period.attendanceCount}/{period.totalStudents}
                    </span>
                    <Badge
                      tone={
                        statusLabel(period) === "완료"
                          ? "brand"
                          : statusLabel(period) === "진행"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {statusLabel(period)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            title="오늘의 수업이 없습니다"
            description="교시를 추가하면 출결을 기록할 수 있습니다."
            actionLabel="교시 추가"
            onAction={() => setShowCreateModal(true)}
          />
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
            <div
              className="w-full max-w-md rounded-md border border-line bg-surface-card p-6 shadow-float"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-period-title"
            >
              <h3 id="create-period-title" className="cp-h3 mb-2">
                새 교시
              </h3>
              <p className="mb-6 text-sm text-ink-muted">
                교시 생성 기능은 준비 중입니다.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cp-btn-ghost"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cp-btn-primary"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
