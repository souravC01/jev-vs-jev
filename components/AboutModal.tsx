import { useEffect } from "react";
import { X } from "lucide-react";

export function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151822]/85 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="about-title" className="console-panel max-h-[90dvh] w-full max-w-lg overflow-y-auto p-5 text-[#21242e] sm:p-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-between gap-4 border-b border-[#60619c] pb-3">
          <h2 id="about-title" className="text-xl font-black uppercase">How it works</h2>
          <button type="button" onClick={onClose} aria-label="Close about dialog" className="flex size-11 items-center justify-center border border-[#3d4f97] bg-[#c0d5e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]"><X className="size-5" /></button>
        </div>
        <div className="mt-4 space-y-3 text-sm font-medium leading-relaxed">
          <p>Describe a task and we ask Jev whether Jev should handle it. Yes, we really asked.</p>
          <p>Jev is built for bounded decisions such as classification, routing, and scoring. It is not a long-form writing or code generation model.</p>
          <p>The number beside the answer is Jev's probability toward that answer. It is not a measured success rate or a separate confidence score.</p>
          <p>This is a playful experiment, not a benchmark or a guarantee of what Jev can do. The time shown is observed request time and depends on the network and service.</p>
        </div>
      </div>
    </div>
  );
}
