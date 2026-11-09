// The only place environment variables are read (docs/06-ARCHITECTURE.md §9).
// NEXT_PUBLIC_* values are inlined at build time: set them before `pnpm build`.

import { normalizeWhatsAppNumber } from "@/lib/whatsapp/build-url";

/** null when missing or invalid → WhatsApp buttons are not rendered (docs/04 §9). */
export const WHATSAPP_NUMBER = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
