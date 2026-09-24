import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface TaskInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export function TaskInput({ value, onChange, onSubmit, onClear, isLoading }: TaskInputProps) {
  const maxChars = 2000;
  const charsUsed = value.trim().length;
  const charsLeft = maxChars - charsUsed;
  const isTooLong = charsLeft < 0;
  const isEmpty = charsUsed === 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isEmpty && !isTooLong && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor="task-prompt"
          className="console-label text-[#21242e]"
        >
          Give Jev a task to judge
        </label>
        <span
          className={`shrink-0 text-[11px] font-bold tabular-nums ${
            isTooLong ? "text-[#b20f20]" : "text-[#3d4f97]"
          }`}
        >
          {charsUsed} / {maxChars}
        </span>
      </div>

      <textarea
        id="task-prompt"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="For example: classify support tickets by department"
        className="console-inset min-h-[104px] w-full resize-none px-3 py-2.5 text-[15px] leading-snug text-[#21242e] placeholder:text-[#626b82] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f] sm:min-h-[128px]"
        disabled={isLoading}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="hidden text-[11px] font-bold text-[#3d4f97] sm:inline">CTRL / ⌘ + ENTER</span>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          {value.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="console-label min-h-11 border border-[#3d4f97] bg-[#c0d5e6] px-3 text-[#21242e] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21242e]"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isEmpty || isTooLong || isLoading}
            className="console-button console-label flex min-h-11 w-full items-center justify-center gap-2 px-5 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21242e]"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Ask Jev</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
