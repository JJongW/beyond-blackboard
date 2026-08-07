"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";
import ProgressCircle from "@/components/ui/ProgressCircle";
import TimePicker from "@/components/ui/TimePicker";
import QuantityPicker from "@/components/ui/QuantityPicker";
import SidePanel from "@/components/ui/SidePanel";
import ScrollFog from "@/components/ui/ScrollFog";
import IdentityPlaceholder from "@/components/ui/IdentityPlaceholder";
import { ClassPeriod, Student, AttendanceStatus } from "@/types";
import { studentAvatarSrc } from "@/constants/designTokens";

const mockClassPeriod: ClassPeriod = {
  id: "1",
  subject: "수학",
  period: 1,
  date: "2024-08-15",
  startTime: "09:00",
  endTime: "09:50",
  attendanceCount: 28,
  totalStudents: 30,
};

const mockStudents: Student[] = [
  {
    id: "1",
    name: "김민준",
    studentNumber: "20240001",
    class: "3-1",
    grade: 3,
    gender: "male",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "2",
    name: "이서윤",
    studentNumber: "20240002",
    class: "3-1",
    grade: 3,
    gender: "female",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("female"),
  },
  {
    id: "3",
    name: "박지호",
    studentNumber: "20240003",
    class: "3-1",
    grade: 3,
    gender: "male",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "4",
    name: "최예은",
    studentNumber: "20240004",
    class: "3-1",
    grade: 3,
    gender: "female",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("female"),
  },
  {
    id: "5",
    name: "정도현",
    studentNumber: "20240005",
    class: "3-1",
    grade: 3,
    gender: "male",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "6",
    name: "한소영",
    studentNumber: "20240006",
    class: "3-1",
    grade: 3,
    gender: "female",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("female"),
  },
  {
    id: "7",
    name: "윤재민",
    studentNumber: "20240007",
    class: "3-1",
    grade: 3,
    gender: "male",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "8",
    name: "임채원",
    studentNumber: "20240008",
    class: "3-1",
    grade: 3,
    gender: "female",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("female"),
  },
  {
    id: "9",
    name: "오현우",
    studentNumber: "20240009",
    class: "3-1",
    grade: 3,
    gender: "male",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("male"),
  },
  {
    id: "10",
    name: "강다은",
    studentNumber: "20240010",
    class: "3-1",
    grade: 3,
    gender: "female",
    tags: [],
    isFavorite: false,
    avatar: studentAvatarSrc("female"),
  },
];

/** Soft UI 파스텔 상태 칩 — 형광 Tailwind 금지 */
const attendanceConfig: Record<
  AttendanceStatus,
  { label: string; selected: string; idle: string; dot: string }
> = {
  present: {
    label: "출석",
    selected: "bg-brand text-white",
    idle: "bg-brand-muted text-brand-ink hover:bg-brand/20",
    dot: "bg-brand",
  },
  absent: {
    label: "결석",
    selected: "bg-danger text-white",
    idle: "bg-[#F8EDEA] text-[var(--cp-danger)] hover:bg-[#F0D9D5]",
    dot: "bg-danger",
  },
  late: {
    label: "지각",
    selected: "bg-[var(--cp-warning)] text-white",
    idle: "bg-[#F5F0E6] text-[var(--cp-warning)] hover:bg-[#EBE3D4]",
    dot: "bg-[var(--cp-warning)]",
  },
  early_leave: {
    label: "조퇴",
    selected: "bg-ink-secondary text-white",
    idle: "bg-surface-elevated text-ink-secondary border border-line hover:border-line-strong",
    dot: "bg-ink-secondary",
  },
  sick_leave: {
    label: "병결",
    selected: "bg-brand-ink text-white",
    idle: "bg-brand-muted/70 text-brand-ink hover:bg-brand-muted",
    dot: "bg-brand-ink",
  },
  official_leave: {
    label: "공결",
    selected: "bg-ink text-white",
    idle: "bg-surface-elevated text-ink border border-line hover:border-line-strong",
    dot: "bg-ink",
  },
};

/**
 * 출결 상세 — Soft UI 토큰 + ActionButton / Snackbar
 */
export default function AttendanceDetailPage() {
  const params = useParams();
  const periodId = typeof params.id === "string" ? params.id : "1";
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [startTime, setStartTime] = useState(mockClassPeriod.startTime);
  const [endTime, setEndTime] = useState(mockClassPeriod.endTime);
  const [bonusSeat, setBonusSeat] = useState(0);
  const [panelStudent, setPanelStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceStatus>
  >({
    "1": "present",
    "2": "present",
    "3": "late",
    "4": "present",
    "5": "absent",
    "6": "present",
    "7": "present",
    "8": "present",
    "9": "present",
    "10": "present",
  });
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    tone: "positive" | "critical";
  }>({ open: false, message: "", tone: "positive" });

  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSnack({
        open: true,
        message: `출결이 저장되었습니다 (${periodId}).`,
        tone: "positive",
      });
    } catch {
      setSnack({
        open: true,
        message: "출결 저장에 실패했습니다. 다시 시도해 주세요.",
        tone: "critical",
      });
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    present: 0,
    absent: 0,
    late: 0,
    early_leave: 0,
    sick_leave: 0,
    official_leave: 0,
  };
  Object.values(attendanceRecords).forEach((s) => {
    stats[s]++;
  });
  const presentCount =
    stats.present +
    stats.late +
    stats.early_leave +
    stats.sick_leave +
    stats.official_leave;
  const attendanceRate = Math.round((presentCount / mockStudents.length) * 100);

  return (
    <MainLayout>
      <main className="cp-page">
        <PageHeader
          title={`${mockClassPeriod.subject} ${mockClassPeriod.period}교시`}
          description={`${mockClassPeriod.startTime}–${mockClassPeriod.endTime} · ${new Date(mockClassPeriod.date).toLocaleDateString("ko-KR")}`}
          crumbs={[
            { label: "홈", href: "/" },
            { label: "출결", href: "/attendance" },
            {
              label: `${mockClassPeriod.subject} ${mockClassPeriod.period}교시`,
            },
          ]}
          actions={
            <ActionButton
              variant="neutralOutline"
              size="small"
              onClick={() => router.push("/attendance")}
              prefixIcon={<CrepassIcon name="chevron-left" size={16} />}
            >
              목록
            </ActionButton>
          }
        />

        <div className="cp-card mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TimePicker
              label="시작"
              value={startTime}
              onChange={setStartTime}
            />
            <TimePicker label="종료" value={endTime} onChange={setEndTime} />
            <QuantityPicker
              label="추가 좌석(미리보기)"
              value={bonusSeat}
              onChange={setBonusSeat}
              max={10}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-line pt-4 md:grid-cols-4 lg:grid-cols-7">
            <div className="text-center">
              <p className="text-2xl font-semibold text-brand">
                {attendanceRate}%
              </p>
              <p className="text-sm text-ink-muted">출석률</p>
            </div>
            {(Object.keys(attendanceConfig) as AttendanceStatus[]).map(
              (status) => (
                <div key={status} className="text-center">
                  <p className="text-xl font-semibold text-ink">
                    {stats[status]}
                  </p>
                  <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm text-ink-muted">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${attendanceConfig[status].dot}`}
                    />
                    {attendanceConfig[status].label}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <section className="cp-card !p-0 overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="cp-h3">학생 출결</h2>
            <p className="mt-1 text-sm text-ink-muted">
              이름을 누르면 상세 패널이 열립니다. 상태는 Select로 변경하세요.
            </p>
          </div>
          <ScrollFog maxHeightClass="max-h-[28rem]">
            <ul className="divide-y divide-line">
              {mockStudents.map((student, index) => {
                return (
                  <li
                    key={student.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-surface-elevated/60"
                  >
                    <button
                      type="button"
                      className="flex min-w-0 items-center gap-3 text-left"
                      onClick={() => setPanelStudent(student)}
                    >
                      {student.avatar ? (
                        <Avatar
                          src={student.avatar}
                          gender={student.gender}
                          alt=""
                          size={40}
                        />
                      ) : (
                        <IdentityPlaceholder label={student.name} size={40} />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-ink">
                          <span className="mr-2 text-ink-subtle">
                            {index + 1}
                          </span>
                          {student.name}
                        </p>
                        <p className="text-sm text-ink-muted">
                          {student.studentNumber} · {student.class}
                        </p>
                      </div>
                      <Badge tone="neutral" className="hidden sm:inline-flex">
                        {
                          attendanceConfig[
                            attendanceRecords[student.id] ?? "present"
                          ].label
                        }
                      </Badge>
                    </button>
                    <div className="w-full sm:w-44">
                      <Select
                        aria-label={`${student.name} 출결`}
                        value={attendanceRecords[student.id] ?? "present"}
                        onChange={(v) =>
                          updateAttendance(student.id, v as AttendanceStatus)
                        }
                        options={(
                          Object.keys(attendanceConfig) as AttendanceStatus[]
                        ).map((status) => ({
                          value: status,
                          label: attendanceConfig[status].label,
                        }))}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollFog>
        </section>

        <div className="mt-6 flex items-center justify-end gap-3">
          {saving && <ProgressCircle size={28} label="저장 중" />}
          <ActionButton
            variant="brandSolid"
            onClick={saveAttendance}
            loading={saving}
            prefixIcon={
              !saving ? (
                <CrepassIcon name="check" size={18} className="text-white" />
              ) : undefined
            }
          >
            출결 저장
          </ActionButton>
        </div>

        <SidePanel
          open={!!panelStudent}
          onClose={() => setPanelStudent(null)}
          title={panelStudent?.name ?? "학생"}
        >
          {panelStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={panelStudent.avatar}
                  gender={panelStudent.gender}
                  alt=""
                  size={56}
                />
                <div>
                  <p className="font-medium text-ink">{panelStudent.name}</p>
                  <p className="text-sm text-ink-muted">
                    {panelStudent.class} · {panelStudent.studentNumber}
                  </p>
                </div>
              </div>
              <p className="text-sm text-ink-secondary">
                현재 상태:{" "}
                {
                  attendanceConfig[
                    attendanceRecords[panelStudent.id] ?? "present"
                  ].label
                }
              </p>
              <p className="text-sm text-ink-muted">
                교시 {startTime}–{endTime}
                {bonusSeat > 0 ? ` · 추가 좌석 ${bonusSeat}` : ""}
              </p>
            </div>
          )}
        </SidePanel>

        <Snackbar
          open={snack.open}
          message={snack.message}
          tone={snack.tone}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        />
      </main>
    </MainLayout>
  );
}
