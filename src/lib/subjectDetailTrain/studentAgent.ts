import { renderUserPrompt } from "./promptRegistry";
import type { PromptVariant } from "./types";

export type StudentGenerateInput = {
  rawText: string;
  prompt: PromptVariant;
  temperature?: number;
  baseUrl?: string;
  model?: string;
  /** 테스트용 fetch 주입 */
  fetchImpl?: typeof fetch;
};

export type StudentGenerateResult = {
  candidateText: string;
};

type OllamaChatResponse = {
  message?: { content?: string };
};

/**
 * 시도 에이전트 — 정답(gold)을 절대 프롬프트에 넣지 않는다.
 * 기존 앱과 동일하게 OLLAMA_BASE_URL / OLLAMA_MODEL env를 기본값으로 쓴다.
 */
export async function generateCandidate(
  input: StudentGenerateInput,
): Promise<StudentGenerateResult> {
  const baseUrl =
    input.baseUrl ?? process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const model = input.model ?? process.env.OLLAMA_MODEL ?? "llama3.2";
  const temperature = input.temperature ?? 0.2;
  const fetchImpl = input.fetchImpl ?? fetch;

  const user = renderUserPrompt(input.prompt.userTemplate, input.rawText);

  const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      options: { temperature },
      messages: [
        { role: "system", content: input.prompt.system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Ollama 응답 오류 (status ${response.status})`);
  }

  const data = (await response.json()) as OllamaChatResponse;
  const candidateText = data.message?.content?.trim();
  if (!candidateText) {
    throw new Error("Ollama 응답에 내용이 없습니다.");
  }

  return { candidateText };
}

/** Ollama 생존 여부 — 스모크 dry-run 분기용 */
export async function isOllamaReachable(
  baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const res = await fetchImpl(baseUrl.replace(/\/$/, "") + "/", {
      signal: AbortSignal.timeout(3_000),
    });
    return res.ok || res.status === 200;
  } catch {
    return false;
  }
}
