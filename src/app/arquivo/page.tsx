import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { strings } from "@/content/strings";
import { getDrops, getProducts, getRenderTime, isReleased } from "@/lib/catalog";

export const metadata: Metadata = { title: "Arquivo" };
export const revalidate = 60;

const year = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(
    new Date(iso),
  );

// docs/04 §1.1 (/arquivo), 05 §4: every drop, newest first, with a marker when pieces are left.
export default async function ArchivePage() {
  const now = await getRenderTime();
  const drops = await getDrops();
  const products = await getProducts();
  // Drop cover: the first real client photo among its pieces, tinted (editorial use, TASK-M3).
  const cover = (slug: string) =>
    products
      .filter((p) => p.dropSlug === slug)
      .map((p) => p.images[0])
      .find((i) => i && i.src.startsWith("/catalogo/slow-"));
  const available = new Set(
    products.filter((p) => p.availability === "disponivel")
      .filter((p) => !p.notForSale)
      .map((p) => p.dropSlug),
  );

  return (
    <main id="conteudo" tabIndex={-1} className="px-4 py-12 focus:outline-none sm:px-6 lg:px-10 lg:py-16">
      <h1 className="font-display text-[clamp(56px,12vw,192px)] leading-[0.85] font-extrabold [font-stretch:62%]">
        {strings["A-TITULO"]}
      </h1>
      <ol className="mt-12 border-t border-content">
        {drops.map((d) => {
          const released = isReleased(d, now);
          return (
            <li
              key={d.slug}
              className="group relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-content py-6 sm:grid-cols-[8ch_1fr_auto]"
            >
              {cover(d.slug) ? (
                <span
                  aria-hidden="true"
                  className="duotone pointer-events-none absolute top-1/2 right-[18%] z-10 hidden aspect-[4/5] w-48 -translate-y-1/2 scale-95 opacity-0 transition duration-(--dur-ui) group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none lg:block"
                >
                  <Image src={cover(d.slug)!.src} alt="" fill sizes="192px" className="object-cover" />
                </span>
              ) : null}
              <span className="type-label">{year(d.releaseAt)}</span>
              <h2 className="font-display text-[clamp(32px,6vw,80px)] leading-[0.9] font-extrabold [font-stretch:62%]">
                <Link href={`/drops/${d.slug}`} className="underline-offset-8 hover:underline">
                  {d.name}
                </Link>
              </h2>
              <span className="type-label col-start-2 sm:col-start-3">
                {!released
                  ? strings["D-EM-BREVE"]
                  : available.has(d.slug)
                    ? strings["A-AINDA"]
                    : strings["D-ESGOTADO"]}
              </span>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
