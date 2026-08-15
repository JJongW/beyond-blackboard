import type { ScoreResult } from "./types";

/** 채점 전 공백·문장부호 정규화 */
export function normalizeForScore(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/["""'']/g, "")
    .trim();
}

/** 공백·한글/영문/숫자 연속을 토큰으로 분리 */
export function tokenize(text: string): string[] {
  const normalized = normalizeForScore(text);
  if (!normalized) return [];
  return normalized.match(/[a-z0-9]+|[가-힣]+/g) ?? [];
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) {
    if (b.has(t)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * 후보 vs 골드 유사도 (0..1).
 * token Jaccard에 길이비 페널티를 곱해 과도하게 짧거나 긴 후보를 낮춘다.
 */
export function scoreCandidate(candidate: string, gold: string): ScoreResult {
  const candTokens = new Set(tokenize(candidate));
  const goldTokens = new Set(tokenize(gold));
  const j = jaccard(candTokens, goldTokens);

  const candLen = normalizeForScore(candidate).length;
  const goldLen = normalizeForScore(gold).length;
  const lengthRatio =
    goldLen === 0
      ? candLen === 0
        ? 1
        : 0
      : Math.min(candLen, goldLen) / Math.max(candLen, goldLen);

  // 길이비가 0.5 미만이면 페널티 강화
  const lengthFactor = 0.5 + 0.5 * lengthRatio;
  const score = Math.max(0, Math.min(1, j * lengthFactor));

  return {
    score,
    detail: { jaccard: j, lengthRatio },
  };
}
