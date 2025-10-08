import { SiteShell } from "@/components/layout/site-shell";
import { HeroSection } from "@/components/sections/hero";
import { FeaturedProductsSection } from "@/components/sections/featured-products";
import { BrandStorySection } from "@/components/sections/brand-story";
import { ContactCtaSection } from "@/components/sections/contact-cta";
import { getFeaturedProductsWithFallback } from "@/lib/shopify-data";
import { RiInformationLine } from "@remixicon/react";

export default async function Home() {
  const { products, isFallback } = await getFeaturedProductsWithFallback();

  return (
    <SiteShell>
      {isFallback ? (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-white">
            <RiInformationLine className="mt-1 h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm font-medium">Usando produtos de exemplo.</p>
              <p className="text-xs text-white/70">
                Adicione as credenciais da Shopify em um arquivo `.env` para carregar seus itens reais.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <HeroSection />
      <FeaturedProductsSection products={products} />
      <BrandStorySection />
      <ContactCtaSection />
    </SiteShell>
  );
}
