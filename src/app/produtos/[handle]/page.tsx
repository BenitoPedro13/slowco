import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { getProductWithFallback } from "@/lib/shopify-data";
import { formatCurrency } from "@/lib/format";
import * as Button from "@/components/ui/button";
import { RiErrorWarningLine } from "@remixicon/react";

type ProductPageProps = {
  params: { handle: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = params;
  const { product, isFallback } = await getProductWithFallback(handle);

  if (!product) {
    notFound();
  }

  const gallery =
    product.media?.nodes
      .map((node) => node.image)
      .filter((image): image is NonNullable<typeof image> => Boolean(image?.url)) ?? [];

  const price = formatCurrency(product.priceRange.minVariantPrice);

  return (
    <SiteShell>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
            <Link href="/produtos" className="transition hover:text-white">
              Produtos
            </Link>
            <span className="text-white/40">/</span>
            <span className="truncate text-white/70">{product.title}</span>
          </nav>

          <div className="mt-6 space-y-4">
            {gallery.length > 0 ? (
              gallery.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? product.title}
                    width={image.width ?? 1200}
                    height={image.height ?? 1200}
                    className="w-full object-cover"
                    priority={index === 0}
                  />
                </div>
              ))
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-sm text-white/40">
                Imagem em breve
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8 text-white">
          {isFallback ? (
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-white">
              <RiErrorWarningLine className="mt-1 h-5 w-5 text-white/70" />
              <div>
                <p className="text-sm font-medium">Conteúdo demonstrativo</p>
                <p className="text-xs text-white/70">
                  Configure a Shopify Storefront API para carregar as informações reais deste produto.
                </p>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              {product.vendor ?? "Slow Company"}
            </span>
            <h1 className="text-3xl font-semibold md:text-4xl">{product.title}</h1>
            <p className="text-lg font-medium text-white">{price}</p>
          </div>

          {product.options.length ? (
            <div className="space-y-4">
              {product.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    {option.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <span
                        key={value}
                        className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="space-y-4">
            <Button.Root
              variant="primary"
              mode="filled"
              size="medium"
              className="w-full bg-white text-black hover:bg-white/90"
            >
              Adicionar ao carrinho
            </Button.Root>

            <Button.Root
              asChild
              variant="neutral"
              mode="stroke"
              size="medium"
              className="w-full border-white/30 bg-transparent text-white hover:border-white hover:bg-white/5"
            >
              <Link href="https://wa.me/5521999999999" target="_blank">
                Falar com o estúdio
              </Link>
            </Button.Root>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Descrição</p>
            <div
              className="prose prose-invert max-w-none text-sm text-white/70"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>

          {product.tags.length ? (
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
