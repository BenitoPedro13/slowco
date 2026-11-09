import type { Metadata } from "next";
import { ArchiveWall, type ArchiveFilter } from "@/components/archive/archive-wall";
import { strings } from "@/content/strings";
import { getDrops, getProducts, getRenderTime, deriveDropState, isPurchasable } from "@/lib/catalog";

export const metadata: Metadata = { title: "Arquivo" };
export const revalidate = 60;

const year = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(
    new Date(iso),
  );

// docs/04 §1.1 (/arquivo), 05 §4: every drop, newest first, with a marker when pieces are left.
export default async function ArchivePage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const filter: ArchiveFilter = estado === "disponivel" || estado === "esgotado" ? estado : "todos";
  const now = await getRenderTime();
  const drops = await getDrops();
  const products = await getProducts();
  // Drop cover: the first real client photo among its pieces, tinted (editorial use, TASK-M3).
  const cover = (slug: string) =>
    products
      .filter((p) => p.dropSlug === slug)
      .map((p) => p.images[0])
      .find((i) => i && i.src.startsWith("/catalogo/slow-"));
  const posters = drops.map(drop => {
    const pieces = products.filter(piece => piece.dropSlug === drop.slug);
    return {
      slug: drop.slug, name: drop.name, year: year(drop.releaseAt),
      state: deriveDropState(drop, pieces, now),
      available: pieces.filter(piece => isPurchasable(piece, drop, now)).length,
      cover: cover(drop.slug),
    };
  });

  return (
    <main id="conteudo" tabIndex={-1} className="px-4 py-12 focus:outline-none sm:px-6 lg:px-10 lg:py-16">
      <h1 className="font-display text-[clamp(56px,12vw,192px)] leading-[0.85] font-extrabold [font-stretch:62%]">
        {strings["A-TITULO"]}
      </h1>
      <ArchiveWall posters={posters} filter={filter} />
    </main>
  );
}
