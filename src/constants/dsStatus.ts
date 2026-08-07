/**
 * Design System Status — Done = React 구현 + Preview 허용
 * Planned = 문서만 (가짜 Preview 금지)
 * Excluded = 크레파스 범위 밖 (Bottom Nav 등)
 */

export type DsStatus = "Done" | "Planned" | "Excluded";

/** 구현 완료 컴포넌트 slug */
export const DS_DONE_COMPONENT_SLUGS = new Set<string>([
  "accordion",
  "action-button",
  "alert-dialog",
  "attachment-input",
  "avatar",
  "badge",
  "bottom-sheet",
  "callout",
  "card",
  "checkbox",
  "chip",
  "content-placeholder",
  "contextual-floating-button",
  "dialog",
  "divider",
  "field",
  "floating-action-button",
  "footer",
  "help-bubble",
  "identity-placeholder",
  "image-frame",
  "input-button",
  "list",
  "menu",
  "menu-sheet",
  "notification-badge",
  "page-banner",
  "progress-circle",
  "quantity-picker",
  "radio",
  "reaction-button",
  "result-section",
  "scroll-fog",
  "segmented-control",
  "select",
  "select-box",
  "side-navigation",
  "side-panel",
  "skeleton",
  "slider",
  "snackbar",
  "switch",
  "tabs",
  "tag-group",
  "text-input",
  "time-picker",
  "top-navigation",
]);

/** 의도적 미구현 (Grill: Bottom Nav 제외) */
export const DS_EXCLUDED_COMPONENT_SLUGS = new Set<string>([
  "bottom-navigation",
]);

/** Foundations — 런타임 토큰/문서 실재 */
export const DS_DONE_FOUNDATION_SLUGS = new Set<string>([
  "color",
  "design-token",
  "typography",
  "spacing",
  "radius",
  "elevation",
  "motion",
  "iconography",
  "state",
]);

/** Patterns */
export const DS_DONE_PATTERN_SLUGS = new Set<string>(["loading"]);

export function resolveDsStatus(
  group: "foundations" | "patterns" | "components",
  slug: string,
): DsStatus {
  if (group === "components") {
    if (DS_EXCLUDED_COMPONENT_SLUGS.has(slug)) return "Excluded";
    return DS_DONE_COMPONENT_SLUGS.has(slug) ? "Done" : "Planned";
  }
  if (group === "foundations") {
    return DS_DONE_FOUNDATION_SLUGS.has(slug) ? "Done" : "Planned";
  }
  return DS_DONE_PATTERN_SLUGS.has(slug) ? "Done" : "Planned";
}
