/**
 * Seed 토큰 이름 alias — `--cp-*` 유지, Seed 스케일/이름만 병기
 * 색 hex는 크레파스 파스텔 유지
 */

import { COLOR, RADIUS, SPACE, TYPE } from "@/constants/designTokens";

/** Seed $font-size.t* ↔ 크레파스 TYPE (본문 t5=16px) */
export const SEED_FONT_SIZE = {
  t1: 11,
  t2: 12,
  t3: 13,
  t4: 14,
  t5: TYPE.body.size,
  t6: 18,
  t7: TYPE.h2.size,
  t8: 22,
  t9: 24,
  t10: TYPE.h1.size,
  t11: 28,
  t12: 32,
} as const;

/** Seed spacing unit (4px 그리드) = SPACE */
export const SEED_SPACING = {
  x0_5: SPACE[1] / 2,
  x1: SPACE[1],
  x1_5: 6,
  x2: SPACE[2],
  x3: SPACE[3],
  x4: SPACE[4],
  x5: SPACE[5],
  x6: SPACE[6],
  x8: SPACE[8],
  x10: SPACE[10],
  x12: SPACE[12],
} as const;

/** Seed radius 이름 alias */
export const SEED_RADIUS = {
  r0_5: 4,
  r1: RADIUS.sm,
  r1_5: 10,
  r2: RADIUS.md,
  r3: RADIUS.lg,
  full: RADIUS.full,
} as const;

/** Seed role color → Crepass hex */
export const SEED_COLOR_ROLE = {
  "fg.neutral": COLOR.ink,
  "fg.neutralSubtle": COLOR.inkSecondary,
  "fg.neutralMuted": COLOR.inkMuted,
  "fg.brand": COLOR.brandInk,
  "fg.critical": COLOR.danger,
  "fg.warning": COLOR.warning,
  "bg.layerDefault": COLOR.surface,
  "bg.layerElevated": COLOR.surfaceElevated,
  "bg.layerFill": COLOR.surfaceCard,
  "bg.brandWeak": COLOR.brandMuted,
  "stroke.neutralMuted": COLOR.border,
  "bg.brandSolid": COLOR.brand,
} as const;
