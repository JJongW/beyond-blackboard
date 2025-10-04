'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentTemplate } from '@/types';

interface DocumentCardProps {
  template: DocumentTemplate;
  className?: string;
}

/**
 * 문서 템플릿 카드 컴포넌트
 * 
 * 각 문서 템플릿을 시각적으로 표현하는 카드 컴포넌트입니다.
 * 
 * 주요 기능:
 * - 문서 템플릿 정보 표시
 * - 호버 효과 및 애니메이션
 * - 접근성 고려
 * - 반응형 디자인
 * 
 * 변경 이유: 기존 HTML 구조를 재사용 가능한 React 컴포넌트로 변환하여
 * 코드의 중복을 줄이고 유지보수성을 향상시켰습니다.
 * 
 * @param template - 문서 템플릿 정보
 * @param className - 추가 CSS 클래스
 */
const DocumentCard: React.FC<DocumentCardProps> = ({ template, className = '' }) => {
  /**
   * 카테고리별 아이콘 매핑
   */
  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      communication: 'M3 8l7.89 7.89a1 1 0 001.42 0L21 7.89V8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
      activity: 'M13 10V3L4 14h7v7l9-11h-7z',
      evaluation: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      meeting: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
      other: 'M9 12h6m-6-4h6m2 5l-7 7-7-7'
    };
    return iconMap[category] || iconMap.other;
  };

  /**
   * 카테고리별 색상 테마
   */
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      communication: 'text-blue-600 bg-blue-50 border-blue-200',
      activity: 'text-purple-600 bg-purple-50 border-purple-200',
      evaluation: 'text-green-600 bg-green-50 border-green-200',
      meeting: 'text-orange-600 bg-orange-50 border-orange-200',
      other: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colorMap[category] || colorMap.other;
  };

  const handleClick = (e: React.MouseEvent) => {
    // 클릭 시 피드백 효과
    const card = e.currentTarget as HTMLElement;
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  };

  return (
    <Link
      href={`/documents/${template.id}`}
      className={`block group ${className}`}
      onClick={handleClick}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-between hover:shadow-lg hover:border-primary-200 transition-all duration-200 transform hover:-translate-y-1">
        {/* 헤더 영역 */}
        <div className="flex-1">
          {/* 카테고리 아이콘 */}
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border-2 mb-4 ${getCategoryColor(template.category)}`}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={getCategoryIcon(template.category)}
              />
            </svg>
          </div>

          {/* 제목 및 설명 */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
              {template.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </div>

          {/* 기능 태그들 */}
          {template.features && template.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {template.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                >
                  {feature}
                </span>
              ))}
              {template.features.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  +{template.features.length - 2}
                </span>
              )}
            </div>
          )}

          {/* 템플릿 수 정보 */}
          {template.templateCount && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 6L8 8v4l8-2z" clipRule="evenodd" />
              </svg>
              템플릿 {template.templateCount}개
            </div>
          )}
        </div>

        {/* 액션 영역 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-primary-500 group-hover:text-primary-600 transition-colors">
            만들기
          </span>
          <svg
            className="w-4 h-4 text-primary-500 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-all"
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

        {/* Coming Soon 오버레이 */}
        {template.isComingSoon && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800 mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                준비 중
              </div>
              <p className="text-xs text-gray-600">곧 출시 예정입니다</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default DocumentCard;
