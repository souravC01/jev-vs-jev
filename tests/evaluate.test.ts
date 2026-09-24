import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/evaluate/route";

const originalKey = process.env.TYPESAFE_API_KEY;
const originalOpenRouterKey = process.env.OPENROUTER_API_KEY;
const originalExperientialKey = process.env.EXPERIENTIAL_API_KEY;
let requestNumber = 0;

function request(task: string): NextRequest {
  requestNumber += 1;
  return new NextRequest("http://localhost/api/evaluate", {
    method: "POST",
    body: JSON.stringify({ task }),
    headers: { "Content-Type": "application/json", "x-forwarded-for": "test-" + requestNumber },
  });
}

describe("POST /api/evaluate", () => {
  beforeEach(() => {
    process.env.TYPESAFE_API_KEY = "test-key";
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.EXPERIENTIAL_API_KEY;
  });
  afterEach(() => {
    if (originalKey === undefined) delete process.env.TYPESAFE_API_KEY;
    else process.env.TYPESAFE_API_KEY = originalKey;
    if (originalOpenRouterKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalOpenRouterKey;
    if (originalExperientialKey === undefined) delete process.env.EXPERIENTIAL_API_KEY;
    else process.env.EXPERIENTIAL_API_KEY = originalExperientialKey;
    vi.unstubAllGlobals();
  });

  it("returns one real Jev judgment for a valid task", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      model: "jev-1.13.0",
      answers: { fit: { type: "noul", noul: 0.82 } },
      usage: { input_tokens: 120, output_tokens: 1 },
    }), { status: 200 })));
    const response = await POST(request("  Classify support tickets  "));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.task).toBe("Classify support tickets");
    expect(data.result.verdict).toBe("YES");
    expect(data.result.answerProbability).toBe(0.82);
    expect(data.stageA).toBeUndefined();
  });

  it.each(["", "   ", "x".repeat(2001)])("rejects invalid task input", async (task) => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request(task));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an error rather than an answer when the key is missing", async () => {
    delete process.env.TYPESAFE_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.EXPERIENTIAL_API_KEY;
    const response = await POST(request("Classify tickets"));
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.error).toBeTruthy();
    expect(data.result).toBeUndefined();
  });

  it("returns an error rather than an answer when Jev fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("no", { status: 500 })));
    const response = await POST(request("Classify tickets"));
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBeTruthy();
    expect(data.result).toBeUndefined();
  });
});
