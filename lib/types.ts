import { z } from "zod";

export const TaskInputSchema = z.object({
  task: z.string().trim().min(1, "Task description cannot be empty").max(2000, "Task description must not exceed 2,000 characters"),
});

export type Verdict = "YES" | "NO";

export interface JevResult {
  verdict: Verdict;
  yesProbability: number;
  answerProbability: number;
  latencyMs: number;
  model: string;
}

export interface EvaluationResponse {
  task: string;
  result: JevResult;
}

export interface ExampleTask {
  id: string;
  title: string;
  category: string;
  task: string;
}
