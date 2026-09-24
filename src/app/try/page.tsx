"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { TaskInput } from "@/components/TaskInput";
import { ExamplePrompts } from "@/components/ExamplePrompts";
import { VerdictBadge } from "@/components/VerdictBadge";
import { LatencyTag } from "@/components/LatencyTag";
import { CopyShareButton } from "@/components/CopyShareButton";
import { AboutModal } from "@/components/AboutModal";
import { SiteFooter } from "@/components/SiteFooter";
import type { EvaluationResponse, ExampleTask } from "@/lib/types";

function MainContent() {
  const searchParams = useSearchParams();
  const [task, setTask] = useState("");
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const activeRequest = useRef(0);

  async function runEvaluation(value: string) {
    const requestId = ++activeRequest.current;
    const trimmed = value.trim();
    setResult(null);
    setError(null);
    if (!trimmed || trimmed.length > 2000) {
      setError("Enter a task between 1 and 2,000 characters.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: trimmed }),
      });
      const data = await response.json().catch(() => null);
      if (requestId !== activeRequest.current) return;
      if (!response.ok) throw new Error(data?.error || "Jev is unavailable. Please try again.");
      if (!data?.result || !data?.task) throw new Error("Jev returned an unreadable result. Please try again.");
      setResult(data as EvaluationResponse);
    } catch (cause) {
      if (requestId === activeRequest.current) {
        setError(cause instanceof Error ? cause.message : "Jev is unavailable. Please try again.");
      }
    } finally {
      if (requestId === activeRequest.current) setIsLoading(false);
    }
  }

  function clearTask() {
    activeRequest.current += 1;
    setTask("");
    setResult(null);
    setError(null);
    setIsLoading(false);
    const url = new URL(window.location.href);
    if (url.searchParams.has("task")) {
      url.searchParams.delete("task");
      window.history.replaceState(window.history.state, "", url);
    }
  }

  useEffect(() => {
    const urlTask = searchParams.get("task");
    if (urlTask) setTask(urlTask);
  }, [searchParams]);

  function selectExample(example: ExampleTask) {
    setTask(example.task);
    void runEvaluation(example.task);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header onOpenAbout={() => setIsAboutOpen(true)} />
      <main className="mx-auto flex w-full max-w-[1120px] flex-1 px-2.5 py-2 sm:px-5 sm:py-4">
        <div className={`console-frame flex w-full flex-col p-2.5 sm:p-4 ${result || error || isLoading ? "has-verdict" : ""}`}>
          <div className="mb-2 flex items-center justify-between border-b border-[#3d4f97] pb-2 text-[#26365f] sm:mb-3">
            <span className="console-label">Self-check</span>
            <span className="console-label hidden sm:inline">Decision test</span>
          </div>

          <div className="mb-3 sm:mb-5">
            <h1 className="console-title text-[clamp(30px,5.4vw,54px)] font-black leading-[.98] tracking-[-.045em]">SHOULD JEV DO IT?</h1>
            <p className="mt-2 text-sm font-bold text-[#21242e] sm:text-base"><span className="sm:hidden">Ask Jev if it&apos;s the right tool.</span><span className="hidden sm:inline">Give Jev a task. Jev decides if it&apos;s the right tool.</span></p>
          </div>

          <div className="grid flex-1 grid-cols-1 items-stretch gap-2 md:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] md:gap-3">
            <section aria-label="Task input" className="console-panel flex min-w-0 flex-col p-3 sm:p-4">
              <div className="console-label mb-3 flex items-center justify-between border-b border-[#60619c] pb-2 text-[#3d4f97]">
                <span>01 / Your task</span><span>Input</span>
              </div>
              <TaskInput value={task} onChange={setTask} onSubmit={() => void runEvaluation(task)} onClear={clearTask} isLoading={isLoading} />
              {!result && !error && !isLoading && <ExamplePrompts onSelect={selectExample} />}
            </section>

            <section aria-label="Jev's answer" aria-live="polite" className={`console-panel min-h-[205px] min-w-0 flex-col p-3 sm:p-4 md:flex md:min-h-[320px] ${result || error || isLoading ? "flex" : "hidden"}`}>
              <div className="console-label mb-3 flex items-center justify-between border-b border-[#60619c] pb-2 text-[#3d4f97]">
                <span>02 / Jev&apos;s call</span><span>Output</span>
              </div>

              {result ? (
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <VerdictBadge verdict={result.result.verdict} probability={result.result.answerProbability} />
                    <p className="mt-2 text-sm font-bold leading-snug text-[#21242e]">
                      {result.result.verdict === "YES"
                        ? "Jev says this is a job for a decision model."
                        : "Jev says this needs more than a decision model."}
                    </p>
                    <div className="console-inset mt-3 hidden h-3 bg-white sm:block" aria-hidden="true">
                      <div className="h-full bg-[#3d4f97]" style={{ width: `${Math.round(result.result.answerProbability * 100)}%` }} />
                    </div>
                  </div>
                  <div className="border-t border-dotted border-[#60619c] pt-3">
                    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <LatencyTag latencyMs={result.result.latencyMs} />
                      <span className="hidden text-[10px] font-bold tracking-wide text-[#3d4f97] sm:inline">{result.result.model}</span>
                    </div>
                    <CopyShareButton response={result} />
                  </div>
                </div>
              ) : error ? (
                <div role="alert" className="flex flex-1 flex-col justify-center gap-3">
                  <span className="console-label text-[#a7282b]">No verdict</span>
                  <p className="text-base font-bold text-[#21242e]">{error}</p>
                  <button type="button" onClick={() => void runEvaluation(task)} className="console-button console-label min-h-11 self-start px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21242e]">Try again</button>
                </div>
              ) : isLoading ? (
                <div role="status" className="flex flex-1 flex-col justify-center gap-2">
                  <span className="console-title text-5xl font-black">...</span>
                  <p className="console-label text-[#3d4f97]">Waiting for Jev&apos;s answer</p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-center gap-2">
                  <span aria-hidden="true" className="console-title text-6xl font-black leading-none">--</span>
                  <p className="console-label text-[#3d4f97]">Ready for a task</p>
                  <p className="max-w-[26ch] text-sm font-bold leading-snug text-[#21242e]">One task in. One yes-or-no judgment out.</p>
                </div>
              )}
            </section>
          </div>

          <p className="mt-1 text-[11px] font-bold text-[#283968] sm:mt-3"><span className="sm:hidden">Jev&apos;s estimate, not a guarantee.</span><span className="hidden sm:inline">A playful self-check, not a capability guarantee. The percentage is Jev&apos;s estimate, not a success rate.</span></p>
        </div>
      </main>
      <SiteFooter />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default function TryPage() {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}><MainContent /></Suspense>;
}
