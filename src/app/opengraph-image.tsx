import { getCurrentDrop, getProducts } from "@/lib/catalog";
import { CURRENT_DROP_ACCENT } from "@/lib/theme/themes";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { strings } from "@/content/strings";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = strings["OG-HOME-ALT"];

export default async function Image() {
  const drop = await getCurrentDrop();
  const photo = drop ? (await getProducts({ dropSlug: drop.slug }))[0]?.images[0]?.src : undefined;
  return renderOg({
    kicker: strings["H-LINHA"],
    title: strings["G-NOME"],
    accent: drop?.accent ?? CURRENT_DROP_ACCENT,
    photo,
  });
}
