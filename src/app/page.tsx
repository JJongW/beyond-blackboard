'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

/**
 * 메인 대시보드 페이지
 * 
 * 첨부된 스크린샷과 정확히 동일하게 구현
 * 심플하고 깔끔한 카드 기반 레이아웃
 */
export default function HomePage() {
  const documents = [
    {
      id: 1,
      title: '창의적 체험활동 작성',
      subtitle: '템플릿 5개',
      color: 'border-gray-200'
    },
    {
      id: 2,
      title: '과목별 세부 특기사항 작성',
      subtitle: '자동 완성 기능',
      color: 'border-gray-200'
    },
    {
      id: 3,
      title: '생활지도 내용 작성',
      subtitle: '과목별 양식 제공',
      color: 'border-gray-200'
    },
    {
      id: 4,
      title: '회의록',
      subtitle: '음성인식 받아쓰기',
      color: 'border-gray-200'
    },
    {
      id: 5,
      title: '행동 특성 및 종합 의견 작성',
      subtitle: '자동 완성 기능',
      color: 'border-gray-200'
    }
  ];

  return (
    <MainLayout>
      <main className="overflow-y-auto p-8 min-h-[calc(100vh-4rem)]">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">새로운 글 작성하기</h2>
          <p className="text-gray-500 mt-1">필요한 문서를 선택하여 빠르게 작성해 보세요.</p>
        </header>

        {/* 문서 종류별 카드 UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 카드 템플릿들 */}
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800">{doc.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{doc.subtitle}</p>
              </div>
              <a href="#" className="text-sm font-semibold text-primary-500 mt-4 self-start">
                만들기 <i className="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          ))}

          {/* 새 양식 추가 카드 */}
          <div className="bg-primary-50 rounded-xl border-2 border-dashed border-primary-300 p-6 flex flex-col justify-center items-center hover:bg-primary-100 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center mb-3">
              <i className="fas fa-plus"></i>
            </div>
            <h3 className="font-bold text-lg text-primary-500">새 문서 추가</h3>
            <p className="text-sm text-primary-700 mt-1">나만의 문서를 만드세요</p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
