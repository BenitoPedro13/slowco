"use client";
import Image from "next/image";
import Link from "next/link";
import { strings } from "@/content/strings";
import { fill } from "@/content/fill";
import type { DropState, ProductImage } from "@/lib/catalog/types";
import { useArchiveFilter } from "@/hooks/use-archive-filter";
import "./archive.css";

export type ArchivePoster = { slug: string; name: string; year: string; state: DropState; available: number; cover?: ProductImage };
const filters = ["todos", "disponivel", "esgotado"] as const;
export type ArchiveFilter = typeof filters[number];
export function ArchiveWall({ posters, filter }: { posters: ArchivePoster[]; filter: ArchiveFilter }) {
  const { grid, select, selected } = useArchiveFilter(filter);
  const visible = posters.filter(poster => selected === "todos" || poster.state === selected);
  const labels = { todos: strings["A-TODOS"], disponivel: strings["A-DISPONIVEL"], esgotado: strings["D-ESGOTADO"] };
  return (
    <>
      <fieldset className="mt-10 flex flex-wrap gap-2">
        <legend className="type-label mb-3">{strings["A-FILTRAR"]}</legend>
        {filters.map(value => (
          <label key={value} className="type-label relative inline-flex min-h-11 cursor-pointer items-center border border-content px-4 has-checked:bg-content has-checked:text-canvas has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-content">
            <input className="absolute inset-0 z-10 size-full cursor-pointer opacity-0" type="radio" name="estado" value={value} checked={selected === value} onChange={() => select(value)} />
            {labels[value]}
          </label>
        ))}
      </fieldset>
      <ol ref={grid} className="mt-8 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((poster, i) => (
          <li key={poster.slug} data-drop={poster.slug} className="archive-poster min-w-0 border border-content">
            <Link href={`/drops/${poster.slug}`} className="group block">
              <div className={`relative aspect-[3/4] overflow-hidden bg-content ${poster.state === "esgotado" ? "archive-poster--quiet" : ""}`}>
                {poster.cover ? <>
                  <Image src={poster.cover.src} alt="" fill priority={i === 0} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="archive-poster__photo object-cover" />
                  <span aria-hidden="true" className="duotone absolute! inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                    <Image src={poster.cover.src} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </span>
                </> : null}
                <span className="type-label absolute top-3 left-3 border border-content bg-canvas px-3 py-2 text-content">{poster.year}</span>
              </div>
              <div className="flex flex-col gap-4 bg-canvas p-4 text-content sm:p-5">
                <p className="type-label">{poster.state === "em-breve" ? strings["D-EM-BREVE"] : poster.state === "esgotado" ? strings["D-ESGOTADO"] : strings["A-AINDA"]}</p>
                <h2 className="font-display text-[clamp(40px,5vw,80px)] leading-[0.9] font-extrabold [font-stretch:62%] group-hover:underline">{poster.name}</h2>
                {poster.available > 0 ? <p className="type-label border-t border-content pt-3">{poster.available === 1 ? strings["A-CONTAGEM-1"] : fill(strings["A-CONTAGEM"], { n: poster.available })}</p> : null}
              </div>
            </Link>
          </li>
        ))}
      </ol>
      {!visible.length ? <p className="type-label py-12" role="status">{strings["A-SEM-RESULTADOS"]}</p> : null}
    </>
  );
}
