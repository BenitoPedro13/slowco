import type { Metadata } from "next";
import Image from "next/image";
import { CONTATO } from "@/content/editorial";
import { INSTAGRAM_URL, strings } from "@/content/strings";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { publicFileExists } from "@/lib/public-file";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";

export const metadata: Metadata = { title: "Contato" };

const big =
  "font-display text-[clamp(40px,7vw,112px)] leading-[0.9] font-extrabold [font-stretch:62%] underline-offset-8 hover:underline";
const arrow = <span aria-hidden="true" className="type-label ml-3 align-top">↗</span>;

// docs/04 §1.1 (/contato), 05 §7. The VIP group block (C-VIP) waits for 08 #15: not rendered.
export default function ContactPage() {
  const photo = publicFileExists(CONTATO.src);
  return (
    <main id="conteudo" tabIndex={-1} className="grid gap-12 px-4 py-12 focus:outline-none sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-16">
      <div className="lg:col-span-7">
        <h1 className="font-display text-[clamp(56px,12vw,192px)] leading-[0.85] font-extrabold [font-stretch:62%]">
          {strings["C-TITULO"]}
        </h1>
        <ul className="mt-12 flex flex-col gap-6 border-t border-content pt-10">
          {WHATSAPP_NUMBER ? (
            <li>
              <a href={buildWhatsAppUrl(WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className={big}>
                {strings["C-WHATSAPP"]}
                <span className="sr-only">{strings["G-NOVA-ABA"]}</span>
              </a>
              {arrow}
            </li>
          ) : null}
          <li>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={strings["G-INSTAGRAM-ARIA"]} className={big}>
              {strings["G-INSTAGRAM"]}
            </a>
            {arrow}
          </li>
        </ul>
        <p className="type-label mt-16">{strings["C-ORIGEM"]}</p>
      </div>
      {photo ? (
        <div className="duotone relative aspect-[4/5] lg:col-span-5">
          <Image src={CONTATO.src} alt={CONTATO.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      ) : null}
    </main>
  );
}
