import React, { useState } from "react";
import { EvaluationResponse } from "@/lib/types";
import { formatResultForClipboard, encodeTaskToUrl } from "@/lib/share";
import { Copy, Check, Link as LinkIcon } from "lucide-react";

interface CopyShareButtonProps {
  response: EvaluationResponse;
}

export function CopyShareButton({ response }: CopyShareButtonProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyText = async () => {
    try {
      const text = formatResultForClipboard(response);
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Failed to copy result text:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      const shareUrl = `${origin}${path}?task=${encodeTaskToUrl(response.task)}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleCopyText}
        className="console-label flex min-h-11 items-center gap-1.5 border-b-2 border-r-2 border-black bg-[#21242e] px-3 text-white hover:bg-[#3d4f97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]"
        title="Copy concise result block to clipboard"
      >
        {copiedText ? (
          <>
            <Check className="size-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="console-label flex min-h-11 items-center gap-1.5 border-b-2 border-r-2 border-black bg-[#21242e] px-3 text-white hover:bg-[#3d4f97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]"
        title="Copy a link that reloads this task and asks Jev again"
      >
        {copiedLink ? (
          <>
            <Check className="size-3.5" />
            <span>Link copied</span>
          </>
        ) : (
          <>
            <LinkIcon className="size-3.5" />
            <span>Share task</span>
          </>
        )}
      </button>
    </div>
  );
}
