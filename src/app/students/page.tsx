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
import Dialog from "@/components/ui/Dialog";
import ReactionButton from "@/components/ui/ReactionButton";
import TagGroup from "@/components/ui/TagGroup";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import HelpBubble from "@/components/ui/HelpBubble";
import Card from "@/components/ui/Card";
import InputButton from "@/components/ui/InputButton";
import MenuSheet from "@/components/ui/MenuSheet";
import ImageFrame from "@/components/ui/ImageFrame";
import Field from "@/components/ui/Field";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import Select from "@/components/ui/Select";
import { studentAvatarSrc } from "@/constants/designTokens";
import { studentStore } from "@/lib/workspace/studentStore";
import { gradeStore } from "@/lib/workspace/gradeStore";
import { useSingletonStore } from "@/lib/workspace/useSingletonStore";

/**
 * 학생 관리 — studentStore + 등록 Dialog
 */
export default function StudentsPage() {
  const { students } = useSingletonStore(studentStore);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("전체");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [snack, setSnack] = useState(false);

  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [grade, setGrade] = useState("3");
  const [className, setClassName] = useState("3-1");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [formError, setFormError] = useState<string | null>(null);

  const openAdd = () => {
    setName("");
    setStudentNumber("");
    setGrade("3");
    setClassName("3-1");
    setGender("male");
    setFormError(null);
    setShowAddModal(true);
  };

  const onAdd = () => {
    const result = studentStore.add({
      name,
      studentNumber,
      grade: Number(grade),
      className,
      gender,
    });
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    gradeStore.syncStudents();
    setShowAddModal(false);
    setSnack(true);
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
            <div className="flex items-center gap-2">
              <HelpBubble content="학년 Chip으로 필터하고, 별표로 즐겨찾기를 표시합니다." />
              <button
                type="button"
                className="cp-btn-secondary !py-1.5 !px-3 !text-sm sm:hidden"
                onClick={() => setSheetOpen(true)}
              >
                더보기
              </button>
            </div>
          }
        />

        <Callout
          tone="informative"
          icon="students"
          className="mb-6"
          title="필터"
        >
          학년 Chip으로 좁히고, 카드/리스트는 Segmented Control로 전환합니다.
          등록한 학생은 이 브라우저에 보관됩니다.
        </Callout>

        <div className="cp-card mb-6 !p-4">
          <div className="flex flex-col gap-4">
            <InputButton
              label="학생 검색"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="이름, 학번, 반"
              buttonLabel="검색"
              onSubmit={() => undefined}
            />

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
            actionLabel="학생 등록"
            onAction={openAdd}
          />
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} as="article" className="!p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="w-16 overflow-hidden rounded-full">
                    <ImageFrame
                      src={student.avatar ?? studentAvatarSrc(student.gender)}
                      alt=""
                      width={64}
                      height={64}
                      ratio="1/1"
                      className="!rounded-full"
                    />
                  </div>
                  <ReactionButton
                    pressed={!!student.isFavorite}
                    onChange={() => studentStore.toggleFavorite(student.id)}
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
                      onChange={() => studentStore.toggleFavorite(student.id)}
                      size={20}
                    />
                  </div>
                }
              />
            ))}
          </List>
        )}

        <FloatingActionButton label="학생 등록" onClick={openAdd} />

        <MenuSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="학생 메뉴"
          items={[
            {
              id: "add",
              label: "학생 등록",
              icon: <CrepassIcon name="add" sizeToken="inline" />,
              onSelect: openAdd,
            },
            {
              id: "card",
              label: "카드 보기",
              onSelect: () => setViewMode("card"),
            },
            {
              id: "list",
              label: "리스트 보기",
              onSelect: () => setViewMode("list"),
            },
          ]}
        />

        <Dialog
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="새 학생 등록"
          actions={
            <>
              <ActionButton
                variant="ghost"
                onClick={() => setShowAddModal(false)}
              >
                취소
              </ActionButton>
              <ActionButton variant="brandSolid" onClick={onAdd}>
                등록
              </ActionButton>
            </>
          }
        >
          <div className="space-y-4">
            <Field
              label="이름"
              htmlFor="stu-name"
              error={formError?.includes("이름") ? formError : undefined}
            >
              <input
                id="stu-name"
                className="cp-input w-full"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError(null);
                }}
              />
            </Field>
            <Field
              label="학번"
              htmlFor="stu-number"
              error={
                formError && !formError.includes("이름") ? formError : undefined
              }
            >
              <input
                id="stu-number"
                className="cp-input w-full"
                value={studentNumber}
                onChange={(e) => {
                  setStudentNumber(e.target.value);
                  if (formError) setFormError(null);
                }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="학년" htmlFor="stu-grade">
                <Select
                  id="stu-grade"
                  value={grade}
                  onChange={setGrade}
                  options={["1", "2", "3", "4", "5", "6"].map((g) => ({
                    value: g,
                    label: `${g}학년`,
                  }))}
                />
              </Field>
              <Field label="반" htmlFor="stu-class">
                <input
                  id="stu-class"
                  className="cp-input w-full"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="3-1"
                />
              </Field>
            </div>
            <Field label="구분" htmlFor="stu-gender">
              <Select
                id="stu-gender"
                value={gender}
                onChange={setGender}
                options={[
                  { value: "male", label: "남" },
                  { value: "female", label: "여" },
                ]}
              />
            </Field>
          </div>
        </Dialog>

        <Snackbar
          open={snack}
          message="학생을 등록했습니다."
          tone="positive"
          onClose={() => setSnack(false)}
        />
      </main>
    </MainLayout>
  );
}
