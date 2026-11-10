import Image from "next/image";
import Link from "next/link";
import { SEM_SINAL } from "@/content/editorial";
import { strings } from "@/content/strings";
import { getCurrentDrop } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-file";
import "./not-found.css";

// docs/04 §1.1 (404), 05 §7; B20 in docs/tasks/TASK-B11-B15-B20-truthful-surfaces.md: "SEM SINAL"
// over a dimmed, desaturated client photo with static scanlines. Always paper on ink, whatever
// the theme (the section sets its own tokens, so the focus ring follows).
export default async function NotFound() {
  const drop = await getCurrentDrop();
  const photo = publicFileExists(SEM_SINAL.src) ? SEM_SINAL : null;
  return (
    <main id="conteudo" tabIndex={-1} className="sem-sinal focus:outline-none">
      {photo ? (
        <div className="sem-sinal__photo">
          <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="sem-sinal__content px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <p className="type-label">
          404 · {strings["X-TITULO"]}
        </p>
        <h1 className="mt-4 font-display text-[clamp(72px,18vw,288px)] leading-[0.82] font-extrabold [font-stretch:62%]">
          {strings["X-SEM-SINAL"]}
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          {drop ? (
            <Link
              href={`/drops/${drop.slug}`}
              className="type-label inline-flex min-h-12 items-center bg-content px-6 text-canvas underline-offset-4 hover:underline"
            >
              {strings["B-VER-DROP"]}
            </Link>
          ) : null}
          <Link
            href="/"
            className="type-label inline-flex min-h-12 items-center border border-content px-6 underline-offset-4 hover:underline"
          >
            {strings["X-VOLTAR"]}
          </Link>
        </div>
      </div>
    </main>
  );
}
