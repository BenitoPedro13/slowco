import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/ui/notification-provider";
import { Toaster } from "@/components/ui/toast";

const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Slow Company® — Streetwear do Rio",
    template: "%s | Slow Company®",
  },
  description:
    "Coleções limitadas, collabs e peças customizadas criadas pelo Slow Studio no Rio de Janeiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <NotificationProvider />
        <Toaster />
      </body>
    </html>
  );
}
