import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { GitHubMark } from "@/components/GitHubMark";

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="carbon-dots border-b-2 border-[#596ba7] text-white">
        <div className="mx-auto flex h-12 max-w-[1120px] items-center justify-between px-3 sm:px-5">
          <span className="flex items-center gap-2.5 text-[15px] font-black tracking-[.08em]">
            JEV <span className="text-[#ecab37]">VS.</span> JEV
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="console-label hidden text-[#f3bf61] sm:inline">A tiny experiment</span>
            <Link href="/try" className="console-label flex min-h-11 items-center text-[#f3bf61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f] sm:hidden">
              Launch Jev →
            </Link>
            <a href="https://github.com/souravC01/jev-vs-jev" target="_blank" rel="noopener noreferrer" aria-label="View Jev vs. Jev on GitHub" className="console-label flex min-h-11 items-center gap-1.5 text-[#f3bf61] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]">
              <GitHubMark /><span className="hidden sm:inline">GitHub ↗</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1120px] flex-1 px-2.5 py-3 sm:px-5 sm:py-5">
        <div className="console-frame flex w-full flex-col p-3 sm:p-4">
          <div className="mb-3 flex items-center border-b border-[#3d4f97] pb-2 text-[#26365f]">
            <span className="console-label">The self-reference test</span>
          </div>

          <h1 className="console-title mb-4 text-[clamp(34px,5.8vw,64px)] font-black leading-[.95] tracking-[-.05em] sm:mb-5">
            JEV JUDGES JEV.
          </h1>

          <div className="grid flex-1 items-stretch gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
            <figure className="console-panel flex min-w-0 flex-col p-2 sm:p-3">
              <div className="console-label mb-2 flex justify-between border-b border-[#60619c] pb-2 text-[#3d4f97]">
                <span>Spot the difference</span><span>There isn&apos;t one</span>
              </div>
              <Image
                src="/jev-points-at-jev.jpg"
                alt="Two Spider-Man characters pointing at each other"
                width={4096}
                height={3072}
                priority
                sizes="(max-width: 767px) 100vw, 55vw"
                className="h-auto w-full border border-[#3d4f97]"
              />
              <figcaption className="console-label mt-2 text-[#3d4f97]">Jev asks Jev about Jev</figcaption>
            </figure>

            <section className="console-panel flex min-w-0 flex-col justify-between p-4 sm:p-5">
              <div>
                <p className="console-label mb-3 border-b border-[#60619c] pb-2 text-[#3d4f97]">So, what is this?</p>
                <h2 className="max-w-[16ch] text-[clamp(25px,3.3vw,40px)] font-black leading-[1.05] tracking-[-.04em] text-[#21242e]">
                  Should Jev decide if you should use Jev?
                </h2>
                <p className="mt-4 max-w-[38ch] text-[15px] font-bold leading-snug text-[#21242e]">
                  Describe a task. Jev gives itself a YES or NO, a probability, and a response time.
                </p>
                <p className="mt-2 max-w-[38ch] text-sm leading-snug text-[#283968]">
                  It&apos;s a playful self-check, not a benchmark or a promise that Jev can do the job.
                </p>
              </div>
              <div className="mt-5 border-t border-dotted border-[#60619c] pt-4">
                <Link href="/try" className="console-button console-label inline-flex min-h-12 items-center justify-center gap-3 px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21242e]">
                  Launch Jev <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <p className="console-label mt-3 text-[#3d4f97]">One task in. One awkward answer out.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
