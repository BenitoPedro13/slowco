import { SiteShell } from "@/components/layout/site-shell";
import * as Button from "@/components/ui/button";
import Link from "next/link";

export default function ContatoPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-3xl px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Entre em contato
        </span>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
          Fala com o Slow Studio
        </h1>
        <p className="mt-4 text-sm text-white/65 md:text-base">
          Tem interesse em personalizar um produto, montar uma collab ou contratar o estúdio para um projeto?
          Escolhe o canal que preferir e a gente responde rápido.
        </p>

        <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              WhatsApp
            </p>
            <p className="mt-2 text-lg font-medium text-white">+55 (21) 99999-9999</p>
            <p className="text-sm text-white/60">Atendimento do estúdio • Segunda a sexta • 10h - 18h</p>
            <Button.Root
              asChild
              variant="primary"
              mode="filled"
              size="small"
              className="mt-4 bg-white text-black hover:bg-white/90"
            >
              <Link href="https://wa.me/5521999999999" target="_blank" rel="noreferrer">
                Mandar mensagem
              </Link>
            </Button.Root>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              E-mail
            </p>
            <p className="mt-2 text-lg font-medium text-white">studio@slowcompany.com.br</p>
            <p className="text-sm text-white/60">Briefings, press, parcerias e atacado.</p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Redes
            </p>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li>
                <Link href="https://instagram.com/" target="_blank" className="transition hover:text-white">
                  Instagram @slowcompany
                </Link>
              </li>
              <li>
                <Link href="https://www.tiktok.com/" target="_blank" className="transition hover:text-white">
                  TikTok @slowcompany
                </Link>
              </li>
              <li>
                <Link href="https://open.spotify.com/" target="_blank" className="transition hover:text-white">
                  Spotify Slow Radio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
