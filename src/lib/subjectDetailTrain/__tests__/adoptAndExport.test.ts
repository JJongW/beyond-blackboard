import { describe, it, expect } from "vitest";
import { adoptFromAttempts } from "../adopt";
import { toDpoRows, toSftRows, toJsonl } from "../exportDataset";
import type { Attempt, GoldPair } from "../types";

const golds: GoldPair[] = [
  { id: "g1", rawText: "관찰1", goldText: "정답1" },
  { id: "g2", rawText: "관찰2", goldText: "정답2" },
];

describe("adoptFromAttempts", () => {
  it("picks highest mean score prompt", () => {
    const attempts: Attempt[] = [
      {
        goldId: "g1",
        promptId: "weak",
        temperature: 0.2,
        candidateText: "약함",
        score: 0.2,
        createdAt: "t",
      },
      {
        goldId: "g1",
        promptId: "strong",
        temperature: 0.2,
        candidateText: "강함-좋음",
        score: 0.9,
        createdAt: "t",
      },
      {
        goldId: "g2",
        promptId: "strong",
        temperature: 0.2,
        candidateText: "강함2",
        score: 0.8,
        createdAt: "t",
      },
      {
        goldId: "g2",
        promptId: "weak",
        temperature: 0.2,
        candidateText: "약함2",
        score: 0.1,
        createdAt: "t",
      },
    ];
    const result = adoptFromAttempts(golds, attempts, () => "now");
    expect(result.winningPromptId).toBe("strong");
    expect(result.dpoPairs.length).toBe(2);
    expect(result.dpoPairs[0].chosen).toContain("강함");
    expect(result.dpoPairs[0].rejected).toContain("약함");
  });
});

describe("exportDataset", () => {
  it("builds sft and dpo jsonl", () => {
    const sft = toSftRows(golds);
    expect(toJsonl(sft)).toContain('"goldText":"정답1"');
    const adopt = adoptFromAttempts(golds, [
      {
        goldId: "g1",
        promptId: "a",
        temperature: 0.2,
        candidateText: "good",
        score: 0.9,
        createdAt: "t",
      },
      {
        goldId: "g1",
        promptId: "b",
        temperature: 0.2,
        candidateText: "bad",
        score: 0.1,
        createdAt: "t",
      },
    ]);
    const dpo = toDpoRows(adopt);
    expect(dpo[0].chosen).toBe("good");
    expect(dpo[0].rejected).toBe("bad");
  });
});
