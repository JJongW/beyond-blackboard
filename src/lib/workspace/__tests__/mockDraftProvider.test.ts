import { afterEach, describe, it, expect } from "vitest";
import {
  createMockDraftProvider,
  getActiveDraftProvider,
  resolveDraftProviderMode,
} from "../draftProvider";
import { MOCK_DRAFT_MAX_LENGTH } from "../subjectDetailPrompt";

describe("createMockDraftProvider", () => {
  const provider = createMockDraftProvider();

  it("returns non-empty text for non-empty input", async () => {
    const result = await provider.generate({ rawText: "수학을 좋아함" });
    expect(result.length).toBeGreaterThan(0);
  });

  it("normalizes excess whitespace and joins short lines", async () => {
    const result = await provider.generate({
      rawText: "수업 중\n  질문을   자주 함\n\n토론에도 적극적임",
    });
    expect(result).not.toMatch(/\n/);
    expect(result).not.toMatch(/\s{2,}/);
  });

  it("ensures the draft ends with sentence punctuation", async () => {
    const result = await provider.generate({ rawText: "성실함" });
    expect(result).toMatch(/[.!?]$/);
  });

  it("does not duplicate punctuation when input already ends with one", async () => {
    const result = await provider.generate({ rawText: "발표를 잘함." });
    expect(result.endsWith("..")).toBe(false);
  });

  it("is deterministic for the same input", async () => {
    const a = await provider.generate({ rawText: "수학을 좋아함" });
    const b = await provider.generate({ rawText: "수학을 좋아함" });
    expect(a).toBe(b);
  });

  it("applies a soft max length cap for very long input", async () => {
    const longText = "수학 시간에 적극적으로 참여함 ".repeat(40);
    const result = await provider.generate({ rawText: longText });
    expect(result.length).toBeLessThanOrEqual(MOCK_DRAFT_MAX_LENGTH + 1);
    expect(result).toMatch(/[.!?]$/);
  });

  it("prefers truncating at the last sentence boundary within the cap", async () => {
    const longText = "학급 활동에 성실히 참여함. ".repeat(60);
    const result = await provider.generate({ rawText: longText });
    expect(result.length).toBeLessThanOrEqual(MOCK_DRAFT_MAX_LENGTH + 1);
    expect(result.endsWith("참여함.")).toBe(true);
  });

  it("falls back to a word boundary when no sentence punctuation is present", async () => {
    const longText = Array.from({ length: 300 }, (_, i) => `키워드${i}`).join(
      " ",
    );
    const result = await provider.generate({ rawText: longText });
    const withoutTrailingPeriod = result.endsWith(".")
      ? result.slice(0, -1)
      : result;
    const tokens = withoutTrailingPeriod.split(" ");
    const lastToken = tokens[tokens.length - 1];
    expect(lastToken).toMatch(/^키워드\d+$/);
    expect(result.length).toBeLessThanOrEqual(MOCK_DRAFT_MAX_LENGTH + 1);
  });
});

describe("getActiveDraftProvider", () => {
  it("defaults to a working mock provider", async () => {
    const provider = getActiveDraftProvider();
    const result = await provider.generate({ rawText: "발표를 잘함" });
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("resolveDraftProviderMode", () => {
  const originalServerEnv = process.env.AI_DRAFT_PROVIDER;
  const originalPublicEnv = process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER;

  afterEach(() => {
    if (originalServerEnv === undefined) {
      delete process.env.AI_DRAFT_PROVIDER;
    } else {
      process.env.AI_DRAFT_PROVIDER = originalServerEnv;
    }
    if (originalPublicEnv === undefined) {
      delete process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER;
    } else {
      process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER = originalPublicEnv;
    }
  });

  it("defaults to mock when unset", () => {
    delete process.env.AI_DRAFT_PROVIDER;
    delete process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER;
    expect(resolveDraftProviderMode()).toBe("mock");
  });

  it("falls back to mock for unknown values", () => {
    delete process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER;
    process.env.AI_DRAFT_PROVIDER = "something-else";
    expect(resolveDraftProviderMode()).toBe("mock");
  });

  it("recognizes the ollama flag via AI_DRAFT_PROVIDER (server-only contexts)", () => {
    delete process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER;
    process.env.AI_DRAFT_PROVIDER = "ollama";
    expect(resolveDraftProviderMode()).toBe("ollama");
  });

  it("recognizes the ollama flag via NEXT_PUBLIC_AI_DRAFT_PROVIDER (browser)", () => {
    delete process.env.AI_DRAFT_PROVIDER;
    process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER = "ollama";
    expect(resolveDraftProviderMode()).toBe("ollama");
  });

  it("prefers NEXT_PUBLIC_AI_DRAFT_PROVIDER over AI_DRAFT_PROVIDER when both are set", () => {
    // 파이프라인은 브라우저에서 실행되므로 클라이언트 번들에 인라인되는
    // NEXT_PUBLIC_* 쪽이 실제로 유효한 값 — AI_DRAFT_PROVIDER만으로는
    // 브라우저에서 Ollama가 켜지지 않는다는 리뷰 지적을 회귀 방지로 고정.
    process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER = "mock";
    process.env.AI_DRAFT_PROVIDER = "ollama";
    expect(resolveDraftProviderMode()).toBe("mock");

    process.env.NEXT_PUBLIC_AI_DRAFT_PROVIDER = "ollama";
    process.env.AI_DRAFT_PROVIDER = "mock";
    expect(resolveDraftProviderMode()).toBe("ollama");
  });

  // getActiveDraftProvider의 ollama 분기 동작(실제 fetch 호출)은
  // ollamaDraftProvider.test.ts에서 fetch를 mock해 검증함.
});
