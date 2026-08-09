import { describe, it, expect } from "vitest";
import {
  createMockDraftProvider,
  getActiveDraftProvider,
} from "../draftProvider";

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
});

describe("getActiveDraftProvider", () => {
  it("defaults to a working mock provider", async () => {
    const provider = getActiveDraftProvider();
    const result = await provider.generate({ rawText: "발표를 잘함" });
    expect(result.length).toBeGreaterThan(0);
  });
});
