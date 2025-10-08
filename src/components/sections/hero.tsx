import * as Button from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -left-16 top-10 h-96 w-96 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-primary-base/40 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-20 xl:px-8">
        <div className="max-w-2xl space-y-6 text-white">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
            Slow Company 2025
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Vestuário de rua com DNA do Rio, feito para quem vive o agora.
          </h1>
          <p className="max-w-xl text-base text-white/70 md:text-lg">
            Drop limitado com shapes exclusivos, nylon técnico, fleece e algodão premium.
            Construa seu look com liberdade total de customização e storytelling.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button.Root
              asChild
              variant="primary"
              mode="filled"
              size="medium"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/new-drop">Explorar coleção</Link>
            </Button.Root>
            <Button.Root
              asChild
              variant="neutral"
              mode="stroke"
              size="medium"
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/5"
            >
              <Link href="/lookbook">Ver lookbook</Link>
            </Button.Root>
          </div>
        </div>

        <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>Drop exclusivo</span>
            <span>Limited Run</span>
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-sm text-white/70">
              Personalize tecidos, cores e aplicações com a equipe criativa Slow Studio.
              Produção sob demanda com suporte direto via WhatsApp e entregas em todo Brasil.
            </p>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">Atendimento</span>
                <span className="text-lg font-semibold text-white">Custom Studio</span>
              </div>
              <div className="ml-auto text-right">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">Tempo médio</span>
                <p className="text-lg font-semibold text-white">24h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
