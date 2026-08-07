"use client";

import React, { useState } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Chip from "@/components/ui/Chip";
import Badge from "@/components/ui/Badge";
import Callout from "@/components/ui/Callout";
import EmptyState from "@/components/ui/EmptyState";
import { Student } from "@/types";
import { studentAvatarSrc } from "@/constants/designTokens";

/**
 * 학생 관리 — Seed Chip / Badge / Segmented / Empty / Dialog 톤 적용
 * 아바타·서비스 스티커는 유지, UI 아이콘은 투명 글리프
 */
export default function StudentsPage() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("전체");
  const [showAddModal, setShowAddModal] = useState(false);

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "홍길동",
      studentNumber: "202401001",
      class: "1-2",
      grade: 1,
      gender: "male",
      tags: ["도움필요", "수학우수"],
      isFavorite: true,
      avatar: studentAvatarSrc("male"),
    },
    {
      id: "2",
      name: "김철수",
      studentNumber: "202402001",
      class: "2-1",
      grade: 2,
      gender: "male",
      tags: ["우수", "리더십"],
      isFavorite: false,
      avatar: studentAvatarSrc("male"),
    },
    {
      id: "3",
      name: "이영희",
      studentNumber: "202401002",
      class: "1-2",
      grade: 1,
      gender: "female",
      tags: ["성실", "예술"],
      isFavorite: true,
      avatar: studentAvatarSrc("female"),
    },
    {
      id: "4",
      name: "박민수",
      studentNumber: "202403001",
      class: "3-1",
      grade: 3,
      gender: "male",
      tags: ["체육우수"],
      isFavorite: false,
      avatar: studentAvatarSrc("male"),
    },
  ]);

  const toggleFavorite = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, isFavorite: !s.isFavorite } : s,
      ),
    );
  };

  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(q) ||
      student.studentNumber.includes(searchQuery) ||
      student.class.includes(searchQuery);
    const matchesGrade =
      selectedGrade === "전체" || student.grade === parseInt(selectedGrade, 10);
    return matchesSearch && matchesGrade;
  });

  const avatarFor = (student: Student) =>
    student.avatar ?? studentAvatarSrc(student.gender);

  const grades = ["전체", "1", "2", "3"];

  return (
    <MainLayout>
      <main className="cp-page">
        <PageHeader
          title="학생"
          description={`${filteredStudents.length}명`}
          crumbs={[{ label: "홈", href: "/" }, { label: "학생" }]}
          actions={
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="cp-btn-primary"
            >
              <CrepassIcon name="add" size={18} className="text-white" />
              학생 등록
            </button>
          }
        />

        <Callout
          tone="informative"
          icon="students"
          className="mb-6"
          title="필터"
        >
          학년 Chip으로 좁히고, 카드/리스트는 Segmented Control로 전환합니다.
        </Callout>

        <div className="cp-card mb-6 !p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted">
                <CrepassIcon name="search" size={20} />
              </span>
              <input
                type="search"
                placeholder="이름, 학번, 반 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cp-input pl-10"
                aria-label="학생 검색"
              />
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="학년"
            >
              {grades.map((g) => (
                <Chip
                  key={g}
                  selected={selectedGrade === g}
                  onClick={() => setSelectedGrade(g)}
                >
                  {g === "전체" ? "전체 학년" : `${g}학년`}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            총 {filteredStudents.length}명
          </p>
          {/* Seed Segmented Control */}
          <div
            className="inline-flex rounded-md border border-line bg-surface-elevated p-1"
            role="tablist"
            aria-label="보기 방식"
          >
            {(
              [
                ["card", "카드"],
                ["list", "리스트"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={viewMode === mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-surface-card text-ink shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <EmptyState
            icon="students"
            title="검색 결과가 없습니다"
            description="다른 검색어나 학년 필터를 시도해 보세요."
          />
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStudents.map((student) => (
              <article key={student.id} className="cp-card !p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Image
                    src={avatarFor(student)}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full border border-line object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(student.id)}
                    aria-label={
                      student.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
                    }
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-elevated ${
                      student.isFavorite ? "text-brand" : "text-ink-muted"
                    }`}
                  >
                    <CrepassIcon
                      name={student.isFavorite ? "star" : "star-outline"}
                      size={22}
                    />
                  </button>
                </div>
                <h2 className="cp-h3">{student.name}</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {student.class} · {student.studentNumber}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {student.tags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <ul className="cp-card !p-0 divide-y divide-line overflow-hidden">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-elevated"
              >
                <Image
                  src={avatarFor(student)}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full border border-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{student.name}</p>
                  <p className="text-sm text-ink-muted">
                    {student.class} · {student.studentNumber}
                  </p>
                </div>
                <div className="hidden flex-wrap gap-1 sm:flex">
                  {student.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(student.id)}
                  aria-label={
                    student.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
                  }
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${
                    student.isFavorite ? "text-brand" : "text-ink-muted"
                  }`}
                >
                  <CrepassIcon
                    name={student.isFavorite ? "star" : "star-outline"}
                    size={20}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Seed Alert Dialog 톤 — 스크림 + 확인 */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            role="presentation"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="cp-panel-overlay w-full max-w-md p-6"
              role="dialog"
              aria-modal
              aria-labelledby="add-student-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="add-student-title" className="cp-h3">
                새 학생 등록
              </h3>
              <p className="mt-2 text-sm text-ink-secondary">
                학생 등록은 곧 연결됩니다. 지금은 미리보기입니다.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="cp-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  닫기
                </button>
                <button
                  type="button"
                  className="cp-btn-primary"
                  onClick={() => setShowAddModal(false)}
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
