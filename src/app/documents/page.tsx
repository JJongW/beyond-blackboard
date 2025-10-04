import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DocumentCard from '@/components/ui/DocumentCard';
import AddNewTemplateCard from '@/components/ui/AddNewTemplateCard';
import { DOCUMENT_TEMPLATES } from '@/constants';

/**
 * 문서 생성 페이지
 * 
 * 다양한 행정 문서 템플릿을 선택하고 생성할 수 있는 페이지입니다.
 */
export default function DocumentsPage() {
  return (
    <MainLayout>
      <div className="p-6 sm:p-8">
        {/* 페이지 헤더 */}
        <header className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-primary-500">홈</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">문서 글 생성</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            문서 글 생성
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            AI가 도와주는 스마트한 행정 문서 작성을 경험해보세요.
          </p>
        </header>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 6L8 8v4l8-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">사용 가능한 템플릿</p>
                <p className="text-2xl font-semibold text-gray-900">{DOCUMENT_TEMPLATES.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">이번 달 생성</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">완료률</p>
                <p className="text-2xl font-semibold text-gray-900">98%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 생성 시간</p>
                <p className="text-2xl font-semibold text-gray-900">3분</p>
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium">
              전체
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              창의적 체험활동 작성
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              과목별 세부 특기사항 작성
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              생활지도 내용 작성
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              회의록
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              행동 특성 및 종합 의견 작성
            </button>
          </div>
        </div>

        {/* 문서 템플릿 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DOCUMENT_TEMPLATES.map((template) => (
            <DocumentCard
              key={template.id}
              template={template}
              className="h-full"
            />
          ))}
          <AddNewTemplateCard className="h-full" />
        </div>
      </div>
    </MainLayout>
  );
}
