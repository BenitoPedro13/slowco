import Image from "next/image";
import Link from "next/link";
import { DropStatus } from "@/components/drop/drop-status";
import { EntryLoader } from "@/components/entry/entry-loader";
import { Globe } from "@/components/globe/globe";
import { Hero } from "@/components/hero/hero";
import { Marquee } from "@/components/marquee/marquee";
import { CatalogCard, CatalogGrid } from "@/components/product/catalog-card";
import { HOME_BAND, MUNDO } from "@/content/editorial";
import { strings } from "@/content/strings";
import { getCurrentDrop, getDrops, getProducts, getRenderTime, isReleased } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-file";

// Home (docs/04-UX-LAYOUT-AND-MOTION.md §1.1 + design moments M1–M6): entry loader, poster hero,
// current drop, pieces still available, marquee band, globe + "pro mundo" photo.
export const revalidate = 60;

const section = "border-t border-content px-4 py-16 sm:px-6 lg:px-10 lg:py-24";
const sectionTitle = "type-label mb-8";

export default async function Home() {
  const renderedAt = await getRenderTime();
  const current = await getCurrentDrop(renderedAt);
  const currentProducts = current ? await getProducts({ dropSlug: current.slug }) : [];
  const released = new Set(
    (await getDrops()).filter((d) => isReleased(d, renderedAt)).map((d) => d.slug),
  );
  const stillAvailable = (await getProducts({ availability: "disponivel" })).filter(
    (p) => p.dropSlug !== current?.slug && released.has(p.dropSlug) && !p.notForSale,
  );
  // Real client photos only (never the drawn stand-ins) for the loader stack.
  const loaderPhotos = [HOME_BAND, ...(await getProducts()).map((p) => p.images[0])]
    .filter((i) => i && i.src.startsWith("/catalogo/slow-") && publicFileExists(i.src))
    .slice(0, 5);

  return (
    <main id="conteudo" tabIndex={-1} className="focus:outline-none">
      <EntryLoader photos={loaderPhotos} />
      <Hero
        drop={
          current
            ? {
                name: current.name,
                href: `/drops/${current.slug}`,
                releaseAt: current.releaseAt,
                renderedAt,
                products: currentProducts.map((p) => ({
                  availability: p.availability,
                  notForSale: p.notForSale,
                })),
              }
            : null
        }
        photo={publicFileExists(HOME_BAND.src) ? HOME_BAND : null}
      />

      {current ? (
        <section aria-labelledby="drop-atual" className={`${section} grid gap-10 lg:grid-cols-12`}>
          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
            <h2 id="drop-atual" className="type-label">
              {strings["H-DROP-ATUAL"]}
            </h2>
            <p className="font-display text-[clamp(40px,6vw,96px)] leading-[0.9] font-extrabold [font-stretch:62%]">
              <Link href={`/drops/${current.slug}`} className="underline-offset-8 hover:underline">
                {current.name}
              </Link>
            </p>
            <DropStatus
              size="md"
              releaseAt={current.releaseAt}
              renderedAt={renderedAt}
              products={currentProducts.map((p) => ({
                availability: p.availability,
                notForSale: p.notForSale,
              }))}
            />
          </div>
          <div className="lg:col-span-7">
            <CatalogGrid count={2}>
              {currentProducts.map((p) => (
                <CatalogCard key={p.slug} product={p} />
              ))}
            </CatalogGrid>
          </div>
        </section>
      ) : null}

      {stillAvailable.length > 0 ? (
        <section aria-labelledby="ainda" className={section}>
          <h2 id="ainda" className={sectionTitle}>
            {strings["H-AINDA"]}
          </h2>
          <CatalogGrid count={stillAvailable.length}>
            {stillAvailable.map((p) => (
              <CatalogCard key={p.slug} product={p} />
            ))}
          </CatalogGrid>
        </section>
      ) : null}

      <Marquee />

      <section aria-label={strings["C-ORIGEM"]} className={`${section} grid items-center gap-10 border-t-0 lg:grid-cols-12`}>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <p className="font-display text-[clamp(40px,6vw,96px)] leading-[0.9] font-extrabold [font-stretch:62%]">
            {strings["C-ORIGEM"]}
          </p>
          <Globe className="w-full max-w-[420px]" />
        </div>
        {publicFileExists(MUNDO.src) ? (
          <div className="duotone aspect-[4/5] lg:col-span-6 lg:col-start-7">
            <Image src={MUNDO.src} alt={MUNDO.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        ) : null}
      </section>
    </main>
  );
}
