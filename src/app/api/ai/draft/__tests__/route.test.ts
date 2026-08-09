import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/ai/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/ai/draft", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns 400 when rawText is missing", async () => {
    const response = await POST(makeRequest({}));
    expect(response.status).toBe(400);
  });

  it("returns 400 when rawText is blank", async () => {
    const response = await POST(makeRequest({ rawText: "   " }));
    expect(response.status).toBe(400);
  });

  it("proxies to Ollama and returns aiText on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: "다듬어진 문장." } }),
    }) as unknown as typeof fetch;

    const response = await POST(makeRequest({ rawText: "수학을 좋아함" }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ aiText: "다듬어진 문장." });
  });

  it("returns 503 with an error message when Ollama is unreachable", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("fetch failed")) as unknown as typeof fetch;

    const response = await POST(makeRequest({ rawText: "수학을 좋아함" }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("fetch failed");
  });

  it("returns 503 when Ollama responds with a non-OK status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as unknown as typeof fetch;

    const response = await POST(makeRequest({ rawText: "수학을 좋아함" }));
    expect(response.status).toBe(503);
  });

  it("returns 503 when Ollama returns an empty message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: "" } }),
    }) as unknown as typeof fetch;

    const response = await POST(makeRequest({ rawText: "수학을 좋아함" }));
    expect(response.status).toBe(503);
  });
});
