"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { BagView } from "./bag-view";
import { strings } from "@/content/strings";
import "./bag-drawer.css";

export function BagDrawer({ children, count, label, whatsappNumber, currentDropHref, nextDrop }: {
  children: React.ReactNode; count: number; label: string;
  whatsappNumber: string | null; currentDropHref: string;
  nextDrop: { name: string; releaseAt: string } | null;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Link href="/sacola" data-count={count} className="type-label inline-flex min-h-11 items-center gap-2 px-1 underline-offset-4 hover:underline"
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); setOpen(true);
          }}>
          <span className="sr-only">{label}</span>{children}
        </Link>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
        <Dialog.Content aria-describedby={undefined} className="bag-drawer fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col overflow-y-auto border-l border-content bg-canvas px-4 pb-[max(24px,env(safe-area-inset-bottom))] text-content sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-4 border-b border-content py-3">
            <Dialog.Title className="font-display text-4xl font-extrabold [font-stretch:62%]">{strings["B-TITULO"]}</Dialog.Title>
            <Dialog.Close className="type-label min-h-11 min-w-11 cursor-pointer underline underline-offset-4">{strings["G-FECHAR"]}</Dialog.Close>
          </div>
          <BagView compact whatsappNumber={whatsappNumber} currentDropHref={currentDropHref} nextDrop={nextDrop} onNavigate={() => setOpen(false)} />
          <Dialog.Close asChild>
            <Link href="/sacola" className="type-label mt-8 inline-flex min-h-11 items-center self-start underline underline-offset-4">{strings["B-VER-SACOLA"]}</Link>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
