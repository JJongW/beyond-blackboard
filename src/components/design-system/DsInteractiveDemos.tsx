"use client";

import React, { useState } from "react";
import Checkbox from "@/components/ui/Checkbox";
import RadioGroup from "@/components/ui/RadioGroup";
import Switch from "@/components/ui/Switch";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import Menu, { MenuDotsTrigger } from "@/components/ui/Menu";
import ProgressCircle from "@/components/ui/ProgressCircle";
import SegmentedControl from "@/components/ui/SegmentedControl";
import List, { ListItem } from "@/components/ui/List";
import Avatar from "@/components/ui/Avatar";
import { SkeletonListRows } from "@/components/ui/Skeleton";
import CrepassIcon from "@/components/ui/CrepassIcon";

/** DS Preview용 인터랙티브 데모 (클라이언트) */
export function DsControlsDemo() {
  const [checked, setChecked] = useState(true);
  const [status, setStatus] = useState<"present" | "absent" | "late">(
    "present",
  );
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <Checkbox checked={checked} onChange={setChecked} label="전체 선택" />
      <RadioGroup
        legend="출결"
        direction="row"
        value={status}
        onChange={setStatus}
        options={[
          { value: "present", label: "출석" },
          { value: "absent", label: "결석" },
          { value: "late", label: "지각" },
        ]}
      />
      <Switch checked={on} onChange={setOn} label="완료 항목 숨기기" />
    </div>
  );
}

export function DsCheckboxDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Checkbox checked={a} onChange={setA} label="수행평가 채점" />
      <Checkbox checked={b} onChange={setB} label="상담 일정 공유" />
      <Checkbox checked={false} onChange={() => {}} label="비활성" disabled />
    </div>
  );
}

export function DsRadioDemo() {
  const [v, setV] = useState("present");
  return (
    <RadioGroup
      value={v}
      onChange={setV}
      direction="row"
      options={[
        { value: "present", label: "출석" },
        { value: "absent", label: "결석" },
        { value: "late", label: "지각" },
      ]}
    />
  );
}

export function DsSwitchDemo() {
  const [on, setOn] = useState(true);
  return <Switch checked={on} onChange={setOn} label="알림 받기" />;
}

export function DsSelectDemo() {
  const [v, setV] = useState("medium");
  return (
    <div className="max-w-xs">
      <Select
        label="우선순위"
        value={v}
        onChange={setV}
        options={[
          { value: "low", label: "낮음" },
          { value: "medium", label: "보통" },
          { value: "high", label: "높음" },
        ]}
      />
    </div>
  );
}

export function DsTabsDemo() {
  const [tab, setTab] = useState<"todo" | "news">("todo");
  return (
    <div>
      <Tabs
        aria-label="홈 섹션"
        value={tab}
        onChange={setTab}
        options={[
          { value: "todo", label: "할 일" },
          { value: "news", label: "소식" },
        ]}
      />
      <p className="mt-4 text-sm text-ink-secondary">
        {tab === "todo" ? "할 일 패널" : "교육 소식 패널"}
      </p>
    </div>
  );
}

export function DsMenuDemo() {
  return (
    <Menu
      aria-label="더보기"
      trigger={<MenuDotsTrigger />}
      items={[
        {
          id: "edit",
          label: "수정",
          icon: <CrepassIcon name="crayon" size={16} />,
        },
        {
          id: "del",
          label: "삭제",
          destructive: true,
          icon: <CrepassIcon name="trash" size={16} />,
        },
      ]}
    />
  );
}

export function DsProgressDemo() {
  return (
    <div className="flex items-end gap-6">
      <ProgressCircle />
      <ProgressCircle value={35} size={48} />
      <ProgressCircle value={80} size={56} label="저장 중" />
    </div>
  );
}

export function DsSegmentedDemo() {
  const [v, setV] = useState<"card" | "list">("card");
  return (
    <SegmentedControl
      aria-label="보기"
      value={v}
      onChange={setV}
      options={[
        { value: "card", label: "카드" },
        { value: "list", label: "리스트" },
      ]}
    />
  );
}

export function DsListDemo() {
  return (
    <List className="max-w-md">
      <ListItem
        leading={<Avatar gender="male" size={36} alt="" />}
        title="김민준"
        description="3-1 · 출석"
      />
      <ListItem
        leading={<Avatar gender="female" size={36} alt="" />}
        title="이서윤"
        description="3-1 · 지각"
      />
    </List>
  );
}

export function DsLoadingDemo() {
  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div className="flex items-center gap-3">
        <ProgressCircle size={28} />
        <span className="text-sm text-ink-secondary">짧은 대기 — Progress</span>
      </div>
      <SkeletonListRows count={2} />
    </div>
  );
}
