import { describe, it, expect } from "vitest";
import { TaskInputSchema } from "@/lib/types";
import { EXAMPLE_TASKS } from "@/lib/constants";

describe("Types & Schemas", () => {
  it("validates task input correctly within length limits", () => {
    // Valid inputs
    expect(TaskInputSchema.safeParse({ task: "Classify support tickets" }).success).toBe(true);
    expect(TaskInputSchema.safeParse({ task: "A".repeat(1500) }).success).toBe(true);

    // Invalid inputs: empty or whitespaces only
    expect(TaskInputSchema.safeParse({ task: "" }).success).toBe(false);
    expect(TaskInputSchema.safeParse({ task: "   " }).success).toBe(false);

    // Invalid input: exceeds 2000 characters
    expect(TaskInputSchema.safeParse({ task: "A".repeat(2001) }).success).toBe(false);
  });

  it("offers decision, generation, and recursive examples", () => {
    expect(EXAMPLE_TASKS.length).toBeGreaterThanOrEqual(6);

    const categories = EXAMPLE_TASKS.map((e) => e.id);
    expect(categories).toContain("support");
    expect(categories).toContain("fraud");
    expect(categories).toContain("tools");
    expect(categories).toContain("writing");
    expect(categories).toContain("coding");
    expect(categories).toContain("recursive");

    EXAMPLE_TASKS.forEach((ex) => {
      expect(ex.title).toBeTruthy();
      expect(ex.task.trim().length).toBeGreaterThan(10);
    });
  });
});
