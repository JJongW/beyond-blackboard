import type { GoldPair } from "./types";

export function parseGoldJsonl(text: string): GoldPair[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: GoldPair[] = [];
  for (let i = 0; i < lines.length; i++) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(lines[i]);
    } catch {
      throw new Error(`gold JSONL ${i + 1}행: JSON 파싱 실패`);
    }
    if (!parsed || typeof parsed !== "object") {
      throw new Error(`gold JSONL ${i + 1}행: 객체가 아닙니다`);
    }
    const row = parsed as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id.trim()) {
      throw new Error(`gold JSONL ${i + 1}행: id가 필요합니다`);
    }
    if (typeof row.rawText !== "string" || !row.rawText.trim()) {
      throw new Error(`gold JSONL ${i + 1}행: rawText가 필요합니다`);
    }
    if (typeof row.goldText !== "string" || !row.goldText.trim()) {
      throw new Error(`gold JSONL ${i + 1}행: goldText가 필요합니다`);
    }
    out.push({
      id: row.id.trim(),
      rawText: row.rawText,
      goldText: row.goldText,
      meta:
        row.meta && typeof row.meta === "object"
          ? (row.meta as GoldPair["meta"])
          : undefined,
    });
  }
  return out;
}
