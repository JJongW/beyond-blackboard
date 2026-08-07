/**
 * 크레파스 Design System IA — Seed Design docs 구조
 * https://seed-design.io : Foundations / Patterns / Components
 * 항목 소스는 dsCatalog.ts (단일 출처)
 */

import { CREPASS_ICON_NAMES, getDsNav } from "@/constants/dsCatalog";

export type DsNavItem = {
  title: string;
  href: string;
};

export type DsNavGroup = {
  title: string;
  href: string;
  items: DsNavItem[];
};

export const DS_NAV: DsNavGroup[] = getDsNav();

export type CrepassIconName = (typeof CREPASS_ICON_NAMES)[number];

export { CREPASS_ICON_NAMES };

/** 앱 네비 경로 → 아이콘 매핑 */
export const NAV_ICON_BY_HREF: Record<string, CrepassIconName> = {
  "/": "home",
  "/documents": "documents",
  "/students": "students",
  "/attendance": "attendance",
  "/evaluation": "grading",
  "/grades": "grading",
  "/records": "records",
};
