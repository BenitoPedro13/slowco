import type { Metadata } from "next";
import Image from "next/image";
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

  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="grid gap-10 px-4 py-12 focus:outline-none sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-16"
    >
      {product.images.length > 0 ? (
        <div className="flex flex-col gap-4 lg:col-span-7">
          {product.images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              priority={i === 0}
              sizes="(min-width: 1024px) 58vw, 100vw"
              data-cursor="ver"
              className="aspect-[4/5] w-full object-cover"
            />
          ))}
        </div>
      ) : null}

      <div
        className={`flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start ${product.images.length > 0 ? "lg:col-span-5" : "lg:col-span-8"}`}
      >
        <p className="type-label">
          {strings["P-DO-DROP"]}{" "}
          <Link href={`/drops/${drop.slug}`} className="underline underline-offset-4 hover:decoration-2">
            {drop.name}
          </Link>
        </p>
        <h1 className="font-display text-[clamp(40px,8vw,120px)] leading-[0.9] font-extrabold [font-stretch:62%]">
          {product.name}
        </h1>
        {product.price ? <p className="text-2xl font-bold">{formatPrice(product.price.cents)}</p> : null}
        {product.color ? <p className="type-label">{product.color}</p> : null}
        {product.description ? <p className="max-w-[68ch]">{product.description}</p> : null}

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
      </div>
    </main>
  );
}
