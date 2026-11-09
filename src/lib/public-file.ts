// Server-only check that a /path is a file in public/ (images are imported by hand, 06 §7).

import { existsSync } from "node:fs";
import { join } from "node:path";

export function publicFileExists(src: string): boolean {
  if (!src.startsWith("/") || src.includes("..")) return false;
  return existsSync(join(process.cwd(), "public", src));
}
