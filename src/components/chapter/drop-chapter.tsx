// A drop as a home chapter (docs/tasks/TASK-B2-drop-chapters.md). Server Component; the section
// (flood) and the rail (arrows) are client leaves. The giant name overlaps only the solid,
// faded-out bottom of the photo, so its contrast is always text on the chapter colour.

import Image from "next/image";
import Link from "next/link";
import { CatalogCard } from "@/components/product/catalog-card";
import { fill } from "@/content/fill";
import { strings } from "@/content/strings";
import type { Drop, Product, ProductImage } from "@/lib/catalog/types";
import { FloodSection } from "./flood-section";
import { Rail } from "./rail";
import "./chapter.css";

export function DropChapter({
  drop,
  label,
  cover,
  products,
  status,
  layer,
}: {
  /** Stacking order (higher = above the following chapters), for the torn edge. */
  layer: number;
  drop: Pick<Drop, "slug" | "name" | "accent">;
  /** `DROP ATUAL` or `AINDA DISPONÍVEL`. */
  label: string;
  cover: ProductImage | null;
  products: Product[];
  /** Live state (countdown) for the current drop, rendered under the name. */
  status?: React.ReactNode;
}) {
  const id = `capitulo-${drop.slug}`;
  return (
    <FloodSection accent={drop.accent} labelledBy={id} layer={layer}>
      <div className="chapter__head">
        <p className="type-label">{label}</p>
        <Link href={`/drops/${drop.slug}`} className="type-label inline-flex min-h-11 items-center underline underline-offset-4 hover:decoration-2">
          {strings["A-VER-DROP"]}
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </div>
      {cover ? (
        <div className="chapter__photo">
          <Image src={cover.src} alt={cover.alt} fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}
      <h2 id={id} className={`chapter__name ${cover ? "chapter__name--over" : ""}`}>
        {drop.name}
      </h2>
      {status ? <div className="chapter__status">{status}</div> : null}
      <Rail label={fill(strings["H-TRILHO"], { drop: drop.name })}>
        {products.map((p) => (
          <CatalogCard key={p.slug} product={p} />
        ))}
      </Rail>
    </FloodSection>
  );
}
