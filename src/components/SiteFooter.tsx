const linkClass = "text-[#f3bf61] underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]";

export function SiteFooter() {
  return (
    <footer className="carbon-dots border-t border-[#596ba7] text-white">
      <div className="console-label mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-2 text-center sm:justify-between sm:px-5">
        <span>Built by <a className={linkClass} href="https://www.souravchandhok.dev/" target="_blank" rel="noopener noreferrer">Sourav Chandhok</a></span>
        <span>Jev by <a className={linkClass} href="https://typesafe.ai/" target="_blank" rel="noopener noreferrer">TypeSafe AI</a> · via <a className={linkClass} href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">OpenRouter</a></span>
      </div>
    </footer>
  );
}
