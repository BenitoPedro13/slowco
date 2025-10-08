"use server";

import { cookies } from "next/headers";
import { envHasShopifyConfig, shopifyFetch, type ShopifyMoney } from "./shopify";
import { sampleProducts } from "@/data/sample-products";
import { sampleProductDetails } from "@/data/sample-product-details";

const CART_COOKIE_NAME = "slowco_shopify_cart_id";
const FALLBACK_CART_COOKIE_NAME = "slowco_fallback_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  estimatedCost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 20) {
    nodes {
      id
      quantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          price {
            amount
            currencyCode
          }
          product {
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

type ShopifyCartResponse = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  estimatedCost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      cost: {
        totalAmount: ShopifyMoney;
      };
      merchandise: {
        __typename: string;
        id: string;
        title: string;
        price: ShopifyMoney;
        product: {
          handle: string;
          title: string;
          featuredImage?: {
            url: string;
            altText?: string | null;
            width?: number | null;
            height?: number | null;
          } | null;
        };
      } | null;
    }>;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
  };
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoney;
    product: {
      handle: string;
      title: string;
      featuredImage?: {
        url: string;
        altText?: string | null;
        width?: number | null;
        height?: number | null;
      };
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  estimatedCost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: CartLine[];
};

export type CartResult = {
  cart: Cart | null;
  isFallback: boolean;
};

function mapShopifyCart(cart: ShopifyCartResponse | null): Cart | null {
  if (!cart) return null;

  const lines: CartLine[] = cart.lines.nodes
    .map((line) => {
      if (!line.merchandise || !("product" in line.merchandise)) {
        return null;
      }

      return {
        id: line.id,
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: line.cost.totalAmount.amount,
            currencyCode: line.cost.totalAmount.currencyCode,
          },
        },
        merchandise: {
          id: line.merchandise.id,
          title: line.merchandise.title,
          price: line.merchandise.price,
          product: {
            handle: line.merchandise.product.handle,
            title: line.merchandise.product.title,
            featuredImage: line.merchandise.product.featuredImage ?? undefined,
          },
        },
      } satisfies CartLine;
    })
    .filter(Boolean) as CartLine[];

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    estimatedCost: {
      subtotalAmount: cart.estimatedCost.subtotalAmount,
      totalAmount: cart.estimatedCost.totalAmount,
    },
    lines,
  };
}

async function getCartCookie() {
  const store = await cookies();
  return store.get(CART_COOKIE_NAME)?.value ?? null;
}

async function setCartCookie(id: string) {
  const store = await cookies();
  store.set(CART_COOKIE_NAME, id, {
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
}

async function deleteCartCookie() {
  const store = await cookies();
  store.delete(CART_COOKIE_NAME);
}

async function getFallbackCartData(): Promise<{ lines: { handle: string; quantity: number }[] }> {
  try {
    const store = await cookies();
    const value = store.get(FALLBACK_CART_COOKIE_NAME)?.value;
    if (!value) {
      return { lines: [] };
    }
    const parsed = JSON.parse(value) as { lines: { handle: string; quantity: number }[] };
    if (!Array.isArray(parsed.lines)) {
      return { lines: [] };
    }
    return { lines: parsed.lines.filter((line) => typeof line.handle === "string" && typeof line.quantity === "number") };
  } catch {
    return { lines: [] };
  }
}

async function setFallbackCartData(data: { lines: { handle: string; quantity: number }[] }) {
  const store = await cookies();
  store.set(FALLBACK_CART_COOKIE_NAME, JSON.stringify(data), {
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
}

function findSampleByVariantId(variantId: string) {
  return Object.values(sampleProductDetails).find((product) =>
    product.variants.nodes.some((variant) => variant.id === variantId),
  );
}

async function addLineToFallbackCart(handleHint: string | null, quantity: number) {
  const current = await getFallbackCartData();
  const handle =
    handleHint ??
    current.lines[0]?.handle ??
    (sampleProducts.length ? sampleProducts[0].handle : null);

  if (!handle) {
    return buildFallbackCart();
  }

  const existing = current.lines.find((line) => line.handle === handle);
  if (existing) {
    existing.quantity += quantity;
  } else {
    current.lines.push({ handle, quantity });
  }

  await setFallbackCartData(current);
  return await buildFallbackCart();
}

async function buildFallbackCart(): Promise<Cart> {
  const fallback = await getFallbackCartData();

  const lines: CartLine[] = fallback.lines
    .map((line, index) => {
      const product = sampleProducts.find((item) => item.handle === line.handle);
      if (!product) return null;

      const price = Number.parseFloat(product.priceRange.minVariantPrice.amount);
      const quantity = line.quantity;
      const amount = (price * quantity).toFixed(2);

      return {
        id: `fallback-line-${index}`,
        quantity,
        cost: {
          totalAmount: {
            amount,
            currencyCode: product.priceRange.minVariantPrice.currencyCode,
          },
        },
        merchandise: {
          id: `fallback-variant-${product.handle}`,
          title: product.title,
          price: product.priceRange.minVariantPrice,
          product: {
            handle: product.handle,
            title: product.title,
            featuredImage: product.featuredImage ?? undefined,
          },
        },
      } satisfies CartLine;
    })
    .filter(Boolean) as CartLine[];

  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = lines.reduce((sum, line) => {
    return sum + Number.parseFloat(line.cost.totalAmount.amount);
  }, 0);
  const currency = lines[0]?.cost.totalAmount.currencyCode ?? "BRL";

  const amountString = totalAmount.toFixed(2);

  return {
    id: "fallback-cart",
    checkoutUrl: "/contato",
    totalQuantity,
    estimatedCost: {
      subtotalAmount: {
        amount: amountString,
        currencyCode: currency,
      },
      totalAmount: {
        amount: amountString,
        currencyCode: currency,
      },
    },
    lines,
  };
}

const CART_QUERY = `
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

async function fetchRemoteCart(cartId: string) {
  const { data } = await shopifyFetch<{
    cart: ShopifyCartResponse | null;
  }>({
    query: CART_QUERY,
    variables: { cartId },
    cache: "no-store",
    revalidate: 0,
  });

  return mapShopifyCart(data.cart);
}

async function createRemoteCart(lines: { merchandiseId: string; quantity: number }[]) {
  const { data } = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCartResponse | null;
      userErrors?: { message: string }[];
    };
  }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    cache: "no-store",
    revalidate: 0,
  });

  const errors = data.cartCreate.userErrors ?? [];
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return mapShopifyCart(data.cartCreate.cart);
}

async function addRemoteLines(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const { data } = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCartResponse | null;
      userErrors?: { message: string }[];
    };
  }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
    revalidate: 0,
  });

  const errors = data.cartLinesAdd.userErrors ?? [];
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return mapShopifyCart(data.cartLinesAdd.cart);
}

export async function getCart(): Promise<CartResult> {
  if (!envHasShopifyConfig()) {
    return { cart: await buildFallbackCart(), isFallback: true };
  }

  const cartId = await getCartCookie();
  if (!cartId) {
    return { cart: null, isFallback: false };
  }

  try {
    const cart = await fetchRemoteCart(cartId);
    if (!cart) {
      await deleteCartCookie();
      return { cart: null, isFallback: false };
    }

    return { cart, isFallback: false };
  } catch (error) {
    console.warn("Failed to load Shopify cart", error);
    await deleteCartCookie();
    return { cart: await buildFallbackCart(), isFallback: true };
  }
}

export async function addToCart(variantId: string, quantity = 1): Promise<CartResult> {
  if (!envHasShopifyConfig()) {
    const fallbackProduct = findSampleByVariantId(variantId);
    const cart = await addLineToFallbackCart(fallbackProduct?.handle ?? null, quantity);
    return { cart, isFallback: true };
  }

  const cartId = await getCartCookie();
  const lines = [{ merchandiseId: variantId, quantity }];

  try {
    if (!cartId) {
      const cart = await createRemoteCart(lines);
      if (cart) {
        await setCartCookie(cart.id);
      }
      return { cart, isFallback: false };
    }

    const updatedCart = await addRemoteLines(cartId, lines);
    if (updatedCart) {
      await setCartCookie(updatedCart.id);
      return { cart: updatedCart, isFallback: false };
    }

    // Fallback: cart might have expired, try to recreate
    await deleteCartCookie();
    const cart = await createRemoteCart(lines);
    if (cart) {
      await setCartCookie(cart.id);
    }
    return { cart, isFallback: false };
  } catch (error) {
    console.warn("Failed to update Shopify cart", error);
    await deleteCartCookie();
    const fallbackProduct = findSampleByVariantId(variantId);
    const cart = await addLineToFallbackCart(fallbackProduct?.handle ?? null, quantity);
    return { cart, isFallback: true };
  }
}
