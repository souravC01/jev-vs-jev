import type { ExampleTask } from "./types";

export const SITE_METADATA = {
  title: "Jev vs. Jev",
  description: "Describe a task. Jev decides whether Jev should handle it.",
};

export const EXAMPLE_TASKS: ExampleTask[] = [
  { id: "support", title: "Route support tickets", category: "Decision", task: "Classify support tickets as billing, technical, sales, or account management." },
  { id: "fraud", title: "Flag suspicious payments", category: "Decision", task: "Decide whether a transaction looks suspicious and needs manual review." },
  { id: "tools", title: "Pick an agent tool", category: "Decision", task: "Choose which of five tools an AI agent should call for a user request." },
  { id: "writing", title: "Write a blog post", category: "Generation", task: "Write a 1,500-word blog post about cloud computing with code samples." },
  { id: "coding", title: "Build a dashboard", category: "Generation", task: "Build a React dashboard from a product description." },
  { id: "recursive", title: "The obvious question", category: "Recursive", task: "Should Jev decide whether I should use Jev?" },
];
