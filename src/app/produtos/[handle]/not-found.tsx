import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

export default function ProductNotFound() {
  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center text-white sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Produto não encontrado
        </span>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Esse drop saiu do ar ou ainda não foi publicado.
        </h1>
        <p className="max-w-xl text-sm text-white/70 md:text-base">
          Volte para o catálogo e explore os lançamentos que estão ativos no momento.
        </p>
        <Link
          href="/produtos"
          className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/5"
        >
          Ver catálogo
        </Link>
      </section>
    </SiteShell>
  );
}
