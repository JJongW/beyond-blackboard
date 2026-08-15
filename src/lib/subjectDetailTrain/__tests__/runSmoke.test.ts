import { describe, it, expect } from "vitest";
import { runTrainSmoke } from "../runSmoke";
import { PROMPT_SLOTS } from "../promptRegistry";

describe("runTrainSmoke", () => {
  it("blocks when PROMPT_SLOTS is empty", async () => {
    expect(PROMPT_SLOTS).toHaveLength(0);
    const result = await runTrainSmoke();
    expect(result.status).toBe("blocked_empty_prompts");
    if (result.status === "blocked_empty_prompts") {
      expect(result.message).toContain("PROMPT_SLOTS");
    }
  });
});
