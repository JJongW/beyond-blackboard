'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';

/**
 * 메인 대시보드 페이지
 * 
 * 선생님들을 위한 실용적인 홈 대시보드
 * - 좌측: 교육 소식 및 뉴스
 * - 우측: 달력 및 할 일 리스트
 */
export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([
    { id: 1, text: '수행평가 채점 마감', completed: false, priority: 'high' },
    { id: 2, text: '학부모 상담 준비', completed: false, priority: 'medium' },
    { id: 3, text: '교육과정 계획서 작성', completed: true, priority: 'low' },
    { id: 4, text: '창의적 체험활동 보고서', completed: false, priority: 'medium' },
  ]);
  
  // 새 할 일 추가 관련 상태
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('medium');

  // 새 할 일 추가 함수
  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo = {
        id: Math.max(...todos.map(t => t.id), 0) + 1,
        text: newTodoText.trim(),
        completed: false,
        priority: newTodoPriority
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      setNewTodoPriority('medium');
      setIsAddingTodo(false);
    }
  };

  // 할 일 추가 취소
  const cancelAddTodo = () => {
    setNewTodoText('');
    setNewTodoPriority('medium');
    setIsAddingTodo(false);
  };

  // 할 일 정렬 (완료되지 않은 것 먼저, 그 다음 우선순위 순)
  const sortedTodos = [...todos].sort((a, b) => {
    // 완료 상태로 먼저 정렬 (완료되지 않은 것이 위로)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // 우선순위로 정렬 (높음 > 보통 > 낮음)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
  });

  // 교육 뉴스/소식 데이터
  const educationNews = [
    {
      id: 1,
      title: '2024년 하반기 교육과정 개편 안내',
      summary: '새로운 교육과정 변경사항과 적용 일정을 확인하세요.',
      image: '/images/education-news-1.jpg',
      date: '2024-10-03',
      category: '정책'
    },
    {
      id: 2, 
      title: 'AI 교육도구 활용 연수 프로그램 안내',
      summary: '교사 대상 AI 도구 활용 온라인 연수가 시작됩니다.',
      image: '/images/education-news-2.jpg',
      date: '2024-10-02',
      category: '연수'
    },
    {
      id: 3,
      title: '학교폭력 예방교육 의무화 시행',
      summary: '모든 교육기관에서 학교폭력 예방교육이 의무화됩니다.',
      image: '/images/education-news-3.jpg', 
      date: '2024-10-01',
      category: '안전'
    }
  ];

  return (
    <MainLayout>
      <main className="overflow-y-auto p-8 min-h-[calc(100vh-4rem)]">
        {/* 메인 콘텐츠 - 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 좌측: 교육 소식 섹션 (2/3 width) - 상단 정렬 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 소식 헤더 */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">교육 소식</h3>
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                더보기 →
              </button>
            </div>

            {/* 뉴스 카드들 */}
            <div className="space-y-4">
              {educationNews.map((news) => (
                <div key={news.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex items-start space-x-4">
                    {/* 뉴스 이미지 영역 */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    
                    {/* 뉴스 내용 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-500">{news.date}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {news.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 달력 및 할 일 리스트 (1/3 width) */}
          <div className="space-y-6">
            {/* 달력 섹션 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">달력</h4>
              
              {/* 간단한 달력 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h5 className="font-medium text-gray-900">
                  {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                </h5>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* 날짜 그리드 (간단 버전) */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="p-2 text-gray-500 font-medium">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 5; // 대략적인 날짜 계산
                  const isToday = day === new Date().getDate();
                  const isCurrentMonth = day > 0 && day <= 31;
                  
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center text-sm transition-colors ${
                        isToday ? 'bg-primary-500 text-white' : 
                        isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-300'
                      }`}
                    >
                      {isCurrentMonth ? day : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 할 일 리스트 섹션 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">할 일 리스트</h4>
                <button 
                  onClick={() => setIsAddingTodo(true)}
                  className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* 새 할 일 추가 폼 */}
              {isAddingTodo && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="space-y-3">
                    {/* 할 일 텍스트 입력 */}
                    <input
                      type="text"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      placeholder="새로운 할 일을 입력하세요..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTodo();
                        }
                        if (e.key === 'Escape') {
                          cancelAddTodo();
                        }
                      }}
                    />
                    
                    {/* 우선순위 선택 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">우선순위:</span>
                      <select
                        value={newTodoPriority}
                        onChange={(e) => setNewTodoPriority(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-gray-400"
                      >
                        <option value="low">낮음</option>
                        <option value="medium">보통</option>
                        <option value="high">높음</option>
                      </select>
                    </div>
                    
                    {/* 버튼들 */}
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={cancelAddTodo}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={addTodo}
                        disabled={!newTodoText.trim()}
                        className="px-3 py-1.5 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 할 일 목록 */}
              <div className="space-y-2">
                {sortedTodos.map((todo) => (
                  <div key={todo.id} className={`flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-all group ${
                    todo.completed ? 'opacity-75' : ''
                  }`}>
                    {/* 커스텀 원형 체크박스 */}
                    <button
                      onClick={() => {
                        setTodos(todos.map(t => 
                          t.id === todo.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        todo.completed 
                          ? 'bg-primary-500 border-primary-500' 
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {todo.text}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {todo.priority === 'high' ? '🔥 높음' : todo.priority === 'medium' ? '⚡ 보통' : '🌱 낮음'}
                        </span>
                        {todo.completed && (
                          <span className="text-xs text-gray-400">✅ 완료됨</span>
                        )}
                      </div>
                    </div>
                    {/* 삭제 버튼 (호버 시 표시) */}
                    <button
                      onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {/* 할 일이 없을 때 */}
                {todos.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500 text-sm">할 일이 없습니다</p>
                    <p className="text-gray-400 text-xs">+ 버튼을 눌러 새로운 할 일을 추가해보세요</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
