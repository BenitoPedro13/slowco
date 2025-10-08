import type { ShopifyProduct } from "@/lib/shopify";
import { sampleProducts } from "./sample-products";

const baseProducts = Object.fromEntries(sampleProducts.map((product) => [product.handle, product]));

export const sampleProductDetails: Record<string, ShopifyProduct> = {
  "slow-beanie-monogram": {
    id: "gid://shopify/Product/slow-beanie-monogram",
    handle: "slow-beanie-monogram",
    title: "Slow Beanie Monogram",
    descriptionHtml:
      "<p>Touca em fleece com bordado frontal do monograma Slow. Forro macio e acabamento que não pinica.</p><ul><li>Fleece premium 300g</li><li>Aplicação em bordado 3D</li><li>Edição limitada</li></ul>",
    availableForSale: true,
    vendor: "Slow Company",
    tags: ["fleece", "acessórios", "monogram"],
    options: [
      {
        id: "size",
        name: "Tamanho",
        values: ["Único"],
      },
    ],
    priceRange: {
      minVariantPrice: baseProducts["slow-beanie-monogram"].priceRange.minVariantPrice,
      maxVariantPrice: baseProducts["slow-beanie-monogram"].priceRange.minVariantPrice,
    },
    media: {
      nodes: [
        {
          id: "gid://shopify/MediaImage/slow-beanie-monogram",
          image: {
            url: baseProducts["slow-beanie-monogram"].featuredImage?.url ?? "",
            altText: baseProducts["slow-beanie-monogram"].featuredImage?.altText ?? "Slow Beanie Monogram",
            width: 1200,
            height: 1200,
          },
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/slow-beanie-monogram-variant",
          title: "Tamanho Único",
          availableForSale: true,
          selectedOptions: [{ name: "Tamanho", value: "Único" }],
          price: baseProducts["slow-beanie-monogram"].priceRange.minVariantPrice,
        },
      ],
    },
  },
  "tracksuit-slow-monogram": {
    id: "gid://shopify/Product/tracksuit-slow-monogram",
    handle: "tracksuit-slow-monogram",
    title: "Tracksuit Slow Monogram",
    descriptionHtml:
      "<p>Conjunto em nylon com recortes contrastantes e logotipos silkados. Ideal para noite, baile e rolê pós-treino.</p><ul><li>Nylon texturizado resistente à água</li><li>Modelagem reta com ajuste na barra</li><li>Disponível do P ao GG</li></ul>",
    availableForSale: true,
    vendor: "Slow Company",
    tags: ["tracksuit", "nylon", "slow studio"],
    options: [
      {
        id: "size",
        name: "Tamanho",
        values: ["P", "M", "G", "GG"],
      },
    ],
    priceRange: {
      minVariantPrice: baseProducts["tracksuit-slow-monogram"].priceRange.minVariantPrice,
      maxVariantPrice: baseProducts["tracksuit-slow-monogram"].priceRange.minVariantPrice,
    },
    media: {
      nodes: [
        {
          id: "gid://shopify/MediaImage/tracksuit-slow-monogram",
          image: {
            url: baseProducts["tracksuit-slow-monogram"].featuredImage?.url ?? "",
            altText: baseProducts["tracksuit-slow-monogram"].featuredImage?.altText ?? "Tracksuit Slow Monogram",
            width: 1200,
            height: 1200,
          },
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/tracksuit-slow-monogram-p",
          title: "P",
          availableForSale: true,
          selectedOptions: [{ name: "Tamanho", value: "P" }],
          price: baseProducts["tracksuit-slow-monogram"].priceRange.minVariantPrice,
        },
      ],
    },
  },
  "camisa-slow-r10": {
    id: "gid://shopify/Product/camisa-slow-r10",
    handle: "camisa-slow-r10",
    title: "Camisa Slow “R10”",
    descriptionHtml:
      "<p>Camiseta em algodão premium que celebra o futebol de rua e a magia do R10. Estampa frontal exclusiva.</p><ul><li>Algodão 240g malha penteada</li><li>Modelagem oversized</li><li>Impressão silk + acabamento soft touch</li></ul>",
    availableForSale: true,
    vendor: "Slow Company",
    tags: ["camiseta", "futebol", "coleção 2025"],
    options: [
      {
        id: "size",
        name: "Tamanho",
        values: ["P", "M", "G", "GG"],
      },
    ],
    priceRange: {
      minVariantPrice: baseProducts["camisa-slow-r10"].priceRange.minVariantPrice,
      maxVariantPrice: baseProducts["camisa-slow-r10"].priceRange.minVariantPrice,
    },
    media: {
      nodes: [
        {
          id: "gid://shopify/MediaImage/camisa-slow-r10",
          image: {
            url: baseProducts["camisa-slow-r10"].featuredImage?.url ?? "",
            altText: baseProducts["camisa-slow-r10"].featuredImage?.altText ?? "Camisa Slow R10",
            width: 1200,
            height: 1200,
          },
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/camisa-slow-r10-p",
          title: "P",
          availableForSale: true,
          selectedOptions: [{ name: "Tamanho", value: "P" }],
          price: baseProducts["camisa-slow-r10"].priceRange.minVariantPrice,
        },
      ],
    },
  },
  "conjunto-slow-world-preto": {
    id: "gid://shopify/Product/slow-world-set",
    handle: "conjunto-slow-world-preto",
    title: "Conjunto Slow World Preto",
    descriptionHtml:
      "<p>Moletom cropped e calça larguinha com padronagem exclusiva Slow World. Pensado para quem curte combinação full look.</p><ul><li>Moletom 350g com toque felpado</li><li>Calça reta com bolso lateral</li><li>Padronagem corrida em silk branco</li></ul>",
    availableForSale: true,
    vendor: "Slow Company",
    tags: ["conjunto", "moletom", "slow world"],
    options: [
      {
        id: "size",
        name: "Tamanho",
        values: ["P", "M", "G"],
      },
    ],
    priceRange: {
      minVariantPrice: baseProducts["conjunto-slow-world-preto"].priceRange.minVariantPrice,
      maxVariantPrice: baseProducts["conjunto-slow-world-preto"].priceRange.minVariantPrice,
    },
    media: {
      nodes: [
        {
          id: "gid://shopify/MediaImage/slow-world-set",
          image: {
            url: baseProducts["conjunto-slow-world-preto"].featuredImage?.url ?? "",
            altText:
              baseProducts["conjunto-slow-world-preto"].featuredImage?.altText ?? "Conjunto Slow World Preto",
            width: 1200,
            height: 1200,
          },
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/slow-world-preto-p",
          title: "P",
          availableForSale: true,
          selectedOptions: [{ name: "Tamanho", value: "P" }],
          price: baseProducts["conjunto-slow-world-preto"].priceRange.minVariantPrice,
        },
      ],
    },
  },
  "slow-mode-kit": {
    id: "gid://shopify/Product/slow-mode-kit",
    handle: "slow-mode-kit",
    title: "Slow Mode Kit",
    descriptionHtml:
      "<p>Combo camiseta + bermuda inspirado no sportswear vintage. Números aplicados e tipografia racing.</p><ul><li>Malha 100% algodão com caimento oversized</li><li>Bermuda em moletom com bolso faca</li><li>Silk frontal e traseiro com relevo</li></ul>",
    availableForSale: true,
    vendor: "Slow Company",
    tags: ["kit", "sportswear", "slow mode"],
    options: [
      {
        id: "size",
        name: "Tamanho",
        values: ["P", "M", "G", "GG"],
      },
    ],
    priceRange: {
      minVariantPrice: baseProducts["slow-mode-kit"].priceRange.minVariantPrice,
      maxVariantPrice: baseProducts["slow-mode-kit"].priceRange.minVariantPrice,
    },
    media: {
      nodes: [
        {
          id: "gid://shopify/MediaImage/slow-mode-kit",
          image: {
            url: baseProducts["slow-mode-kit"].featuredImage?.url ?? "",
            altText: baseProducts["slow-mode-kit"].featuredImage?.altText ?? "Slow Mode Kit",
            width: 1200,
            height: 1200,
          },
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/slow-mode-kit-p",
          title: "P",
          availableForSale: true,
          selectedOptions: [{ name: "Tamanho", value: "P" }],
          price: baseProducts["slow-mode-kit"].priceRange.minVariantPrice,
        },
      ],
    },
  },
};
