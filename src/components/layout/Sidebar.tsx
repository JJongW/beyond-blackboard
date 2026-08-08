"use client";

import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

/**
 * 우측 사이드바 — Soft UI 토큰 (gray/white 제거)
 */
const Sidebar: React.FC = () => {
  return (
    <aside className="cp-floating-surface hidden h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-80 shrink-0 overflow-y-auto border-l border-line p-6 lg:block">
      <div className="cp-card mb-6 !p-0 overflow-hidden">
        <h3 className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">
          공지사항
        </h3>
        <ul className="space-y-1 p-2 text-sm text-ink-secondary">
          <li>
            <button
              type="button"
              className="w-full rounded-md px-3 py-2.5 text-left hover:bg-surface-elevated hover:text-ink"
            >
              8월 시스템 정기점검 안내 (25일 02:00)
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full rounded-md px-3 py-2.5 text-left hover:bg-surface-elevated hover:text-ink"
            >
              수행평가 채점 모델 업데이트 안내
            </button>
          </li>
        </ul>
      </div>

      <div className="cp-card !p-0 overflow-hidden">
        <h3 className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">
          도움말 및 지원
        </h3>
        <ul className="space-y-0.5 p-2 text-sm text-ink-secondary">
          {(
            [
              { title: "사용 매뉴얼", icon: "notebook" as const },
              { title: "자주 묻는 질문 (FAQ)", icon: "help" as const },
              { title: "1:1 고객 지원", icon: "notifications" as const },
            ] as const
          ).map((item) => (
            <li key={item.title}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-surface-elevated hover:text-ink"
              >
                <CrepassIcon
                  name={item.icon}
                  size={20}
                  weight="line"
                  className="text-ink-muted"
                />
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <CrepassIcon
                  name="chevron-right"
                  size={14}
                  className="text-ink-subtle"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
