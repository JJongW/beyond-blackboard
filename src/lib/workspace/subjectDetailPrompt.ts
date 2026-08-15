/**
 * 세부특기사항 초안 생성 프롬프트 메타 + Mock 변환 규칙.
 * Phase 2 OllamaDraftProvider가 같은 시스템 프롬프트를 재사용할 수 있도록 분리.
 */

/** Phase 2 Ollama 연동 시 시스템 프롬프트로 사용 (Phase 1 mock은 미사용) */
export const SUBJECT_DETAIL_SYSTEM_PROMPT =
  "당신은 과목별 세부특기사항을 작성하는 보조 교사입니다. 학생의 활동 기록을 바탕으로 NEIS 양식에 맞는 자연스러운 문장으로 다듬어 주세요.";

/** Ollama chat API의 user 메시지 — 원본 텍스트를 NEIS 세부특기사항 문체로 변환 요청 */
export function buildOllamaUserPrompt(rawText: string): string {
  return [
    "다음은 학생의 활동에 대한 원본 기록입니다.",
    "이를 바탕으로 NEIS 과목별 세부능력 및 특기사항 양식에 맞는 자연스러운 한국어 문장으로 다듬어 주세요.",
    "- 서술형 종결어미(~함, ~보임, ~수행함 등)를 사용하세요.",
    "- 원본에 없는 내용을 지어내지 말고 사실에 기반해 작성하세요.",
    "- 완성된 문장만 출력하고, 설명이나 따옴표는 포함하지 마세요.",
    "",
    `원본: ${rawText}`,
  ].join("\n");
}

/** 줄바꿈·중복 공백 정리 후 한 문장 흐름으로 결합 */
export function normalizeWhitespace(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** 마침표/느낌표/물음표로 끝나지 않으면 마침표를 붙여 문장을 마무리 */
export function ensureSentenceEnding(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

/** 세부특기사항 한 항목의 소프트 상한 (글자 수). NEIS 특기사항 칸의 통상적인 분량 감안 */
export const MOCK_DRAFT_MAX_LENGTH = 500;

/**
 * 상한을 넘는 텍스트를 문장 경계(마침표/느낌표/물음표) 우선, 없으면 단어(공백) 경계에서 자름.
 * 두 경계 모두 없으면 상한에서 그대로 자름 (입력이 공백 없는 긴 문자열인 극단적 경우).
 */
export function truncateSoft(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const slice = text.slice(0, maxLength);
  const lastSentenceEnd = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf("!"),
    slice.lastIndexOf("?"),
  );
  if (lastSentenceEnd > 0) {
    return slice.slice(0, lastSentenceEnd + 1);
  }

  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 0) {
    return slice.slice(0, lastSpace);
  }

  return slice;
}

/** Mock 초안 변환: 공백 정규화 → 소프트 길이 제한 → 문장 부호 보정 (결정적 — 같은 입력엔 항상 같은 출력) */
export function buildMockDraft(rawText: string): string {
  const normalized = normalizeWhitespace(rawText);
  const truncated = truncateSoft(normalized, MOCK_DRAFT_MAX_LENGTH);
  return ensureSentenceEnding(truncated);
}
