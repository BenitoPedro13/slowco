// Product tile for drop pages and the home (server). Image only when the record has one;
// price only when the record has one.

import Image from "next/image";
import Link from "next/link";
import { strings } from "@/content/strings";
import { formatPrice } from "@/lib/format/price";
import type { Product } from "@/lib/catalog/types";

export function CatalogCard({ product, showSoldOut = true }: { product: Product; showSoldOut?: boolean }) {
  const [image, alternate] = product.images;
  const soldOut = product.availability === "esgotado";
  return (
    <li className="border-t border-content">
      <Link
        href={`/produtos/${product.slug}`}
        className="group flex h-full flex-col gap-3 py-4 underline-offset-4"
      >
        {image ? (
          // Slow posts every piece front and alternate (00 §B.3): hover/focus shows the second.
          <span data-cursor="ver" className="relative block aspect-[4/5] overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
            {alternate ? (
              <Image
                src={alternate.src}
                alt=""
                width={alternate.width}
                height={alternate.height}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-(--dur-ui) group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
              />
            ) : null}
          </span>
        ) : null}
        <span className="font-display text-3xl leading-none font-extrabold [font-stretch:62%] group-hover:underline">
          {product.name}
        </span>
        <span className="type-label flex flex-wrap gap-x-3 gap-y-1">
          <span aria-hidden="true" className="flex gap-2">
            {product.sizes.map((s) =>
              s.availability === "disponivel" ? (
                <span key={s.label}>{s.label}</span>
              ) : (
                <s key={s.label} className="text-subtle">
                  {s.label}
                </s>
              ),
            )}
          </span>
          {product.price ? <span>{formatPrice(product.price.cents)}</span> : null}
          {product.notForSale ? <span lang="en">{strings["P-NAO-VENDA"]}</span> : null}
          {showSoldOut && soldOut ? <span>{strings["P-ESGOTADO"]}</span> : null}
        </span>
      </Link>
    </li>
  );
}

const COLS = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;

/** Columns follow the count, so two pieces never sit in a four-column row with a hole. */
export function CatalogGrid({ children, count }: { children: React.ReactNode; count: number }) {
  const cols = COLS[Math.min(4, Math.max(2, count)) as 2 | 3 | 4];
  return <ul className={`grid gap-x-6 sm:grid-cols-2 lg:gap-x-10 ${cols}`}>{children}</ul>;
}
