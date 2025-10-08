type ShopifyFetchOptions<T> = {
  query: string;
  variables?: Record<string, unknown>;
  /** Pass `no-cache` while developing to avoid stale data */
  cache?: RequestCache;
  /** Override default revalidation (in seconds). */
  revalidate?: number | false;
  /** Optional custom mapper to shape the response. */
  mapData?: (data: unknown) => T;
};

type ShopifyFetchResponse<T> = {
  data: T;
};

export const SHOPIFY_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
export const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2024-10";

export function envHasShopifyConfig() {
  return Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);
}

function ensureShopifyCredentials() {
  if (!envHasShopifyConfig()) {
    throw new Error(
      "Missing Shopify credentials. Make sure SHOPIFY_STORE_DOMAIN/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are defined.",
    );
  }
}

export async function shopifyFetch<TData = unknown>(
  options: ShopifyFetchOptions<TData>,
): Promise<ShopifyFetchResponse<TData>> {
  ensureShopifyCredentials();

  const { query, variables, cache, revalidate, mapData } = options;

  const requestInit: RequestInit & { next?: { revalidate?: number } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (cache) {
    requestInit.cache = cache;
  }

  if (revalidate === false) {
    requestInit.cache = "no-store";
  } else if (typeof revalidate === "number") {
    requestInit.next = { revalidate };
  }

  const result = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    requestInit,
  );

  if (!result.ok) {
    const message = await result.text();
    throw new Error(`Shopify request failed: ${result.status} ${message}`);
  }

  const json = (await result.json()) as { data?: unknown; errors?: unknown };

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors, null, 2)}`);
  }

  const data = (mapData ? mapData(json.data) : json.data) as TData;

  return { data };
}

const DEFAULT_PRODUCT_CARD_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  vendor
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  featuredImage {
    url(transform: {preferredContentType: WEBP, maxWidth: 900})
    altText
    width
    height
  }
`;

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProductCard = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  vendor?: string | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

export type ShopifyProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: ShopifyMoney;
};

export type ShopifyProductMediaImage = {
  id: string;
  image: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  };
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  availableForSale: boolean;
  vendor?: string | null;
  tags: string[];
  options: ShopifyProductOption[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  media?: {
    nodes: ShopifyProductMediaImage[];
  };
  variants: {
    nodes: ShopifyProductVariant[];
  };
};

export async function getFeaturedProducts(limit = 8) {
  const query = `
    query FeaturedProducts($limit: Int!) {
      products(first: $limit, sortKey: BEST_SELLING) {
        nodes {
          ${DEFAULT_PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    products: { nodes: ShopifyProductCard[] };
  }>({
    query,
    variables: { limit },
    revalidate: 60,
  });

  return data.products.nodes;
}

export async function getCollectionProducts(collectionHandle: string, limit = 24) {
  const query = `
    query CollectionProducts($handle: String!, $limit: Int!) {
      collection(handle: $handle) {
        id
        title
        description
        products(first: $limit) {
          nodes {
            ${DEFAULT_PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    collection: {
      id: string;
      title: string;
      description: string;
      products: { nodes: ShopifyProductCard[] };
    } | null;
  }>({
    query,
    variables: { handle: collectionHandle, limit },
    revalidate: 300,
  });

  return data.collection;
}

export async function getProductByHandle(handle: string) {
  const query = `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        descriptionHtml
        availableForSale
        vendor
        tags
        options {
          id
          name
          values
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        media(first: 8) {
          nodes {
            ... on MediaImage {
              id
              image {
                url(transform: {preferredContentType: WEBP, maxWidth: 1200})
                altText
                width
                height
              }
            }
          }
        }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>({
    query,
    variables: { handle },
    revalidate: 0,
  });

  return data.product;
}

export async function getProductRecommendations(productId: string) {
  const query = `
    query ProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        ${DEFAULT_PRODUCT_CARD_FIELDS}
      }
    }
  `;

  const { data } = await shopifyFetch<{
    productRecommendations: ShopifyProductCard[];
  }>({
    query,
    variables: { productId },
    revalidate: 300,
  });

  return data.productRecommendations;
}
