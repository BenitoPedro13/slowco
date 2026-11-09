import { getDrop, getProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { CURRENT_DROP_ACCENT } from "@/lib/theme/themes";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { strings } from "@/content/strings";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = strings["OG-PRODUTO-ALT"];

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const drop = await getDrop(product.dropSlug);
  return renderOg({
    kicker: drop?.name ?? strings["G-NOME"],
    title: product.name,
    accent: drop?.accent ?? CURRENT_DROP_ACCENT,
    photo: product.images[0]?.src,
  });
}
