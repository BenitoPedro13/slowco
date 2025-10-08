import { ProductGrid } from "@/components/product/product-grid";
import type { ShopifyProductCard } from "@/lib/shopify";

type FeaturedProductsProps = {
  products: ShopifyProductCard[];
  title?: string;
  subtitle?: string;
};

export function FeaturedProductsSection({
  products,
  title = "Novidades em destaque",
  subtitle = "Peças dropadas recentemente direto do Slow Studio",
}: FeaturedProductsProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 pb-8 text-white">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Drop atual
        </span>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
          <p className="max-w-lg text-sm text-white/60 md:text-base">{subtitle}</p>
        </div>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
