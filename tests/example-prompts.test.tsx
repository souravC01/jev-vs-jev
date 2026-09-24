import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ExamplePrompts } from "@/components/ExamplePrompts";

vi.stubGlobal("React", React);

describe("ExamplePrompts", () => {
  it("offers labeled controls to reach examples hidden offscreen", () => {
    const markup = renderToStaticMarkup(React.createElement(ExamplePrompts, { onSelect: () => {} }));

    expect(markup).toContain('aria-label="Previous examples"');
    expect(markup).toContain('aria-label="Next examples"');
    expect(markup).toContain("The obvious question");
  });
});
