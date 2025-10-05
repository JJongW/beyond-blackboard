'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

// 생기부 템플릿 타입 정의
interface RecordTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  popularity: number;
  recentlyUsed: boolean;
}

// 생기부 템플릿 데이터
const RECORD_TEMPLATES: RecordTemplate[] = [
  {
    id: 'subject-details',
    title: '과목별 세부특기사항',
    description: '각 과목별 학생의 학업 성취도와 특기사항을 상세히 기록합니다.',
    category: 'academic',
    features: ['AI 맞춤 문장 생성', '성취수준 분석', '개별 특성 반영'],
    popularity: 95,
    recentlyUsed: true
  },
  {
    id: 'creative-activities',
    title: '창의적 체험활동',
    description: '자율활동, 동아리활동, 봉사활동, 진로활동 기록을 체계적으로 작성합니다.',
    category: 'experience',
    features: ['4개 영역 통합 관리', '활동 연계성 분석', '성장 과정 추적'],
    popularity: 88,
    recentlyUsed: false
  },
  {
    id: 'behavior-opinion',
    title: '행동특성 및 종합의견',
    description: '학생의 행동 특성과 학교생활 전반에 대한 종합적인 의견을 작성합니다.',
    category: 'behavior',
    features: ['행동 패턴 분석', '긍정적 표현 제안', '개선 방향 제시'],
    popularity: 92,
    recentlyUsed: true
  },
  {
    id: 'career-activities',
    title: '진로활동 기록',
    description: '학생의 진로 탐색 과정과 관련 활동들을 체계적으로 기록합니다.',
    category: 'career',
    features: ['진로 연계성 분석', '적성 매칭', '미래 계획 수립'],
    popularity: 76,
    recentlyUsed: false
  },
  {
    id: 'reading-activities',
    title: '독서활동 기록',
    description: '학생의 독서 이력과 독후 활동을 상세히 기록하고 분석합니다.',
    category: 'reading',
    features: ['도서 정보 자동 입력', '독후감 평가', '독서 성향 분석'],
    popularity: 73,
    recentlyUsed: false
  },
  {
    id: 'club-activities',
    title: '동아리활동 기록',
    description: '동아리에서의 활동 내용과 성과를 구체적으로 기록합니다.',
    category: 'experience',
    features: ['활동 일정 관리', '성과 정량화', '협력 능력 평가'],
    popularity: 81,
    recentlyUsed: true
  }
];

// 카테고리별 설정
const CATEGORY_CONFIG = {
  academic: {
    label: '교과 활동',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
  },
  experience: {
    label: '체험 활동',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  behavior: {
    label: '행동 특성',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  career: {
    label: '진로 활동',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  reading: {
    label: '독서 활동',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  }
};

export default function RecordsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 필터링된 템플릿
  const filteredTemplates = selectedCategory === 'all' 
    ? RECORD_TEMPLATES 
    : RECORD_TEMPLATES.filter(template => template.category === selectedCategory);

  // 카테고리별 개수 계산
  const categoryCounts = {
    all: RECORD_TEMPLATES.length,
    academic: RECORD_TEMPLATES.filter(t => t.category === 'academic').length,
    experience: RECORD_TEMPLATES.filter(t => t.category === 'experience').length,
    behavior: RECORD_TEMPLATES.filter(t => t.category === 'behavior').length,
    career: RECORD_TEMPLATES.filter(t => t.category === 'career').length,
    reading: RECORD_TEMPLATES.filter(t => t.category === 'reading').length,
  };

  return (
    <MainLayout>
      <main className="overflow-y-auto p-8 min-h-[calc(100vh-4rem)]">
        {/* 페이지 헤더 */}
        <header className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-500">홈</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">생기부도우미</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            생기부도우미
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            AI가 도와주는 스마트한 생활기록부 작성을 경험해보세요.
          </p>
        </header>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5l-7 7-7-7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{RECORD_TEMPLATES.length}</p>
                <p className="text-gray-600 text-sm">사용 가능한 템플릿</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{RECORD_TEMPLATES.filter(t => t.recentlyUsed).length}</p>
                <p className="text-gray-600 text-sm">최근 사용한 템플릿</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(RECORD_TEMPLATES.reduce((acc, t) => acc + t.popularity, 0) / RECORD_TEMPLATES.length)}%
                </p>
                <p className="text-gray-600 text-sm">평균 만족도</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2.5분</p>
                <p className="text-gray-600 text-sm">평균 작성 시간</p>
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({categoryCounts.all})
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {config.label} ({categoryCounts[key as keyof typeof categoryCounts]})
              </button>
            ))}
          </div>
        </div>

        {/* 생기부 템플릿 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const categoryConfig = CATEGORY_CONFIG[template.category as keyof typeof CATEGORY_CONFIG];
            
            return (
              <Link
                key={template.id}
                href={`/records/${template.id}`}
                className="block group"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-between hover:shadow-lg hover:border-primary-200 transition-all duration-200 transform hover:-translate-y-1">
                  {/* 헤더 영역 */}
                  <div className="flex-1">
                    {/* 카테고리 아이콘 */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border-2 mb-4 ${categoryConfig.color}`}>
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
                          d={categoryConfig.icon}
                        />
                      </svg>
                    </div>

                    {/* 제목 및 설명 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                          {template.title}
                        </h3>
                        {template.recentlyUsed && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            최근 사용
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* 기능 태그들 */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 2 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                            +{template.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 푸터 영역 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{template.popularity}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>자세히 보기</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* 새 템플릿 추가 카드 */}
          <div className="group cursor-pointer">
            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 h-full flex flex-col items-center justify-center text-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2 group-hover:text-primary-600">
                새 템플릿 요청
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-primary-500">
                필요한 생기부 템플릿을 요청하세요
              </p>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
