import { notFound } from "next/navigation";
import { getDrop, getProducts } from "@/lib/catalog";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { strings } from "@/content/strings";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = strings["OG-DROP-ALT"];

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const drop = await getDrop((await params).slug);
  if (!drop) notFound();
  const photo = (await getProducts({ dropSlug: drop.slug }))[0]?.images[0]?.src;
  return renderOg({
    kicker: strings["OG-DROP"],
    title: drop.name,
    accent: drop.accent,
    photo,
  });
}
