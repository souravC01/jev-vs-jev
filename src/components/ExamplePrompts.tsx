import { EXAMPLE_TASKS } from "@/lib/constants";
import type { ExampleTask } from "@/lib/types";

interface ExamplePromptsProps {
  onSelect: (example: ExampleTask) => void;
  disabled?: boolean;
}

export function ExamplePrompts({ onSelect, disabled = false }: ExamplePromptsProps) {
  return (
    <div className="mt-3 border-t border-dotted border-[#60619c] pt-2.5">
      <p className="console-label mb-2 text-[#3d4f97]">Try a task</p>
      <div className="example-strip flex gap-2 overflow-x-auto pb-1">
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
    </div>
  );
}
