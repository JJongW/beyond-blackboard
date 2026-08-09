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

export type DraftProviderMode = "mock" | "ollama";

/** `AI_DRAFT_PROVIDER` (서버) 또는 `NEXT_PUBLIC_AI_DRAFT_PROVIDER` (클라이언트) 플래그를 읽음. 미설정/알 수 없는 값은 mock */
export function resolveDraftProviderMode(): DraftProviderMode {
  const raw =
    process.env.AI_DRAFT_PROVIDER ??
    process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER ??
    "mock";
  return raw.trim().toLowerCase() === "ollama" ? "ollama" : "mock";
}

/**
 * 현재 활성 DraftProvider.
 * 플래그가 `ollama`여도 Phase 2 OllamaDraftProvider는 아직 미구현이라 mock으로 폴백.
 */
export function getActiveDraftProvider(): DraftProvider {
  const mode = resolveDraftProviderMode();
  // Phase 2 자리: mode === "ollama"일 때 createOllamaDraftProvider()로 교체 예정.
  void mode;

  if (!mockProviderSingleton) {
    mockProviderSingleton = createMockDraftProvider();
  }
  return mockProviderSingleton;
}
