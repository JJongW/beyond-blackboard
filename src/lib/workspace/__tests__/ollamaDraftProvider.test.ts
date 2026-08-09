import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createOllamaDraftProvider,
  getActiveDraftProvider,
} from "../draftProvider";

function mockFetchOnce(response: {
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
}) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe("createOllamaDraftProvider", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("POSTs rawText to /api/ai/draft and returns aiText on success", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      json: async () => ({ aiText: "다듬어진 문장입니다." }),
    });

    const provider = createOllamaDraftProvider();
    const result = await provider.generate({ rawText: "수학을 좋아함" });

    expect(result).toBe("다듬어진 문장입니다.");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/draft",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: "수학을 좋아함" }),
      }),
    );
  });

  it("throws using the route's error message when the response is not OK", async () => {
    mockFetchOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: "Ollama 서버에 연결할 수 없습니다." }),
    });

    const provider = createOllamaDraftProvider();
    await expect(provider.generate({ rawText: "테스트" })).rejects.toThrow(
      "Ollama 서버에 연결할 수 없습니다.",
    );
  });

  it("falls back to a status-based message when the error body isn't usable JSON", async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("not json");
      },
    });

    const provider = createOllamaDraftProvider();
    await expect(provider.generate({ rawText: "테스트" })).rejects.toThrow(
      /500/,
    );
  });

  it("throws when the success response has no aiText", async () => {
    mockFetchOnce({ ok: true, json: async () => ({}) });

    const provider = createOllamaDraftProvider();
    await expect(provider.generate({ rawText: "테스트" })).rejects.toThrow(
      /aiText/,
    );
  });

  it("propagates network errors (e.g. fetch rejecting) as a throw", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    const provider = createOllamaDraftProvider();
    await expect(provider.generate({ rawText: "테스트" })).rejects.toThrow(
      "network down",
    );
  });
});

describe("getActiveDraftProvider with AI_DRAFT_PROVIDER=ollama", () => {
  const originalEnv = process.env.AI_DRAFT_PROVIDER;
  const originalFetch = global.fetch;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AI_DRAFT_PROVIDER;
    } else {
      process.env.AI_DRAFT_PROVIDER = originalEnv;
    }
    global.fetch = originalFetch;
  });

  it("returns an Ollama-backed provider that calls fetch", async () => {
    process.env.AI_DRAFT_PROVIDER = "ollama";
    const fetchMock = mockFetchOnce({
      ok: true,
      json: async () => ({ aiText: "ollama 결과" }),
    });

    const provider = getActiveDraftProvider();
    const result = await provider.generate({ rawText: "원본" });

    expect(result).toBe("ollama 결과");
    expect(fetchMock).toHaveBeenCalled();
  });
});
