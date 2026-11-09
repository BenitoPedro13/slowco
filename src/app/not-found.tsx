import Link from "next/link";
import { strings } from "@/content/strings";

// docs/04 §1.1 (404), 05 §7.
export default function NotFound() {
  return (
    <main id="conteudo" tabIndex={-1} className="px-4 py-16 focus:outline-none sm:px-6 lg:px-10 lg:py-24">
      <p className="type-label">404</p>
      <h1 className="mt-4 font-display text-[clamp(48px,10vw,160px)] leading-[0.85] font-extrabold [font-stretch:62%]">
        {strings["X-TITULO"]}
      </h1>
      <Link
        href="/"
        className="type-label mt-10 inline-flex min-h-12 items-center bg-content px-6 text-canvas underline-offset-4 hover:underline"
      >
        {strings["X-VOLTAR"]}
      </Link>
    </main>
  );
}
