/**
 * 크레파스 Design Tokens
 * Seed/Toss foundations 형식 — Color · Type · Space · Radius · Elevation · Motion
 * 라이브 문서: /design-system
 *
 * Audience: 30대+ 교사 — 형광 금지, 본문 16px+, Soft UI
 */

export const BRAND = {
  name: "크레파스",
  mark: "/images/crepass-app-icon.png",
  avatar: "/images/crepass-avatar.png",
  accentBudget: "10%",
} as const;

/** Flat pastel sticker student avatars — gender → path */
export const STUDENT_AVATARS = {
  male: "/images/crepass-avatar-student-boy.png",
  female: "/images/crepass-avatar-student-girl.png",
} as const;

/** gender 기준 학생 아바타 경로 (미지정 시 boy) */
export function studentAvatarSrc(
  gender?: "male" | "female",
): (typeof STUDENT_AVATARS)[keyof typeof STUDENT_AVATARS] {
  return gender === "female" ? STUDENT_AVATARS.female : STUDENT_AVATARS.male;
}

/** Brand: 세이지 에메랄드 (구 #1CCF60 형광톤 폐기) */
export const COLOR = {
  ink: "#1F1F1D",
  inkSecondary: "#57574F",
  inkMuted: "#6F6F67",
  inkSubtle: "#9A9A92",
  surface: "#F6F5F2",
  surfaceElevated: "#FAF9F6",
  surfaceCard: "#FBFBFA",
  border: "#E6E5E0",
  borderStrong: "#D2D1CB",
  brand: "#3D8B6E",
  brandHover: "#2F6F57",
  brandMuted: "#E6F0EA",
  brandInk: "#1E4D3A",
  danger: "#B42318",
  warning: "#9A6700",
  focus: "#3D8B6E",
} as const;

export const SPACE = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

/** 교사 가독성 — body 16px+ */
export const TYPE = {
  h1: { size: 26, line: 34, weight: 600 },
  h2: { size: 20, line: 28, weight: 600 },
  h3: { size: 17, line: 26, weight: 600 },
  body: { size: 16, line: 26, weight: 400 },
  bodyStrong: { size: 16, line: 26, weight: 500 },
  caption: { size: 14, line: 22, weight: 400 },
  label: { size: 14, line: 20, weight: 500 },
} as const;

export const COMPONENT_SPACING = {
  header: { height: 64, px: 24, navGap: 24 },
  page: { padding: 32, sectionGap: 32 },
  card: { padding: 24, gap: 16, radius: RADIUS.md },
  listRow: { py: 12, gap: 12, radius: RADIUS.sm },
  button: { py: 10, px: 16, gap: 8, radius: RADIUS.sm },
  input: { py: 12, px: 14, radius: RADIUS.sm },
  chip: { py: 4, px: 10, radius: RADIUS.sm },
} as const;

/**
 * Elevation (Seed foundations/elevation 축소 적용)
 * Soft UI: 경계선 우선, 그림자는 떠 있는 UI에만
 */
export const ELEVATION = {
  flat: {
    token: "--cp-elevation-flat",
    shadow: "none",
    use: "페이지 배경, 인라인 텍스트, 리스트 행",
  },
  raised: {
    token: "--cp-elevation-raised",
    shadow: "0 1px 2px rgba(31, 31, 29, 0.04)",
    use: "기본 카드, 입력 그룹 (필요 시 border와 병행)",
  },
  floating: {
    token: "--cp-elevation-floating",
    shadow: "0 8px 24px rgba(31, 31, 29, 0.08)",
    use: "드롭다운, 알림 패널, 사용자 메뉴",
  },
  overlay: {
    token: "--cp-elevation-overlay",
    shadow: "0 16px 40px rgba(31, 31, 29, 0.12)",
    use: "모달, 다이얼로그",
  },
} as const;

/**
 * Motion (Seed foundations/motion 축소 적용)
 * 교사 앱: 150–220ms, 장식 루프 금지, reduced-motion 필수
 */
export const MOTION = {
  duration: {
    /** 색·opacity 마이크로 (hover/focus) */
    quick: { ms: 120, css: "120ms", use: "link color, chip, icon tint" },
    /** 기본 UI 전환 (button, card border) */
    normal: { ms: 180, css: "180ms", use: "button, card, input focus ring" },
    /** 패널·메뉴 등장 */
    moderate: { ms: 220, css: "220ms", use: "dropdown, drawer, modal enter" },
  },
  easing: {
    /** Seed식 표준 out — 대부분의 UI */
    out: {
      css: "cubic-bezier(0.16, 1, 0.3, 1)",
      use: "enter, hover settle",
    },
    /** 닫힘·퇴장 */
    in: {
      css: "cubic-bezier(0.4, 0, 1, 1)",
      use: "exit, dismiss",
    },
    /** 대칭 전환 */
    inOut: {
      css: "cubic-bezier(0.4, 0, 0.2, 1)",
      use: "layout shift (rare)",
    },
  },
} as const;

/** 하위 호환 */
export const MOTION_DEFAULT = {
  durationMs: 180,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;
