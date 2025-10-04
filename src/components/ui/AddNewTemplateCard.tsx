'use client';

import React from 'react';
import Link from 'next/link';

interface AddNewTemplateCardProps {
  className?: string;
  onClick?: () => void;
}

/**
 * 새 양식 추가 카드 컴포넌트
 * 
 * 사용자가 새로운 문서 템플릿을 추가할 수 있는 액션 카드입니다.
 * 
 * 주요 기능:
 * - 시각적으로 구분되는 디자인 (점선 테두리)
 * - 호버 효과 및 애니메이션
 * - 클릭 이벤트 처리
 * 
 * @param className - 추가 CSS 클래스
 * @param onClick - 클릭 이벤트 핸들러
 */
const AddNewTemplateCard: React.FC<AddNewTemplateCardProps> = ({ 
  className = '',
  onClick 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // 클릭 시 피드백 효과
    const card = e.currentTarget as HTMLElement;
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // 외부 onClick 핸들러 실행
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`group ${className}`}>
      <Link
        href="/templates/new"
        className="block h-full"
        onClick={handleClick}
      >
        <div className="bg-primary-50 rounded-xl border-2 border-dashed border-primary-200 p-6 h-full flex flex-col justify-center items-center hover:bg-primary-100 hover:border-primary-300 transition-all duration-200 transform hover:-translate-y-1 min-h-[280px]">
          {/* 아이콘 */}
          <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-200">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          {/* 제목 */}
          <h3 className="font-bold text-lg text-primary-600 group-hover:text-primary-700 transition-colors text-center mb-2">
            새 양식 추가
          </h3>

          {/* 설명 */}
          <p className="text-sm text-primary-700 text-center leading-relaxed">
            나만의 문서 양식을<br />
            만들어 보세요
          </p>

          {/* 추가 설명 (호버 시 표시) */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-primary-600">
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                커스텀 템플릿
              </div>
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AI 지원
              </div>
            </div>
          </div>

          {/* 하단 화살표 */}
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
            <svg
              className="w-5 h-5 text-primary-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AddNewTemplateCard;
