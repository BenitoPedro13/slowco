import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/config";
import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RouteFocus } from "@/components/transitions/route-focus";
import { strings } from "@/content/strings";
import { themeInitScript } from "@/lib/theme/init-script";
import { BagProvider } from "@/components/bag/bag-provider";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/header/site-header";
import { getCatalogIndex, getCurrentDrop, hasPlaceholderData } from "@/lib/catalog";
import { CURRENT_DROP_ACCENT, DEFAULT_THEME } from "@/lib/theme/themes";

// docs/02-VISUAL-IDENTITY.md §4.1: Archivo (OFL) with the width axis, normal + italic.
// Only `latin` is preloaded (pt-BR fits it); latin-ext stays available on demand (TASK-P1).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: strings["M-TITULO"],
    template: strings["M-TITULO-MODELO"],
  },
  description: strings["M-DESCRICAO"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The current drop's accent drives the `drop` theme (docs/06-ARCHITECTURE.md §6).
  const currentDrop = await getCurrentDrop();
  const accent = currentDrop?.accent ?? CURRENT_DROP_ACCENT;
  const placeholder = await hasPlaceholderData();
  const index = await getCatalogIndex();
  return (
    <html
      lang="pt-BR"
      data-theme={DEFAULT_THEME}
      data-drop-accent={accent}
      className={`${archivo.variable} ${geistMono.variable}`}
      // The init script may change data-theme before hydration (docs/06-ARCHITECTURE.md §6).
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body id="topo" className={`antialiased ${placeholder ? "has-sample-notice" : ""}`}>
        <a
          href="#conteudo"
          className="type-label sr-only z-40 bg-canvas px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {strings["G-PULAR"]}
        </a>
        <BagProvider index={index}>
          <SiteHeader whatsappNumber={WHATSAPP_NUMBER} accent={accent} currentDrop={currentDrop ? { slug: currentDrop.slug, name: currentDrop.name, releaseAt: currentDrop.releaseAt } : null} />
          {placeholder ? (
            <p role="note" className="type-label flex items-center border-b border-content px-4 py-2 sm:px-6 lg:px-10">
              <span className="xl:hidden">{strings["G-EXEMPLO-CURTO"]}</span>
              <span className="hidden xl:inline">{strings["G-EXEMPLO"]}</span>
            </p>
          ) : null}
          {children}
          <SiteFooter placeholder={placeholder} />
          <RouteFocus />
          <CustomCursor />
        </BagProvider>
      </body>
    </html>
  );
}
