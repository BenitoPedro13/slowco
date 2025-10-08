import * as Button from "@/components/ui/button";
import Link from "next/link";

export function ContactCtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white shadow-[0_40px_120px_-60px_rgba(0,0,0,0.7)] md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Slow Studio
          </span>
          <h3 className="text-2xl font-semibold md:text-3xl">
            Quer lançar uma collab ou personalizar sua linha?
          </h3>
          <p className="text-sm text-white/65 md:text-base">
            Fala com o estúdio e recebe um deck com opções de tecidos, bordados e acabamentos.
            A gente conecta Shopify + produção local para você vender sem intermediários.
          </p>
        </div>

        <div className="flex min-w-fit flex-col gap-3">
          <Button.Root
            asChild
            variant="primary"
            mode="filled"
            size="medium"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href="https://wa.me/5521999999999" target="_blank" rel="noreferrer">
              Abrir WhatsApp
            </Link>
          </Button.Root>
          <Button.Root
            asChild
            variant="neutral"
            mode="stroke"
            size="medium"
            className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/5"
          >
            <Link href="mailto:studio@slowcompany.com.br">Enviar briefing</Link>
          </Button.Root>
        </div>
      </div>
    </section>
  );
}
