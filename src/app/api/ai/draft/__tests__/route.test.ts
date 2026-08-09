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

  it("returns 400 when rawText exceeds the max length", async () => {
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;

    const response = await POST(makeRequest({ rawText: "가".repeat(5001) }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("5000");
    expect(fetchSpy).not.toHaveBeenCalled();
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

  it("passes an abort signal to fetch so a hung Ollama call times out", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: "다듬어진 문장." } }),
    });
    global.fetch = fetchSpy as unknown as typeof fetch;

    await POST(makeRequest({ rawText: "수학을 좋아함" }));

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("returns 503 when the Ollama call times out", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(
        new DOMException(
          "The operation was aborted due to timeout",
          "TimeoutError",
        ),
      ) as unknown as typeof fetch;

    const response = await POST(makeRequest({ rawText: "수학을 좋아함" }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toContain("timeout");
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
