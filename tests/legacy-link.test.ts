import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";

describe("old shared links", () => {
  it("send a task on the former home route to the checker", () => {
    const response = middleware(new NextRequest("https://example.test/?task=Classify%20tickets"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.test/try?task=Classify%20tickets");
  });
});
