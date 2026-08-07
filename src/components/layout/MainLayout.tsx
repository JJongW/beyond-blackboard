"use client";

import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { User } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User;
  /** 기본값 false — 우측 사이드바 숨김 (디자인 시스템) */
  showSidebar?: boolean;
}

/**
 * 앱 셸 레이아웃
 * 변경: 사이드바 기본 숨김, 표면색을 cp-surface 토큰으로 통일
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  showSidebar = false,
}) => {
  return (
    <div className="min-h-screen bg-surface">
      <Header user={user} />
      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        <div className="flex-1 min-w-0">{children}</div>
        {showSidebar && <Sidebar />}
      </div>
    </div>
  );
};

export default MainLayout;
