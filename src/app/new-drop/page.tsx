import { SiteShell } from "@/components/layout/site-shell";
import { ProductGrid } from "@/components/product/product-grid";
import { getCollectionWithFallback } from "@/lib/shopify-data";
import { RiErrorWarningLine } from "@remixicon/react";

const COLLECTION_HANDLE = "new-drop";

export default async function NewDropPage() {
  const { collection, isFallback } = await getCollectionWithFallback(COLLECTION_HANDLE);

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 pb-8 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Novo drop
          </span>
          <h1 className="text-3xl font-semibold md:text-4xl">{collection.title || "New Drop"}</h1>
          <p className="max-w-2xl text-sm text-white/65 md:text-base">
            Peças recém-lançadas direto do estúdio. Atualize os estoques na Shopify para liberar o drop completo.
          </p>
        </div>

        {isFallback ? (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-white">
            <RiErrorWarningLine className="mt-1 h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm font-medium">Coleção de exemplo</p>
              <p className="text-xs text-white/70">
                Configure a coleção `new-drop` na Shopify ou ajuste o handle desta página.
              </p>
            </div>
          </div>
        ) : null}

        <ProductGrid products={collection.products.nodes} />
      </section>
    </SiteShell>
  );
}
