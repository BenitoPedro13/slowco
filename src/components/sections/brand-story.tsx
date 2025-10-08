export function BrandStorySection() {
  return (
    <section className="border-t border-white/5 bg-gradient-to-br from-black via-gray-950 to-gray-900">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="space-y-6 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Manifesto
          </span>
          <h3 className="text-3xl font-semibold md:text-4xl">
            Slow é ritmo, movimento e expressão de quem vive a rua de forma autêntica.
          </h3>
          <p className="text-base text-white/65">
            Combinamos storytelling e design para lançar coleções limitadas inspiradas no
            street futebol, baile funk, grafite e na pulsação única do Rio. Cada peça nasce
            com pesquisa, parcerias com artistas locais e materiais premium que performam
            no dia a dia.
          </p>
          <p className="text-base text-white/65">
            A nova plataforma permite que você customize cores, numerações e acabamentos
            antes de cada drop. Isso significa drops mais conectados com a comunidade e
            sem depender de templates engessados.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Highlights
            </span>
            <span className="text-white/40">2025</span>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
              <div>
                <p className="text-white font-medium">Custom Studio sob demanda</p>
                <p>Workflow integrado com Shopify para personalizar pedidos especiais.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
              <div>
                <p className="text-white font-medium">Entrega omnichannel</p>
                <p>Sincronização com estoques físicos, pop-ups e vendas diretas pelo WhatsApp.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
              <div>
                <p className="text-white font-medium">Lookbooks dinâmicos</p>
                <p>Conteúdo editorial com artistas, playlists e drops segmentados.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
