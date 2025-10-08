import { SiteShell } from "@/components/layout/site-shell";

const artists = [
  {
    name: "DJ Bia Marques",
    description: "Sets de baile funk e produção sonora das campanhas 2024/25.",
  },
  {
    name: "Thiago Neves",
    description: "Fotógrafo autoral responsável pelos editoriais street futebol.",
  },
  {
    name: "Luna Andrade",
    description: "Diretora de arte e colunista convidada do blog Slow Stories.",
  },
];

export default function ArtistsPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Artistas & comunidade
        </span>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
          Quem faz a Slow pulsar
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/65 md:text-base">
          Seleciona uma ficha para saber mais sobre as collabs ativas. A nova plataforma vai permitir
          publicar releases completos, lookbooks interativos e drops co-criados com a comunidade.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-6"
            >
              <span className="text-lg font-semibold text-white">{artist.name}</span>
              <p className="text-sm text-white/65">{artist.description}</p>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                Perfil em breve
              </span>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
