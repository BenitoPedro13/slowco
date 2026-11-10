"use client";

// The bag page body (docs/04 §1, 05 §6). Ordering happens in WhatsApp: the button is a wa.me
// link with the message of 05 §8; nothing is sent from the site and nothing is stored but the
// bag lines in this browser.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fill } from "@/content/fill";
import { strings } from "@/content/strings";
import { OrdersUnavailable } from "@/components/whatsapp/orders-unavailable";
import { useBagActions, useBagLines } from "@/hooks/use-bag";
import { useIsUpcoming } from "@/hooks/use-drop-state";
import { formatDropDate } from "@/lib/format/date";
import { MAX_QUANTITY } from "@/lib/bag/store";
import { formatPrice } from "@/lib/format/price";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";
import { MAX_NAME_LENGTH, formatOrderMessage } from "@/lib/whatsapp/format-message";

const stepButton =
  "grid size-11 cursor-pointer place-items-center border border-content text-lg disabled:cursor-not-allowed disabled:opacity-50";

export const primaryAction =
  "type-label inline-flex min-h-12 items-center justify-center bg-content px-6 text-canvas underline-offset-4 hover:underline";

export function BagView({
  whatsappNumber,
  currentDropHref,
  nextDrop = null,
  compact = false,
  onNavigate,
}: {
  /** The current drop, for the empty state's "next drop" line while it is still to open (B20). */
  nextDrop?: { name: string; releaseAt: string } | null;
  compact?: boolean;
  onNavigate?: () => void;
  whatsappNumber: string | null;
  currentDropHref: string;
}) {
  const lines = useBagLines();
  const { setQuantity, remove } = useBagActions();
  const [name, setName] = useState("");
  const upcoming = useIsUpcoming(nextDrop?.releaseAt);

  if (lines.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-6">
        <p className={`font-display leading-[0.9] font-extrabold [font-stretch:62%] ${compact ? "text-[clamp(40px,8vw,64px)]" : "text-[clamp(40px,7vw,112px)]"}`}>
          {strings["B-VAZIA"]}
        </p>
        {upcoming && nextDrop ? (
          <p className="type-label max-w-[48ch]">
            {fill(strings["B-PROXIMO"], { nome: nextDrop.name, data: formatDropDate(nextDrop.releaseAt).toUpperCase() })}
          </p>
        ) : null}
        <Link onClick={onNavigate} href={currentDropHref} className={primaryAction}>
          {strings["B-VER-DROP"]}
        </Link>
      </div>
    );
  }

  const message = formatOrderMessage({
    lines: lines.map((l) => ({
      product: l.name,
      drop: l.dropName,
      size: l.size,
      quantity: l.quantity,
      price: l.price ? formatPrice(l.price.cents) : undefined,
    })),
    name,
  });

  return (
    <div className={`mt-8 grid gap-8 ${compact ? "" : "lg:grid-cols-12"}`}>
      <ul className={`flex flex-col border-t border-content ${compact ? "" : "lg:col-span-7"}`}>
        {lines.map((l) => (
          <li
            key={`${l.slug}:${l.size}`}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-content py-4"
          >
            <div className="flex items-center gap-4">
            {l.image ? (
              <Image
                src={l.image.src}
                alt=""
                width={64}
                height={80}
                sizes="64px"
                className="h-20 w-16 shrink-0 object-cover"
              />
            ) : null}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                <Link onClick={onNavigate} href={`/produtos/${l.slug}`} className="underline-offset-4 hover:underline">
                  {l.name}
                </Link>
              </h2>
              <p className="type-label">
                {l.dropName} / {fill(strings["B-TAMANHO"], { tamanho: l.size })}
                {l.price ? ` / ${formatPrice(l.price.cents)}` : ""}
              </p>
            </div>
            </div>
            <div className="flex items-center gap-4">
              <fieldset className="flex items-center gap-2">
                <legend className="sr-only">
                  {strings["B-QTD"]}: {l.name}, {fill(strings["B-TAMANHO"], { tamanho: l.size })}
                </legend>
                <button
                  type="button"
                  className={stepButton}
                  aria-label={strings["B-MENOS"]}
                  disabled={l.quantity <= 1}
                  onClick={() => setQuantity(l.slug, l.size, l.quantity - 1)}
                >
                  <span aria-hidden="true">−</span>
                </button>
                <output className="type-label w-6 text-center" aria-label={strings["B-QTD"]}>
                  {l.quantity}
                </output>
                <button
                  type="button"
                  className={stepButton}
                  aria-label={strings["B-MAIS"]}
                  disabled={l.quantity >= MAX_QUANTITY}
                  onClick={() => setQuantity(l.slug, l.size, l.quantity + 1)}
                >
                  <span aria-hidden="true">+</span>
                </button>
              </fieldset>
              <button
                type="button"
                className="type-label min-h-11 cursor-pointer px-2 underline underline-offset-4 hover:decoration-2"
                onClick={() => remove(l.slug, l.size)}
              >
                {strings["B-REMOVER"]}
                <span className="sr-only">: {l.name}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={`min-w-0 flex flex-col gap-6 ${compact ? "" : "lg:col-span-5"}`}>
        <label className="flex flex-col gap-2">
          <span className="type-label">{strings["B-NOME"]}</span>
          <input
            type="text"
            name="nome"
            autoComplete="given-name"
            maxLength={MAX_NAME_LENGTH}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11 border border-content bg-canvas px-3 text-content"
          />
        </label>
        <div className="min-w-0 border border-content p-4">
          <h2 className="type-label mb-4">{strings["B-PREVIA"]}</h2>
          <pre data-testid="message-preview" className="font-label text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{message}</pre>
        </div>
        <p className="max-w-[68ch]">{strings["B-NOTA"]}</p>
        {whatsappNumber ? (
          <a
            href={buildWhatsAppUrl(whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pedir"
            className={primaryAction}
          >
            {strings["B-ENVIAR"]}
            <span className="sr-only">{strings["G-NOVA-ABA"]}</span>
          </a>
        ) : (
          <OrdersUnavailable />
        )}
      </div>
    </div>
  );
}
