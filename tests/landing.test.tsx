import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.stubGlobal("React", React);

describe("landing page", () => {
  it("introduces the Jev self-check and launches the app", () => {
    const html = renderToStaticMarkup(React.createElement(HomePage));
    expect(html).toMatch(/Jev judges Jev/i);
    expect(html).toContain('href="/try"');
  });
});
