import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import "@/components/transitions/page-transition.css";
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
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
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
      <body className="antialiased">
        <a
          href="#conteudo"
          className="type-label sr-only z-40 bg-canvas px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {strings["G-PULAR"]}
        </a>
        <BagProvider index={index}>
          <SiteHeader accent={accent} currentDropSlug={currentDrop?.slug ?? null} />
          {placeholder ? (
            <p role="note" className="type-label border-b border-content px-4 py-2 sm:px-6 lg:px-10">
              {strings["G-EXEMPLO"]}
            </p>
          ) : null}
          <ViewTransition default="page-wipe">{children}</ViewTransition>
          <SiteFooter />
          <RouteFocus />
          <CustomCursor />
        </BagProvider>
      </body>
    </html>
  );
}
