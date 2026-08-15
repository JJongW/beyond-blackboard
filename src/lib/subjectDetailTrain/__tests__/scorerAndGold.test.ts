import { describe, it, expect } from "vitest";
import { scoreCandidate, tokenize } from "../scorer";
import { assertPromptsReady, renderUserPrompt } from "../promptRegistry";
import { parseGoldJsonl } from "../goldParser";
import type { PromptVariant } from "../types";

describe("scorer", () => {
  it("identical text scores near 1", () => {
    const text = "수학 개념을 빠르게 이해하고 친구에게 풀이 과정을 설명함.";
    const r = scoreCandidate(text, text);
    expect(r.score).toBeGreaterThan(0.95);
  });

  it("unrelated text scores low", () => {
    const r = scoreCandidate(
      "오늘 급식 메뉴는 비빔밥이었다.",
      "수학 개념을 빠르게 이해하고 친구에게 풀이 과정을 설명함.",
    );
    expect(r.score).toBeLessThan(0.25);
  });

  it("tokenize splits korean and latin", () => {
    expect(tokenize("수학 Math 12")).toEqual(["수학", "math", "12"]);
  });
});

describe("promptRegistry helpers", () => {
  it("blocks empty slots", () => {
    const r = assertPromptsReady([]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("PROMPT_SLOTS");
  });

  it("requires rawText placeholder", () => {
    const slots: PromptVariant[] = [
      { id: "a", system: "sys", userTemplate: "no placeholder" },
    ];
    const r = assertPromptsReady(slots);
    expect(r.ok).toBe(false);
  });

  it("renders user template", () => {
    expect(renderUserPrompt("원본:{{rawText}}", "관찰")).toBe("원본:관찰");
  });
});

describe("parseGoldJsonl", () => {
  it("parses valid rows", () => {
    const text = [
      JSON.stringify({
        id: "g1",
        rawText: "관찰",
        goldText: "세특",
        meta: { subject: "수학" },
      }),
      JSON.stringify({ id: "g2", rawText: "a", goldText: "b" }),
    ].join("\n");
    const rows = parseGoldJsonl(text);
    expect(rows).toHaveLength(2);
    expect(rows[0].meta?.subject).toBe("수학");
  });

  it("rejects missing goldText", () => {
    expect(() =>
      parseGoldJsonl(JSON.stringify({ id: "g1", rawText: "x" })),
    ).toThrow(/goldText/);
  });
});
