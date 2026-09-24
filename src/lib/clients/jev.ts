import { z } from "zod";
import type { JevResult } from "../types";

const answerSchema = z.object({
  model: z.string().min(1),
  answers: z.object({
    fit: z.object({ type: z.literal("noul"), noul: z.number().finite().min(0).max(1) }),
  }),
});

export type JevErrorCode = "not_configured" | "timeout" | "upstream" | "invalid_response";

export class JevClientError extends Error {
  constructor(public readonly code: JevErrorCode, message: string) {
    super(message);
    this.name = "JevClientError";
  }
}

export async function evaluateJev(task: string): Promise<JevResult> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const experientialKey = process.env.EXPERIENTIAL_API_KEY;
  const typeSafeKey = process.env.TYPESAFE_API_KEY;
  const apiKey = openRouterKey || experientialKey || typeSafeKey;
  if (!apiKey) throw new JevClientError("not_configured", "Jev is not configured yet.");
  const endpoint = openRouterKey
    ? "https://openrouter.ai/api/alpha/decisions"
    : experientialKey
      ? "https://api.experientiallabs.ai/v1/systemone"
      : "https://api.typesafe.ai/v1/systemone";

  const start = performance.now();
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: openRouterKey ? "typesafe/jev-1.13" : "jev-latest",
        state: task,
        questions: {
          fit: {
            type: "noul",
            instructions: "Is this task suitable for Jev to perform?",
            criteria: {
              true: "The task is primarily a bounded decision such as classification, routing, ranking, scoring, or verification, with a predefined output.",
              false: "The task requires substantial open-ended text, code, image, or other content generation rather than a bounded decision.",
            },
          },
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new JevClientError("timeout", "Jev took too long to respond. Please try again.");
    }
    throw new JevClientError("upstream", "Jev could not be reached. Please try again.");
  }

  if (!response.ok) {
    throw new JevClientError("upstream", response.status === 429
      ? "Jev is busy. Please try again shortly."
      : "Jev is unavailable. Please try again.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new JevClientError("invalid_response", "Jev returned an unreadable response.");
  }

  const parsed = answerSchema.safeParse(payload);
  if (!parsed.success) {
    throw new JevClientError("invalid_response", "Jev returned an invalid answer.");
  }

  const yesProbability = parsed.data.answers.fit.noul;
  const verdict = yesProbability >= 0.5 ? "YES" : "NO";
  return {
    verdict,
    yesProbability,
    answerProbability: verdict === "YES" ? yesProbability : 1 - yesProbability,
    latencyMs: Math.max(1, Math.round(performance.now() - start)),
    model: parsed.data.model,
  };
}
