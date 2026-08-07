"use client";

import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

/**
 * 우측 사이드바 — 공지·도움말
 * 변경: 미사용 Heroicons/SVG 헬퍼 제거, CrepassIcon으로 통일
 */
const Sidebar: React.FC = () => {
  return (
    <aside className="hidden h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-80 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-6 lg:block">
      <div className="widget-box mb-6 rounded-xl">
        <h3 className="border-b border-gray-200 p-4 font-semibold">공지사항</h3>
        <ul className="space-y-3 p-4 text-sm text-gray-600">
          <li className="cursor-pointer hover:text-primary-500">
            - 8월 시스템 정기점검 안내 (25일 02:00)
          </li>
          <li className="cursor-pointer hover:text-primary-500">
            - 수행평가 채점 AI 모델 업데이트 안내
          </li>
        </ul>
      </div>
      <div className="widget-box rounded-xl">
        <h3 className="border-b border-gray-200 p-4 font-semibold">
          도움말 및 지원
        </h3>
        <ul className="space-y-1 p-2 text-sm text-gray-600">
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
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 hover:text-brand"
              >
                <CrepassIcon name={item.icon} size={20} />
                <span className="truncate">{item.title}</span>
                <CrepassIcon
                  name="chevron-right"
                  size={14}
                  className="ml-auto opacity-50"
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
