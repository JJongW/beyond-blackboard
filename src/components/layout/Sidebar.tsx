'use client';

import React from 'react';
import Link from 'next/link';
import { Notice, SupportItem } from '@/types';
// import { NOTICES, SUPPORT_ITEMS } from '@/constants';

/**
 * 우측 사이드바 컴포넌트
 * 
 * 기능:
 * - 공지사항 표시
 * - 도움말 및 지원 메뉴
 * - 반응형 디자인 (모바일에서는 숨김)
 * 
 * 이 컴포넌트는 Clean Architecture의 UI Layer에 속하며,
 * 비즈니스 로직과 분리된 순수한 프레젠테이션 컴포넌트입니다.
 */
const Sidebar: React.FC = () => {
  /**
   * 날짜를 한국어 형식으로 포맷팅
   * @param dateString - ISO 날짜 문자열
   * @returns 포맷된 날짜 문자열
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  /**
   * 공지사항 아이템 렌더링
   */
  const renderNoticeItem = (notice: Notice) => (
    <li key={notice.id} className="group">
      <Link
        href={`/notices/${notice.id}`}
        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              notice.isImportant ? 'text-red-600' : 'text-gray-900'
            }`}>
              {notice.isImportant && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">
                  중요
                </span>
              )}
              {notice.title}
            </p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {notice.content}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(notice.date)}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </li>
  );

  /**
   * 지원 메뉴 아이템 렌더링
   */
  const renderSupportItem = (item: SupportItem) => (
    <li key={item.id}>
      <Link
        href={item.href}
        className="flex items-center p-3 text-sm text-gray-600 hover:text-green-500 hover:bg-gray-50 rounded-lg transition-all group"
      >
        <svg
          className="w-4 h-4 mr-3 group-hover:text-green-500 transition-colors"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* 아이콘은 실제 구현에서 각 타입에 맞게 교체 */}
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="truncate">{item.title}</span>
        <svg
          className="w-3 h-3 ml-auto text-gray-400 group-hover:text-green-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </li>
  );

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 p-6 overflow-y-auto hidden lg:block h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
      <div className="widget-box rounded-xl mb-6">
        <h3 className="font-semibold p-4 border-b border-gray-200 flex items-center">
          <i className="fas fa-bullhorn text-primary-500 mr-3"></i>
          공지사항
        </h3>
        <ul className="p-4 space-y-3 text-sm text-gray-600">
          <li className="hover:text-primary-500 cursor-pointer">- 8월 시스템 정기점검 안내 (25일 02:00)</li>
          <li className="hover:text-primary-500 cursor-pointer">- 수행평가 채점 AI 모델 업데이트 안내</li>
        </ul>
      </div>
      <div className="widget-box rounded-xl">
        <h3 className="font-semibold p-4 border-b border-gray-200 flex items-center">
          <i className="fas fa-question-circle text-primary-500 mr-3"></i>
          도움말 및 지원
        </h3>
        <ul className="p-4 space-y-3 text-sm text-gray-600">
          <li className="hover:text-primary-500 cursor-pointer">사용 메뉴얼</li>
          <li className="hover:text-primary-500 cursor-pointer">자주 묻는 질문 (FAQ)</li>
          <li className="hover:text-primary-500 cursor-pointer">1:1 고객 지원</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
