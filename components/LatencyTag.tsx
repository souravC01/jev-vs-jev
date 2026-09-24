interface LatencyTagProps {
  latencyMs: number;
  className?: string;
}

export function LatencyTag({ latencyMs, className = "" }: LatencyTagProps) {
  return (
    <span
      className={`console-label text-[#3d4f97] ${className}`}
      title="Observed elapsed request time (informational, not an official benchmark)"
    >
      {latencyMs}ms <span className="font-normal">request time</span>
    </span>
  );
}
