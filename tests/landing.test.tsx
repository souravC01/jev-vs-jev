import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import TryPage from "@/app/try/page";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.stubGlobal("React", React);

describe("landing page", () => {
  it("introduces the Jev self-check and launches the app", () => {
    const html = renderToStaticMarkup(React.createElement(HomePage));
    expect(html).toMatch(/Jev judges Jev/i);
    expect(html).toContain('href="/try"');
  });

  it.each([
    ["landing", HomePage],
    ["checker", TryPage],
  ])("credits the creator, model maker, and gateway on the %s page", (_name, Page) => {
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('href="https://www.souravchandhok.dev/"');
    expect(html).toContain('href="https://typesafe.ai/"');
    expect(html).toContain('href="https://openrouter.ai/"');
  });
});
