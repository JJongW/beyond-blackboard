import { buildMockDraft } from "./subjectDetailPrompt";

export type DraftProvider = {
  generate(input: { rawText: string }): Promise<string>;
};

/** Phase 1 기본 provider — 규칙 기반 텍스트 정리 (실제 AI 호출 없음) */
export function createMockDraftProvider(): DraftProvider {
  return {
    async generate({ rawText }) {
      return buildMockDraft(rawText);
    },
  };
}

let mockProviderSingleton: DraftProvider | null = null;

/**
 * 현재 활성 DraftProvider.
 * Phase 2에서 `AI_DRAFT_PROVIDER=ollama` 등으로 분기 예정 — 이번 태스크는 mock 고정.
 */
export function getActiveDraftProvider(): DraftProvider {
  if (!mockProviderSingleton) {
    mockProviderSingleton = createMockDraftProvider();
  }
  return mockProviderSingleton;
}
