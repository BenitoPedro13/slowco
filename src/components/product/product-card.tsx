import Image from "next/image";
import Link from "next/link";
import * as Button from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { ShopifyProductCard } from "@/lib/shopify";

type ProductCardProps = {
  product: ShopifyProductCard;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = formatCurrency(product.priceRange.minVariantPrice);

  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.04]">
      <Link href={`/produtos/${product.handle}`} className="relative block overflow-hidden rounded-2xl bg-white/5">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width ?? 900}
            height={product.featuredImage.height ?? 900}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-white/40">
            Sem imagem
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3">
        <div className="space-y-2">
          <Link
            href={`/produtos/${product.handle}`}
            className="line-clamp-2 text-base font-medium text-white transition hover:text-white/80"
          >
            {product.title}
          </Link>
          <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="text-lg font-semibold text-white">{price}</span>
          <Button.Root
            variant="primary"
            mode="filled"
            size="small"
            asChild
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href={`/produtos/${product.handle}`}>Comprar</Link>
          </Button.Root>
        </div>
      </div>
    </article>
  );
}
