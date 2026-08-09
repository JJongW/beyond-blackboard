"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, NOTICES } from "@/constants";
import { BRAND } from "@/constants/designTokens";
import { NAV_ICON_BY_HREF } from "@/constants/designSystemNav";
import { User } from "@/types";
import Badge, { NotificationBadge } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import List, { ListItem } from "@/components/ui/List";
import Menu from "@/components/ui/Menu";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Dialog, { AlertDialog } from "@/components/ui/Dialog";
import ActionButton from "@/components/ui/ActionButton";
import Snackbar from "@/components/ui/Snackbar";
import Field from "@/components/ui/Field";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  user?: User;
}

/**
 * 헤더 — Top Nav + 알림 + 설정/로그아웃 안내 다이얼로그
 */
const Header: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const notifRef = useRef<HTMLDivElement>(null);

  const defaultUser: User = {
    id: "1",
    name: "김민준",
    email: "teacher@school.edu",
    role: "teacher",
    school: "서울초등학교",
  };

  const currentUser = user || defaultUser;

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="cp-header-bar fixed top-0 left-0 right-0 z-50 h-16 border-b border-line backdrop-blur-sm">
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <Image
              src={BRAND.mark}
              alt={`${BRAND.name} 로고`}
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="text-base font-semibold tracking-tight text-ink">
              {BRAND.name}
            </span>
          </Link>

          <nav
            className="hidden lg:flex items-center gap-4"
            aria-label="주요 메뉴"
          >
            {NAVIGATION_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const iconName = NAV_ICON_BY_HREF[item.href];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "cp-link-active inline-flex items-center gap-1.5 text-base whitespace-nowrap"
                      : "cp-link inline-flex items-center gap-1.5 text-base font-medium whitespace-nowrap"
                  }
                >
                  {iconName && (
                    <CrepassIcon
                      name={iconName}
                      sizeToken="lg"
                      weight="line"
                      className={isActive ? "text-brand" : "text-ink-muted"}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-muted hover:bg-surface-elevated hover:text-ink transition-colors"
              aria-label="알림"
              aria-expanded={isNotifOpen}
              onClick={() => {
                setIsNotifOpen((v) => !v);
              }}
            >
              <CrepassIcon name="bell" sizeToken="xl" />
              <NotificationBadge count={NOTICES.length} />
            </button>

            {isNotifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-md border border-line bg-surface-card shadow-float z-50 cp-floating-surface"
                role="dialog"
                aria-label="알림"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-base font-semibold text-ink">알림</p>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:text-ink"
                    aria-label="닫기"
                    onClick={() => setIsNotifOpen(false)}
                  >
                    <CrepassIcon name="close" sizeToken="inline" />
                  </button>
                </div>
                {NOTICES.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-ink-muted">
                    새 알림이 없습니다
                  </p>
                ) : (
                  <List bordered={false} className="max-h-72 overflow-y-auto">
                    {NOTICES.slice(0, 5).map((notice) => (
                      <ListItem
                        key={notice.id}
                        title={notice.title}
                        description={notice.content}
                        trailing={
                          notice.isImportant ? (
                            <Badge tone="critical" size="small">
                              중요
                            </Badge>
                          ) : undefined
                        }
                      />
                    ))}
                  </List>
                )}
              </div>
            )}
          </div>

          <div className="relative hidden sm:block">
            <Menu
              aria-label="사용자 메뉴"
              trigger={
                <span className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-elevated transition-colors">
                  <Avatar brand alt="" size={32} />
                  <span className="text-base font-medium text-ink hidden md:inline">
                    {currentUser.name}
                  </span>
                  <CrepassIcon
                    name="chevron-down"
                    sizeToken="sm"
                    className="text-ink-muted hidden md:inline"
                  />
                </span>
              }
              items={[
                {
                  id: "settings",
                  label: "설정",
                  icon: <CrepassIcon name="settings" sizeToken="inline" />,
                  onSelect: () => setSettingsOpen(true),
                },
                {
                  id: "logout",
                  label: "로그아웃",
                  destructive: true,
                  onSelect: () => setLogoutOpen(true),
                },
              ]}
            />
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-elevated"
            aria-label="메뉴 열기"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <CrepassIcon name="menu" sizeToken="2xl" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={currentUser}
        onOpenSettings={() => {
          setIsMobileMenuOpen(false);
          setSettingsOpen(true);
        }}
        onOpenLogout={() => {
          setIsMobileMenuOpen(false);
          setLogoutOpen(true);
        }}
      />

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="설정"
        actions={
          <ActionButton
            variant="brandSolid"
            onClick={() => setSettingsOpen(false)}
          >
            확인
          </ActionButton>
        }
      >
        <p className="mb-4">
          계정·알림 설정은 곧 연결됩니다. 지금은 데모 프로필만 확인할 수
          있습니다.
        </p>
        <div className="space-y-3">
          <Field label="이름" htmlFor="settings-name">
            <input
              id="settings-name"
              className="cp-input w-full"
              value={currentUser.name}
              readOnly
            />
          </Field>
          <Field label="이메일" htmlFor="settings-email">
            <input
              id="settings-email"
              className="cp-input w-full"
              value={currentUser.email}
              readOnly
            />
          </Field>
          <Field label="학교" htmlFor="settings-school">
            <input
              id="settings-school"
              className="cp-input w-full"
              value={currentUser.school}
              readOnly
            />
          </Field>
        </div>
      </Dialog>

      <AlertDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="로그아웃"
        description="인증이 아직 연결되지 않아 실제로 로그아웃되지 않습니다. 데모 미리보기만 제공합니다."
        confirmLabel="확인"
        cancelLabel="닫기"
        onConfirm={() => {
          setLogoutOpen(false);
          setSnack({
            open: true,
            message: "로그아웃은 곧 연결됩니다.",
          });
        }}
      />

      <Snackbar
        open={snack.open}
        message={snack.message}
        tone="neutral"
        onClose={() => setSnack({ open: false, message: "" })}
      />
    </header>
  );
};

export default Header;
