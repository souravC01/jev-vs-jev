import type { EvaluationResponse } from "./types";

export function formatResultForClipboard(response: EvaluationResponse): string {
  const percent = Math.round(response.result.answerProbability * 100);
  const side = response.result.verdict.toLowerCase();
  return [
    "I asked Jev if Jev should handle: " + response.task,
    "Jev says " + response.result.verdict + " (" + percent + "% toward " + side + ").",
    "A playful experiment, not a capability guarantee.",
  ].join("\n");
}

export function encodeTaskToUrl(task: string): string {
  return encodeURIComponent(task);
}

export function decodeTaskFromUrl(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}
