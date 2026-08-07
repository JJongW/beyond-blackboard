"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Callout from "@/components/ui/Callout";
import Badge from "@/components/ui/Badge";
import Checkbox from "@/components/ui/Checkbox";
import Switch from "@/components/ui/Switch";
import Tabs from "@/components/ui/Tabs";
import ActionButton from "@/components/ui/ActionButton";
import Menu, { MenuDotsTrigger } from "@/components/ui/Menu";
import RadioGroup from "@/components/ui/RadioGroup";

/**
 * 홈 대시보드
 * 변경: 할 일 1순위·소식 압축, 이모지 제거, 카드 shadow 축소, 사이드바 없음
 */
export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: "수행평가 채점 마감",
      completed: false,
      priority: "high" as const,
    },
    {
      id: 2,
      text: "학부모 상담 준비",
      completed: false,
      priority: "medium" as const,
    },
    {
      id: 3,
      text: "교육과정 계획서 작성",
      completed: true,
      priority: "low" as const,
    },
    {
      id: 4,
      text: "창의적 체험활동 보고서",
      completed: false,
      priority: "medium" as const,
    },
  ]);

  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  const [hideCompleted, setHideCompleted] = useState(false);
  const [homeTab, setHomeTab] = useState<"todo" | "news">("todo");

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    setTodos([
      ...todos,
      {
        id: Math.max(...todos.map((t) => t.id), 0) + 1,
        text: newTodoText.trim(),
        completed: false,
        priority: newTodoPriority,
      },
    ]);
    setNewTodoText("");
    setNewTodoPriority("medium");
    setIsAddingTodo(false);
  };

  const cancelAddTodo = () => {
    setNewTodoText("");
    setNewTodoPriority("medium");
    setIsAddingTodo(false);
  };

  const sortedTodos = [...todos]
    .filter((t) => !(hideCompleted && t.completed))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    });

  const educationNews = [
    {
      id: 1,
      title: "2024년 하반기 교육과정 개편 안내",
      date: "2024-10-03",
      category: "정책",
    },
    {
      id: 2,
      title: "AI 교육도구 활용 연수 프로그램 안내",
      date: "2024-10-02",
      category: "연수",
    },
    {
      id: 3,
      title: "학교폭력 예방교육 의무화 시행",
      date: "2024-10-01",
      category: "안전",
    },
  ];

  const shiftMonth = (delta: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return next;
    });
  };

  const priorityLabel = { high: "높음", medium: "보통", low: "낮음" } as const;
  const priorityClass = {
    high: "cp-chip-high",
    medium: "cp-chip-medium",
    low: "cp-chip-low",
  } as const;

  return (
    <MainLayout>
      <main className="cp-page">
        <div className="mb-8">
          <h1 className="cp-h1">오늘</h1>
          <p className="mt-1 text-base text-ink-muted">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </p>
        </div>

        <Callout tone="informative" icon="clipboard" className="mb-8">
          우선순위 높은 할 일부터 처리하세요. Brand 버튼은 화면당 핵심 행동
          하나에만 씁니다.
        </Callout>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <section
            className="lg:col-span-2 space-y-4"
            aria-labelledby="todo-heading"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="todo-heading" className="cp-h2">
                오늘 업무
              </h2>
              <div className="flex items-center gap-3">
                <Switch
                  checked={hideCompleted}
                  onChange={setHideCompleted}
                  label="완료 숨기기"
                />
                <button
                  type="button"
                  onClick={() => setIsAddingTodo(true)}
                  className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                  aria-label="할 일 추가"
                >
                  <CrepassIcon name="add" size={28} />
                </button>
              </div>
            </div>

            <Tabs
              aria-label="홈 콘텐츠"
              value={homeTab}
              onChange={setHomeTab}
              options={[
                { value: "todo", label: "할 일" },
                { value: "news", label: "소식" },
              ]}
            />

            {homeTab === "todo" ? (
              <div className="cp-card !p-4">
                {isAddingTodo && (
                  <div className="mb-4 space-y-3 rounded-md border border-dashed border-line-strong bg-surface p-4">
                    <label className="sr-only" htmlFor="new-todo">
                      새 할 일
                    </label>
                    <input
                      id="new-todo"
                      type="text"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      placeholder="할 일 입력"
                      className="cp-input"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTodo();
                        if (e.key === "Escape") cancelAddTodo();
                      }}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <RadioGroup
                        legend="우선순위"
                        direction="row"
                        value={newTodoPriority}
                        onChange={setNewTodoPriority}
                        options={[
                          { value: "low", label: "낮음" },
                          { value: "medium", label: "보통" },
                          { value: "high", label: "높음" },
                        ]}
                      />
                      <div className="flex gap-2">
                        <ActionButton
                          variant="ghost"
                          size="small"
                          onClick={cancelAddTodo}
                        >
                          취소
                        </ActionButton>
                        <ActionButton
                          variant="brandSolid"
                          size="small"
                          onClick={addTodo}
                          disabled={!newTodoText.trim()}
                        >
                          추가
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                )}

                <ul className="divide-y divide-line">
                  {sortedTodos.map((todo) => (
                    <li
                      key={todo.id}
                      className={`group flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${
                        todo.completed ? "opacity-60" : ""
                      }`}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onChange={(checked) =>
                          setTodos(
                            todos.map((t) =>
                              t.id === todo.id
                                ? { ...t, completed: checked }
                                : t,
                            ),
                          )
                        }
                        aria-label={todo.completed ? "완료 취소" : "완료 표시"}
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm ${
                            todo.completed
                              ? "line-through text-ink-muted"
                              : "text-ink"
                          }`}
                        >
                          {todo.text}
                        </p>
                        {!todo.completed && (
                          <span
                            className={`cp-chip mt-1 ${priorityClass[todo.priority]}`}
                          >
                            {priorityLabel[todo.priority]}
                          </span>
                        )}
                      </div>

                      <Menu
                        aria-label={`${todo.text} 메뉴`}
                        className="opacity-0 group-hover:opacity-100"
                        trigger={<MenuDotsTrigger />}
                        items={[
                          {
                            id: "del",
                            label: "삭제",
                            destructive: true,
                            icon: <CrepassIcon name="trash" size={16} />,
                            onSelect: () =>
                              setTodos(todos.filter((t) => t.id !== todo.id)),
                          },
                        ]}
                      />
                    </li>
                  ))}
                </ul>

                {todos.length === 0 && (
                  <p className="py-10 text-center text-sm text-ink-muted">
                    할 일이 없습니다
                  </p>
                )}
              </div>
            ) : (
              <div>
                <ul className="cp-card !p-0 divide-y divide-line">
                  {educationNews.map((news) => (
                    <li key={news.id}>
                      <button
                        type="button"
                        className="flex w-full items-baseline gap-3 px-5 py-3.5 text-left hover:bg-surface-elevated transition-colors"
                      >
                        <Badge tone="neutral" className="shrink-0">
                          {news.category}
                        </Badge>
                        <span className="min-w-0 flex-1 text-sm font-medium text-ink truncate">
                          {news.title}
                        </span>
                        <time className="cp-caption shrink-0">{news.date}</time>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* 달력 — PLACEHOLDER_CAL */}
          <section className="cp-card" aria-labelledby="cal-heading">
            <h2 id="cal-heading" className="cp-h3 mb-4">
              달력
            </h2>
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface"
                aria-label="이전 달"
              >
                <CrepassIcon name="chevron-left" size={22} />
              </button>
              <p className="text-sm font-medium text-ink">
                {currentDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface"
                aria-label="다음 달"
              >
                <CrepassIcon name="chevron-right" size={22} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="py-2 font-medium text-ink-muted">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5;
                const isToday = day === new Date().getDate();
                const isCurrentMonth = day > 0 && day <= 31;
                return (
                  <div
                    key={i}
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      isToday
                        ? "bg-brand text-white font-medium"
                        : isCurrentMonth
                          ? "text-ink hover:bg-surface cursor-pointer"
                          : "text-ink-subtle"
                    }`}
                  >
                    {isCurrentMonth ? day : ""}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
