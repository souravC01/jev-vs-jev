import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { EvaluationResponse } from "@/lib/types";
import { createShareCard } from "@/lib/share-card";
import { formatResultForClipboard, encodeTaskToUrl } from "@/lib/share";
import { Check, Copy, Download, Link as LinkIcon, Share2, X } from "lucide-react";

interface CopyShareButtonProps { response: EvaluationResponse }

function ShareDialog({ response, onClose }: { response: EvaluationResponse; onClose: () => void }) {
  const [card, setCard] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const shareUrl = `${window.location.origin}${window.location.pathname}?task=${encodeTaskToUrl(response.task)}`;
  const shareText = `I asked Jev if Jev should do it. Jev said ${response.result.verdict}.`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  useEffect(() => {
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    createShareCard(response)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setCard({ blob, url: objectUrl });
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not create the result card.");
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [response]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setError(null);
    } catch {
      setError("Could not copy the link. Try selecting it below.");
    }
  }

  function downloadCard() {
    if (!card) return;
    const anchor = document.createElement("a");
    anchor.href = card.url;
    anchor.download = "jev-vs-jev-result.png";
    anchor.click();
  }

  async function nativeShare() {
    if (!card) return;
    try {
      const file = new File([card.blob], "jev-vs-jev-result.png", { type: "image/png" });
      await navigator.share({ files: [file], text: `${shareText} ${shareUrl}` });
      setError(null);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError("This device could not share the card. Download it and copy the link instead.");
    }
  }

  const canNativeShare = Boolean(card && typeof navigator.share === "function" && navigator.canShare?.({ files: [new File([card.blob], "jev-vs-jev-result.png", { type: "image/png" })] }));

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151822]/80 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="share-title" className="console-frame max-h-[calc(100dvh-24px)] w-full max-w-[680px] overflow-y-auto p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#3d4f97] pb-2">
          <div><p className="console-label text-[#26365f]">Jev vs. Jev / Share</p><h2 id="share-title" className="text-2xl font-black text-[#21242e]">Share Jev&apos;s answer</h2></div>
          <button ref={closeButton} type="button" onClick={onClose} aria-label="Close sharing" className="flex size-10 shrink-0 items-center justify-center border-2 border-[#3d4f97] bg-[#dce8f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]"><X className="size-5" /></button>
        </div>
        <div className="border-2 border-[#3d4f97] bg-[#21242e]">
          {card ? <Image src={card.url} alt={`Share card showing the task and Jev's ${response.result.verdict} judgment`} width={1200} height={630} unoptimized className="h-auto w-full" /> : <div className="flex aspect-[1200/630] items-center justify-center text-sm font-bold text-white">{error ? "Card unavailable" : "Making your result card…"}</div>}
        </div>
        <p className="mt-2 text-xs font-bold text-[#26365f]">The card shows a snapshot of this answer. The link contains your full task and lets someone else ask Jev too.</p>
        {error && <p role="alert" className="mt-2 text-sm font-bold text-[#8c2025]">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {canNativeShare && <button type="button" onClick={() => void nativeShare()} className="console-button console-label flex min-h-11 items-center gap-2 px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21242e]"><Share2 className="size-4" /> Share via device</button>}
          <button type="button" onClick={downloadCard} disabled={!card} className="console-label flex min-h-11 items-center gap-2 border-b-2 border-r-2 border-black bg-[#21242e] px-3 text-white disabled:opacity-50"><Download className="size-4" /> Download image</button>
          <button type="button" onClick={() => void copyLink()} className="console-label flex min-h-11 items-center gap-2 border-b-2 border-r-2 border-black bg-[#21242e] px-3 text-white">{copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}{copied ? "Link copied" : "Copy link"}</button>
        </div>
        <div className="mt-4 border-t border-dotted border-[#3d4f97] pt-3">
          <p className="console-label mb-2 text-[#26365f]">Post it</p>
          <div className="flex flex-wrap gap-2">
            <a href={xUrl} target="_blank" rel="noopener noreferrer" className="console-label flex min-h-11 items-center border-2 border-[#3d4f97] bg-[#dce8f2] px-3 text-[#21242e]">Open X draft ↗</a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="console-label flex min-h-11 items-center border-2 border-[#3d4f97] bg-[#dce8f2] px-3 text-[#21242e]">Open LinkedIn ↗</a>
          </div>
          <p className="mt-2 text-xs font-bold text-[#26365f]">To include the image on X or LinkedIn, download and attach it. Some apps also drop shared links, so copy the link if needed.</p>
        </div>
        <input readOnly aria-label="Shareable task link" onFocus={(event) => event.currentTarget.select()} value={shareUrl} className="mt-3 w-full border-2 border-[#3d4f97] bg-white px-2 py-2 text-xs text-[#21242e]" />
      </section>
    </div>, document.body
  );
}

export function CopyShareButton({ response }: CopyShareButtonProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareButton = useRef<HTMLButtonElement>(null);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(formatResultForClipboard(response));
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Failed to copy result text:", err);
    }
  }

  function closeShare() {
    setIsShareOpen(false);
    requestAnimationFrame(() => shareButton.current?.focus());
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => void copyText()} className="console-label flex min-h-11 items-center gap-1.5 border-b-2 border-r-2 border-black bg-[#21242e] px-3 text-white hover:bg-[#3d4f97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]" title="Copy concise result block to clipboard">
        {copiedText ? <><Check className="size-3.5" /><span>Copied</span></> : <><Copy className="size-3.5" /><span>Copy</span></>}
      </button>
      <button ref={shareButton} type="button" onClick={() => setIsShareOpen(true)} className="console-label flex min-h-11 items-center gap-1.5 border-b-2 border-r-2 border-black bg-[#21242e] px-3 text-white hover:bg-[#3d4f97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]" title="Share Jev's answer as an image and task link">
        <Share2 className="size-3.5" /><span>Share result</span>
      </button>
      {isShareOpen && <ShareDialog response={response} onClose={closeShare} />}
    </div>
  );
}
