import type { Verdict } from "@/lib/types";

export function VerdictBadge({ verdict, probability }: { verdict: Verdict; probability: number }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="font-[Arial_Black,Arial,sans-serif] text-[52px] font-black leading-none tracking-[-.07em] text-[#21242e] sm:text-[80px]">
        {verdict}
      </div>
      <div className="pb-1 text-right">
        <div className="text-3xl font-black tabular-nums text-[#3d4f97] sm:text-4xl">{Math.round(probability * 100)}%</div>
        <div className="console-label text-[#3d4f97]">toward {verdict.toLowerCase()}</div>
      </div>
    </div>
  );
}
