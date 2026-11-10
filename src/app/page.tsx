import Image from "next/image";
import { DropStatus } from "@/components/drop/drop-status";
import { EntryLoader } from "@/components/entry/entry-loader";
import { Globe } from "@/components/globe/globe";
import { Hero } from "@/components/hero/hero";
import { Marquee } from "@/components/marquee/marquee";
import { DropChapter } from "@/components/chapter/drop-chapter";
import { HOME_BAND, MUNDO } from "@/content/editorial";
import { strings } from "@/content/strings";
import { getCurrentDrop, getDrops, getProducts, getRenderTime, isReleased } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-file";

// Home (docs/04-UX-LAYOUT-AND-MOTION.md §1.1 + design moments M1–M6): entry loader, poster hero,
// drop chapters (B2: current drop, then older drops with pieces left), marquee band, globe +
// "pro mundo" photo.
export const revalidate = 60;

const section = "border-t border-content px-4 py-16 sm:px-6 lg:px-10 lg:py-24";

export default async function Home() {
  const renderedAt = await getRenderTime();
  const current = await getCurrentDrop(renderedAt);
  const currentProducts = current ? await getProducts({ dropSlug: current.slug }) : [];
  const drops = await getDrops();
  const released = new Set(drops.filter((d) => isReleased(d, renderedAt)).map((d) => d.slug));
  const releaseOf = new Map(drops.map((d) => [d.slug, d.releaseAt]));
  const allProducts = await getProducts();
  const stillAvailable = (await getProducts({ availability: "disponivel" })).filter(
    (p) => p.dropSlug !== current?.slug && released.has(p.dropSlug) && !p.notForSale,
  );
  // B2: one chapter per drop: the current one, then each older drop with pieces still for sale.
  const chapters = [
    ...(current ? [{ drop: current, label: strings["H-DROP-ATUAL"], products: currentProducts, current: true }] : []),
    ...drops
      .filter((d) => stillAvailable.some((p) => p.dropSlug === d.slug))
      .map((d) => ({
        drop: d,
        label: strings["H-AINDA"],
        products: stillAvailable.filter((p) => p.dropSlug === d.slug),
        current: false,
      })),
  ];
  // Chapter cover: the drop's first real client photo not already shown big on the home.
  const usedBig = new Set([HOME_BAND.src, MUNDO.src]);
  const coverFor = (slug: string) =>
    allProducts
      .filter((p) => p.dropSlug === slug)
      .flatMap((p) => p.images)
      .find((i) => i.src.startsWith("/catalogo/slow-") && !usedBig.has(i.src) && publicFileExists(i.src)) ?? null;
  // Real client photos only (never the drawn stand-ins) for the loader stack.
  const loaderPhotos = [HOME_BAND, ...allProducts.map((p) => p.images[0])]
    .filter((i) => i && i.src.startsWith("/catalogo/slow-") && publicFileExists(i.src))
    .filter((photo, index, photos) => photos.findIndex((p) => p.src === photo.src) === index)
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

      {chapters.map(({ drop, label, products, current: isCurrent }, i) => (
        <DropChapter
          key={drop.slug}
          layer={chapters.length - i}
          drop={drop}
          label={label}
          cover={coverFor(drop.slug)}
          products={products}
          status={
            isCurrent ? (
              <DropStatus
                size="md"
                releaseAt={drop.releaseAt}
                renderedAt={renderedAt}
                products={products.map((p) => ({ availability: p.availability, notForSale: p.notForSale }))}
              />
            ) : undefined
          }
        />
      ))}

      <Marquee
        renderedAt={renderedAt}
        drop={
          current
            ? {
                name: current.name,
                releaseAt: current.releaseAt,
                products: currentProducts.map((p) => ({ availability: p.availability, notForSale: p.notForSale })),
              }
            : null
        }
        pieces={allProducts.flatMap((p) => {
          const releaseAt = releaseOf.get(p.dropSlug);
          return releaseAt ? [{ releaseAt, availability: p.availability, notForSale: p.notForSale }] : [];
        })}
      />

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
