import { NextRequest, NextResponse } from "next/server";
import {
  SUBJECT_DETAIL_SYSTEM_PROMPT,
  buildOllamaUserPrompt,
} from "@/lib/workspace/subjectDetailPrompt";

export const runtime = "nodejs";

type OllamaChatResponse = {
  message?: { content?: string };
};

/** Ollama 호출 타임아웃(ms) — 로컬 모델 응답이 무한정 걸려 요청이 hang되는 것을 방지 */
const OLLAMA_TIMEOUT_MS = 30_000;
/** 허용 최대 rawText 길이 — 과도하게 큰 입력이 Ollama를 오래 붙잡거나 프롬프트를 깨뜨리지 않도록 제한 */
const MAX_RAW_TEXT_LENGTH = 5_000;

/**
 * 과목별 세부특기사항 초안 생성 Route Handler — 브라우저는 로컬 Ollama에 직접 접근할 수
 * 없으므로(CORS/네트워크) 서버를 경유. 실패 시 503으로 응답하고, 클라이언트(OllamaDraftProvider)가
 * catch해 파이프라인에서 원본 텍스트로 폴백함.
 */
export async function POST(request: NextRequest) {
  let rawText: unknown;
  try {
    const body = await request.json();
    rawText = (body as { rawText?: unknown } | null)?.rawText;
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 파싱할 수 없습니다." },
      { status: 400 },
    );
  }

  if (typeof rawText !== "string" || !rawText.trim()) {
    return NextResponse.json(
      { error: "rawText가 비어 있습니다." },
      { status: 400 },
    );
  }

  if (rawText.length > MAX_RAW_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `rawText가 너무 깁니다. (최대 ${MAX_RAW_TEXT_LENGTH}자)` },
      { status: 400 },
    );
  }

  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: SUBJECT_DETAIL_SYSTEM_PROMPT },
          { role: "user", content: buildOllamaUserPrompt(rawText) },
        ],
      }),
      signal: AbortSignal.timeout(OLLAMA_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Ollama 서버 응답 오류 (status ${response.status})`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    const aiText = data.message?.content?.trim();
    if (!aiText) {
      throw new Error("Ollama 응답에 내용이 없습니다.");
    }

    return NextResponse.json({ aiText });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ollama 서버에 연결할 수 없습니다.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
