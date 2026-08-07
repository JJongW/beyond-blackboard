"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Chip from "@/components/ui/Chip";
import Callout from "@/components/ui/Callout";
import EmptyState from "@/components/ui/EmptyState";
import Avatar from "@/components/ui/Avatar";
import SegmentedControl from "@/components/ui/SegmentedControl";
import List, { ListItem } from "@/components/ui/List";
import { AlertDialog } from "@/components/ui/Dialog";
import ReactionButton from "@/components/ui/ReactionButton";
import TagGroup from "@/components/ui/TagGroup";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import HelpBubble from "@/components/ui/HelpBubble";
import Card from "@/components/ui/Card";
import { Student } from "@/types";
import { studentAvatarSrc } from "@/constants/designTokens";

/**
 * 학생 관리 — SegmentedControl / Avatar / List / AlertDialog 연결
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

  const grades = ["전체", "1", "2", "3"];

  return (
    <MainLayout>
      <main className="cp-page">
        <PageHeader
          title="학생"
          description={`${filteredStudents.length}명`}
          crumbs={[{ label: "홈", href: "/" }, { label: "학생" }]}
          actions={
            <HelpBubble content="학년 Chip으로 필터하고, 별표로 즐겨찾기를 표시합니다." />
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
          <SegmentedControl
            aria-label="보기 방식"
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "card", label: "카드" },
              { value: "list", label: "리스트" },
            ]}
          />
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
              <Card key={student.id} as="article" className="!p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Avatar
                    src={student.avatar}
                    gender={student.gender}
                    alt=""
                    size={48}
                  />
                  <ReactionButton
                    pressed={!!student.isFavorite}
                    onChange={() => toggleFavorite(student.id)}
                  />
                </div>
                <h2 className="cp-h3">{student.name}</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {student.class} · {student.studentNumber}
                </p>
                <TagGroup tags={student.tags} className="mt-3" />
              </Card>
            ))}
          </div>
        ) : (
          <List>
            {filteredStudents.map((student) => (
              <ListItem
                key={student.id}
                leading={
                  <Avatar
                    src={student.avatar}
                    gender={student.gender}
                    alt=""
                    size={40}
                  />
                }
                title={student.name}
                description={`${student.class} · ${student.studentNumber}`}
                trailing={
                  <div className="flex items-center gap-2">
                    <TagGroup
                      tags={student.tags}
                      max={2}
                      className="hidden sm:flex"
                    />
                    <ReactionButton
                      pressed={!!student.isFavorite}
                      onChange={() => toggleFavorite(student.id)}
                      size={20}
                    />
                  </div>
                }
              />
            ))}
          </List>
        )}

        <FloatingActionButton
          label="학생 등록"
          onClick={() => setShowAddModal(true)}
        />

        <AlertDialog
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="새 학생 등록"
          description="학생 등록은 곧 연결됩니다. 지금은 미리보기입니다."
          confirmLabel="확인"
          cancelLabel="닫기"
          onConfirm={() => setShowAddModal(false)}
        />
      </main>
    </MainLayout>
  );
}
