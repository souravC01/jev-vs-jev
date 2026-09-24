import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { evaluateJev } from "@/lib/clients/jev";

const originalKey = process.env.TYPESAFE_API_KEY;
const originalOpenRouterKey = process.env.OPENROUTER_API_KEY;
const originalExperientialKey = process.env.EXPERIENTIAL_API_KEY;

function reply(noul: unknown, status = 200): Response {
  return new Response(JSON.stringify({
    model: "jev-1.13.0",
    answers: { fit: { type: "noul", noul } },
    usage: { input_tokens: 120, output_tokens: 1 },
  }), { status, headers: { "Content-Type": "application/json" } });
}

describe("Jev client", () => {
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

  it("uses Experiential Labs for Jev when its key is configured", async () => {
    process.env.EXPERIENTIAL_API_KEY = "experiential-test-key";
    const fetchMock = vi.fn().mockResolvedValue(reply(0.87));
    vi.stubGlobal("fetch", fetchMock);

    const result = await evaluateJev("Classify support tickets");
    expect(result.verdict).toBe("YES");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.experientiallabs.ai/v1/systemone");
    expect(options.headers.Authorization).toBe("Bearer experiential-test-key");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("jev-latest");
    expect(body.state).toBe("Classify support tickets");
    expect(body.questions.fit.type).toBe("noul");
  });

  it("uses OpenRouter's Jev endpoint when only its key is configured", async () => {
    delete process.env.TYPESAFE_API_KEY;
    process.env.OPENROUTER_API_KEY = "openrouter-test-key";
    const fetchMock = vi.fn().mockResolvedValue(reply(0.87));
    vi.stubGlobal("fetch", fetchMock);

    const result = await evaluateJev("Classify support tickets");
    expect(result.verdict).toBe("YES");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/alpha/decisions");
    expect(options.headers.Authorization).toBe("Bearer openrouter-test-key");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("typesafe/jev-1.13");
    expect(body.state).toBe("Classify support tickets");
    expect(body.questions.fit.type).toBe("noul");
  });

  it("uses OpenRouter when its key is set alongside the old provider keys", async () => {
    process.env.OPENROUTER_API_KEY = "openrouter-test-key";
    process.env.EXPERIENTIAL_API_KEY = "experiential-test-key";
    const fetchMock = vi.fn().mockResolvedValue(reply(0.87));
    vi.stubGlobal("fetch", fetchMock);

    await evaluateJev("Classify support tickets");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/alpha/decisions");
    expect(options.headers.Authorization).toBe("Bearer openrouter-test-key");
    expect(JSON.parse(options.body).model).toBe("typesafe/jev-1.13");
  });

  it("uses the official request contract and returns Jev's yes probability", async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(0.87));
    vi.stubGlobal("fetch", fetchMock);
    const result = await evaluateJev("Classify support tickets");
    expect(result.verdict).toBe("YES");
    expect(result.yesProbability).toBe(0.87);
    expect(result.answerProbability).toBe(0.87);
    expect(result.model).toBe("jev-1.13.0");
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.typesafe.ai/v1/systemone");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("jev-latest");
    expect(body.state).toBe("Classify support tickets");
    expect(body.questions.fit.type).toBe("noul");
    expect(options.headers.Authorization).toBe("Bearer test-key");
    expect(options.signal).toBeDefined();
  });

  it("uses the complement for a no verdict", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(0.12)));
    const result = await evaluateJev("Write a long story");
    expect(result.verdict).toBe("NO");
    expect(result.answerProbability).toBeCloseTo(0.88);
  });

  it("maps an even split to yes with a 50% probability", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(0.5)));
    const result = await evaluateJev("Choose a tool");
    expect(result.verdict).toBe("YES");
    expect(result.answerProbability).toBe(0.5);
  });

  it("does not call the API without a configured key", async () => {
    delete process.env.TYPESAFE_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.EXPERIENTIAL_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(evaluateJev("Classify support tickets")).rejects.toMatchObject({ code: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([401, 429, 500])("does not fabricate a verdict after HTTP %i", async (status) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(0.87, status)));
    await expect(evaluateJev("Classify support tickets")).rejects.toMatchObject({ code: "upstream" });
  });

  it.each([undefined, "0.9", -0.1, 1.2, Number.NaN])("rejects malformed noul value %s", async (noul) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(noul)));
    await expect(evaluateJev("Classify support tickets")).rejects.toMatchObject({ code: "invalid_response" });
  });

  it("turns a timed-out request into a timeout error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("timed out", "TimeoutError")));
    await expect(evaluateJev("Classify support tickets")).rejects.toMatchObject({ code: "timeout" });
  });
});
