import { NextRequest, NextResponse } from "next/server";
import { TaskInputSchema, type EvaluationResponse } from "@/lib/types";
import { evaluateJev, JevClientError } from "@/lib/clients/jev";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.success) {
    return NextResponse.json({ error: `Too many requests. Please wait ${rateCheck.resetInSeconds}s.` }, {
      status: 429,
      headers: { "Retry-After": String(rateCheck.resetInSeconds) },
    });
  }

  const body = await req.json().catch(() => ({}));
  const input = TaskInputSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Enter a task between 1 and 2,000 characters." }, { status: 400 });
  }

  try {
    const result = await evaluateJev(input.data.task);
    const payload: EvaluationResponse = { task: input.data.task, result };
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof JevClientError) {
      const status = error.code === "timeout" ? 504 : error.code === "not_configured" ? 503 : 502;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error("Unexpected Jev evaluation error:", error);
    return NextResponse.json({ error: "Could not evaluate this task. Please try again." }, { status: 500 });
  }
}
