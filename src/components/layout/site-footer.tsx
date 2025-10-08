import Link from "next/link";

const footerLinks = [
  {
    title: "Coleções",
    links: [
      { label: "New Drop", href: "/new-drop" },
      { label: "Apparel", href: "/apparel" },
      { label: "Merch", href: "/merch" },
    ],
  },
  {
    title: "Slow Company",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Artistas", href: "/artists" },
      { label: "Entre em contato", href: "/contato" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold uppercase tracking-[0.4em] text-white">
            Slow
          </Link>
          <p className="max-w-sm text-sm text-white/60">
            Marca nascida no Rio de Janeiro que celebra cultura de rua, esporte e
            liberdade criativa. Edição limitada, corte premium, design autêntico.
          </p>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              {section.title}
            </p>
            <ul className="space-y-2">
              {section.links.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Slow Company. Todos os direitos reservados.
      </div>
    </footer>
  );
}
