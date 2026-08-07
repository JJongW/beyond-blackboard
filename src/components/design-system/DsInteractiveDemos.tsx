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
import Accordion from "@/components/ui/Accordion";
import Divider from "@/components/ui/Divider";
import PageBanner from "@/components/ui/PageBanner";
import HelpBubble from "@/components/ui/HelpBubble";
import ReactionButton from "@/components/ui/ReactionButton";
import TagGroup from "@/components/ui/TagGroup";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import Card from "@/components/ui/Card";

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

export function DsAccordionDemo() {
  return (
    <Accordion
      exclusive
      className="max-w-md"
      items={[
        {
          id: "1",
          title: "출결은 어떻게 저장하나요?",
          defaultOpen: true,
          content: "학생별 상태를 고른 뒤 출결 저장을 누릅니다.",
        },
        {
          id: "2",
          title: "즐겨찾기는 어디에 쓰이나요?",
          content: "자주 보는 학생을 별표로 표시합니다.",
        },
      ]}
    />
  );
}

export function DsDividerDemo() {
  return (
    <div className="max-w-md space-y-4">
      <Divider />
      <Divider label="또는" />
    </div>
  );
}

export function DsPageBannerDemo() {
  const [show, setShow] = useState(true);
  if (!show) {
    return (
      <button
        type="button"
        className="text-sm text-brand"
        onClick={() => setShow(true)}
      >
        배너 다시 보기
      </button>
    );
  }
  return (
    <PageBanner
      title="마감 안내"
      description="수행평가 채점 마감이 다가옵니다."
      onDismiss={() => setShow(false)}
    />
  );
}

export function DsHelpBubbleDemo() {
  return (
    <HelpBubble content="도움말은 짧은 한 문장으로 적습니다." label="도움말" />
  );
}

export function DsReactionDemo() {
  const [on, setOn] = useState(true);
  return <ReactionButton pressed={on} onChange={setOn} />;
}

export function DsTagGroupDemo() {
  return <TagGroup tags={["성실", "수학우수", "리더십", "예술"]} max={3} />;
}

export function DsFabDemo() {
  return (
    <div className="relative h-24 overflow-hidden rounded-md border border-dashed border-line bg-surface">
      <FloatingActionButton
        label="추가"
        className="!absolute !bottom-3 !right-3 !h-11 !px-4 !text-sm"
        onClick={() => undefined}
      />
    </div>
  );
}

export function DsCardDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 max-w-lg">
      <Card>
        <p className="cp-h3">기본 카드</p>
        <p className="mt-2 text-sm text-ink-secondary">표면 컨테이너</p>
      </Card>
      <Card raised>
        <p className="cp-h3">Raised</p>
        <p className="mt-2 text-sm text-ink-secondary">강조 표면</p>
      </Card>
    </div>
  );
}
