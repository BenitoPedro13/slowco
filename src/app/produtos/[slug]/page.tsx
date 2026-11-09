import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { CatalogCard } from "@/components/product/catalog-card";
import "@/components/product/product.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product/product-purchase";
import { strings } from "@/content/strings";
import { getDrop, getProduct, getProducts, getRenderTime } from "@/lib/catalog";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { formatPrice } from "@/lib/format/price";

// docs/04-UX-LAYOUT-AND-MOTION.md §1.1, §5; 05 §5. Re-rendered every minute so the HTML agrees
// with the browser clock after a release (06 §4).
export const revalidate = 60;
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const drop = await getDrop(product.dropSlug);
  if (!drop) notFound();
  const renderedAt = await getRenderTime();
  const related = (await getProducts({ dropSlug: drop.slug })).filter(p => p.slug !== product.slug);

  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="product-page grid gap-8 px-4 pt-6 pb-48 focus:outline-none sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-10"
    >
      <div className="grid min-w-0 gap-8 lg:col-span-12 lg:grid-cols-12 lg:gap-10">
      <ProductGallery images={product.images} />

      <div
        className={`flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start ${product.images.length > 0 ? "lg:col-span-5" : "lg:col-span-8"}`}
      >
        <p className="type-label">
          {strings["P-DO-DROP"]}{" "}
          <Link href={`/drops/${drop.slug}`} className="underline underline-offset-4 hover:decoration-2">
            {drop.name}
          </Link>
        </p>
        <h1 className="font-display text-[clamp(56px,7vw,96px)] leading-[0.9] font-extrabold [font-stretch:62%]">
          {product.name}
        </h1>
        {product.price ? <p className="text-2xl font-bold">{formatPrice(product.price.cents)}</p> : null}
        {product.color ? <p className="type-label">{product.color}</p> : null}
        {product.description ? <p className="max-w-[68ch]">{product.description}</p> : null}

        {product.placeholder ? (
          <div className="border border-content p-4">
            <p className="type-label">{strings["P-DADOS-CAMPOS"]}</p>
            <p className="mt-3 font-display text-2xl font-extrabold">{strings["P-DADOS-PENDENTES"]}</p>
          </div>
        ) : null}
        <ProductPurchase
          product={{
            slug: product.slug,
            name: product.name,
            dropName: drop.name,
            sizes: product.sizes,
            availability: product.availability,
            notForSale: Boolean(product.notForSale),
            price: product.price ? formatPrice(product.price.cents) : undefined,
          }}
          releaseAt={drop.releaseAt}
          renderedAt={renderedAt}
          whatsappNumber={WHATSAPP_NUMBER}
        />
        <div className="type-label flex flex-col gap-2 border border-content p-4">
          <p lang="en">{strings["G-LEGAL-1"]}</p>
          <p lang="en" className="border-t border-content pt-2">{strings["G-LEGAL-2"]}</p>
        </div>
      </div>
      </div>
      {related.length ? (
        <section aria-labelledby="same-drop" className="min-w-0 border-t border-content pt-6 lg:col-span-12">
          <h2 id="same-drop" className="font-display text-4xl font-extrabold [font-stretch:62%]">{strings["P-MESMO-DROP"]}</h2>
          <ul className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [&>li]:w-[80%] [&>li]:shrink-0 [&>li]:snap-start sm:[&>li]:w-[45%] lg:[&>li]:w-[30%]">
            {related.map(piece => <CatalogCard key={piece.slug} product={piece} />)}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
