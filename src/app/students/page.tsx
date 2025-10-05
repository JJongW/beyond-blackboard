'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Student } from '@/types';

/**
 * 학생관리 페이지
 * 
 * 학생 정보 관리 및 검색 기능 제공
 * - 학생 목록 조회 (카드형/리스트형)
 * - 검색 및 필터링
 * - 즐겨찾기 관리
 * - 학생 등록
 */
export default function StudentsPage() {
  // 뷰 모드 (카드형/리스트형)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('전체');
  const [selectedClass, setSelectedClass] = useState<string>('전체');
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [showAddModal, setShowAddModal] = useState(false);

  // 임시 학생 데이터
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: '홍길동',
      studentNumber: '202401001',
      class: '1-2',
      grade: 1,
      tags: ['도움필요', '수학우수'],
      isFavorite: true,
      avatar: '/images/cute-character.svg'
    },
    {
      id: '2',
      name: '김철수',
      studentNumber: '202402001',
      class: '2-1',
      grade: 2,
      tags: ['우수', '리더십'],
      isFavorite: false,
      avatar: '/images/cute-character.svg'
    },
    {
      id: '3',
      name: '이영희',
      studentNumber: '202401002',
      class: '1-2',
      grade: 1,
      tags: ['성실', '예술'],
      isFavorite: true,
      avatar: '/images/cute-character.svg'
    },
    {
      id: '4',
      name: '박민수',
      studentNumber: '202403001',
      class: '3-1',
      grade: 3,
      tags: ['체육우수'],
      isFavorite: false,
      avatar: '/images/cute-character.svg'
    }
  ]);

  // 즐겨찾기 토글
  const toggleFavorite = (studentId: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, isFavorite: !student.isFavorite }
        : student
    ));
  };

  // 필터링된 학생 목록
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentNumber.includes(searchQuery) ||
                         student.class.includes(searchQuery);
    const matchesGrade = selectedGrade === '전체' || student.grade === parseInt(selectedGrade);
    const matchesClass = selectedClass === '전체' || student.class.includes(selectedClass);
    const matchesTag = selectedTag === '전체' || student.tags.includes(selectedTag);
    
    return matchesSearch && matchesGrade && matchesClass && matchesTag;
  });

  // 태그 색상 매핑
  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      '도움필요': 'bg-red-100 text-red-800',
      '우수': 'bg-blue-100 text-blue-800',
      '성실': 'bg-green-100 text-green-800',
      '리더십': 'bg-purple-100 text-purple-800',
      '예술': 'bg-pink-100 text-pink-800',
      '체육우수': 'bg-orange-100 text-orange-800',
      '수학우수': 'bg-yellow-100 text-yellow-800',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <main className="overflow-y-auto p-8 min-h-[calc(100vh-4rem)]">
        {/* 페이지 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">학생관리</h1>
          <p className="text-gray-600">우리 반 학생들을 체계적으로 관리하세요.</p>
        </header>

        {/* 검색 및 필터 영역 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색창 */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="학생 이름, 학번, 반으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* 필터 */}
            <div className="flex gap-3">
              <select 
                value={selectedGrade} 
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="전체">전체 학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </select>

              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="전체">전체 반</option>
                <option value="1">1반</option>
                <option value="2">2반</option>
                <option value="3">3반</option>
              </select>

              <select 
                value={selectedTag} 
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="전체">전체 태그</option>
                <option value="도움필요">도움필요</option>
                <option value="우수">우수</option>
                <option value="성실">성실</option>
                <option value="리더십">리더십</option>
              </select>
            </div>
          </div>
        </div>

        {/* 상단 액션 바 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              총 {filteredStudents.length}명의 학생
            </span>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              카드형
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              리스트형
            </button>
          </div>
        </div>

        {/* 학생 목록 */}
        {viewMode === 'card' ? (
          /* 카드형 뷰 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <img 
                    src={student.avatar} 
                    alt={student.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <button
                    onClick={() => toggleFavorite(student.id)}
                    className={`text-xl ${student.isFavorite ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
                  >
                    {student.isFavorite ? '⭐️' : '☆'}
                  </button>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{student.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{student.class} · {student.studentNumber}</p>
                
                <div className="flex flex-wrap gap-1">
                  {student.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 리스트형 뷰 */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-6">
                    {/* 학생 기본 정보 */}
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.studentNumber}</p>
                      </div>
                    </div>
                    
                    {/* 학년/반 */}
                    <div className="w-20 flex-shrink-0">
                      <span className="text-sm text-gray-600">{student.class}</span>
                    </div>
                    
                    {/* 태그 영역 - 고정 너비와 말줄임표 */}
                    <div className="w-48 flex-shrink-0">
                      <div className="flex flex-wrap gap-1 overflow-hidden">
                        {student.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {student.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{student.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* 즐겨찾기 */}
                    <div className="w-10 flex-shrink-0 flex justify-center">
                      <button
                        onClick={() => toggleFavorite(student.id)}
                        className={`text-xl ${student.isFavorite ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
                      >
                        {student.isFavorite ? '⭐️' : '☆'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}

        {/* FAB - 학생 등록 버튼 */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* 학생 등록 모달 (임시) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">새 학생 등록</h3>
              <p className="text-gray-600 mb-4">학생 등록 기능은 곧 구현될 예정입니다.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
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
