"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import EmptyState from "@/components/ui/EmptyState";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Field from "@/components/ui/Field";
import { ClassPeriod } from "@/types";
import { parseISODateLocal, todayISODate } from "@/constants/attendanceMock";
import { periodStore } from "@/lib/workspace/periodStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";
import { ICON_SIZE } from "@/components/ui/CrepassIcon";

function statusLabel(period: ClassPeriod) {
  if (period.attendanceCount === period.totalStudents) return "완료";
  if (period.attendanceCount > period.totalStudents * 0.8) return "진행";
  return "미완료";
}

function toISODate(date: Date) {
  return todayISODate(date);
}

/**
 * 출결 목록 — periodStore 연동 + 교시 추가 폼
 */
export default function AttendancePage() {
  const router = useRouter();
  const { periods } = useSingletonStore(periodStore);
  const [currentDate, setCurrentDate] = useState(() =>
    parseISODateLocal(todayISODate()),
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [periodNum, setPeriodNum] = useState(4);
  const [startTime, setStartTime] = useState("13:00");
  const [endTime, setEndTime] = useState("13:50");
  const [formError, setFormError] = useState<string | null>(null);

  const selectedISO = toISODate(currentDate);
  const visiblePeriods = useMemo(
    () => periods.filter((p) => p.date === selectedISO),
    [periods, selectedISO],
  );

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

  const openCreate = () => {
    setSubject("");
    setPeriodNum(
      Math.min(8, Math.max(1, ...visiblePeriods.map((p) => p.period), 0) + 1),
    );
    setStartTime("13:00");
    setEndTime("13:50");
    setFormError(null);
    setShowCreateModal(true);
  };

  const onCreate = () => {
    const result = periodStore.add({
      subject,
      period: periodNum,
      date: selectedISO,
      startTime,
      endTime,
    });
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setShowCreateModal(false);
    router.push(`/attendance/${result.period.id}`);
  };

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
              <CrepassIcon name="chevron-left" size={ICON_SIZE.inline} />
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
              <CrepassIcon name="chevron-right" size={ICON_SIZE.inline} />
            </button>
          </div>
        </div>

        {visiblePeriods.length > 0 ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="cp-h2">오늘의 수업</h2>
              <button
                type="button"
                onClick={openCreate}
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
                      <CrepassIcon name="students" size={ICON_SIZE.inline} />
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
            onAction={openCreate}
          />
        )}

        {showCreateModal && (
          <div className="cp-scrim fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="cp-floating-surface w-full max-w-md rounded-md border border-line p-6 shadow-float"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-period-title"
            >
              <h3 id="create-period-title" className="cp-h3 mb-2">
                새 교시
              </h3>
              <p className="mb-4 text-sm text-ink-muted">
                {formatDate(currentDate)} 일정에 교시를 추가합니다.
              </p>
              <div className="space-y-4">
                <Field
                  label="과목"
                  htmlFor="period-subject"
                  error={formError?.includes("과목") ? formError : undefined}
                >
                  <input
                    id="period-subject"
                    className="cp-input w-full"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="예: 과학"
                  />
                </Field>
                <Field label="교시" htmlFor="period-num">
                  <input
                    id="period-num"
                    type="number"
                    min={1}
                    max={8}
                    className="cp-input w-28"
                    value={periodNum}
                    onChange={(e) => setPeriodNum(Number(e.target.value) || 1)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="시작" htmlFor="period-start">
                    <input
                      id="period-start"
                      className="cp-input w-full"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="13:00"
                    />
                  </Field>
                  <Field label="종료" htmlFor="period-end">
                    <input
                      id="period-end"
                      className="cp-input w-full"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="13:50"
                    />
                  </Field>
                </div>
                {formError && !formError.includes("과목") && (
                  <p className="text-sm text-[var(--cp-danger)]" role="alert">
                    {formError}
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cp-btn-ghost"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={onCreate}
                  className="cp-btn-primary"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
