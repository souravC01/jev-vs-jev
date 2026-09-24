import { Info } from "lucide-react";
import Link from "next/link";
import { GitHubMark } from "@/components/GitHubMark";

interface HeaderProps {
  onOpenAbout: () => void;
}

export function Header({ onOpenAbout }: HeaderProps) {
  return (
    <header className="carbon-dots border-b-2 border-[#596ba7] text-white">
      <div className="mx-auto flex h-12 max-w-[1120px] items-center justify-between px-3 sm:px-5">
        <Link href="/" aria-label="Jev vs. Jev home" className="flex items-center gap-2.5 font-black tracking-[.08em] text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]">
          JEV <span className="text-[#ecab37]">VS.</span> JEV
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <button type="button" onClick={onOpenAbout} aria-label="How it works" className="console-label flex min-h-11 items-center gap-1.5 text-[#f3bf61] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]">
            <Info className="size-4" aria-hidden="true" /> <span className="hidden sm:inline">How it works</span>
          </button>
          <a href="https://github.com/souravC01/jev-vs-jev" target="_blank" rel="noopener noreferrer" aria-label="View Jev vs. Jev on GitHub" className="console-label flex min-h-11 items-center gap-1.5 text-[#f3bf61] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]">
            <GitHubMark /><span className="hidden sm:inline">GitHub ↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
