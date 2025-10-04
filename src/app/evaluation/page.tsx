import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

/**
 * 수행평가 채점 페이지
 * 
 * AI 기반 자동 채점 시스템을 제공하는 페이지입니다.
 */
export default function EvaluationPage() {
  return (
    <MainLayout>
      <div className="p-6 sm:p-8">
        {/* 페이지 헤더 */}
        <header className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-500">홈</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">수행평가 채점</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            수행평가 채점
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            AI가 도와주는 객관적이고 일관된 수행평가 채점을 경험해보세요.
          </p>
        </header>

        {/* 채점 옵션 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 새 채점 시작 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-4">새 채점 시작</h3>
            </div>
            <p className="text-gray-600 mb-4">
              학생들의 답안지를 업로드하고 AI 자동 채점을 시작하세요.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-primary-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">
                답안지 업로드하기
              </button>
              <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                채점 기준 설정
              </button>
            </div>
          </div>

          {/* 진행 중인 채점 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-4">진행 중인 채점</h3>
            </div>
            <p className="text-gray-600 mb-4">
              현재 AI가 채점 중인 과제들을 확인하고 관리하세요.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-orange-800">국어 수행평가 1차</span>
                  <span className="text-xs text-orange-600">78% 완료</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">수학 서술형 평가</span>
                  <span className="text-xs text-blue-600">45% 완료</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 채점 결과 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">최근 채점 결과</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평가명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    과목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    채점 완료
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평균 점수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    창의적 글쓰기 평가
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">국어</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28명</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">85.3점</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      완료
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">결과 보기</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    과학 실험 보고서
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">과학</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25명</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78.6점</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      완료
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">결과 보기</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    영어 에세이 평가
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">영어</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30명</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82.1점</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      검토중
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">검토하기</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI 채점 도움말 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">AI 채점 팁</h4>
              <div className="text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>명확한 채점 기준을 미리 설정해주세요</li>
                  <li>답안지는 고화질 스캔본을 업로드해주세요</li>
                  <li>AI 채점 결과는 항상 교사가 최종 검토해주세요</li>
                  <li>특이한 답안은 수동으로 재검토하는 것을 권장합니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
