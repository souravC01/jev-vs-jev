import { describe, expect, it } from "vitest";
import { formatResultForClipboard, encodeTaskToUrl, decodeTaskFromUrl } from "@/lib/share";
import type { EvaluationResponse } from "@/lib/types";

describe("sharing", () => {
  it("copies one Jev answer without claims about other models", () => {
    const response: EvaluationResponse = {
      task: "Route support tickets",
      result: {
        verdict: "YES",
        yesProbability: 0.87,
        answerProbability: 0.87,
        latencyMs: 128,
        model: "jev-1.13.0",
      },
    };
    expect(formatResultForClipboard(response)).toBe(
      "I asked Jev if Jev should handle: Route support tickets\nJev says YES (87% toward yes).\nA playful experiment, not a capability guarantee."
    );
  });

  it("round-trips a task containing punctuation through a URL", () => {
    const task = "Classify billing & support tickets?";
    expect(decodeTaskFromUrl(encodeTaskToUrl(task))).toBe(task);
  });
});
