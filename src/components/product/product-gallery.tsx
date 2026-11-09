"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { strings } from "@/content/strings";
import { fill } from "@/content/fill";
import { useProductGallery } from "@/hooks/use-product-gallery";
import type { ProductImage } from "@/lib/catalog/types";

const control = "type-label inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-content px-3";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const { track, index, zoom, onScroll, select, open, close, restoreFocus, step } = useProductGallery(images.length);
  if (!images.length) return null;
  const zoomImage = zoom === null ? null : images[zoom];
  return (
    <div className="min-w-0 lg:col-span-7">
      <div role="region" aria-label={strings["P-GALERIA"]}>
        <div ref={track} onScroll={onScroll} className="product-gallery flex snap-x snap-mandatory overflow-x-auto" tabIndex={0}>
          {images.map((image, i) => (
            <button key={image.src} type="button" className="relative block w-full shrink-0 snap-start cursor-zoom-in focus-visible:-outline-offset-4"
              aria-label={fill(strings["P-AMPLIAR"], { n: i + 1 })}
              onClick={event => open(i, event.currentTarget)}>
              <Image {...image} alt={image.alt} sizes="(min-width: 1024px) 58vw, 100vw" priority={i === 0} fetchPriority={i === 0 ? "high" : undefined}
                className="aspect-[4/5] w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-content py-3">
          <div className="flex flex-wrap gap-2">
            {images.map((image, i) => (
              <button key={image.src} className={`${control} ${index === i ? "bg-content text-canvas" : ""}`} type="button"
                aria-label={fill(strings["P-VER-FOTO"], { n: i + 1 })} aria-current={index === i ? "true" : undefined}
                onClick={() => select(i)}><span aria-hidden="true">{i + 1}</span></button>
            ))}
          </div>
          <span className="type-label tabular-nums" data-testid="gallery-counter">{index + 1} / {images.length}</span>
        </div>
      </div>
      <Dialog.Root open={zoom !== null} onOpenChange={open => { if (!open) close(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80" />
          <Dialog.Content aria-describedby={undefined} onCloseAutoFocus={event => { event.preventDefault(); restoreFocus(); }}
            onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1); } }}
            className="fixed inset-2 z-50 flex flex-col gap-3 overflow-auto border border-content bg-canvas p-4 text-content sm:inset-6">
            <div className="flex items-center justify-between gap-3">
              <Dialog.Title className="type-label">{strings["P-GALERIA"]}</Dialog.Title>
              <Dialog.Close className={control}>{strings["G-FECHAR"]}</Dialog.Close>
            </div>
            {zoomImage ? <Image {...zoomImage} alt={zoomImage.alt} sizes="100vw" className="min-h-0 w-full flex-1 object-contain" /> : null}
            <div className="flex items-center justify-between gap-3">
              <button className={control} type="button" onClick={() => step(-1)}>{strings["P-FOTO-ANTERIOR"]}</button>
              <span className="type-label" data-testid="zoom-counter">{(zoom ?? 0) + 1} / {images.length}</span>
              <button className={control} type="button" onClick={() => step(1)}>{strings["P-FOTO-PROXIMA"]}</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
