import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TaskInput } from "@/components/TaskInput";

describe("TaskInput", () => {
  const handlers = { onChange: () => {}, onSubmit: () => {}, onClear: () => {}, isLoading: false };

  it("offers Clear when a task is entered", () => {
    const markup = renderToStaticMarkup(createElement(TaskInput, { ...handlers, value: "Classify tickets" }));
    expect(markup).toContain("Clear");
  });

  it("does not offer Clear on the empty initial form", () => {
    const markup = renderToStaticMarkup(createElement(TaskInput, { ...handlers, value: "" }));
    expect(markup).not.toContain("Clear");
  });
});
