// Site footer (docs/04-UX-LAYOUT-AND-MOTION.md §2.2). Shipping/exchange small print waits for
// the client (08 #8): not rendered until then.

import Link from "next/link";
import { INSTAGRAM_URL, strings } from "@/content/strings";

export function SiteFooter() {
  return (
    <footer className="border-t border-content px-4 py-10 sm:px-6 lg:px-10">
      <div className="type-label flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p lang="en">{strings["G-LEGAL-1"]}</p>
          <p lang="en">{strings["G-LEGAL-2"]}</p>
        </div>
        <ul className="flex gap-6">
          <li>
            <Link href="/contato" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:decoration-2">
              {strings["G-NAV-CONTATO"]}
            </Link>
          </li>
          <li>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={strings["G-INSTAGRAM-ARIA"]}
              className="inline-flex min-h-11 items-center underline underline-offset-4 hover:decoration-2"
            >
              {strings["G-INSTAGRAM"]}
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
