"use client";

import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "@/components/ui/Footer";
import { User } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User;
  /** 기본값 false — 우측 사이드바 숨김 (디자인 시스템) */
  showSidebar?: boolean;
  showFooter?: boolean;
}

/**
 * 앱 셸 레이아웃 — Header + 본문 + 선택 Footer
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  showSidebar = false,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header user={user} />
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 pt-16">
        <div className="flex-1 min-w-0">{children}</div>
        {showSidebar && <Sidebar />}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
