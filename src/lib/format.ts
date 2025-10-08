import type { ShopifyMoney } from "@/lib/shopify";

export function formatCurrency(price: ShopifyMoney, locale = "pt-BR") {
  const amount = Number.parseFloat(price.amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}
