import type { PromptVariant } from "./types";

/**
 * 학습용 프롬프트 슬롯 — 소유자가 나중에 채운다.
 * 런타임 `subjectDetailPrompt.ts`와 분리되어 있다.
 *
 * 채우는 법:
 * 1. 아래 배열에 `{ id, system, userTemplate }` 추가
 * 2. `userTemplate`에 `{{rawText}}` 포함
 * 3. `npm run train:smoke` (Ollama 기동)
 *
 * 비어 있으면 스모크 러너는 Ollama를 호출하지 않고 안내 메시지와 함께 종료한다.
 */
export const PROMPT_SLOTS: PromptVariant[] = [
  // 예:
  // {
  //   id: "slot-a",
  //   system: "...",
  //   userTemplate: "원본:\n{{rawText}}\n\n세특 문장으로 다듬어 주세요.",
  // },
];

/** 채택된 winning prompt id를 런타임에 연결할 때 읽을 훅 (Phase B) */
let adoptedPromptId: string | null = null;

export function getActiveTrainPromptId(): string | null {
  return adoptedPromptId;
}

/** 스모크/채택 결과에서 호출 — 런타임 DraftProvider 연결은 이후 단계 */
export function setActiveTrainPromptId(id: string | null): void {
  adoptedPromptId = id;
}

export function renderUserPrompt(template: string, rawText: string): string {
  if (!template.includes("{{rawText}}")) {
    throw new Error("userTemplate에 {{rawText}} 플레이스홀더가 필요합니다.");
  }
  return template.split("{{rawText}}").join(rawText);
}

export function assertPromptsReady(slots: PromptVariant[] = PROMPT_SLOTS):
  | {
      ok: true;
    }
  | { ok: false; message: string } {
  if (slots.length === 0) {
    return {
      ok: false,
      message:
        "프롬프트를 src/lib/subjectDetailTrain/promptRegistry.ts 의 PROMPT_SLOTS에 넣은 뒤 재실행하세요.",
    };
  }
  for (const slot of slots) {
    if (!slot.id?.trim()) {
      return { ok: false, message: "prompt slot id가 비어 있습니다." };
    }
    if (!slot.system?.trim()) {
      return {
        ok: false,
        message: `prompt slot "${slot.id}"의 system이 비어 있습니다.`,
      };
    }
    if (!slot.userTemplate.includes("{{rawText}}")) {
      return {
        ok: false,
        message: `prompt slot "${slot.id}"의 userTemplate에 {{rawText}}가 필요합니다.`,
      };
    }
  }
  return { ok: true };
}
