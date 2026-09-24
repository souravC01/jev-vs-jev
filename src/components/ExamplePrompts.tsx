"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EXAMPLE_TASKS } from "@/lib/constants";
import type { ExampleTask } from "@/lib/types";

interface ExamplePromptsProps {
  onSelect: (example: ExampleTask) => void;
  disabled?: boolean;
}

export function ExamplePrompts({ onSelect, disabled = false }: ExamplePromptsProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  function scrollExamples(direction: -1 | 1) {
    const strip = stripRef.current;
    if (strip) strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="mt-3 border-t border-dotted border-[#60619c] pt-2.5">
      <p className="console-label mb-2 text-[#3d4f97]">Try a task</p>
      <div className="flex min-w-0 items-center gap-1.5">
        <button type="button" aria-label="Previous examples" aria-controls="example-tasks" onClick={() => scrollExamples(-1)} disabled={disabled} className="hidden min-h-11 w-8 shrink-0 items-center justify-center border border-[#3d4f97] bg-[#c0d5e6] text-[#21242e] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f] disabled:opacity-50 md:flex">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div id="example-tasks" ref={stripRef} className="example-strip flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {EXAMPLE_TASKS.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => onSelect(example)}
              disabled={disabled}
              className="min-h-11 shrink-0 border border-[#3d4f97] bg-[#c0d5e6] px-3 text-left text-xs font-bold text-[#21242e] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f] disabled:opacity-50"
              title={example.task}
            >
              {example.title}
            </button>
          ))}
        </div>
        <button type="button" aria-label="Next examples" aria-controls="example-tasks" onClick={() => scrollExamples(1)} disabled={disabled} className="hidden min-h-11 w-8 shrink-0 items-center justify-center border border-[#3d4f97] bg-[#c0d5e6] text-[#21242e] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f] disabled:opacity-50 md:flex">
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
