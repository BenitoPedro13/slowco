import type { Metadata } from "next";
import { BagView } from "@/components/bag/bag-view";
import { strings } from "@/content/strings";
import { getCurrentDrop } from "@/lib/catalog";
import { WHATSAPP_NUMBER } from "@/lib/config";

export const metadata: Metadata = { title: "Sacola" };

// docs/04-UX-LAYOUT-AND-MOTION.md §1 (/sacola) and 05 §6.
export default async function BagPage() {
  const drop = await getCurrentDrop();
  return (
    <main id="conteudo" tabIndex={-1} className="px-4 py-12 focus:outline-none sm:px-6 lg:px-10 lg:py-16">
      <h1 className="font-display text-[clamp(56px,12vw,192px)] leading-[0.85] font-extrabold [font-stretch:62%]">
        {strings["B-TITULO"]}
      </h1>
      <BagView
        whatsappNumber={WHATSAPP_NUMBER}
        currentDropHref={drop ? `/drops/${drop.slug}` : "/arquivo"}
        nextDrop={drop ? { name: drop.name, releaseAt: drop.releaseAt } : null}
      />
    </main>
  );
}
