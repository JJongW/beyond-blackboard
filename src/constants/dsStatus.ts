/**
 * Design System Status — Done = React 구현 + Preview 허용
 * Planned = 문서만 (가짜 Preview 금지)
 */

export type DsStatus = "Done" | "Planned";

/** Phase 1–2 구현 완료 컴포넌트 slug */
export const DS_DONE_COMPONENT_SLUGS = new Set<string>([
  "action-button",
  "alert-dialog",
  "avatar",
  "badge",
  "callout",
  "card",
  "checkbox",
  "chip",
  "dialog",
  "divider",
  "field",
  "floating-action-button",
  "help-bubble",
  "list",
  "menu",
  "notification-badge",
  "page-banner",
  "progress-circle",
  "radio",
  "reaction-button",
  "result-section",
  "segmented-control",
  "select",
  "select-box",
  "side-navigation",
  "skeleton",
  "snackbar",
  "switch",
  "tabs",
  "tag-group",
  "text-input",
  "top-navigation",
  "accordion",
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
    return DS_DONE_COMPONENT_SLUGS.has(slug) ? "Done" : "Planned";
  }
  if (group === "foundations") {
    return DS_DONE_FOUNDATION_SLUGS.has(slug) ? "Done" : "Planned";
  }
  return DS_DONE_PATTERN_SLUGS.has(slug) ? "Done" : "Planned";
}
