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

const AI_DRAFT_ROUTE = "/api/ai/draft";

/**
 * Phase 2 provider — 브라우저에서 Route Handler(`/api/ai/draft`)를 호출해 로컬 Ollama로 초안 생성.
 * 라우트가 503/오류를 반환하면 throw — 호출부(subjectDetailJobStore)가 entry 단위로 잡아
 * `aiText = rawText` 폴백 처리함.
 */
export function createOllamaDraftProvider(): DraftProvider {
  return {
    async generate({ rawText }) {
      const response = await fetch(AI_DRAFT_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      if (!response.ok) {
        let message = `Ollama 초안 생성 실패 (status ${response.status})`;
        try {
          const data = (await response.json()) as { error?: unknown };
          if (typeof data.error === "string" && data.error) {
            message = data.error;
          }
        } catch {
          // 오류 응답 본문이 JSON이 아니면 기본 메시지 사용
        }
        throw new Error(message);
      }

      const data = (await response.json()) as { aiText?: unknown };
      if (typeof data.aiText !== "string" || !data.aiText) {
        throw new Error("Ollama 응답에 aiText가 없습니다.");
      }
      return data.aiText;
    },
  };
}

let mockProviderSingleton: DraftProvider | null = null;
let ollamaProviderSingleton: DraftProvider | null = null;

export type DraftProviderMode = "mock" | "ollama";

/**
 * `NEXT_PUBLIC_AI_DRAFT_PROVIDER` (클라이언트/브라우저) 또는 `AI_DRAFT_PROVIDER` (서버·테스트
 * 전용 컨텍스트) 플래그를 읽음. 미설정/알 수 없는 값은 mock.
 *
 * 파이프라인은 브라우저에서 실행되므로 `NEXT_PUBLIC_*`가 아닌 `AI_DRAFT_PROVIDER`만 설정하면
 * Next.js가 클라이언트 번들에 이를 인라인하지 않아 실제로는 활성화되지 않는다. 따라서
 * `NEXT_PUBLIC_AI_DRAFT_PROVIDER`를 우선 확인하고, 그것이 없을 때만 `AI_DRAFT_PROVIDER`(서버
 * 전용 코드나 Vitest처럼 process.env를 직접 읽는 컨텍스트)로 폴백한다.
 */
export function resolveDraftProviderMode(): DraftProviderMode {
  const raw =
    process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER ??
    process.env.AI_DRAFT_PROVIDER ??
    "mock";
  return raw.trim().toLowerCase() === "ollama" ? "ollama" : "mock";
}

/** 현재 활성 DraftProvider. 플래그가 `ollama`면 OllamaDraftProvider, 그 외엔 mock */
export function getActiveDraftProvider(): DraftProvider {
  const mode = resolveDraftProviderMode();

  if (mode === "ollama") {
    if (!ollamaProviderSingleton) {
      ollamaProviderSingleton = createOllamaDraftProvider();
    }
    return ollamaProviderSingleton;
  }

  if (!mockProviderSingleton) {
    mockProviderSingleton = createMockDraftProvider();
  }
  return mockProviderSingleton;
}
