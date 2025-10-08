import type { ShopifyProductCard } from "@/lib/shopify";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: ShopifyProductCard[];
  emptyState?: React.ReactNode;
};

export function ProductGrid({ products, emptyState }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10 text-center text-white/70">
        {emptyState ?? "Nenhum produto encontrado."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
