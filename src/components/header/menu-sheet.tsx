"use client";

// Mobile navigation (docs/04-UX-LAYOUT-AND-MOTION.md §2.1): Radix Dialog primitive, the same one
// shadcn's Sheet wraps (06 §8). Radix gives the focus trap, Escape, focus return and inert
// background; we only style it.

import * as Dialog from "@radix-ui/react-dialog";
import { strings } from "@/content/strings";
import type { NavItem } from "./nav-items";
import { NavLinks } from "./nav-links";

const button =
  "type-label inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-2 underline-offset-4 hover:underline";

export function MenuSheet({ items }: { items: NavItem[] }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={button}>{strings["G-MENU"]}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="menu-sheet fixed inset-0 z-40 flex flex-col bg-canvas px-4 text-content"
        >
          <div className="flex h-14 items-center justify-between">
            <Dialog.Title className="type-label">{strings["G-MENU"]}</Dialog.Title>
            <Dialog.Close className={button}>{strings["G-FECHAR"]}</Dialog.Close>
          </div>
          <nav aria-label={strings["G-NAV"]} className="mt-8">
            <NavLinks
              items={items}
              className="flex flex-col gap-2"
              linkClassName="font-display text-[clamp(40px,14vw,72px)] leading-none font-extrabold [font-stretch:62%] uppercase aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
              wrapLink={(link) => <Dialog.Close asChild>{link}</Dialog.Close>}
            />
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
