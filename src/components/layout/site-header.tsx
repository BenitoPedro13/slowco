import Link from "next/link";
import * as Button from "@/components/ui/button";

const navLinks = [
  { label: "Vestuário", href: "/apparel" },
  { label: "Merch", href: "/merch" },
  { label: "Artistas", href: "/artists" },
  { label: "Contato", href: "/contato" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold uppercase tracking-[0.3em] text-white">
          Slow
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/buscar"
            className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline"
          >
            Buscar
          </Link>

          <Link
            href="/conta"
            className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline"
          >
            Conta
          </Link>

          <Button.Root
            asChild
            variant="neutral"
            mode="stroke"
            size="small"
            className="border-white/20 text-white hover:border-white hover:bg-white/5"
          >
            <Link href="/carrinho">Carrinho</Link>
          </Button.Root>
        </div>
      </div>
    </header>
  );
}
