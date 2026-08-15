import type {
  AdoptResult,
  Attempt,
  DpoPair,
  GoldPair,
  PromptStat,
} from "./types";

/**
 * 시도 결과를 프롬프트별로 집계해 winning prompt를 고르고,
 * gold별로 최고/최저 후보가 다르면 DPO 쌍을 만든다.
 */
export function adoptFromAttempts(
  golds: GoldPair[],
  attempts: Attempt[],
  now = () => new Date().toISOString(),
): AdoptResult {
  const byPrompt = new Map<string, number[]>();
  for (const a of attempts) {
    const list = byPrompt.get(a.promptId) ?? [];
    list.push(a.score);
    byPrompt.set(a.promptId, list);
  }

  const promptStats: PromptStat[] = [...byPrompt.entries()].map(
    ([promptId, scores]) => ({
      promptId,
      n: scores.length,
      meanScore: scores.reduce((s, x) => s + x, 0) / Math.max(1, scores.length),
    }),
  );

  promptStats.sort((a, b) => b.meanScore - a.meanScore);

  const winningPromptId =
    promptStats.length > 0 ? promptStats[0].promptId : null;

  const goldById = new Map(golds.map((g) => [g.id, g]));
  const dpoPairs: DpoPair[] = [];

  const byGold = new Map<string, Attempt[]>();
  for (const a of attempts) {
    const list = byGold.get(a.goldId) ?? [];
    list.push(a);
    byGold.set(a.goldId, list);
  }

  for (const [goldId, list] of byGold) {
    const gold = goldById.get(goldId);
    if (!gold || list.length < 2) continue;
    const sorted = [...list].sort((a, b) => b.score - a.score);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    if (best.candidateText === worst.candidateText) continue;
    if (best.score <= worst.score) continue;
    dpoPairs.push({
      goldId,
      rawText: gold.rawText,
      chosen: best.candidateText,
      rejected: worst.candidateText,
    });
  }

  return {
    winningPromptId,
    promptStats,
    dpoPairs,
    createdAt: now(),
  };
}
