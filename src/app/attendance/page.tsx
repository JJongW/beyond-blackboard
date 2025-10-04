'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { ClassPeriod } from '@/types';

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const mockClassPeriods: ClassPeriod[] = [
  {
    id: '1',
    subject: '수학',
    period: 1,
    date: '2024-08-15',
    startTime: '09:00',
    endTime: '09:50',
    attendanceCount: 28,
    totalStudents: 30,
  },
  {
    id: '2',
    subject: '국어',
    period: 2,
    date: '2024-08-15',
    startTime: '10:00',
    endTime: '10:50',
    attendanceCount: 29,
    totalStudents: 30,
  },
  {
    id: '3',
    subject: '영어',
    period: 3,
    date: '2024-08-15',
    startTime: '11:00',
    endTime: '11:50',
    attendanceCount: 27,
    totalStudents: 30,
  },
];

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classPeriods, setClassPeriods] = useState<ClassPeriod[]>(mockClassPeriods);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 날짜 이동 함수
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // 현재 시간 포맷팅
  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <MainLayout>
      <main className="overflow-y-auto p-8 min-h-[calc(100vh-4rem)]">
        {/* 헤더 */}
        <header className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-primary-500">홈</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">출결 관리</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            출결 관리
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            학생들의 출석 현황을 실시간으로 관리하고 분석해보세요.
          </p>
        </header>

        {/* 시간바 및 날짜 네비게이션 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-primary-500">
                {formatCurrentTime()}
              </div>
              <div className="text-gray-600">
                현재 시간
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDate('prev')}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-chevron-left text-gray-600"></i>
            </button>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(currentDate)}
              </div>
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-chevron-right text-gray-600"></i>
            </button>
          </div>
        </div>

        {/* 교시별 박스 버튼들 */}
        <div className="space-y-4">
          {classPeriods.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">오늘의 수업</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                  <span>교시 추가</span>
                </button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classPeriods.map((period) => (
                  <Link
                    key={period.id}
                    href={`/attendance/${period.id}`}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group block"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        {period.period}교시
                      </div>
                      <div className="text-sm text-gray-500">
                        {period.startTime} - {period.endTime}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
                        {period.subject}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-users text-gray-400"></i>
                        <span className="text-sm text-gray-600">
                          출석 {period.attendanceCount}/{period.totalStudents}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          period.attendanceCount === period.totalStudents 
                            ? 'bg-green-500' 
                            : period.attendanceCount > period.totalStudents * 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                          {period.attendanceCount === period.totalStudents 
                            ? '완료' 
                            : period.attendanceCount > period.totalStudents * 0.8 
                            ? '진행중' 
                            : '미완료'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            // 교시가 없을 때 표시되는 화면
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-plus text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                오늘의 수업이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                첫 번째 교시를 생성하여 출결 관리를 시작해보세요.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors mx-auto"
              >
                <i className="fas fa-plus"></i>
                <span>첫 교시 생성하기</span>
              </button>
            </div>
          )}
        </div>

        {/* 교시 생성 모달 (간단한 구현) */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                새 교시 생성
              </h3>
              <p className="text-gray-600 mb-4">
                새로운 교시 생성 기능은 곧 구현될 예정입니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
