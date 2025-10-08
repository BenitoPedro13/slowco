import type { ShopifyProductCard } from "@/lib/shopify";

export const sampleProducts: ShopifyProductCard[] = [
  {
    id: "gid://shopify/Product/slow-beanie-monogram",
    handle: "slow-beanie-monogram",
    title: "Slow Beanie Monogram",
    description: "Touca em fleece com bordado exclusivo da Slow Company.",
    availableForSale: true,
    vendor: "Slow Company",
    priceRange: {
      minVariantPrice: {
        amount: "99.99",
        currencyCode: "BRL",
      },
    },
    featuredImage: {
      url: "https://dcdn-us.mitiendanube.com/stores/001/303/752/products/gorro-slow-monogram-02168caabfbf0edd5417210800562945-1024-1024.webp",
      altText: "Slow Beanie Monogram",
      width: 1024,
      height: 1024,
    },
  },
  {
    id: "gid://shopify/Product/tracksuit-slow-monogram",
    handle: "tracksuit-slow-monogram",
    title: "Tracksuit Slow Monogram",
    description:
      "Conjunto nylon sem capuz com recortes e logotipos silkados em branco.",
    availableForSale: true,
    vendor: "Slow Company",
    priceRange: {
      minVariantPrice: {
        amount: "479.99",
        currencyCode: "BRL",
      },
    },
    featuredImage: {
      url: "https://dcdn-us.mitiendanube.com/stores/001/303/752/products/kit-track-907ee2d2b4f75bcedf17559951985301-1024-1024.webp",
      altText: "Tracksuit Slow Monogram",
      width: 1024,
      height: 1024,
    },
  },
  {
    id: "gid://shopify/Product/camisa-slow-r10",
    handle: "camisa-slow-r10",
    title: "Camisa Slow “R10”",
    description: "Camiseta em algodão premium com ilustração especial SLW-2025.",
    availableForSale: true,
    vendor: "Slow Company",
    priceRange: {
      minVariantPrice: {
        amount: "149.99",
        currencyCode: "BRL",
      },
    },
    featuredImage: {
      url: "https://dcdn-us.mitiendanube.com/stores/001/303/752/products/camiseta-slw-frente-1-86a80a8284bfe8ce2617559896784490-1024-1024.webp",
      altText: "Camisa Slow “R10”",
      width: 1024,
      height: 1024,
    },
  },
  {
    id: "gid://shopify/Product/slow-world-set",
    handle: "conjunto-slow-world-preto",
    title: "Conjunto Slow World Preto",
    description: "Moletom cropped e calça com padronagem exclusiva Slow World.",
    availableForSale: true,
    vendor: "Slow Company",
    priceRange: {
      minVariantPrice: {
        amount: "549.99",
        currencyCode: "BRL",
      },
    },
    featuredImage: {
      url: "https://dcdn-us.mitiendanube.com/stores/001/303/752/products/teste21-02fa7ca6c335e85d7917559995006961-1024-1024.webp",
      altText: "Conjunto Slow World Preto",
      width: 1024,
      height: 1024,
    },
  },
  {
    id: "gid://shopify/Product/slow-mode-kit",
    handle: "slow-mode-kit",
    title: "Slow Mode Kit",
    description: "Camiseta e bermuda vermelha Slow Mode com números inspirados no sportswear.",
    availableForSale: true,
    vendor: "Slow Company",
    priceRange: {
      minVariantPrice: {
        amount: "329.99",
        currencyCode: "BRL",
      },
    },
    featuredImage: {
      url: "https://dcdn-us.mitiendanube.com/stores/001/303/752/products/slow-mode-bermuda-vermelha-4-ed4c439bb9e15c028717559899170705-1024-1024.webp",
      altText: "Slow Mode Kit",
      width: 1024,
      height: 1024,
    },
  },
];
