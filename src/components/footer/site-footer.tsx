// Site footer (docs/04-UX-LAYOUT-AND-MOTION.md §2.2; B15 in
// docs/tasks/TASK-B11-B15-B20-truthful-surfaces.md): set as the garment's woven care label.
// Shipping/exchange small print waits for the client (08 #8): not rendered until then.
// "Voltar ao topo" is a plain fragment link to the top of the body (#topo; a sticky target would not scroll): no JS, moves the focus
// starting point, never smooth-scrolls.

import Link from "next/link";
import { SlowModeSwitch } from "@/components/motion/slow-mode-switch";
import { INSTAGRAM_URL, strings } from "@/content/strings";
import "./site-footer.css";

const link = "inline-flex min-h-11 items-center underline underline-offset-4 hover:decoration-2";

export function SiteFooter({ placeholder }: { placeholder: boolean }) {
  return (
    <footer className="border-t border-content px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="woven-label type-label">
        <span aria-hidden="true" className="woven-label__eyelet" />
        <p className="woven-label__row woven-label__brand">{strings["G-NOME"]}</p>
        <div className="woven-label__row flex flex-col gap-1">
          <p lang="en">{strings["G-LEGAL-1"]}</p>
          <p lang="en">{strings["G-LEGAL-2"]}</p>
        </div>
        <ul className="woven-label__row flex flex-wrap justify-center gap-x-6">
          <li>
            <Link href="/contato" className={link}>
              {strings["G-NAV-CONTATO"]}
            </Link>
          </li>
          <li>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={strings["G-INSTAGRAM-ARIA"]}
              className={link}
            >
              {strings["G-INSTAGRAM"]}
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </li>
        </ul>
        <div className="woven-label__row flex justify-center">
          <SlowModeSwitch align="center" />
        </div>
        {placeholder ? <p className="woven-label__row">{strings["R-DADOS-EXEMPLO"]}</p> : null}
        <p className="woven-label__row">
          <a href="#topo" className={link}>
            {strings["R-TOPO"]}
            <span aria-hidden="true">&nbsp;↑</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
