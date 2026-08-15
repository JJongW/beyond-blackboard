import { describe, it, expect, vi } from "vitest";
import { generateCandidate } from "../studentAgent";
import type { PromptVariant } from "../types";

const prompt: PromptVariant = {
  id: "slot-a",
  system: "sys",
  userTemplate: "원본:{{rawText}}",
};

describe("studentAgent", () => {
  it("calls ollama without gold text in body", async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      const blob = JSON.stringify(body);
      expect(blob).not.toContain("GOLD_SECRET");
      expect(blob).toContain("관찰원문");
      return {
        ok: true,
        json: async () => ({ message: { content: " 후보 문장. " } }),
      } as Response;
    });

    const result = await generateCandidate({
      rawText: "관찰원문",
      prompt,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(result.candidateText).toBe("후보 문장.");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});
