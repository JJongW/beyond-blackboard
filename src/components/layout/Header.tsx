'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ITEMS } from '@/constants';
import { User } from '@/types';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  user?: User;
}

/**
 * 상단 네비게이션 바 컴포넌트
 * 
 * 기능:
 * - 로고 및 서비스명 표시
 * - 메인 네비게이션 메뉴
 * - 사용자 정보 및 알림
 * - 반응형 디자인 지원
 * 
 * @param user - 현재 로그인한 사용자 정보
 */
const Header: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 기본 사용자 정보 (개발용)
  const defaultUser: User = {
    id: '1',
    name: '김민준',
    email: 'teacher@school.edu',
    role: 'teacher',
    school: '서울초등학교',
    avatar: 'https://placehold.co/100x100/1ccf60/ffffff?text=교',
  };

  const currentUser = user || defaultUser;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 w-full flex-shrink-0 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 메뉴 */}
          <div className="flex items-center space-x-8">
            {/* 로고 */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src="/images/pencil-logo.png" 
                alt="로고" 
                className="w-8 h-8 rounded-full mr-2 shadow-sm"
              />
              <h1 className="text-lg font-bold">크레파스 - AI도우미</h1>
            </Link>
            {/* 네비게이션 메뉴 */}
            <nav className="hidden md:flex items-center space-x-6">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-semibold ${
                      isActive
                        ? 'text-primary-500 border-b-2 border-primary-500 pb-1'
                        : 'text-gray-600 hover:text-primary-500'
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* 사용자 정보 및 알림 */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-800">
              <i className="fas fa-bell"></i>
            </button>
            <div className="flex items-center">
              <img
                className="h-9 w-9 rounded-full object-cover"
                src="/images/cute-character.svg"
                alt="User avatar"
              />
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-semibold">{currentUser.name} 선생님</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
