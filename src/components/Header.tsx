import { Info } from "lucide-react";
import Link from "next/link";

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
        <button type="button" onClick={onOpenAbout} className="console-label flex min-h-11 items-center gap-1.5 text-[#f3bf61] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]">
          <Info className="size-4" /> <span className="hidden min-[360px]:inline">How it works</span>
        </button>
      </div>
    </header>
  );
}
