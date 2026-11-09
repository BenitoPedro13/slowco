// Catalogue types (docs/06-ARCHITECTURE.md §3). No data-source type leaks past this folder.

import type { DropAccent } from "@/lib/theme/themes";

export type { DropAccent };
export type Availability = "em-breve" | "disponivel" | "esgotado";
export type DropState = "em-breve" | "disponivel" | "esgotado";

export type Drop = {
  slug: string;
  name: string;
  /** ISO 8601 with offset (America/Sao_Paulo is -03:00). */
  releaseAt: string;
  accent: DropAccent;
  /** The client's own drop text, if any. */
  text?: string;
  /** Only when the client says so (docs/01-BRAND-BOOK.md rule 17). */
  limited?: boolean;
  noRestock?: boolean;
  /** Fake record standing in for client data (docs/08-OPEN-INPUTS.md #22). */
  placeholder?: boolean;
};

export type Size = { label: string; availability: Availability };

export type ProductImage = { src: string; alt: string; width: number; height: number };

export type Product = {
  slug: string;
  dropSlug: string;
  name: string;
  /** Absent → not rendered (docs/05-CONTENT.md P-PRECO). */
  price?: { cents: number };
  description?: string;
  color?: string;
  sizes: Size[];
  /** Product-level; "esgotado" when every size is. */
  availability: Availability;
  notForSale?: boolean;
  images: ProductImage[];
  placeholder?: boolean;
};

/** What client components (the bag) need about a product, passed as props. */
export type CatalogIndexEntry = {
  slug: string;
  name: string;
  dropName: string;
  price?: { cents: number };
  placeholder: boolean;
  /** First product photo, for the bag thumbnail. */
  image?: { src: string; alt: string };
};
