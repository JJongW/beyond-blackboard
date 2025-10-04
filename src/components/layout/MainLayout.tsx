'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { User } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User;
  showSidebar?: boolean;
}

/**
 * 메인 레이아웃 컴포넌트
 * 
 * 전체 애플리케이션의 레이아웃을 담당하는 컴포넌트입니다.
 * Clean Architecture의 Framework & Drivers Layer에 해당하며,
 * 사용자 인터페이스의 전체적인 구조를 정의합니다.
 * 
 * 변경 이유: 기존 HTML 구조를 React 컴포넌트로 변환하여
 * 재사용성과 유지보수성을 향상시켰습니다.
 * 
 * @param children - 메인 콘텐츠 영역에 렌더링될 컴포넌트
 * @param user - 현재 로그인한 사용자 정보
 * @param showSidebar - 사이드바 표시 여부 (기본값: true)
 */
const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  user, 
  showSidebar = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 - 고정 위치 */}
      <Header user={user} />

      {/* 메인 콘텐츠 영역 - 헤더 높이만큼 상단 여백 추가 */}
      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        {/* 메인 콘텐츠 - 남은 공간 모두 사용 */}
        <div className="flex-1">
          {children}
        </div>

        {/* 우측 사이드바 - 조건부 렌더링 */}
        {showSidebar && <Sidebar />}
      </div>
    </div>
  );
};

export default MainLayout;
