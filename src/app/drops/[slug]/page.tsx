import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DropStatus } from "@/components/drop/drop-status";
import { CatalogCard, CatalogGrid } from "@/components/product/catalog-card";
import { strings } from "@/content/strings";
import { getDrop, getDrops, getProducts, getRenderTime } from "@/lib/catalog";

// docs/04-UX-LAYOUT-AND-MOTION.md §1.1, §5; 05 §3.
export const revalidate = 60;
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getDrops()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const drop = await getDrop((await params).slug);
  return drop ? { title: drop.name } : {};
}

export default async function DropPage({ params }: { params: Promise<{ slug: string }> }) {
  const drop = await getDrop((await params).slug);
  if (!drop) notFound();
  const products = await getProducts({ dropSlug: drop.slug });
  const renderedAt = await getRenderTime();

  return (
    <main id="conteudo" tabIndex={-1} className="px-4 py-12 focus:outline-none sm:px-6 lg:px-10 lg:py-16">
      <header className="flex flex-col gap-8 pb-12">
        <h1 className="font-display text-[clamp(40px,8vw,120px)] leading-[0.9] font-extrabold [font-stretch:62%]">
          {drop.name}
        </h1>
        <DropStatus
          releaseAt={drop.releaseAt}
          renderedAt={renderedAt}
          products={products.map((p) => ({ availability: p.availability, notForSale: p.notForSale }))}
        />
        {drop.limited || drop.noRestock ? (
          <p className="type-label flex gap-4">
            {drop.limited ? <span>{strings["D-LIMITADO"]}</span> : null}
            {drop.noRestock ? <span>{strings["D-SEM-REPOSICAO"]}</span> : null}
          </p>
        ) : null}
        {drop.text ? <p className="max-w-[68ch] text-lg">{drop.text}</p> : null}
      </header>
      <CatalogGrid count={products.length}>
        {products.map((p) => (
          <CatalogCard key={p.slug} product={p} />
        ))}
      </CatalogGrid>
    </main>
  );
}
