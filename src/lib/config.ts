// The only place environment variables are read (docs/06-ARCHITECTURE.md §9).
// NEXT_PUBLIC_* values are inlined at build time: set them before `pnpm build`.

import { normalizeWhatsAppNumber } from "@/lib/whatsapp/build-url";

/** null when missing or invalid → WhatsApp buttons are not rendered (docs/04 §9). */
export const WHATSAPP_NUMBER = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

/** Absolute base for canonical and Open Graph URLs (docs/10 B17, docs/08 #11: domain still open). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
