import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { getCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import * as Button from "@/components/ui/button";

export default async function CartPage() {
  const { cart, isFallback } = await getCart();
  const hasItems = Boolean(cart && cart.totalQuantity > 0);

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 pb-8 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Seu carrinho
          </span>
          <h1 className="text-3xl font-semibold md:text-4xl">Conferir produtos</h1>
          <p className="max-w-2xl text-sm text-white/65 md:text-base">
            Revise os itens adicionados antes de seguir para o checkout.
          </p>
        </div>

        {isFallback ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-white">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/70" />
            <div>
              <p className="text-sm font-medium">Carrinho demonstrativo</p>
              <p className="text-xs text-white/70">
                Configure as credenciais da Shopify para habilitar checkout e estoque em tempo real.
              </p>
            </div>
          </div>
        ) : null}

        {!hasItems ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-16 text-center text-white/70">
            <p className="text-lg font-medium text-white">Seu carrinho está vazio.</p>
            <p className="mt-2 text-sm text-white/60">
              Explore o catálogo e adicione peças para montar o seu drop.
            </p>
            <Button.Root
              asChild
              variant="neutral"
              mode="stroke"
              size="medium"
              className="mx-auto mt-6 border-white/30 bg-transparent text-white hover:border-white hover:bg-white/5"
            >
              <Link href="/produtos">Ver produtos</Link>
            </Button.Root>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cart?.lines.map((line) => {
                const merchandise = line.merchandise;
                const product = merchandise.product;
                const image = product.featuredImage;

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-white"
                  >
                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-white/5 sm:h-32 sm:w-32">
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.altText ?? product.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="space-y-1">
                        <Link href={`/produtos/${product.handle}`} className="text-base font-medium transition hover:text-white/80">
                          {product.title}
                        </Link>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                          {merchandise.title}
                        </p>
                        <p className="text-sm text-white/60">Qtd: {line.quantity}</p>
                      </div>
                      <p className="text-base font-semibold text-white">
                        {formatCurrency(line.cost.totalAmount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white">
              <h2 className="text-lg font-semibold">Resumo</h2>

              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{cart ? formatCurrency(cart.estimatedCost.subtotalAmount) : "--"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="text-base font-semibold text-white">
                    {cart ? formatCurrency(cart.estimatedCost.totalAmount) : "--"}
                  </span>
                </div>
              </div>

              {isFallback ? (
                <Button.Root
                  asChild
                  variant="neutral"
                  mode="stroke"
                  size="medium"
                  className="w-full border-white/30 bg-transparent text-white hover:border-white hover:bg-white/5"
                >
                  <Link href="/contato">Falar com o estúdio</Link>
                </Button.Root>
              ) : (
                <Button.Root
                  asChild
                  variant="primary"
                  mode="filled"
                  size="medium"
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  <Link href={cart?.checkoutUrl ?? "#"} target="_blank" rel="noreferrer">
                    Finalizar no checkout
                  </Link>
                </Button.Root>
              )}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
